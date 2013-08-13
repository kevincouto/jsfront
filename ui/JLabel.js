"use strict";

(function(){
    
    define("jsf.ui.JLabel",{
        _require: ["jsf.ui.DisplayObject"],
        
        _extend: "display",
		
        _alias: "jsf.JLabel",
		
        _xtype: "label",
        
        _constructor: function(properties){
            jsf.ui.DisplayObject.call(this);
            
            this._canvas.className = 'lbl';
            this._canvas.innerHTML = this._caption = this.CLASS;
            this._applyProperties(properties);
        },
        
        _protected:{
            transparent : true
        },
        
        _event:{
            click : function(){
                if (this._editable && !this._input.parentNode){
                    this._input.oldValue = this._input.value = this._canvas.innerHTML;
                    this._canvas.appendChild(this._input);
                    jsf.Keyboard.selectText(this._input, this._input.value);
                }
            }
        },
        
        _public:{
            caption : function(value){
                //get
                if (value === undefined){
                    return this._caption;
                }
                
                //set
                this._caption = value;
                this._canvas.innerHTML = this.firePropertyChange('caption', Lang.bind(this, 'caption', value));				
                
                return this;
            },
        
            transparent : function(value){
                //get
                if (value === undefined){
                    return this._transparent;
                }
                
                //set
                this._transparent = this.firePropertyChange('className', value);
                this._canvas.className = value ? 'lbl' : 'lbl lbl-background';
                
                return this;
            },
        
            editable : function(value){
                //get
                if (value === undefined){
                    return this._editable;
                }
                    
                //set
                this._editable = this.firePropertyChange('className', value);
                if (value && !this._input){
                    this._input = jsf.Dom.create('input', 'text-align:center', 'lbl-input');
                    this._input.type = 'text';
                    this._input.onblur = this._inputBlur;
                }
                this._canvas.className = value ? 'lbl-editable' : 'lbl';
                
                return this;
            }
        }
    });
}());

