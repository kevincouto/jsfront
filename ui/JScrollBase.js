"use strict";

(function(){
    
    define("jsf.ui.JScrollBase", {
        _require: ["jsf.ui.JScrollbar", "jsf.ui.DisplayObject"],
        _extend: "jsf.ui.DisplayObject",
        _xtype: "scrollbase",
        _abstract: true,
        
        _constructor: function(properties){
            jsf.ui.DisplayObject.call(this);
            
            this._canvas.innerHTML = '<div></div>';
            this._scrollArea = this._canvas.firstChild;
            
            this._vScrollbar = new jsf.JScrollbar({orientation:'v', right:0, top:0, parentComponent:this});
            this._hScrollbar = new jsf.JScrollbar({orientation:'h', bottom:0, left:0, parentComponent:this});
            this._canvas.appendChild(this._vScrollbar._canvas);
            this._canvas.appendChild(this._hScrollbar._canvas);
            
            this._applyProperties(properties);
        },
        
        _event: {
            resize : function(){
                if (this._hScrollbar){
                    this._hScrollbar._onresize();
                }
                
                if (this._vScrollbar){
                    this._vScrollbar._onresize();
                }
                
                this.render();
            },
            mousewheel : function(delta){
                if (this._hScrollbar){
                    this._hScrollbar._onmousewheel(delta);
                }
                
                if (this._vScrollbar){
                    this._vScrollbar._onmousewheel(delta);
                }
            },
            scroll: function(value, scrollBar){
                this._scrollArea.style[scrollBar==this._hScrollbar ? 'left' : 'top'] = (-value)+'px';
            }
        },
        
        _protected: {
            //exibe/oculta a(s) barra(s) de rolagem
            updateScrollBars: function(){
                var width = this._canvas.offsetWidth,
                    height= this._canvas.offsetHeight,
                    scrollSizeWidth = this._scrollArea.offsetWidth,
                    scrollSizeHeight= this._scrollArea.offsetHeight,
                    hsv = (scrollSizeWidth > width), 
                    vsv = (scrollSizeHeight> height),
                    h   = jsf.JScrollbar.getHeight(), 
                    w   = jsf.JScrollbar.getWidth(),
                    clientWidth = width,
                    clientHeight= height;
                
                hsv = (scrollSizeWidth > width);
                vsv = (scrollSizeHeight> height);
                
                if (vsv) {
                    clientWidth = width - w;
                    hsv = (scrollSizeWidth > clientWidth);
                }   
                if (hsv) {
                    clientHeight = height - h;
                    vsv = (scrollSizeHeight > clientHeight );
                }
                if (vsv) {
                    clientWidth = width - w;
                    hsv = (scrollSizeWidth > clientWidth);
                }
                
                this._hScrollbar.canvasSize(clientWidth).scrollSize(scrollSizeWidth);
                this._hScrollbar.right (vsv ? w : 0).render();
                
                this._vScrollbar.canvasSize(clientHeight).scrollSize(scrollSizeHeight);
                this._vScrollbar.bottom (hsv ? h : 0).render();
            }
        }
    });
    
}());