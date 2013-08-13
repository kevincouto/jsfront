"use strict";

(function(){ 
    define("jsf.ui.JGrid",{
        _require: ["jsf.ui.JGridBase"],
        _alias: "jsf.JGrid",
        _extend: "gridbase",
        _xtype: "grid",
        
        _constructor: function(properties) {
            this._rules = {
                canvas: "b1 grd",
                row_data: "grd-row-data",
                cell_data: "grd-cell-data",
                row_selected: "grd-row-data i2 grd-row-data-selected",
                row_selected_with_focus: "grd-row-data i1 grd-row-data-selected",
                head1: "h3 grd-chead1",
                corner1: "h3 grd-corner1",
                corner2: "h4",
                cellFoxR: "h3 grd-cell-nums"
            };
            
            jsf.ui.JGridBase.call(this);

            this._focuset = true;

            //private vars
            this._cellsHead = [];
            this._valuesHead = [];
            this._cellsNums = [];
            this._valuesNums = [];
            this._rowsData = [];
            this._colsDrag = [];
            this._selectedIndex = null;
            
            this._elementHCols = [];
            this._valueHCols   = [];

            this._itemRender = cellRender;
            this._rowRender  = rowRender;
            this._dataRender = dataRender;
            
            //default properties
            this._defaultRowHeight = 26;
            this._horizontalScroll = true;

            this._canvas.className = this._rules.canvas;
            
            //template
            this._canvas.innerHTML =
                    '<div class="' + this._rules.head1 + '">' +                 // 0 titulo das colunas
                        '<div class="grd-chead2"></div>' +
                    '</div>' +
                    '<div class="grd-rhead1">' +                                // 1 númeração de linhas
                        '<div class="grd-rhead2"></div>' +
                    '</div>' +
                     //_client células de dados
                    '<div class="' + this._rules.corner1 + '"></div>' +         // 2 canto superior esquerdo
                    '<div class="grd-indicator" style="display:none"></div>';   // 3 indicador de redimensionamento de colunas
            
            this._el_head_cols = this._canvas.childNodes[0];
            this._el_head_colsS= this._el_head_cols.firstChild;
            this._el_head_rows = this._canvas.childNodes[1];
            this._el_head_rowsS= this._el_head_rows.firstChild;
            this._el_corner_lt = this._canvas.childNodes[2];
            this._el_indicator = this._canvas.childNodes[3];
            
            //adiciona o _client(células de dados) em uma nova posição no dom
            this._canvas.insertBefore(this._client, this._el_corner_lt);
            
            //reposiciona as barras de rolagem para ficar por cima de _client
            this._canvas.appendChild(this._vs._canvas);
            this._canvas.appendChild(this._hs._canvas);
            
            //------------------------------------
            //------------ inicio teste ----------
            // 150 colunas, 10.000 linhas
            var i, j, o, dp = [], c = [];

            for (i = 1; i <= 5; i++) {
                c.push({name: 'col' + i, caption: 'Col' + i, width: 80});
            }

            //c[2].width = 160;
            //c[8].width = 60;
            //c[15].width = 180;

            for (i = 0; i <= 10; i++) {
                o = {};
                for (j = 1; j <= c.length; j++) {
                    o['col' + j] = 'cell ' + i + ', ' + j;
                }
                dp.push(o);
            }
            properties.dataProvider = dp;
            properties.cols = c;        
            //------------- fim teste -------------
            //-------------------------------------

            this._applyProperties(properties);
        },
        
        _event: {
            resize: function(){
                this._client.style.top = this._el_head_cols.offsetHeight + "px";
                jsf.ui.JGridBase.prototype._onresize.call(this);
                this._updateLayout();
                //this._updateScrollbars(this._canvas.offsetWidth, this._canvas.offsetHeight - this._el_head_cols.offsetHeight, this._colsWidth, this._rowsHeight);
            },            
            $mouseover: function(element) {
                if (element._captureMouseEvent){
                    this._elOver = element;
                    jsf.Dom.addClass(element, 'grd-row-data-over');
                }
            },
            $mouseout: function(element) {
                if (this._elOver){
                    jsf.Dom.removeClass(this._elOver, 'grd-row-data-over');
                }
            },
            mousedown: function(element, evt) {
                var lst, item, row, meta, i;

                if (element._drag) {
                    _self = this;
                    this._xInit = element.offsetLeft;
                    this._xDiff = 0;
                    this._colResizing = element._colIndex;
                    jsf.Drag.start(evt, element, false, this._ondragend, 'e-resize');
                } else {
                    row = element.rowElement;
                    if (row) {
                        i = row.rowIndex;
                        meta = this._META_ROWS[i];
                        
                        //se foi selecionada uma nova linha
                        if (this._selectedIndex != i) {
                            //desmarca a linha atual
                            if (this._selectedIndex !== null) {
                                this._META_ROWS[this._selectedIndex].selected = false;
                            }
                            
                            //marca a nova linha
                            this._selectedIndex = i;
                            meta.selected = true;
                            this._updateList();
                            
                            item = this._dataProvider[this._selectedIndex];
                            
                            //define o dataProvider filho, se as propriedades childList e childField foram definidas
                            if (this._childList && this._childField) {
                                lst = jsf.core.Control.get(this._childList);
                                if (lst && lst.dataProvider) {
                                    lst.dataProvider(item[this._childField] || null);
                                }
                            }
                            
                            //dispara os eventos
                            this._fireBindableProperty("selectedItem", item);
                            this.dispatch(jsf.Event.ON_CHANGE, item);
                        }
                    }
                }
            },
            $mousewheel: function(delta){
                if (this._horizontalScroll){
                    this._hs._onmousewheel(delta);
                }
                
                this._vs._onmousewheel(delta);
            },
            $draging: function(target, x, y){
                _self._xDiff = x - _self._xInit;
                _self._el_indicator.setAttribute('style', 'left:'+(x + _self._colFixWidth + parseInt(_self._el_dataS.style.left, 10)) + 'px');
            },
            $dragend: function(){
                _self._el_indicator.style.display = 'none';
                
                var col = _self._cols[_self._colResizing],
                    w = col.width + _self._xDiff;
                
                delete(col._width);
                col.width = w;
                
                _self._onresize();
                _self._updateList();
            },
            $langchanged: function(param, value){
                //param = coluna, value=caption da coluna
                param.caption = value;
                
                this.invalidateSize();
                this.updateDisplay();
            }
        },
        
        _protected: {
            updateDataProvider: function(value){
                this._dataProvider = value;
                this._rowsCount = this._dataProvider.length;

                if (null != this._selectedIndex) {
                    if (!this._dataProvider[ this._selectedIndex ]) {
                        this._selectedIndex = null;
                    } else {
                        this._dataProvider[ this._selectedIndex ]._selected_ = true;
                    }
                }

                this.invalidateSize();
                this.updateDisplay();
            },
            //posiciona elementos de layout
            updateLayout: function() {
                var i, j, y, h = this._el_head_rows.offsetHeight;
                
                //largura da coluna fixa
                this._colFixWidth = this._lineNumber ? jsf.System.textMetrics(this._dataProviderCount, null, this._rules.cellFoxR).width + 8 : 0;

                //posiciona elementos HTML
                this._client.style.left         = this._colFixWidth + 'px';
                this._el_head_cols.style.left   = this._colFixWidth + 'px';
                this._el_corner_lt.style.width  = this._colFixWidth + 'px';
                this._el_head_rows.style.width  = this._colFixWidth + 'px';
                this._el_head_rowsS.style.width = this._colFixWidth + 'px'; //TODO: mudar para 100%
                
                return;
                
                //cria as células visiveis dos números das linhas e as linhas visiveis de dados
                y = 0;
                for (i = 0; i < this._rowsCount; i++) {
                    if (y > h) {
                        for (j = i; j < this._cellsNums.length; j++) {
                            if (this._cellsNums[j]) {
                                this._cellsNums[j].setAttribute('style', 'display:none');
                                this._rowsData[j].setAttribute('style', 'display:none');
                            }
                        }
                        break;
                    } else {
                        if (!this._cellsNums[i]) {
                            this._cellsNums.push(this._el_head_rows.firstChild.appendChild(jsf.Dom.create('div', null, this._rules.cellFoxR)));
                            this._rowsData.push(this._el_data.firstChild.appendChild(jsf.Dom.create('div', null, 'grd-row-data')));
                            this._rowsData[i]._captureMouseEvent = true;
                            this._rowsData[i].cells = [];
                            this._rowsData[i].values = [];
                            this._valuesNums.push(this._cellsNums[i].appendChild(document.createTextNode('')));
                        }
                        this._cellsNums[i].setAttribute('style', 'top:' + y + 'px;width:' + this._colFixWidth + 'px');
                        this._rowsData[i].setAttribute('style', 'top:' + y + 'px;width:' + this._colsWidth + 'px');
                    }

                    y += this._rowHeight;
                }
                this._visibleRowsCount = i;

                //largura da área de dados
                this._dataWidth = this._el_data.offsetWidth;

                this._updateHeads = true;
            }
        },
        
        _property: {
            childList: {
                type: "String",
                get: function() {
                    return this._childList;
                },
                set: function(value) {
                    this._childList = value;
                }
            },
            childField: {
                type: "String",
                get: function() {
                    return this._childField;
                },
                set: function(value) {
                    this._childField = value;
                }
            },
            lineNumber: {
                type: "Boolean",
                get: function(){
                    return this._lineNumber;
                },
                set: function(value){
                    this._lineNumber = value;
                    
                    this._el_head_rows.style.display = value ? "" : "none";
                    this._el_corner_lt.style.display = value ? "" : "none";
                            
                    this.invalidateSize();
                    this.updateDisplay();
                }
            },
            horizontalScroll: {
                type: "Boolean",
                get: function() {
                    return this._horizontalScroll;
                },
                set: function(value){
                    this._horizontalScroll = value;

                    this.invalidateSize();
                    this.updateDisplay();
                }
            },
            selectedIndex: {
                type: "Number",
                get: function() {
                    return this._selectedIndex;
                },
                set: function(value){
                    if (this._selectedIndex !== null) {
                        delete(this._dataProvider[this._selectedIndex]._selected_);
                    }

                    this._selectedIndex = value;
                    this._dataProvider[this._selectedIndex]._selected_ = true;

                    this._updateList();

                    this.dispatch(jsf.Event.ON_CHANGE, this._dataProvider[this._selectedIndex]);
                }
            },
            listSource: {
                type: "String",
                get: function(){
                    return this._listSource;
                },
                set: function(value){
                    this._listSource = value;
                }
            },
        },
		
        _public: {
            $cols: function(value) {
                var i;
                
                // get
                if (value === undefined){
                    return this._cols;
                }
                
                // set
                for (i=0; i<value.length; i++){
                    if (!value[i].width){
                        value[i].width=this._defaultColWidth;
                    }
                    
                    if (!value[i].caption){
                        value[i].caption=value[i].name;
                    }else{
                        value[i].caption = Lang.bind(this, '_cc', value[i].caption, value[i]);//_cc=col caption
                    }
                    
                    if (!value[i].dataAlign){
                        value[i].dataAlign = 'left';
                    }
                    
                    if (!value[i].textAlign){
                        value[i].textAlign = 'left';
                    }
                }
                this._cols = value;
                this._colsCount = value.length;
                
                this.invalidateSize();
                this.updateDisplay();
                
                return this;
            },
            selectedItem: function() {
                return this._dataProvider[this._selectedIndex];
            },
            updateItem: function(index, value) {
                var item = this._dataProvider[index], i;

                if (item) {
                    for (i in item) {
                        if (value[i] !== undefined) {
                            item[i] = value[i];
                        }
                    }
                    this._dataProvider[this._selectedIndex] = item;
                }

                this._updateList();
            },
            removeItem: function(index) {
                this._updateDataProvider(jsf.Array.removeByIndex(this._dataProvider, index));
                return this;
            },
            addItem: function(value) {
                this._dataProvider.push(value);
                this._updateDataProvider(this._dataProvider);
                return this;
            },
            $render: function(){
                return;
				if (!this._initLayout){
                    this._onresize();
                    this._initLayout = true;
                }
                this._updateList();		
            }
        }
	});

    var _self;
    
//private functions:
    function calculateColsWidth(cols, minWidth, canvasWidth){
        var w=0, col, i=0, sw=0;
        
        //calcula a largura total da soma das colunas
        for (i=0; i<cols.length; i++){
            col = cols[i];
            if (!col._width){
                col._width = col.width;
            }
            col.width = col._width;
            col.x = w;
            w += col.width;
        }
        
        for (i=cols.length-1; i>=0; i--){
            col = cols[i];
            if (col.x+col.width+sw > canvasWidth){
                col.width = canvasWidth - col.x - sw;
                if (col.width<minWidth){
                    col.width = minWidth;
                }
                sw += col.width;
            }else{
                col.width = canvasWidth - col.x - sw;
                break;
            }
        }
        
    }
    
    //renderizando a área de dados
    function dataRender(x,y){
        this._el_head_colsS.style.left = x + "px";
    }
    
    //renderizando uma linha
    function rowRender(data, row, indexRow, y){
        var  
            m = this._META_ROWS[row],
            c = this._rules.row_data;
        
        if ( m.selected ){
            c = this._rules.row_selected_with_focus;
        }
        
        this._elementRows[indexRow].className = c;
    }
    
    //renderizando uma célula
    function cellRender(data, row, col, indexRow, indexCol, width, height) {
        var 
            cell, 
            c = this._cols[col];
        
        this._valueCols[indexRow][indexCol].nodeValue = data[c.name];
        
        if (indexRow==0){
            cell = getCellElement(this, indexCol);
            cell.style.width = width + "px";
            this._valueHCols[indexCol].nodeValue = c.caption;
        }
    }
    
    function getCellElement(component, c) {
        var e;

        if (!component._elementHCols[c]) {
            e = component._el_head_colsS.appendChild(jsf.Dom.create('div', null, component._rules.cell_data ));
            e._captureMouseEvent = true;
            
            component._elementHCols.push(e);
            component._valueHCols.push(e.appendChild(document.createTextNode('')));
        }

        return component._elementHCols[c];
    }
}());