"use strict";

(function(){
    var cls = jsf.getContentRule(".jcheck-class" ),
        cFace1 = (cls[0] || "f1") + " chk-icon";
        
    define("jsf.ui.JCheck", {
        _require: ["jsf.ui.DisplayObject"],
        
        _alias: "jsf.JCheck",
        
        _extend: "display",
		
        _xtype: "checkbox",
        
        _constructor : function(properties){
            jsf.ui.DisplayObject.call(this);
            
            this._focuset = true;
            
            //default values
            this._caption = 'JCheck';
            this._focusCls = "";
            this._canvas.innerHTML = '<div class="' + cFace1 + '"><div></div></div><span>JCheck</span>';
            this._echeck   = this._canvas.childNodes[0];
            this._ecaption = this._canvas.childNodes[1];
            
            this._applyProperties( properties );
        },
        
        _event: {
            enter : function(){
                //this._focusCls = " ui-af chk-focus";
                this.render();
            },
            
            exit : function(){
                //this._focusCls = "";
                this.render();
            },
            
            click : function(){
                this.checked(!this.checked());
            },
            
            mouseover : function(){
                this.render();
            },
            
            mouseout : function(){
                this.render();
            }
        },
        
        _public: {
            caption : function(value){
                //get
                if (value === undefined){
                    return this._caption;
                }
                
                //set
                this._caption = this._ecaption.innerHTML = Lang.bind(this, 'caption', value);
                
                return this;
            },
            
            checked : function(value){
                //get
                if (value === undefined){
                    return this._checked;
                }
                
                //set
                this._oldChecked = !!this._checked;
                this._checked = !!value;			
                this.updateDisplay();
                
                return this;
            },
            
            checkStyle : function(value){
                //get
                if (value === undefined){
                    return this._checkStyle;
                }
                
                //set
                this._checkStyle = value;
                this._echeck.className = "ui-fc ui-bd chk_" + value + "-icon";
                this.updateDisplay();
                
                return this;
            },
            
            render : function(){
                var c;
                
                if (this._checkStyle=="slide"){
                    c = "chk_slide";
                    this._ecaption.innerHTML = this._checked ? "ON" : "OFF";
                }else{
                    c = "chk";
                }
                
                this._canvas.className= c + this._focusCls +
                                        (this._checked ? " " + c + "-checked" : "") +
                                        (jsf.MouseEvent.isOver(this) ? " " + c + "-over" : "") +
                                        (this._enabled ? "" : " " + c + "-disabled");
                
                this._canvas.style.lineHeight = this._canvas.offsetHeight + 'px';
                
                if (this._oldChecked != this._checked){
                    this.dispatch(jsf.Event.ON_CHANGE, this._checked);
                    this._oldChecked = this._checked;
                }
            },
			
			data: function(value){
                // get
                if (value === undefined) {
                    return this._checked ? 1 : 0;
                }
                
                // set
                this.checked( Boolean(value) );
                
                return this;
            }
        }
    });
}())
