(function(){
    define("jsf.ui.JSplitter", {
        _require: ["jsf.ui.DisplayObject", "jsf.util.Dom"],
        _alias: "jsf.JSpliter",
        _extend: "display",
        _xtype: "splitter",
        
        _constructor: function(properties){
            var me;
            
            jsf.Display.call(this);
            
            //regras css
            this._rules = {
                vertical: "jspt jspt-vertical",
                horizontal: "jspt jspt-horizontal"
            };
            
            this._canvas.className = this._rules.vertical;
            
            //htmlElements
            this._canvas.innerHTML = '<div class="jspt-icon"></div>';
            this._icon = this._canvas.firstChild;
            
            //defaults
            this._align= "left";
            this._cursor = "col-resize";
            
            me = this;
            
            this._canvas._ondraging = function(target, x, y){
                var w = x - me._dx, h = y - me._dy;
                
                (me._align=='left' || me._align=='right') ? target.style.left = x + 'px' : target.style.top = y + 'px';
                
                if (me._leftElement){
                    me._leftElement._canvas.style.width = (me._wi + w)+'px';
                }else if (me._rightElement){
                    me._rightElement._canvas.style.width = (me._wi - w)+'px';
                }else if (me._topElement){
                    me._topElement._canvas.style.height = (me._hi + h)+'px';
                }else if (me._bottomElement){
                    me._bottomElement._canvas.style.height = (me._hi - h)+'px';
                }
                
                me.parent()._onresize();//updateParentDisplay();
            };
            
            this._applyProperties(properties);
        },
        
        _event: {
            draging: function(x, y){
                var 
                    w = x - this._dx, 
                    h = y - this._dy,
                    c = this.canvas();
                
                (this._align=='left' || this._align=='right') ? c.style.left = x + 'px' : c.style.top = y + 'px';
                
                if (this._leftElement){
                    this._leftElement._canvas.style.width = (this._wi + w)+'px';
                }else if (this._rightElement){
                    this._rightElement._canvas.style.width = (this._wi - w)+'px';
                }else if (this._topElement){
                    this._topElement._canvas.style.height = (this._hi + h)+'px';
                }else if (this._bottomElement){
                    this._bottomElement._canvas.style.height = (this._hi - h)+'px';
                }
                
                this.parent()._onresize();//updateParentDisplay();
                
                return false;
            },
            dragstart: function(){
                return false;
            },
            mousedown: function(element, evt){
                this._dx = this._canvas.offsetLeft;
                this._dy = this._canvas.offsetTop;
                
                if (this._leftElement){
                    this._wi = this._leftElement._canvas.offsetWidth;
                }else if (this._rightElement){
                    this._wi = this._rightElement._canvas.offsetWidth;
                }else if (this._topElement){
                    this._hi = this._topElement._canvas.offsetHeight;
                }else if (this._bottomElement){
                    this._hi = this._bottomElement._canvas.offsetHeight;
                }
                
                jsf.managers.DragManager.doDrag(this, {cursor:this._cursor});
            }
        },
        
        _property: {
            align: {
                set: function(value){
                    var vertical = Boolean(value == 'left' || value == 'right');
                    
                    this._align = value;

                    if (vertical){
                        this._canvas.style.width = null;                        
                    }else{
                        this._canvas.style.height = null;
                    }
                    
                    this._canvas.className = vertical ? this._rules.vertical : this._rules.horizontal;
                    this._cursor = vertical ? 'col-resize' : 'row-resize';
                    
                    this._updateParentDisplay();
                }
            }
        },
        
        _public: {
            
        }
    });
}());
