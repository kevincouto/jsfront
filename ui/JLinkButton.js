"use strict";

(function(){
	
	define("jsf.ui.JLinkButton", {
		_require: ["jsf.ui.DisplayObject"],
        
        _extend: "display",
		
        _alias: "jsf.JLinkButton",
		
        _xtype: "link",
		
		_constructor : function(properties){
			jsf.ui.DisplayObject.call(this);
			
			this._focuset = true;
	        
			this._canvas.className = 'l1 lkb';
	        this._canvas.innerHTML = this._caption = 'JLinkButton';
	        
			this._applyProperties(properties);
		},
		
		_event: {
			mousedown : function() {
				var ui;
                
                if (this._popup) {
                    ui = jsf.Control.get(this._popup);
                    
                    if (ui){
                        jsf.Popup.add({
							shadow: true,
                            target: ui,
                            owner : this,
                            position:'left|bottom right|top'
                        });
                    }
				}
                
				this.render();
			},
            
			mouseup : function() {
				this.render();
			},
            
			mouseover : function() {
				this.render();
			},
            
			mouseout : function() {
				this.render();
			},
            
			menuhide : function() {
				this.selected(false);
			}
		},
		
		_public: {
            underline: function(value) {
		        //get
				if (value === undefined) {
					return this._underline;
				}
		        
		        //set
		        this._underline = value;
		        this.updateDisplay();
				
				return this;
			},
            
			popup: function(value) {
		        //get
				if (value === undefined){
					return this._popup;
				}
		        
		        //set
				this._popup = value;
				
				return this;
			},
            
			caption: function(value) {
		        //get
				if (value === undefined) {
					return this._caption;
				}
		        
		        //set
		        this._caption = value;
		        this._canvas.innerHTML = Lang.bind(this, 'caption', value);
				
				return this;
			},
            
			render: function() {
				var className = 'l1 lkb';
				
				if (this._enabled) {
					className += ((jsf.MouseEvent.isOver(this) || this._underline ? ' l2 lkb-over' : '') + (jsf.MouseEvent.isDown(this) ? ' lkb-down'	: ''));
				}else{
					className += ' lkb-disabled';
				}
				
				this._canvas.setAttribute('class', className);
				
				return this;
			}
		}
	});
	
}());
