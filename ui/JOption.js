"use strict";

(function() {

    define("jsf.ui.JOption", {
        _require: ["jsf.ui.DisplayObject"],
        _extend: "display",
        _alias: "jsf.JOption",
        _xtype: "optionbox",
        
        _constructor: function(properties) {
            jsf.ui.DisplayObject.call(this);

            this._focuset = true;

            this._caption = '';
            this._canvas.innerHTML = 
                '<div class="client">' +
                    '<div class="icon">'+
                        '<div></div>'+
                    '</div>'+
                    '<div class="caption">JOption</div>'+
                '</div>';
            
            this._echeck = this._canvas.firstChild.childNodes[0];
            this._ecaption = this._canvas.firstChild.childNodes[1];

            this._iconAlign = 'left';

            this._applyProperties(properties);
        },
        _event: {
            click: function() {
                if (!this.checked()) {
                    this.checked(true);
                }
            }
        },
        _property:{
            caption: {
                type: "String",
                get: function() {
                    return this._caption;
                },
                set: function(value){
                    this._caption = this._ecaption.innerHTML = Lang.bind(this, 'caption', value);
                }
            },
            checked: {
                type: "Boolean",
                get: function() {
                    return this._checked;
                },
                set: function(value){
                    this._checked = value;
                    this._rules.custom = value ? " checked" : "";
                    this.updateDisplay();
                }
            },
            group: {
                type:"String",
                get: function() {
                    return this._group;
                },
                set: function(value){
                    this._group = value;
                }
            }
        },
        _public: {
            iconAlign: function(value) {
                //get
                if (value === undefined) {
                    return this._iconAlign;
                }

                //set
                this._iconAlign = value;
                this.updateDisplay();

                return this;
            },
            iconStyle: function(value) {
                //get
                if (value === undefined) {
                    return this._iconStyle;
                }

                //set
                this._echeck.className = 'opt-icon' + (value == 0 ? '' : value == 1 ? ' opt-icon1' : value == 2 ? ' opt-icon2' : '');
                this._iconStyle = value;
                this.updateDisplay();

                return this;
            },
            render: function() {
                 var 
                    children, i, o;

                //desmarca os outros componentes do grupo caso este esteja marcado.
                if (this._checked) {
                    children = this._parent.children();
                    for (i = 0; i < children.length; i++) {
                        o = children[i];
                        if (o && o instanceof jsf.ui.JOption && o._group == this._group && this._id != o._id) {// é JOption, faz parte do meu grupo e não sou eu
                            o.checked(false);
                        }
                    }
                }

                if (this._oldChecked != this._checked) {
                    this.dispatch(jsf.Event.ON_CHANGE, this._checked);
                }
                
                this._oldChecked = this._checked;
            }
        }
    });

}());
