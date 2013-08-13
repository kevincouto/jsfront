"use strict";

(function(){
    define("jsf.ui.JListBase", {
        _require: ["jsf.ui.JScrollbar", "jsf.ui.DisplayObject"],
        _extend: "display",
        _xtype: "listbase",
        
        _constructor: function(properties) {
            var me;

            jsf.Display.call(this);

            //this._canvas.className = 'lst ui-bd';
            this._canvas.innerHTML = '<div><div></div></div>';
            this._client = this._canvas.firstChild;
            this._el_data = this._client.firstChild;

            //properties
            this._dataProvider = [];
            this._rowHeight = 40;

            //protected vars
            this._scrollSizeWidth = 0;
            this._scrollSizeHeight = 0;
            this._scrollX = 0;
            this._scrollY = 0;
            this._dataProviderCount = 0;
            this._valueRows = [];
            this._elementRows = [];

            //scrollbar
            me = this;
            this._vs = new jsf.JScrollbar({orientation: 'v', top: 0, right: 0, bottom: 0, parentComponent: this});
            this._vs._parent = this;
            this._client.appendChild(this._vs._canvas);
            this._vs._onscroll = function(value) {
                me._onscrollY(value);
            };

            this._applyProperties(properties);
        },
		
        _event: {
            //chamado pelo código acima no _constructor
            scrollY: function(value) {
                this._scrollY = value;
                this._updateList();
            },
            mousewheel: function(delta) {
                this._vs._onmousewheel(delta);
            }
        },
        
        _protected: {
            updateList: function() {
                var row, cls = "", i = 0, y, h, r, e;

                this._el_data.style.display = "none";

                if (this._dataProviderCount == 0) {
                    return;
                }

                row = firstRow(this, this._scrollY); //row = linha aproximada referente a posição y com base na altura média das linhas
                y = -(this._scrollY - this._dataProvider[row]._meta_.y1);

                while (y > 0) {
                    if (y > this._rowHeightAverage) {
                        row -= parseInt((y - this._rowHeightAverage) / this._rowHeightAverage, 10);
                    }

                    row--;
                    y = -(this._scrollY - this._dataProvider[row]._meta_.y1);
                }

                this._el_data.style.top = y + 'px';

                while (row < this._dataProviderCount && y < this._clientHeight) {
                    r = this._dataProvider[row]; //json da linha
                    e = getRowElement(this, i);  //elemento html da linha
                    h = r._meta_.h;              //altura da linha

                    //define altura da linha, a classe(css) e guarda o índice no próprio HTMLElement
                    e.itemIndex = row;
                    e.style.cssText = ";height:" + h + "px;line-height:" + h + "px;";
                    this._renderItem(r, e, i);

                    //incrementa posição y, linha e do índice
                    y += r._meta_.h;
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

                    delete(this._elActive); //elemento ativo = undefined

                    this.updateDisplay();
                }
            }
        },
                
        _method: {
            render: function() {
                this._clientHeight = this._client.offsetHeight;

                this._vs.scrollSize(this._dataProviderHeight);
                this._vs.canvasSize(this._client.offsetHeight);
                this._vs._onresize();
                this._vs.render();

                this._updateList();
            }
        }
    });
	
//private functions:
    function initDataProvider(component){
        var i, h=0, q=component._dataProvider.length, r;
        
        for (i=0; i<q; i++){
            r = component._dataProvider[i];
            r._meta_ = {
                h : r.height || component._rowHeight,
                y1: h,
                y2: h+r.height
            };
            
            h += r._meta_.h;
        }
        
        component._el_data.style.height = h + 'px';
        component._rowHeightAverage     = h / q;
        component._dataProviderCount    = q;
        component._dataProviderHeight   = h;    
    }
    
    function firstRow(component, y){
        var r, i, d;
        
        i = parseInt(y / component._rowHeightAverage, 10);
        r = component._dataProvider[i]._meta_;
        d = y - r.y2;
        
        while (y >= r.y2){
            if (d>component._rowHeightAverage){
                i += parseInt(d/component._rowHeightAverage, 10);
            }
            
            r = component._dataProvider[++i]._meta_;
        }
        
        return i;
    }
    
    function getRowElement(component, index){
        var e;
        
        if ( !component._elementRows[index] ){
            e = component._el_data.appendChild(jsf.Dom.create('div'));
            e._captureMouseEvent = true;
            
            component._elementRows.push(e);
            component._valueRows.push(e.appendChild(document.createTextNode('')));
        }
        
        return component._elementRows[index];
    }
}());
