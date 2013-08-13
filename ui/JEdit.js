"use strict";

(function(){

    define("jsf.ui.JEdit", {
        _require: ["jsf.ui.DisplayObject"],
        
        _extend: "display",
        
        _alias: "jsf.JEdit",
        
        _xtype: "editbox",
        
        _constructor: function(properties){
            jsf.ui.DisplayObject.call(this);
            
            this._rules= {
                canvas  : "b1 txt",
                focus   : "b2",
                disabled: "b3 txt-disabled",
                notvalid: "txt-notvalid"
            };
            
            this._focuset = true;
            
            this._canvas.innerHTML = '<textarea></textarea>';
            this._canvas.className = 'txt ui-bd txt-border';
            
            this._input = this._canvas.childNodes[0];
            
            this._applyProperties(properties);
        },
        
        _event: {
            enter : function(){
                this._input.focus();
                return false;
            },
            exit : function(evt){
                this.dispatch(jsf.event.Event.ON_EDIT_END, evt);
                return false;
            }
        },
        
        _protected: {
            
        },
        
        _public: {
            text: function(value){
                // get
                if (value === undefined) {
                    return this._input.value; 
                }
                
                // set
                this._input.value = this.firePropertyChange('text', value);
                
                return this;
            },
            
            dataField: function(value){
                // get
                if (value === undefined) {
                    return this._dataField; 
                }
                
                // set
                this._dataField = value;
                
                return this;
            },
            
            data: function(value){
                // get
                if (value === undefined) {
                    return this._input.value; 
                }
                
                // set
                this._input.value = value;        
                
                return this;
            },
            
            clear: function(){
                this._input.value = '';
            },
            
            focus: function(){
                this._input.focus();
            }
        }
    });
    
}());
