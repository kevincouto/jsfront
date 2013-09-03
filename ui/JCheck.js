"use strict";

(function() {
    
    define("jsf.ui.JCheck", {
        _require: ["jsf.ui.DisplayObject"],
        _alias: "jsf.JCheck",
        _extend: "display",
        _xtype: "checkbox",
        
        _constructor: function(properties) {
            jsf.ui.DisplayObject.call(this);

            this._focuset = true;

            //default values
            this._caption = 'JCheck';
    
            this._canvas.innerHTML = 
                '<div class="client">' +
                    '<div class="icon">'+
                        '<div></div>'+
                    '</div>'+
                    '<div class="caption">JCheck</div>'+
                '</div>';
        
            this._echeck = this._canvas.firstChild.childNodes[0];
            this._ecaption = this._canvas.firstChild.childNodes[1];

            this._applyProperties(properties);
        },
        _event: {
            click: function() {
                this.checked(!this.checked());
            }
        },
        _property:{
            caption:{
                type:"String",
                get: function(){
                    return this._caption;
                },
                set: function(value){
                    this._caption = this._ecaption.innerHTML = Lang.bind(this, 'caption', value);
                }
            },
            checked:{
                type:"Boolean",
                get: function(){
                    return this._checked;
                },
                set: function(value){
                    var oldChecked = this._checked;
                    
                    this._checked = value;
                    this._rules.custom = value ? " checked" : "";
                    this._updateCssRule();
                    
                    if (oldChecked != this._checked) {
                        this.dispatch(jsf.Event.ON_CHANGE, this._checked);
                    }
                }
            }
        },
        _public: {
            checkStyle: function(value) {
                //get
                if (value === undefined) {
                    return this._checkStyle;
                }

                //set
                this._checkStyle = value;
                this._echeck.className = "ui-fc ui-bd chk_" + value + "-icon";
                this.updateDisplay();

                return this;
            },
            render: function() {
                
            }
        }
    });
}())
