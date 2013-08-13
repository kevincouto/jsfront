"use strict";

(function(){
    define("jsf.ui.JGridBase", {
        _require: ["jsf.ui.JScrollbar", "jsf.ui.DisplayObject"],
        _extend: "display",
        _xtype: "gridbase",
        
        _constructor: function(properties) {
            jsf.Display.call(this);
            
            this._canvas.innerHTML = 
                    '<div style="left:0;right:0;top:0;bottom:0">'+
                        '<div></div>' +
                        '<div class="'+this._rules.corner2+'" style="' + "height:" + jsf.JScrollbar.getHeight() + "px;" + "width:" + jsf.JScrollbar.getWidth() + "px;right:0;bottom:0" + '"></div>'+
                    '</div>';
            
            this._client = this._canvas.firstChild;
            this._el_data = this._client.childNodes[0];
            this._el_corner = this._client.childNodes[1];
            
            //properties
            this._dataProvider = [];
            this._defaultRowHeight = 40;
            this._defaultColWidth = 90;
            this._cols = [];

            //protected vars
            this._scrollSizeWidth = 0;
            this._scrollSizeHeight = 0;
            this._scrollX = 0;
            this._scrollY = 0;
            this._dataProviderCount = 0;
            this._valueRows = [];
            this._elementRows = [];
            this._elementCols = [];
            this._valueCols = [];

            this._itemRender = jsf.EMPTY_FUNCTION;
            this._dataRender = jsf.EMPTY_FUNCTION;
            this._rowRender  = jsf.EMPTY_FUNCTION;

            this._META_ROWS = [];
            this._META_COLS = [];

            //vertical scrollbar
            this._vs = new jsf.JScrollbar({orientation: 'v', top: 0, right: 0, bottom: 0, parentComponent: this});
            this._vs._parent = this;
            this._canvas.appendChild(this._vs._canvas);
            this._vs._onscroll = function(value) {
                this._onscrollY(value);
            };

            //horizontal scrollbar
            this._hs = new jsf.JScrollbar({orientation: 'h', left: 0, right: 0, bottom: 0, parentComponent: this});
            this._hs._parent = this;
            this._canvas.appendChild(this._hs._canvas);
            this._hs._onscroll = function(value) {
                this._onscrollX(value);
            };

            this._applyProperties(properties);
        },
		
        _event: {
            resize: function() {
                this._clientHeight = this._client.offsetHeight;
                this._clientWidth = this._client.offsetWidth;

                this._el_data.style.height = this._dataProviderHeight + 'px';
                this._el_data.style.width = this._dataProviderWidth + 'px';
                
                this._updateList();
                this._updateScrollbars(this._clientWidth, this._clientHeight, this._dataProviderWidth, this._dataProviderHeight);
            },
            //chamado pelo código acima no _constructor
            scrollY: function(value) {
                this._scrollY = value;
                this._updateList();
            },
            //chamado pelo código acima no _constructor
            scrollX: function(value) {
                this._scrollX = value;
                this._updateList();
            },
            mousewheel: function(delta) {
                this._hs._onmousewheel(delta);
                this._vs._onmousewheel(delta);
            }
        },
        
        _protected: {
            /*
                         width
                    +-----------+
                    | +-------/\|-----+
             height | |       |||     |
                    | |       \/|     |
                    |<=======>  |     | scrollSizeHeight
                    +-----------+     |
                      |               |
                      +---------------+
                      scrollSizeWidth
             */
            updateScrollbars: function(width, height, scrollSizeWidth, scrollSizeHeight) {
                var hsv = (scrollSizeWidth > width),
                        vsv = (scrollSizeHeight > height),
                        h = (this._hs ? jsf.JScrollbar.getHeight() : 0),
                        w = (this._vs ? jsf.JScrollbar.getWidth() : 0),
                        clientWidth = width,
                        clientHeight = height;

                //define quais barras de rolagem estão visíveis
                if (vsv) {
                    clientWidth = width - w;
                    hsv = this._horizontalScroll ? (scrollSizeWidth > clientWidth) : false;
                }
                if (hsv) {
                    clientHeight = height - h;
                    vsv = (scrollSizeHeight > clientHeight);
                }
                if (vsv) {
                    clientWidth = width - w;
                    hsv = this._horizontalScroll ? (scrollSizeWidth > clientWidth) : false;
                }

                //posiciona e exibe/oculta a barra de rolagem horizontal
                this._hs.cancelUpdateDisplay(true).visible(hsv);
                if (hsv) {
                    this._hs.canvasSize(width);
                    this._hs.scrollSize(scrollSizeWidth);
                    this._hs.right(vsv ? w : 0);
                    this._hs.cancelUpdateDisplay(false).updateDisplay();
                }
                this._hs.cancelUpdateDisplay(false);

                //posiciona e exibe/oculta a barra de rolagem vertical
                this._vs.cancelUpdateDisplay(true).visible(vsv);
                if (vsv) {
                    this._vs.canvasSize(height);
                    this._vs.scrollSize(scrollSizeHeight);
                    this._vs.bottom(hsv ? h : 0);
                    this._vs.cancelUpdateDisplay(false).updateDisplay();
                }
                this._vs.cancelUpdateDisplay(false);

                this._el_corner.style.display = (vsv && hsv ? "" : "none");
            },
            updateList: function() {
                var row, col, i = 0, y, x, h, d, m, e, a, fcol, fx, j, c, cell;

                /*
                    this._META_ROWS = [
                       {
                           y1:0,
                           selected:false,
                           height:30
                       }
                    ];

                    this._META_COLS = [
                       {
                           x1:0,
                           width:90,
                           selected:false
                       }
                    ];
                */

                if (this._dataProviderCount == 0) {
                    return;
                }

                //calcula a 1ª linha visível, row = linha aproximada referente a posição y com base na altura média das linhas
                if (this._scrollYOld == this._scrollY) {
                    row = this._fisrtRowOld;
                    y = this._yStartOld;
                } else {
                    a = firstRow(this, this._scrollY);
                    row = a[0];
                    y = a[1];
                }

                //calcula a 1ª coluna visível, col = coluna aproximada referente a posição x com base na largura média das colunas
                if (this._scrollXOld == this._scrollX) {
                    fcol = this._fisrtColOld;
                    fx = this._xStartOld;
                } else {
                    a = firstCol(this, this._scrollX);
                    fcol = a[0];
                    fx = a[1];
                }

                //guarda _scrollY e _scrollX para evitar recalcular sem necessidade
                this._scrollYOld = this._scrollY;
                this._fisrtRowOld = row;
                this._yStartOld = y;
                this._scrollXOld = this._scrollX;
                this._fisrtColOld = fcol;
                this._xStartOld = fx;

                this._el_data.style.display = "none";
                this._el_data.style.top = y + 'px';
                this._el_data.style.left = fx + 'px';
                
                this._dataRender.call(this, fx, y);
                
                //loop da primeira à última linha visível
                while (row < this._dataProviderCount && y < this._clientHeight) {
                    d = this._dataProvider[row];     //json da linha
                    m = this._META_ROWS[row];        //metadados da linha
                    e = getRowElement(this, i);      //elemento html da linha
                    h = m.height;                    //altura da linha
                    j = 0;

                    //define altura da linha e guarda o índice no próprio HTMLElement
                    e.rowIndex = row;
                    e.style.cssText = "height:" + h + "px;width:" + (this._dataProviderWidth + 100) + "px";
                    
                    this._rowRender.call(this, d, row, i, y);
                    
                    //loop da primeira à última coluna visível
                    x = fx;
                    col = fcol;
                    while (col < this._colsCount && x < this._clientWidth) {
                        c = this._META_COLS[col];
                        cell = getItemElement(this, i, j);

                        cell.colIndex = col;
                        cell.style.cssText = "width:" + c.width + "px;height:" + h + "px;line-height:" + h + "px;";

                        this._itemRender.call(this, d, row, col, i, j, c.width, h);

                        //incrementa posição x, a coluna e o índice
                        x += c.width;
                        col++;
                        j++;
                    }

                    //incrementa posição y, linha e o índice
                    y += m.height;
                    row++;
                    i++;
                }

                this._el_data.style.display = "";
            }
        },
        
        _property: {
            dataProvider: {
                type: "Array",
                get: function() {
                    return this._dataProvider;
                },
                set: function(value) {
                    this._dataProvider = (!value ? [] : value);

                    if (this._dataProvider.length > 64000) {
                        throw "dataProvider count overflow";
                    }

                    initDataProvider(this);
                    this.updateDisplay();
                }
            },
            cols: {
                type: "Array",
                get: function() {
                    return this._cols;
                },
                set: function(value) {
                    initCols(this, value);

                    this.invalidateSize().updateDisplay();

                    return this;
                }
            }
        }
    });
	
//private functions:
    function initDataProvider(component) {
        var i, h = 0, q = component._dataProvider.length, r, h1;

        component._META_ROWS = [];

        for (i = 0; i < q; i++) {
            r = component._dataProvider[i];
            h1 = r.height || component._defaultRowHeight;

            component._META_ROWS.push({
                y1: h,
                y2: h + h1,
                height: h1,
                selected: false
            });

            h += h1;
        }

        component._scrollY = 0;
        //component._el_data.style.height = h + 'px';
        component._rowHeightAverage = h / q;
        component._dataProviderCount = q;
        component._dataProviderHeight = h;
    }
	
    function initCols(component, value) {
        var i, w = 0, q = value.length, r, w1;

        for (i = 0; i < q; i++) {
            r = value[i];

            r.width = r.width || component._defaultColWidth;
            r.caption = r.caption || r.name;
            r.dataAlign = r.dataAlign || 'left';
            r.textAlign = r.textAlign || 'left';

            w1 = r.width || component._defaultColWidth;

            component._META_COLS.push({
                x1: w,
                x2: w + w1,
                width: w1,
                selected: false
            });

            w += w1;
        }

        component._scrollX = 0;
        component._cols = value;
        //component._el_data.style.width = w + 'px';
        component._colWidthAverage = w / q;
        component._colsCount = q;
        component._dataProviderWidth = w;
    }
    
    function firstRow(component, y){
        var r, i, d;
        
        i = parseInt(y / component._rowHeightAverage, 10);
        r = component._META_ROWS[i];
        d = y - r.y2;
        
        while (y >= r.y2){
            if (d>component._rowHeightAverage){
                i += parseInt(d/component._rowHeightAverage, 10);
            }
            
            r = component._META_ROWS[++i];
        }
        
        y = -(component._scrollY - component._META_ROWS[i].y1);
		while (y>0){
			if (y>component._rowHeightAverage){
				i -= parseInt( (y-component._rowHeightAverage)/ component._rowHeightAverage, 10 );
			}
			
			i--;
			y = -(component._scrollY - component._META_ROWS[row].y1);
		}
		
		return [i,y];
    }
    
    function firstCol(component, x) {
        var r, i, d;

        i = parseInt(x / component._colWidthAverage, 10);
        r = component._META_COLS[i];
        d = x - r.x2;

        while (x >= r.x2) {
            if (d > component._colWidthAverage) {
                i += parseInt(d / component._colWidthAverage, 10);
            }

            r = component._META_COLS[++i];
        }

        x = -(component._scrollX - component._META_COLS[i].x1);
        while (x > 0) {
            if (x > component._colWidthAverage) {
                i -= parseInt((x - component._colWidthAverage) / component._colWidthAverage, 10);
            }

            i--;
            x = -(component._scrollX - component._META_COLS[i].x1);
        }

        return [i, x];
    }
    
    function getRowElement(component, index) {
        var e;

        if (!component._elementRows[index]) {
            e = component._el_data.appendChild(jsf.Dom.create('div', null, component._rules.row_data));
            e.type="row";
            e._captureMouseEvent = true;

            component._elementRows.push(e);
            component._elementCols.push([]);
            component._valueCols.push([]);
        }

        return component._elementRows[index];
    }

    function getItemElement(component, r, c) {
        var e;

        if (!component._elementCols[r][c]) {
            e = component._elementRows[r].appendChild(jsf.Dom.create('div', null, component._rules.cell_data ));
            e.type="item";
            e.rowElement = component._elementRows[r];
            e._captureMouseEvent = true;

            component._elementCols[r].push(e);
            component._valueCols[r].push(e.appendChild(document.createTextNode('')));
        }

        return component._elementCols[r][c];
    }
}());
