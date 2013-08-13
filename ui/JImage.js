"use strict";

(function(){
    
	define("jsf.ui.JImage",{
		_require: ["jsf.ui.DisplayObject"],
        
        _alias: "jsf.JImage",
        
        _extend: "display",
		
        _xtype: "image",
		
		_constructor : function(properties){
			jsf.ui.DisplayObject.call(this);
			
			this._canvas.className = "b1 img";
            this._canvas.innerHTML = "<div></div>";
            this._el_bg = this._canvas.firstChild;
            
            this._rule = null;
            this._changeRule = false;
            
			this._applyProperties(properties);
		},
        
        _public: {
            stretch: function(value){
                // get
                if (value === undefined){
                    return this._stretch;
                }
                
                // set
                this._stretch = value;
                this._changeRule = true;
                this.updateDisplay();
                
                return this;
            },
            
            image: function(value){ //url ou {url, x, y, width, height, position}
                // get
                if (value === undefined){
                    return this._image;
                }
                
                // set
                if (jsf.isString(value)){
                    value = {
                        url: value
                    };
                }
                
                this._image = value;
                this._changeRule = true;
                this.updateDisplay();
                
                return this;
            },
            
            render: function(){
                if ( this._changeRule && this._image ){
                    var o = this._image, s = 'background: url(' + o.url + ') no-repeat;';
                    
                    if (o.x){ //usar sprite
                        if (!this._stretch){
                            s += 'background-position: -' + o.x + 'px -' + o.y + 'px;';
                        }
                        s += 'width:' + o.width + 'px;height:' + o.height + 'px;';
                    }else{
                        s += 'width:100%;height:100%;';
                    }
                    
                    if (this._stretch){
                        s += 'background-size:100% 100%; background-origin:content-box;';
                    }
                    
                    this._el_bg.setAttribute('style',  s);
                    
                    switch (o.position){
                        case 'center':
                            this._el_bg.style.top = parseInt((this._canvas.offsetHeight/2)-(this._el_bg.offsetHeight/2), 10)+'px';
                            this._el_bg.style.left= parseInt((this._canvas.offsetWidth/2)-(this._el_bg.offsetWidth/2), 10)+'px';
                            break;
                    }
                    
                    this._changeRule= false;
                }
                
                return this;
            }
        }
    });
    
}())
