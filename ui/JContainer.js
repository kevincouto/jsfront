"use strict";

(function(){
    
    define("jsf.ui.JContainer", {
        _require: ["jsf.managers.LayoutManager", "jsf.ui.JScrollbar", "jsf.util.Dom", "jsf.ui.DisplayObject"],
        _alias: "jsf.JContainer",
        _extend: "display",
        _xtype: "container",
        
        _constructor: function(properties){
            jsf.Display.call(this);
            
            this._children   = [];
            this._childrenEx = {};
            this._datasource = {};
            this._canvas.className = 'ctn';
            
            this._applyProperties(properties);
        },
        
        _event : {
            resize : function(){
                var i, x=0, y=0, q=this._children.length;
             
                //reposiciona os filhos de acordo com layout do container
                jsf.Layout.render(this);
                
                //calcula as posições x e y da posição do componente mais à direita e/ou abaixo.
                this._scrollX = undefined;
                this._scrollY = undefined;
                for (i=0; i<q; i++){
                    y = Math.max(this._children[i]._canvas.offsetTop  + this._children[i]._canvas.offsetHeight, y);
                    x = Math.max(this._children[i]._canvas.offsetLeft + this._children[i]._canvas.offsetWidth, x);
                    
                    //checa se o componente foi redimensionado, isso pode ter ocorrido na chamada de jsf.Layout.render(this);
                    this._children[i].dispatchOnResize();
                }
                this._scrollX = x;
                this._scrollY = y;
                
                //atualiza as barras de rolagem, se for o caso
                updateScrollBars(this);
            },
            mousewheel : function(delta){
                if (this._hScrollbar){
                    this._hScrollbar._onmousewheel(delta);
                }
                
                if (this._vScrollbar){
                    this._vScrollbar._onmousewheel(delta);
                }
            },
            click: function(element){
                var href, a, e, r;
                
                if (this._scroll && this._html && element && element.nodeName=="A"){//click em um link
                    href = element.getAttribute("href");
                    a = href.split("#");
                    if (a.length>1){
                        a = document.getElementsByName(a[1]);
                        if (a.length>0){
                            e = a[0];
                            r = jsf.Dom.rect(e, this._scrollArea);
                            this._vScrollbar.value(r.top);
                        }
                    }
                }
            },
            scroll: function(value, scrollBar){
                this._scrollArea.style[scrollBar==this._hScrollbar ? 'left' : 'top'] = (-value)+'px';
            },
            dragover : function(){ //entrar
                jsf.Dom.addClass(this._canvas, 'ctn-drag-over');
            },
            dragout : function(){  //sair
                jsf.Dom.removeClass(this._canvas, 'ctn-drag-over');
            },
            dragenter : function(){//soltar em cima
                jsf.Dom.removeClass(this._canvas, 'ctn-drag-over');
            }
        },
        
        _protected: {
            layout   : 'absolute',
            grap     : 0,
            flex     : 3,
            rules : {
                dragOver:"dov"
            },
            updateVisibleChildren : function(flag){
                var i;
                
                if (!this._visibleChildren || flag){
                    this._visibleChildren = [];
                    for (i=0; i<this._children.length; i++){
                        if (this._children[i]._visible){
                            this._visibleChildren.push(this._children[i]);
                        }
                    }
                }
            }
        },
        
        _property:{
            height:{
                value:100
            },
            width:{
                value:200
            }       
        },
        
        _public: {
            render: function(){
                /*var i, x=0, y=0, q=this._children.length;
                jsf.ui.DisplayObject.prototype.render.call(this);
                return this;*/
            },
            
            /**
             * Define/retorna o conteúdo do componente como html
             * @param {String} value Um texto do tipo html, default: undefined
             * @default undefined
             * @returns {JContainer}
            */
            html: function(value){
               //get
               if (value === undefined) {
                   return this._html;
               }
               
               //set
               this._html = this.firePropertyChange('html', value);
               this.removeAll();
               (this._scrollArea || this._client).innerHTML = value;
               
               this.updateDisplay();
               
               return this;
            },
            
            /**
            * Define/retorna o layout do componente.<br>
            * @param {String} value Os valores possiveis são:<i>absolute, horizontal, vertical e float</i> default: undefined
            * @default undefined
            * @returns {JContainer}
            */
            layout: function(value){
               //get
               if (value === undefined){
                   return this._layout;
               }
               
               //set
               this._layout = this.firePropertyChange('layout', value);
               this.updateDisplay();
               return this;
            },
            
            /**
            * Define/retorna o titulo que será usado por determinados componentes como o JTabPanel
            * @param {String} value Um texto referente ao titulo desejado, default: undefined
            * @returns {JContainer}
            */
            caption: function(value){
               //get
               if (value === undefined){
                   return this._caption;
               }
               
               //set
               this._caption = this.firePropertyChange('caption', Lang.bind(this, 'caption', value));
               
               this._updateParentDisplay();
               return this;
            },
            
            /**
            * Define/retorna um valor boleando referente à mostrar ou não a barra de rolagem quando existirem componentes filhos fora da área visivel.
            * @param {Boolean} value Um valor boleando (true|false), default: undefined
            * @returns {JContainer}
            */
            scroll: function(value){
               //get
               if (value === undefined){
                   return this._scroll;
               }
               
               //set
               this._scroll = this.firePropertyChange('scroll', value);
               
               if (value){
                   createScrollArea(this);
                   
                   if (!this._vScrollbar){
                       this._vScrollbar = new jsf.JScrollbar({orientation:'v', right:0, top:0, parentComponent:this});
                       this._hScrollbar = new jsf.JScrollbar({orientation:'h', bottom:0, left:0, parentComponent:this});
                       this._client.appendChild(this._vScrollbar._canvas);
                       this._client.appendChild(this._hScrollbar._canvas);
                   }                
               }else{
                   removeScrollArea(this);
                   
                   if (this._vScrollbar){
                       this._vScrollbar.destroy();
                       this._hScrollbar.destroy();
                   }
               }
               
               this.updateDisplay();
               return this;
            },
            
            /**
            * Define/retorna um valor que informa ao Layout como ele deve dispor os componentes filhos nos casos
            * onde a propriedade align for horizontal ou vertical.
            * @param {Boolean} value Um valor entre 0 e 3, default: 0
            * @example
            * obj.layout('horizontal');
            * obj.flex(0); //o container será dividido horizontalmente em partes iguais, uma para cada filho. cada filho assume a largura definida.
            * obj.flex(1); //cada filho permanesce no seu tamanho original, e dispostos horizotalmente.
            * obj.flex(2); //cada filho assume a altura do container e ficam dispostos horizotalmente.
            * obj.flex(3); //os filhos juntos ocuparão todo o container e ficam dispostos horizotalmente.
            * @returns {JContainer}
            */
            flex: function(value){
               //get
               if (value === undefined){
                   return this._flex;
               }
               
               //set
               this._flex = this.firePropertyChange('flex', parseInt(value,10));
               this.updateDisplay();
               return this;
            },
            
            /**
            * Define/retorna o valor referento ao espaço entre os filhos que estão dispostos no componente.
            * @param {Number} value O espaçamento desejado, default: 0
            * @returns {JContainer}
            */
            grap: function(value){
               //get
               if (value === undefined){
                   return this._grap;
               }
               
               //set
               this._grap = this.firePropertyChange('grap', parseInt(value, 10));
               this.updateDisplay();
               return this;
            },
            
            /**
            * Define/retorna o componente Sprites que esrá utilizado pelo pelo componente e por todos os seus filhos.
            * @param {Sprites} value Um componente do tipo Sprite, default: undefined
            * @returns {JContainer}
            */
            sprites: function(value){
               //get
               if (value === undefined){
                   return this._sprites;
               }
               
               //set
               this._sprites = this.firePropertyChange('sprites', value);
               return this;
            },
            
            dataSource: function(value){
               //get
               if (value === undefined){
                   return this._dataSource;
               }
               
               //set
               this._dataSource = this.firePropertyChange('dataSource', value);
               
               return this;
            },
            
            //////////////////////////// public methods: ///////////////////////////////////	
            isChild: function(value){
              return this._children.indexOf(value)==-1 ? false : true;
            },
            
            /**
            * Retorna um array contendo todos os filhos do componente.
            * @param {Boolean} flag define se serão retornados apenas os filhos visiveis(true) ou não(false|undefined), default: undefined
            * @returns {JContainer}
            */
            children: function(flag){
               if (flag){
                   this._updateVisibleChildren(true);
                   return this._visibleChildren;
               }
               return this._children;
            },
            
            /**
            * Adiciona um componente filho.
            * @param {DisplayObject} control O componente filho a ser adicionado
            * @returns {DisplayObject}
            */
            add: function (control){
               var p, i, q;
               
               if (control){
                   if (control instanceof jsf.Display){
                        p = control.parent(); 
                       
                        if (p){
                            p.remove(control);
                        }
                       
                        if (this._scrollArea){
                            this._scrollArea.appendChild(control._canvas);
                        }
                        else{
                            this._client.appendChild(control._canvas);
                        }
                       
                       control._parent = this;
                       control._module = this._module;
                       
                       control.designMode(this._designMode);
                       
                       this._children.push(control);
                       
                       q = this._children.length;
                       
                       if (q>1){
                           delete(this._children[q-2]._lastChild_);
                           control._lastChild_ = true;
                       }else{
                           control._firstChild_ = true;
                       }
                       
                       control._onadd(this);
                       
                       this.invalidateSize();
                       this.updateDisplay();
                   }else if (jsf.isArray(control)){
                       for (i=0; i<control.length; i++){
                           this.add(control[i]);
                       }
                   }else{
                        control._parent = this;
                        control._module = this._module;
                        
                        if (control instanceof jsf.core.Control){
                            this._childrenEx[ control.id() ] = control;
                            control._container = this;
                        }
                        
                        if (control instanceof jsf.Sprites){
                            this._sprites = control;
                        }
                       
                        if (control instanceof jsf.core.Validator){
                            this._validator = control;
                        }
                       
                        if (control instanceof jsf.rpc.RemoteService){
                            this._datasource[ control.id() ] = control;
                            control._container = this;
                        }
                   }
               }
               
               return control;
            },
            
            /**
            * Remove um componente filho.
            * @param {DisplayObject} control O componente filho a ser removido
            * @returns {JContainer}
            */
            remove: function(control){
               var i, c;
               
               for (i=0; i<this._children.length; i++){
                   if (this._children[i]._id==control._id){
                       c = this._children[i];
                       this._children.splice(i,1);
                       
                       if (c._canvas){
                           jsf.Dom.remove(c._canvas);
                       }
                       
                       c.dispatch('remove');
                       
                       break;
                   }
               }
               
               this.updateDisplay();
               return this;
            },
            
            /**
            * Remove todos os componentes filhos.
            * @returns {JContainer}
            */
            removeAll: function(){
               var i,c;
               
               for (i=0; i<this._children.length; i++){
                   c = this._children[i];
                   
                   if (c._canvas){
                       jsf.Dom.remove(c._canvas);
                   }
                   
                   c.dispatch('remove');
               }
              
               this._children = [];
               //this.commitProperties();
               
               return this;
            },
            
            status: function(statusName){
                setStatus(this, statusName, false);
                
                switch (statusName){
                    case "wait":
                        setStatus(this, statusName, true);
                        break;
                    default:
                        break;
                }
            }
        }
    });
    
    function calculateSize(container, width, height, scrollSizeWidth, scrollSizeHeight){
        var hsv = (scrollSizeWidth > width), 
            vsv = (scrollSizeHeight> height),
            h   = jsf.JScrollbar.getHeight(), 
            w   = jsf.JScrollbar.getWidth(),
            clientWidth = width,
            clientHeight= height;
        
        if (container._html){
            container._scrollArea.style.height=null;
            container._scrollArea.style.width=null;
            scrollSizeHeight = container._scrollArea.offsetHeight;
            scrollSizeWidth  = container._scrollArea.offsetWidth;
            hsv = (scrollSizeWidth > width);
            vsv = (scrollSizeHeight> height);
        }
        
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
        
        container._hScrollbar.canvasSize(clientWidth).scrollSize(scrollSizeWidth);
        container._hScrollbar.right (vsv ? w : 0).render();
        
        container._vScrollbar.canvasSize(clientHeight).scrollSize(scrollSizeHeight);
        container._vScrollbar.bottom (hsv ? h : 0).render();
        
        if (!container._html){
            container._scrollArea.style.width = clientWidth + 'px';
            container._scrollArea.style.height= clientHeight + 'px';
        }
    };
    
    function updateScrollBars(container){
        if (container._hScrollbar){
            //this._hScrollbar ? this._hScrollbar._onresize() : null;
            //this._vScrollbar ? this._vScrollbar._onresize() : null;
            calculateSize(container, container._canvas.offsetWidth, container._canvas.offsetHeight, container._scrollX, container._scrollY);
        }
    };
    
    function createScrollArea(ctn){
        if (!ctn._scrollArea){
            var a=[], i, s;
            
            for (i=0; i<ctn._client.childNodes.length; i++){
                if (ctn._client.childNodes[i]!=ctn._statusEL){
                    a.push(ctn._client.childNodes[i]);
                }
            }
            
            s = ctn._client.appendChild( jsf.Dom.create('div', 'overflow:visible', 'ctn-scrollarea') );
            
            for (i=0; i<a.length; i++){
                s.appendChild(a[i]);
            }
            
            ctn._scrollArea = s;
            
            a = s = null;            
        }
    };
    
    function removeScrollArea(ctn){
        if (ctn._scrollArea){
            var a=[], i;
            
            for (i=0; i<ctn._scrollArea.childNodes.length; i++){
                a.push(ctn._scrollArea.childNodes[i]);
            }
            
            for (i=0; i<a.length; i++){
                ctn._client.appendChild(a[i]);
            }
            
            Dom.remove(ctn._scrollArea);
            
            ctn._scrollArea = null;
            
            a = null;
        }
    };
    
    function setStatus(ctn, status, visible){
        if (!ctn._statusEL){
            ctn._statusEL = jsf.Dom.create('div', 'top:0;left:0;right:0;bottom:0', 'ctn-status' );
            ctn._statusEL.innerHTML = '<div class="ctn-status-'+status+'"></div>';
        }
        
        if (visible){
            ctn._canvas.appendChild( ctn._statusEL );
        }else{
            jsf.Dom.remove( ctn._statusEL );
        }
    };
    
}());