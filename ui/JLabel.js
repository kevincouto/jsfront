"use strict";

(function() {

    define("jsf.ui.JLabel", {
        _require: ["jsf.ui.DisplayObject"],
        _extend: "display",
        _alias: "jsf.JLabel",
        _xtype: "label",
        
        _constructor: function(properties) {
            jsf.ui.DisplayObject.call(this);

            this._canvas.innerHTML = this._caption = "JLabel";
            this._applyProperties(properties);
        },
        _protected: {
            transparent: true
        },
        _event: {
            click: function() {
                if (this._editable && !this._input.parentNode) {
                    this._input.oldValue = this._input.value = this._canvas.innerHTML;
                    this._canvas.appendChild(this._input);
                    jsf.Keyboard.selectText(this._input, this._input.value);
                }
            }
        },
        _property:{
            caption: {
                type:"String",
                get: function() {
                    return this._caption;
                },
                set: function(value){
                    this._caption = value;
                    this._canvas.innerHTML = Lang.bind(this, 'caption', value);
                }
            },
            editable: {
                type:"Boolean",
                get: function() {
                    return this._editable;
                },
                set: function(value){
                    this._editable = value;
                    if (value && !this._input) {
                        this._input = jsf.Dom.create('input[type="text"]');
                        this._input.onblur = this._inputBlur;
                    }
                }
            }
        },
        _public: {
            
        }
    });
}());

