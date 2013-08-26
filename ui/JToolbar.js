"use strict";
(function(){
    
    define("jsf.ui.JToolbar",{
        _require: ["jsf.ui.JContainer"],
        _extend: "container",
        _alias: "jsf.JToolbar",
        _xtype: "toolbar",
        
        _constructor : function(properties){
            jsf.JContainer.call(this, properties);
            
            this._captureChildMouseClick = true;
            
            this._layout = 'custom';
            this._align = 'top';
            this._indent= 2;
            this._grap  = 3;
            
            this._applyProperties(properties);
        },
        
        _event:{
            click : function(element, evt, child){
                if (child instanceof jsf.Display){
                    this.dispatch(jsf.Event.ON_ITEM_CLICK, child);
                }
            },
            resize: function(){
                var 
                    i, child,
                    y = (this.canvas().offsetHeight/2),
                    children= this.children();
                
                //calcula o margin-top dos filhos
                for (i=0; i<children.length; i++){
                    child = children[i];
                    child.canvas().style.marginTop = (y - (child.canvas().offsetHeight/2))+'px';
                }
            }
        },
        
        _public: {
            toolbarStyle: function(value){
                //get
                if (value === undefined){
                    return this._toolbarStyle;
                }
                
                //set
                this._toolbarStyle = value;
                this._canvas.className = (value == "head1" ? this._rules.style1 : value=="head3" ? this._rules.style3 : this._rules.style2);
                
                return this;
            },
            
            indent: function(value){
                //get
                if (value === undefined){
                    return this._indent;
                }
                
                //set
                this._indent = Number(value);
                this.updateDisplay();
                
                return this;
            },
            
            caption: function(value){
                //get
                if (value === undefined){
                    return this._caption;
                }
                
                //set
                this._caption = Lang.bind(this, 'caption', value);
                this.updateDisplay();
                
                return this;
            },
            
            render: function(){
                
                return;
                var i, j, 
                    ym      = (this._canvas.offsetHeight/2),
                    xm      = (this._canvas.offsetWidth/2),
                    x       = this._indent,
                    y       = this._indent,
                    children= this.children(), 
                    count   = children.length;
                
                if (this._align=='left' || this._align=='right'){
                    for (i=0; i<count; i++){
                        children[i]._focuset=false;
                        switch ( children[i]._CLASS_ ){
                            case 'jsf.ui.JSpace':
                                y = this._canvas.offsetHeight - this._indent;
                                for (j=i+1; j<count; j++){
                                    y -= (children[j]._canvas.offsetHeight + children[j]._marginTop + children[j]._marginBottom +  this._grap);
                                }
                                break;
                                
                            case 'jsf.ui.JSeparator':
                                children[i]._canvas.style.top = (y+children[i]._marginTop) + 'px';
                                children[i]._canvas.className = 'tbr-horizontal-separator';
                                y += children[i]._canvas.offsetHeight + this._grap;
                                break;
                                
                            default:
                                x = parseInt(xm - (children[i]._canvas.offsetWidth/2), 10)-1;
                                
                                children[i]._canvas.style.top = (y+children[i]._marginTop) + 'px';
                                children[i]._canvas.style.left = x + 'px';
                                
                                y += children[i]._canvas.offsetHeight + this._grap + children[i]._marginBottom;
                                
                                children[i].updateDisplay();
                        }			
                    }
                }else{
                    for (i=0; i<count; i++){
                        children[i]._focuset=false;
                        switch (children[i]._CLASS_){
                            case 'jsf.ui.JSpace':
                                x = this._canvas.offsetWidth - this._indent;
                                for (j=i+1; j<count; j++){
                                    x -= (children[j]._canvas.offsetWidth + children[j]._marginLeft + children[j]._marginRight +  this._grap);
                                }
                                break;
                                
                            case 'jsf.ui.JSeparator':
                                children[i]._canvas.style.left = (x+children[i]._marginLeft) + 'px';
                                children[i]._canvas.className = 'tbr-vertical-separator';
                                x += children[i]._canvas.offsetWidth + this._grap;
                                break;
                            
                            default:
                                y = parseInt(ym - (children[i]._canvas.offsetHeight/2), 10)-1;
                                
                                children[i]._canvas.style.left = (x+children[i]._marginLeft) + 'px';
                                children[i]._canvas.style.top  = y + 'px';
                                
                                x += children[i]._canvas.offsetWidth + this._grap + children[i]._marginRight;
                                
                                children[i].updateDisplay();
                        }			
                    }
                }
                
                if (this._caption){
                    if (!this._el_caption){
                        this._el_caption = this._canvas.insertBefore(jsf.Dom.create('div', null, 'tbr-caption'), this._client);
                    }
                    this._el_caption.innerHTML = this._caption;
                }
            }
        }
    });
    
}());

