"use strict";

(function(){
    
	define("jsf.ui.JSplitButton", {
	    _require: ["jsf.ui.DisplayObject"],
      
        _extend: "display",
        
        _alias: "jsf.JSplitButton",
        
        _xtype: "splitbutton",
	    
		_constructor : function(properties){
			jsf.Display.call(this);
			
			this._focuset = true;
			
			this._iconAlign = 'left';                      
			this._border = true;
			
			this._canvas.innerHTML = '<div class="btn" style="top:0;bottom:0;left:0;border-top-right-radius: 0;border-bottom-right-radius: 0;"><span></span></div><div class="btn btn-arrow"><div></div></div>';
			this._canvas.style.overflow = 'visible';
			
			this._el_canvas  = this._canvas.firstChild;
			this._el_caption = this._el_canvas.firstChild;
			this._el_arrow   = this._canvas.childNodes[1];
			
			this._el_canvas._captureMouseEvent = this._el_arrow._captureMouseEvent = true;
			
			this._applyProperties(properties);
		},
        
	    _static: {
	    	IA_LEFT  : 'left',
	        IA_TOP   : 'top',
	        IA_RIGHT : 'right',
	        IA_BOTTOM: 'bottom'
	    },
	    
	    _event: {
	    	mousedown: function(element) {
				if (this._popup && element==this._el_arrow){
					if (jsf.isString(this._popup)){
						this._popup = this.module()[this._popup];
					}
					
		            if (this._popup){
		                jsf.ui.JButton.showPopup(this);
		            }
				}
				this.render();
			},
            
			mouseup: function() {
				this.render();
			},
            
			mouseover : function(element) {
				element.style.zIndex = 1;
				this._mouseOverElement = element;
				this.render();
			},
            
			mouseout : function(element) {
				element.style.zIndex = null;
				this._mouseOverElement = null;
				this.render();
			},
            
			menuhide : function() {
				this._popupVisible = false;
				this.render.call(this);
			}
	    },
	   
		_public: {
			popup: function(value) {
		        //get
				if (value === undefined){
					return this._popup;
				}
		        
		        // set
		        this._popup = value;
				return this;
			},
            
			caption: function(value) {
		        // get
				if (value === undefined){
					return this._caption;
				}
		        
		        // set
		        this._el_caption.innerHTML = this._caption = Lang.bind(this, 'caption', value);
				return this;
			},
            
			sprites: function(value) {
		        // get
				if (value === undefined) {
					return this._sprites;
				}
		        
		        // set
		        this._sprites = value;
                
		        if (this._el_icon){
		            this.updateDisplay();
				}
		        
				return this;
			},
            
			icon: function(value) {
		        // get
				if (value === undefined){
					return this._icon;
				}
		        
		        // set
		        this._icon = value;
		        
		        if (this._icon >= 0 && !this._el_icon){
		            this._el_icon = this._canvas.insertBefore(Dom.create('div'), this._canvas.firstChild);
		        }
		        
		        if (this._sprites){
		            this.updateDisplay();
				}
		        
				return this;
			},
            
			iconAlign: function(value) {
		        // get
				if (value === undefined) {
					return this._iconAlign;
				}
		        
		        // set
		        this._iconAlign = value;
                
		        if (this._el_icon){
		            this.updateDisplay();
				}
		        
				return this;
			},
            
			border: function(value) {
				// get
		        if (value === undefined) {
					return this._border;
				}
		        
		        // set
		        this._border = !!value;
		        this.updateDisplay();
				
				return this;
			},
            
			render: function() {
				var sprites,
					cls1 = 'ui-fc' + (this._border ? ' ui-bd' : '') + ' btn',
					cls2 = cls1 + ' btn-arrow',
					cls3 = jsf.MouseEvent.isDown(this) || this._popupVisible ? ' ui-dn btn-down' : '';
				
				this._el_canvas.style.right = this._el_arrow.offsetWidth + 'px';
				
				if (this._mouseOverElement == this._el_canvas){
					cls1 += (cls3 + ' ui-ov btn-over');
				}
				else if (this._mouseOverElement == this._el_arrow){
					cls2 += (cls3 + ' ui-ov btn-over');
				}
				
				this._el_canvas.setAttribute('class', cls1);
				this._el_arrow.setAttribute ('class', cls2 + (!jsf.MouseEvent.isDown(this) && this._popupVisible ? ' btn-down' : ''));
				
				this._canvas.style.lineHeight = this._canvas.offsetHeight + 'px';
				
				// alinha o icone, se existir
				sprites = this.getSprites();
				if (this._icon >= 0 && sprites) {
					alignIcon(this._el_icon, this._iconAlign, sprites.sprite(this._icon, this._enabled ? 0 : 1));
				}
				
				return this;
			}
		}
	});

//private functions:   
    function alignIcon(icon, align, cls){
        var p = icon.parentNode, h;
        
        p.style.padding = 0;
        icon.setAttribute('class', 'btn-icon btn-icon-' + align + ' ' +  cls);
        
        switch (align){
            case 'left':
                icon.setAttribute('style', 'margin-top:-'+(icon.offsetHeight/2)+'px');
                p.style.paddingLeft = (icon.offsetLeft) + icon.offsetWidth + 'px';
                break;
            
            case 'top':
                icon.setAttribute('style', 'margin-left:-'+(icon.offsetWidth/2)+'px');
                p.style.paddingTop = (icon.offsetTop) + icon.offsetHeight + 'px';
                p.style.verticalAlign = 'top';
                p.style.lineHeight = '';
                break;
            
            case 'right':
                icon.setAttribute('style', 'margin-top:-'+(icon.offsetHeight/2)+'px');
                p.style.paddingRight = ((p.offsetWidth-(icon.offsetLeft+icon.offsetWidth))) + icon.offsetWidth + 'px';
                break;
            
            case 'bottom':
                h = ((p.offsetHeight-(icon.offsetTop+icon.offsetHeight))) + icon.offsetHeight;
                icon.setAttribute('style', 'margin-left:-'+(icon.offsetWidth/2)+'px');
                p.style.paddingBottom = p.style.lineHeight = h + 'px';
                p.style.verticalAlign = 'bottom';
                break;
            
            case 'center':
                icon.setAttribute('style', 'margin-left:-'+(icon.offsetWidth/2)+'px;margin-top:-'+(icon.offsetHeight/2)+'px');
            break;
        }
    }

}());
