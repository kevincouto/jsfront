"use strict";

(function() {
    define("jsf.ui.JCombo", {
        _require: ["jsf.ui.DisplayObject", "jsf.ui.JList"],
        _alias: "jsf.JCombo",
        _extend: "display",
        _xtype: "combobox",
        
        _constructor: function(properties) {
            var me;

            jsf.ui.DisplayObject.call(this);

            this._focuset = true;
            this._list = new jsf.ui.JList({focuset:false});

            this._listField = 'label';

            me = this;
            this._list._onchange = function(item) {
                me.caption(item ? item[me._listField] : '');

                jsf.managers.PopupManager.remove(me._list);
                me.dispatch(jsf.Event.ON_ITEM_CLICK, me._list.selectedItem());
            };
            
            this._canvas.innerHTML = 
                    '<div class="client" style="position:relative;top:0;left:0;width:100%;height:100%;">'+
                        '<span class="caption"></span>'+
                        '<div class="arrow"><div></div></div>'+
                    '</div>';
            
            this._client = this._canvas.firstChild.firstChild;

            this._applyProperties(properties);
        },
        _event: {
            resize: function(){
                this._canvas.firstChild.style.lineHeight = this._canvas.firstChild.offsetHeight + 'px';
            },
            mousedown: function(element) {
                this._updateCssRule();
                this._popupVisible = true;
                showList(this, this._list);
            },
            mouseup: function() {
                if (!this._popupVisible){
                    this._updateCssRule();
                }
            },
            mouseover: function(element) {
                if (!this._popupVisible){
                    this._updateCssRule();
                }
            },
            mouseout: function(element) {
                if (!this._popupVisible){
                    this._updateCssRule();
                }
            },
            menuhide2: function() {
                this._popupVisible = false;
                this.render.call(this);
            }
        },
        _property:{
            caption: {
                type: "String",
                get: function() {
                    return this._caption;
                },
                set: function(value){
                    this._client.innerHTML = this._caption = Lang.bind(this, 'caption', value);
                }
            }
        },
        _public: {            
            listHeight: function(value) {
                // get
                if (value === undefined) {
                    return this._listHeight;
                }

                // set
                this._listHeight = value;

                return this;
            },
            listWidth: function(value) {
                // get
                if (value === undefined) {
                    return this._listWidth;
                }

                // set
                this._listWidth = value;

                return this;
            },
            selectedIndex: function(value) {
                return this._list.selectedIndex(value);
            },
            selectedItem: function(value) {
                return this._list.selectedItem();
            },
            find: function(field, value) {
                return this._list.find(field, value);
            },
            render: function() {
                return
                this._canvas.setAttribute('class', cFace1 + (jsf.MouseEvent.isOver(this) ? ' ui-ov' : '') + (jsf.MouseEvent.isDown(this) || this._popupVisible ? ' ui-dn' : '') + (this._enabled ? "" : " cmb-disabled"));
                this._canvas.style.lineHeight = this._canvas.offsetHeight + 'px';
                return this;
            },
            fieldName: function(value) {
                return this._list.fieldName(value);
            },
            listSource: function(value) {
                // get
                if (value === undefined) {
                    return this._listSource;
                }

                //set
                this._listSource = value;
                return this;
            },
            dataProvider: function(value) {
                return this._list.dataProvider(value);
            },
            listField: function(value) { //campo que será listado, default=label
                this._listField = value;
                return this._list.listField(value);
            },
            dataField: function(value) { //campo ao qual o componente está associado
                return this._list.dataField(value);
            }
        }
    });

//private functions:
    function setListPosition(combo, list, rect) {
        var h1 = list.measureHeight(),
                h2 = jsf.managers.SystemManager.height(),
                w1 = combo._canvas.offsetWidth,
                //w2 = System.width(),
                y = rect.top + rect.height;
        //x  = rect.left;

        //define o height e top
        if (jsf.isNumber(combo._listHeight)) {
            h1 = combo._listHeight;
        } else { //combo._listHeight == 'auto' ou undefined
            if (y + h1 > h2) { //a lista não cabe abaixo do combo
                if (h2 - y > rect.top) {//tem mais espaço abaixo do que acima
                    //ajusta para caber abaixo
                    h1 = h2 - y - 2;
                } else {//tem mais espaço acima
                    if (h1 > rect.top - 2) {//não cabe acima
                        //ajusta para caber acima
                        h1 = rect.top - 2;
                        y = 2;
                    } else {//cabe acima
                        y = rect.top - h1;
                    }
                }
            }
        }

        //define o width e left
        if (jsf.isNumber(combo._listWidth)) {
            w1 = combo._listWidth;
        }

        /*
         if (x+w1 > w2){ //a lista nao cabe a direita do combo
         //ajusta para ficar alinhado a esquerda do combo
         x = rect.left - (w1-rect.width);
         }
         */

        list.height(h1);
        list.width(w1);

        return jsf.Dom.positionByRect({
            rect: rect,
            target: list,
            position: 'left|bottom right|top'
        });

        //list.top(y);
        //list.left(x);
        //list.height(h1);
        //list.width(w1);
    }

    function showList(combo, list) {
        var app = jsf.managers.SystemManager.application(),
                rect = jsf.util.Dom.rect(combo._canvas),
                r, e;

        //coloca o popup na aplicacao
        list._canvas.style.visibility = 'hidden';
        list._canvas.style.display = null;
        app._canvas.appendChild(list._canvas);

        //define as dimensoes e posicao da lista
        r = setListPosition(combo, list, rect);

        jsf.managers.PopupManager.add({
            target: list,
            shadow: true,
            modal: false,
            onhide: function() {
                combo._popupVisible = false;
                combo.render();
            },
            onshow: function() {
                list._onresize();
                list.render();

                //efeito de exibicao
                e = {
                    visibility: {from: ''},
                    height: {from: '1px', to: list.height() + 'px'}
                };

                if (r.topPos == 'top') {
                    e.top = {from: rect.top + 'px', to: list.top() + 'px'};
                }

                jsf.Effect.cssTransition({
                    target: list,
                    properties: e
                });
            }
        });

        jsf.FocusManager.childFocus(list, true);
    }
}());
