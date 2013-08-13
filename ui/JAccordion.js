"use strict";

(function(){
    var cls = jsf.getContentRule(".jaccordion-class"),
        cHead1  = (cls[0] || "h3") + " acc-c2",
        cBorder1= (cls[1] || "b1") + " acc";
    
    define("jsf.ui.JAccordion",{
        _require: ["jsf.ui.JContainer"],
        
        _alias: "jsf.JAccordion",
        
        _extend: "container",
        
        _xtype: "accordion",
        
        _constructor : function(properties){
            jsf.ui.JContainer.call(this);
            
            this._canvas.className = cBorder1;
            this._canvas.innerHTML = '<div class="acc-cl"></div>';
            this._client = this._canvas.firstChild;
            
            this._activeIndex = 0;
            
            this._applyProperties(properties);
        },
        
        _event: {
            click: function(el, evt){
                if ( el.isTitle ){
                    if ( this._activeIndex != el.itemIndex ){
                        this._activeIndex = el.itemIndex;
                        this.render(true);
                    }
                }
            }
        },
        
        _static: {
        
        },
        
        _public: {
            /**
             * override jsf.ui.JContainer.add
             */
            add: function (container){
                var r, d;
                
                if ( !(container instanceof jsf.ui.JContainer) ){
                    jsf.exception("child not instance of jsf.ui.JContainer");
                    return container;
                }
                
                //cria um elemento título para o container
                d = this._client.appendChild( jsf.Dom.create("div", false, "acc-c1") );
                d.innerHTML = '<div class="' + cHead1 + '">' + container._caption + '</div>';
                d.container = container;
                d.isTitle = true;
                d._captureMouseEvent = true;
                
                container._acc_el_caption = d;
                
                jsf.ui.JContainer.prototype.add.call(this, container);
                
                return container;
            },
            
            activeIndex: function(value){
               //get
               if (value === undefined){
                   return this._activeIndex;
               }
               
               //set
               this._activeIndex = this.firePropertyChange('activeIndex', value);
               return this;
            },
            
            render: function(effect){
                var i, h, c, ec, ht, ha, y=0;
                
                ht= this._client.offsetHeight; //altura total do componente
                h = headHeight(this);          //altura dos captions
                c = this.children();           //componentes(containers) filhos
                
                if ( c.length>0 ){                    
                    //calcula a altura disponível para o item atual
                    ha = ht - (c.length * h);
                    
                    for (i=0; i<c.length; i++){
                        ec = c[i]._acc_el_caption;
                        ec.itemIndex = i;
                        
                        //effect será true quando chamado pelo evento click do evento acima
                        if (effect){
                            //título
                            jsf.Effect.cssTransition({
                                target: ec,
                                properties: {
                                    top: {to:y+'px', duration:'0.3s', timing:'ease-in'}
                                }
                            });
                            
                            //conteúdo
                            c[i]._canvas.style.cssText = "border:none;left:0;right:0;top:" + (ec.offsetTop + ec.offsetHeight) + "px;height:0px";
                            jsf.Effect.cssTransition({
                                target: c[i],
                                properties: {
                                    top: {to:(y+h)+'px', duration:'0.3s', timing:'ease-in'},
                                    height: {to:(i == this._activeIndex ? ha : 0)+'px', duration:'0.3s', timing:'ease-in'}
                                }
                            });
                        }else{
                            //título
                            ec.style.top = y + "px";
                            
                            //conteúdo
                            c[i]._canvas.style.cssText = "border:none;left:0;right:0;top:" + (y+h) + "px;height:" + (i == this._activeIndex ? ha : 0) + "px";
                        }                        
                        
                        if ( i == this._activeIndex ){
                            y += (h+ha);
                        }else{
                            y += h;
                        }
                    }
                    
                    c[this._activeIndex].render();
                }
                
                return this;
            }
        }
    });
    
    var _headHeight;
    
    function headHeight(acc){
        if ( !_headHeight ){
            _headHeight = acc._client.firstChild ? acc._client.firstChild.offsetHeight : 0;
        }
        
        return _headHeight;
    }
    
}());
