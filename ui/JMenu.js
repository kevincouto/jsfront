"use strict";

(function() {
    var ids = 1;

    define("jsf.ui.JMenu", {
        _require: ["jsf.ui.DisplayObject"],
        _extend: "display",
        _alias: "jsf.JMenu",
        _xtype: "menu",
        
        _constructor: function(properties) {
            jsf.ui.DisplayObject.call(this);

            this._itens = [];

            this._applyProperties(properties);
        },
        _static: {
            noParent: true
        },
        _event: {
            mouseover: function(element) {
                return;
                if (element.getAttribute('_captureMouseEvent') && !element.getAttribute('disabled')) {

                    if (this._elover == element) {
                        return;
                    }

                    element.setAttribute('class', 'i1 mnu-item mnu-item-over');

                    if (this._popupChild) {
                        jsf.Popup.remove(this._popupChild);
                        this._popupChild = null;
                        if (this._elover) {
                            this._onmouseout(this._elover);
                        }
                    }

                    this._elover = element;

                    if (element.getAttribute('popup')) {
                        this._popupChild = this._itens[element.getAttribute('itemIndex')].popup;
                        this._popupChild._parentPopup = this;

                        var app = jsf.System.application(),
                                r1 = jsf.Dom.rect(element, app),
                                r2 = jsf.Dom.measure(this._popupChild),
                                l = r1.left + r1.width,
                                t = r1.top;

                        if (l + r2.width + 2 > app._canvas.offsetWidth) {
                            l = r1.left - r2.width;
                        }

                        if (t + r2.height + 2 > app._canvas.offsetHeight) {
                            t = r1.top - r2.height + r1.height;
                        }

                        if (l < r1.left) {
                            this._popupChild.show(l, t, 'left');
                        } else {
                            this._popupChild.show(l, t, 'right');
                        }
                    }
                }
            },
            mouseout: function(element) {
                if (!this._popupChild) {
                    if (this._elover) {
                        this._elover.setAttribute('class', 'mnu-item');
                        this._elover = null;
                    }
                }
            },
            click: function(element, evt) {
                var item, p;
                
                if (element.getAttribute('_captureMouseEvent') && element.className.indexOf('disabled')==-1 && !element.getAttribute('popup')) {
                    item = this._itens[element.getAttribute('itemIndex')];

                    p = this._parentPopup || this;
                    while (p._parentPopup) {
                        p = p._parentPopup;
                    }
                    jsf.managers.PopupManager.remove(p);

                    this.dispatch(jsf.Event.ON_ITEM_CLICK, item);
                }
            },
            hide: function() {
                if (this._elover) {
                    this._elover.setAttribute('class', 'mnu-item');
                    this._elover = null;
                }

                if (this._popupChild) {
                    jsf.Popup.remove(this._popupChild);
                }

                this._parentPopup = null;
                this._popupChild = null;
            },
            /* quando um menu é adicionado dentro de um container usando o método add */
            add: function(parent) {
                jsf.Dom.remove(this.canvas());
            },
            langchanged: function(param, value) {
                param.caption = value;
            }
        },
        
        _property: {
            itens: {
                type: "Array",
                get: function() {
                    return this._itens;
                },
                set: function(value){
                    var i, item, o;

                    this._itens       = value;
                    this._itemChanged = true;
                    this._withIcon   = false;
                    
                    for (i = 0; i < value.length; i++) {
                        item = value[i];

                        if (!item.id) {
                            item.id = 'menuItem_' + (ids++);
                        }
                        
                        if (item.icon){
                            this._withIcon = true;
                            item.icon = JSON.parse(item.icon);
                            item.icon = jsf.isArray(item.icon) ? item.icon : [item.icon];
                        }
                        
                        item.enabled = item.enabled===undefined ? true : jsf.isString(item.enabled) ? (item.enabled=="true" ? true : false) : item.enabled;
                        item.label = Lang.bind(this, '_imc', item.label, item);//_imc=item menu caption

                        if (item.add) {
                            o = item.add[0];
                            delete(item.add);
                            delete(o.xtype);
                            this.addChild(item, new jsf.ui.JMenu(o));
                        }
                    }

                    this.updateDisplay();
                }
            },
            enabled: { //sobrescreve o set_enabled
                set: function(value) {
                    this._enabled = true;//sempre habilitado, desabilita apenas os itens

                    for (i = 0; i < this._itens.length; i++) {
                        this._itens[i].enabled = value;
                    }

                    this._itemChanged = true;
                    this.updateDisplay();
                }
            }
        },        
        _public: {
            
            //retorna um item
            item: function(value) {
                var i, item, type = jsf.isObject(value) ? 'object' : jsf.isString(value) ? 'string' : 'number';

                for (i = 0; i < this._itens.length; i++) {
                    item = this._itens[i]; //{label:'', icon:0, checked:true}

                    if (type == 'number' && i == value) {
                        return item;
                    }

                    if (type == 'string' && item.id == value) {
                        return item;
                    }

                    if (type == 'object' && item.id == value.id) {
                        return item;
                    }
                }
                
                this._itemChanged = true;
                this.updateDisplay();

                return null;
            },
            //{label:'', icon:[[1,1],[1,2]], checked:true}
            addItem: function(item) {
                this._itens.push(item);
                this._itemChanged = true;
                this.updateDisplay();
                return this;
            },
            addChild: function(item, popup) {
                item = this.item(item);

                if (item) {
                    item.popup = popup;
                    this.updateItem(item);
                    this.updateDisplay();
                }
            },
            updateItem: function(item, properties) {
                var i;

                if (item) {
                    item = this.item(item);

                    if (item) {
                        for (i in properties) {
                            item[i] = properties[i];
                        }
                        this._itemChanged = true;
                        this.updateDisplay();
                    }
                }

                return this;
            },
            caption: function(value) {
                // get
                if (value === undefined) {
                    return this._caption;
                }

                // set
                this._caption = Lang.bind(this, 'caption', value);

                return this;
            },
            sprites: function(value) {
                // get
                if (value === undefined) {
                    return this._sprites;
                }

                // set
                this._sprites = value;

                return this;
            },
            render: function() {
                if (this._itemChanged) {
                    var 
                        i, item, htmlIcon, htmlLabel, clsItem,
                        sprites = this.getSprites(),
                        html = "";//this._caption ? '<div class="mnu-caption">' + this._caption + '</div>' : '';
                    
                    for (i = 0; i < this._itens.length; i++) {
                        item = this._itens[i];

                        if (item.id === undefined) {
                            item.id = ('item_' + i);
                        }
                        
                        htmlIcon = (
                            item.checked
                            ? '<div class="checked"></div>'
                            : (item.icon && sprites ? '<div class="icon ' + sprites.sprite(item.icon[item.enabled ? 0 : 1]) + '"></div>' : '')
                        );
                        
                        htmlLabel = (
                            htmlIcon == "" 
                            ? item.label
                            : htmlIcon + item.label
                        );
                        
                        clsItem = "menuitem" + (
                            (this._withIcon ? " withicon" : "") + 
                            (item.enabled===false ? " disabled" : "")
                        );
                        
                        
                        html += (
                            item.label == '-' 
                            ? '<div class="menuitem_separator"><div></div></div>'
                            : '<div class="' + clsItem + '" _captureMouseEvent="true" itemIndex="' + i + '" ' + (item.popup ? 'popup="1"' : '') + '>' +
                                    htmlLabel +
                                    (item.popup ? '<div class="arrow"></div>' : '') +
                              '</div>'
                        );
                    }

                    this._canvas.innerHTML = html;
                    this._itemChanged = false;
                }
            },
            show: function(x, y, direction) {
                var r = jsf.Dom.measure(this), p;

                if (y + r.height > jsf.System.height()) {
                    y -= (y + r.height - jsf.System.height()) + 6;
                }

                this.left(x);
                this.top(y);

                p = {
                    overflow: {from: 'hidden'},
                    display: {from: ''},
                    height: {from: '1px', to: r.height + 'px'},
                    width: {from: '1px', to: r.width + 'px'}
                };

                if (direction == 'left') {
                    p.left = {
                        from: (r.width + x) + 'px', to: x + 'px'
                    };
                }

                jsf.Popup.add({
                    target: this,
                    showEffect: {
                        target: this,
                        properties: p,
                        complete: function(e) {
                            e.style.overflow = null;
                        }
                    }
                });
            },
            hide: function() {
                jsf.Popup.remove(this);
            }
        }
    });

}());
