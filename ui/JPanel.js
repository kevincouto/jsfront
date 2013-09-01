"use strict";

(function(){
    define("jsf.ui.JPanel", {
        _require: ["jsf.ui.JContainer"],
        _extend: "container",
        _alias: "jsf.JPanel",
        _xtype: "panel",
        
        _constructor: function(properties) {
            jsf.ui.JContainer.call(this);
            
            this._canvas.innerHTML = '<div class="title"><div class="icon"></div><div class="caption"></div><div class="pbutton"></div></div><div class="client"></div>';
            this._title  = this._canvas.childNodes[0];
            this._client = this._canvas.childNodes[1];

            this._applyProperties(properties);
        },
        _event: {
            
        },
        _property: {
            caption:{
                type:"String",
                get: function(){
                    return this._caption;
                },
                set: function(value){
                    this._caption = value;
                    this._title.childNodes[1].innerHTML = value;
                }
            }
        }
    });
}());
