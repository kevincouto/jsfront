"use strict";

(function() {

    define("jsf.ui.JSplitButton", {
        _require: ["jsf.ui.DisplayObject", "jsf.ui.JButton"],
        _extend: "display",
        _alias: "jsf.JSplitButton",
        _xtype: "splitbutton",
        
        _constructor: function(properties) {
            jsf.ui.DisplayObject.call(this);

            this._canvas.innerHTML = '<div style="position:relative;top:0;left:0;width:100%;height:100%;"><div class="button1"></div><div class="button2"><div></div></div></div>';
            this._bt1 = this._canvas.firstChild.childNodes[0];
            this._bt2 = this._canvas.firstChild.childNodes[1];
            this._client = this._bt1;
            
            jsf.event.MouseEvent.enabledEvents(this._bt1);
            jsf.event.MouseEvent.enabledEvents(this._bt2);
            
            /*this._canvas.style.overflow = 'visible';

            this._el_canvas = this._canvas.firstChild;
            this._el_caption = this._el_canvas.firstChild;
            this._el_arrow = this._canvas.childNodes[1];*/

            this._applyProperties(properties);
        },
        _static: {
            IA_LEFT: 'left',
            IA_TOP: 'top',
            IA_RIGHT: 'right',
            IA_BOTTOM: 'bottom'
        },
        _event: {
            mousedown: function(element) {
                updateCssRule(this, (element==this._bt1 ? "button1 down" : null), "button2 down" );
               
                if (this._popup && element == this._bt2) {
                    if (jsf.isString(this._popup)) {
                        this._popup = this.module()[this._popup];
                    }

                    if (this._popup) {
                        this._popup.shadow(true);
                        jsf.managers.PopupManager.add({
                            target: this._popup,
                            owner:  this,
                            position:{},
                            onhide: function(){
                                this._popupVisible = false;
                                this._onmouseup();
                            }
                        });
                        this._popupVisible = true;
                    }
                }
            },
            mouseup: function() {
                if (!this._popupVisible){
                    updateCssRule(this, "button1 over", "button2 over");
                }
            },
            mouseover: function(element) {
                if (!this._popupVisible){
                    updateCssRule(this, (element==this._bt1 || this._buttonStyle ? "button1 over" : null), "button2 over" );
                }
            },
            mouseout: function(element) { 
                if (!this._popupVisible){
                    updateCssRule(this, "button1", "button2");
                }
            }
        },
                
        _property: {
            caption: {
                type: "String",
                get: function() {
                    return this._caption;
                },
                set: function(value){
                    this._client.innerHTML = this._caption = Lang.bind(this, 'caption', value);
                }
            },
            sprites: {
                type: "{jsf.core.Sprite}",
                get: function() {
                    return this._sprites;
                },
                set: function(value) {
                    this._sprites = value;

                    if (this._el_icon) {
                        this.updateDisplay();
                    }
                }
            },
            icon: {
                type: "Number",
                get: function() {
                    return this._icon;
                },
                set: function(value) {
                    this._icon = value;

                    if (this._icon >= 0 && !this._el_icon) {
                        this._el_icon = this._canvas.insertBefore(Dom.create('div'), this._canvas.firstChild);
                    }

                    if (this._sprites) {
                        this.updateDisplay();
                    }
                }
            },
            iconAlign: {
                type: "String",
                get: function() {
                    return this._iconAlign;
                },
                set: function(value) {
                    this._iconAlign = value;

                    if (this._el_icon) {
                        this.updateDisplay();
                    }
                }
            },
            buttonStyle: {
                type: "String",
                get: function() {
                    return this._buttonStyle;
                },
                set: function(value){
                    this._buttonStyle = value;
                    this._rules.custom = " " + value;
                    this.updateDisplay();
                }
            },
            popup: {
                type: "String",
                get: function() {
                    return this._popup;
                },
                set: function(value){
                    this._popup = value;
                }
            } 
            
        },
        
        _public: {
            render: function() {
                return this;
            }
        }
    });

//private functions:
    function updateCssRule(component, cls1, cls2){
        component._bt2.className = cls2;
        if (cls1){
            component._bt1.className = cls1;
        }
        component._updateCssRule();
    }

    function alignIcon(icon, align, cls) {
        var p = icon.parentNode, h;

        p.style.padding = 0;
        icon.setAttribute('class', 'btn-icon btn-icon-' + align + ' ' + cls);

        switch (align) {
            case 'left':
                icon.setAttribute('style', 'margin-top:-' + (icon.offsetHeight / 2) + 'px');
                p.style.paddingLeft = (icon.offsetLeft) + icon.offsetWidth + 'px';
                break;

            case 'top':
                icon.setAttribute('style', 'margin-left:-' + (icon.offsetWidth / 2) + 'px');
                p.style.paddingTop = (icon.offsetTop) + icon.offsetHeight + 'px';
                p.style.verticalAlign = 'top';
                p.style.lineHeight = '';
                break;

            case 'right':
                icon.setAttribute('style', 'margin-top:-' + (icon.offsetHeight / 2) + 'px');
                p.style.paddingRight = ((p.offsetWidth - (icon.offsetLeft + icon.offsetWidth))) + icon.offsetWidth + 'px';
                break;

            case 'bottom':
                h = ((p.offsetHeight - (icon.offsetTop + icon.offsetHeight))) + icon.offsetHeight;
                icon.setAttribute('style', 'margin-left:-' + (icon.offsetWidth / 2) + 'px');
                p.style.paddingBottom = p.style.lineHeight = h + 'px';
                p.style.verticalAlign = 'bottom';
                break;

            case 'center':
                icon.setAttribute('style', 'margin-left:-' + (icon.offsetWidth / 2) + 'px;margin-top:-' + (icon.offsetHeight / 2) + 'px');
                break;
        }
    }

}());
