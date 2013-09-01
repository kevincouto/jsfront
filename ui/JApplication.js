"use strict";

(function(){
    
    define("jsf.ui.JApplication", {
        _require: ["jsf.ui.JModule"],
        _extend: "module",
        _xtype: "application",
        
        _constructor: function(properties) {
            jsf.JModule.call(this, properties);

            this._canvas.style.visibility = 'hidden';
            this._canvas.tabIndex = 1;
        },
                
        _property: {
            title: {
                type:"String",
                get: function() {
                    return document.title;
                },
                set: function(value){
                    document.title = Lang.bind(this, 'title', value);
                }
            },
            container: {
                type:"String|HTMLElement",
                get: function() {
                    return this._container || document.body;
                },
                set: function(value){
                    this._container = value;
                }
            }
        },
                
        _public: {
            //override JModule.create
            create: function(def) {
                jsf.JModule.prototype.create.call(this, def);
                this.container().appendChild(this._canvas);
                return this;
            }
        }
    });
}());
