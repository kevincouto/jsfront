"use strict";

(function(){
    
    define("jsf.ui.DisplayObject",{
        _require: ["jsf.util.Dom", "jsf.core.Control"],
        _alias: "jsf.Display",
        _extend: "control",
        _xtype: "display",
        
        _constructor: function(){
            jsf.Control.call(this);
            
            this._canvas = this._client = jsf.Dom.create('div');
            
            //busca as definições das regras css para o componente
            initRules(this);
            
            this._canvas.setAttribute("_UID", this._id);
            
            this._horizontalCenter = null;
            this._verticalCenter = null;
            
            this._mouseState = {down:false, over:false};
            this._canvas._UID = this._id;
        },
        
        _destructor: function(){
            var p;
            
            p = this.parent();
            
            if (p){
                p.remove(this);
            }else{
                jsf.Dom.remove(this._canvas);
                this.dispatch('remove');
            }
            
            delete(jsf.Control.ALL[this._UIIndex]);
        },
        
        //TODO: trocar por _listener
        _event: {
            enter     : function(){return false;},
            exit      : function(){return false;},
            invalidate: jsf.EMPTY_FUNCTION,
            keydown   : jsf.EMPTY_FUNCTION,
            keyup     : jsf.EMPTY_FUNCTION,
            keypress  : jsf.EMPTY_FUNCTION,		
            mousewheel: jsf.EMPTY_FUNCTION,
            resize    : jsf.EMPTY_FUNCTION,
            click     : jsf.EMPTY_FUNCTION,
            mousedown : jsf.EMPTY_FUNCTION,
            mouseup   : jsf.EMPTY_FUNCTION,
            dragstart : jsf.EMPTY_FUNCTION,
            draging   : jsf.EMPTY_FUNCTION,
            dragmove  : jsf.EMPTY_FUNCTION,
            dragenter : jsf.EMPTY_FUNCTION,
            dragexit  : jsf.EMPTY_FUNCTION,
            dragend   : jsf.EMPTY_FUNCTION,
            drop      : jsf.EMPTY_FUNCTION,
            add       : jsf.EMPTY_FUNCTION,
            mouseover : jsf.EMPTY_FUNCTION,
            mouseout  : jsf.EMPTY_FUNCTION
        },
        
        _protected: {
            focuset     : false, //define se o componente recebe foco(true) ou não(false default)
            enabled     : true,
            marginLeft  : 0, //margem esquerda
            marginTop   : 0, //margem de cima
            marginBottom: 0, //margem de baixo
            marginRight : 0, //margem direita
            margin      : 0,
            hideEffect  : '',
            showEffect  : '',
            tipText     : '',
            visible     : true,
            visibleOld  : true,
            invalidateSize : true,
            
            updateParentDisplay: function(){
                if (this._parent){
                    this._parent.updateDisplay(this);
                }
                return this;
            },
            updateCssRule: function(){
                var className;
                
                //define a classe css do elemento _canvas caso o componente tenha definido _rules
                if (this._rules){
                    className = this._rules.canvas || "";
                    if (this._enabled){
                        className += jsf.MouseEvent.isOver(this) && this._rules.over ? " " + this._rules.over : "";
                        className += jsf.MouseEvent.isDown(this) && this._rules.down ? " " + this._rules.down : "";
                        className += this._hasFocus && this._rules.focus ? " " + this._rules.focus : "";
                    }else{
                        className += ( this._rules.disabled ? " " + this._rules.disabled : "" );
                    }
                    
                    if (className!=""){
                        if ( this._hasValidate==2 && this._rules.notvalid){
                            className += (" " + this._rules.notvalid);
                        }
                        
                        this._canvas.setAttribute('class', className);
                    }
                }
            },
            resizeChanged: function(){
                var changed = (
                    (this._top    != this._topOld)    || 
                    (this._left   != this._leftOld)   ||
                    (this._width  != this._widthOld)  ||
                    (this._right  != this._rightOld)  ||
                    (this._height != this._heightOld) ||
                    (this._bottom != this._bottomOld)
                );
                
                this._topOld   = this._top; 
                this._leftOld  = this._left;
                this._widthOld = this._width;
                this._rightOld = this._right;
                this._heightOld= this._height;
                this._bottomOld= this._bottom;
                return changed;
            },
            
            template: function(html){
                this._canvas.innerHTML = html;
                return this._canvas;
            }
        },
        
        _property: {
            /**
             * Define/retorna o alinhamento do componente dentro do seu container<br>
             * <b>OBS:</b> a propriedade <i>align</i> só será considerada caso a propriedade <i>layout</i> do container do componente tenha o valor <i>absolute</i>
             * @param {String} value Os valores possiveis são: <i>left, top, right, bottom, client e center</i>, default: undefined
             * @default undefined
            */
            align: {
                type: ["left", "top", "right", "bottom", "client", "center", "none"],
                get: function(){
                    return this._align;
                },
                set: function(value){
                    this._align = value;
                    this._updateParentDisplay();
                }
            },
            
            dropEnabled: {
                type: "Boolean",
                get: function(){
                    return this._dropEnabled;
                },
                set: function(value){
                    this._dropEnabled = value;
                    jsf.managers.DragManager.dropEnabled(this, value);
                }
            },
            
            /**
             * Define/retorna a distância entre a borda superior do container e a bordar superior do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            top: {
                type:"Number",
                get: function(){
                    return this._top;
                },
                set: function(value){
                    this._canvas.style.top = value != null ? value + 'px' : null;
                    this._top = value;
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna a distância entre a borda esquerda do container e a bordar esquerda do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            left: {
                type:"Number",
                get: function(){
                    return this._left;
                },
                set: function(value){
                    this._canvas.style.left = value != null ? value+'px' : null;
                    this._left = value;
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna a distância entre a borda direita do container e a bordar direita do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            right: {
                type:"Number",
                get: function(){
                    return this._right;
                },
                set: function(value){
                    this._right = value;
                    this._canvas.style.right = value != null ? value + 'px' : null;
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna a distância entre a borda inferior do container e a bordar inferior do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            bottom: {
                type:"Number",
                get: function(){
                    return this._bottom;
                },
                set: function(value){
                    this._canvas.style.bottom = value != null ? value + 'px' : null;
                    this._bottom = value;
                    this._updateParentDisplay();
                }
            },
                    
            /**
             * Define/retorna a altura do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            height: {
                type:"Number",
                get:function(){
                    return this._height;
                },
                set:function(value){
                    this._canvas.style.height = value != null ? value + 'px' : null;
                    this._height = value;
                    this._updateParentDisplay();
                }
            },
                    
            /**
             * Define/retorna a largura do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            width: {
                type:"Number",
                get:function(){
                    return this._width;
                },
                
                set:function(value){
                    this._canvas.style.width = value != null ? value + 'px' : null;
                    this._width = value;
                    this._updateParentDisplay();
                }
            },
                    
            /**
             * Exibe/oculta o componente
             * @param {Boolean} value Um valor boleano(true|false), default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            visible: {
                type:"Boolean",
                get: function(){
                    return this._visible;
                },
                set: function(value){
                    this._visible = !!value;
                    this._canvas.style.display = value ? '' : 'none';
                    this._canvas.style.visibility = value ? '' : 'hidden';

                    if (this._visible != this._oldVisible){
                        this.dispatch(this._visible ? 'show' : 'hide');
                    }

                    this._oldVisible = this._visible;
                    this._updateParentDisplay();
                }
            },
            
            enabled: {
                type:"Boolean",
                get: function(){
                    return this._enabled;
                },
                set: function(value){
                    jsf.Control.prototype.enabled.call(this, value);
                    this.updateDisplay();
                }
            },
            
            validator: {
                type:"String",
                get: function(){
                    return this._validator;
                },
                set: function(value){
                    this._validator = value;
                }
            },
                    
            /**
             * Define/retorna o raio da borda do componente.<br>
             * Percentuas também são aceitos nessa propriedade
             * @param {String|Number} value Um valor inteiro ou um percentual, default: undefined
             * @default undefined
             * @example
             * obj1.borderRaius(6);
             * obj2.borderRaius('50%');
             * @returns {jsf.ui.DisplayObject}
            */
            borderRadius: {
                type: "Number|String",
                get: function(){
                    return this._borderRadius;
                },
                set: function(value){
                    value = jsf.isString(value) ? value : (value + 'px')
                    this._canvas.style.borderRadius = value;
                    this._borderRadius = value;
                }
            },
            
            /**
             * Define/retorna se o componente irá(true) ou não(false) mostrar borda.<br>
             * @param {Boolean} value true mostra, false oculta, default: false
             * @default false
             * @example
             * obj1.border(true);
             * @returns {jsf.ui.DisplayObject}
            */
            border: {
                type: "Boolean",
                get: function(){
                    return this._border;
                },
                set: function(value){
                    this._canvas.style.borderStyle = (value ? 'solid' : 'none');
                    this._border = value;
                }
            },
            
            background: {
                type: "Color",
                get: function(){
                    return this._background;
                },
                set: function(value){
                    this._canvas.style.background = value;
                    this._background = value;
                }
            },
            
            borderLeft: {
                type: "Boolean",
                get: function(){
                    return this._borderLeft;
                },
                set: function(value){
                    this._canvas.style.borderLeftStyle = (value ? 'solid' : 'none');
                    this._borderLeft = value;
                }
            },
            
            borderRight: {
                type: "Boolean",
                get: function(){
                    return this._borderRight;
                },
                set: function(value){
                    this._canvas.style.borderRightStyle = (value ? 'solid' : 'none');
                    this._borderRight = value;
                }
            },
            
            borderTop: {
                type: "Boolean",
                get: function(){
                    return this._borderTop;
                },
                set: function(value){
                    this._canvas.style.borderTopStyle = (value ? 'solid' : 'none');
                    this._borderTop = value;
                }
            },
            
            borderBottom: {
                type: "Boolean",
                get: function(){
                    return this._borderBottom;
                },
                set: function(value){
                    this._canvas.style.borderBottomStyle = (value ? 'solid' : 'none');
                    this._borderBottom = value;
                }
            },
            
            /**
             * Define/retorna a distância (y) entre o centro do container e o centro do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            verticalCenter: {
                type: "Number",
                get: function(){
                    return this._verticalCenter;
                },
                set: function(value){
                    this._verticalCenter = value;
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna a distância horizontal entre o centro a posição top do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            horizontalCenter: {
                type: "Number",
                get: function(){
                    return this._horizontalCenter;
                },
                set: function(value){
                    this._horizontalCenter = value;
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna o css personalizado definido para o componente
             * @param {Object} value
             * @default undefined
             * @example
             * obj.style({
             *     background:'#ff0000',
             *     borderWidth:5
             * });
             * @returns {jsf.ui.DisplayObject}
            */
            style: {
                type: "Object",
                get: function(){
                    return this._style;
                },
                set: function(value){
                    var i;
                    
                    this._style = value;
                    for (i in value){
                        this._canvas.style[i] = value[i];
                    }

                    this.updateDisplay();
                }
            },
            
            /**
             * Define/retorna as margens esquerda, direita, superior e inferior<br>
             * OBS: <i>O mesmo que definir valores iguais para as propriedades marginLeft, marginTop, marginRight e marginBottom</i>
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {jsf.ui.DisplayObject}
            */
            margin: {
                type: "Number",
                get: function(){
                    return this._margin;
                },
                set: function(value){
                    this._marginTop = this._marginRight = this._marginBottom = this._marginLeft = this._margin = parseInt(value, 10) || 0;
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna a margem esquerda do componente.
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {jsf.ui.DisplayObject}
            */
            marginLeft: {
                type: "Number",
                get: function(){
                    return this._marginLeft;
                },
                set: function(value){
                    this._marginLeft = parseInt(value, 10) || 0;								
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna a margem superior do componente.
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {jsf.ui.DisplayObject}
            */
            marginTop: {
                type: "Number",
                get: function(){
                    return this._marginTop;
                },
                set: function(value){
                    this._marginTop = parseInt(value, 10) || 0;								
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna a margem inferior do componente.
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {jsf.ui.DisplayObject}
            */
            marginBottom: {
                type: "Number",
                get: function(){
                    return this._marginBottom;
                },
                set: function(value){
                    this._marginBottom = parseInt(value, 10) || 0;								
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna a margem direita do componente.
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {jsf.ui.DisplayObject}
            */
            marginRight: {
                type: "Number",
                get: function(){
                    return this._marginRight;
                },
                set: function(value){
                    this._marginRight = parseInt(value, 10) || 0;								
                    this._updateParentDisplay();
                }
            },
            
            /**
             * Define/retorna o texto de dica do componente
             * @param {String} value O texto a ser mostrado quando o mouse estive sobre o componente, default: undefined
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            tipText: {
                type: "String",
                get: function(){
                    return this._tipText;
                },
                set: function(value){
                    this._tipText = jsf.core.Lang.bind(this, 'tipText', value);
                    this._canvas.title = value;
                }
            },
            
            /**
             * Define/retorna o efeito que será aplicado quando o componente for exibido.
             * @param {Object} value
             * @default undefined
             * @returns {jsf.ui.DisplayObject}
            */
            showEffect: {
                type: "Object",
                get: function(){
                    return this._showEffect;
                },
                set: function(value){
                    this._showEffect = value;
                }
            },
            
            /**
             * Define/retorna o efeito a ser aplicado no componente a ficar oculto
             * @returns {jsf.ui.DisplayObject}
            */
            hideEffect: {
                type: "Object",
                get: function(){
                    return this._hideEffect;
                },
                set: function(value){
                    this._hideEffect = value;
                }
            }/*,
            
            rule: function(value){
                //get
                if (value === undefined) {
                    return this._rule;
                }
                
                //set
                this._rule = this.firePropertyChange('rule', value);
                this.updateDisplay();
                
                return this;
            }*/
        },
        
        _method: {
            invalidateSize: function(){
                this._invalidateSize = true;
                return this;
            },
            
            dispatchOnResize: function(){
                var cv = this._canvas;
                
                //verifica se o componente foi redimensionado
                if (cv.offsetWidthOld != cv.offsetWidth ||  cv.offsetHeightOld != cv.offsetHeight ){
                    this._invalidateSize = true;
                }
                
                //se foi redimensionado chama o onresize
                if (this._invalidateSize){
                    this._onresize();
                    this._invalidateSize = false;
                }
                
                //guarda as dimensões atuais
                cv.offsetWidthOld  = cv.offsetWidth;
                cv.offsetHeightOld = cv.offsetHeight;
            },
            
            cancelUpdateDisplay: function(cancel){
                this._updateDisplayInProgress = cancel;
                return this;
            },
            
            //sender=quem chamou o updateDisplay
            updateDisplay: function(sender){
                var
                    cv = this._canvas,
                    i, count, children;
                
                if (this._updateDisplayInProgress || (sender && sender._updateDisplayInProgress)) {
                    return this;
                }
                
                this._updateDisplayInProgress = true;
                
                // Quando um componente tem _parentComponentId, significa que está dentro de um container
                // mais não faz parte da lista de filhos (_children) desse container, ex: JScrollbar
                if ( (this._module || this._parentComponentId) && this._visible && cv.offsetWidth){
                    
                    //define a classe css do componente de acordo com o estado: mousedown, mouseover, focus...
                    this._updateCssRule();
                    
                    //verifica se o componente foi redimensionado e dispara onresize se for o caso
                    this.dispatchOnResize();
                    
                    //redenriza o componente
                    this.render();
                    
                    //se for um container, redenriza os filhos também
                    if (this instanceof jsf.ui.JContainer) {
                        children = this.children();
                        count = children.length;
                        
                        for (i=0; i<count; i++) {
                            children[i].updateDisplay();
                        }
                    }
                }
                
                this._updateDisplayInProgress = false;
                
                return this;
            },
            
            /**
             * Retorna o container do componente
             * @returns {JContainer}
            */
            parent: function(){
               return this._parent;
            },
            
            /**
             * Retorna o HTMLElement do componente
             * @returns {HTMLElement}
            */
            canvas: function(){
               return this._canvas;
            },
            
            /**
             * Redesenha o componente
             * @returns {jsf.ui.DisplayObject}
            */
            render: function(){
                return this;
            },
            
            getSprites: function(){
               var app = jsf.managers.SystemManager.application(), sprite=null, module=null, s;
               
               //tenta o sprite do componente
               if (this._sprites){
                   sprite = this._sprites;
                   module = this._module;
               //tenta o sprite o container pai
               }else if (this._parent && this._parent._sprites){
                   sprite = this._parent._sprites;
                   module = this._parent._module;
               //tenta o sprite da aplicação
               }else if (app._sprites){
                   sprite = app._sprites;
                   module = app;
               }
               
               if (jsf.isString(sprite)){
                   s = sprite;
                   sprite = module[s];
                   if (!sprite){
                       sprite = app[s];
                   }
               }
               
               return sprite;
            },
            
            /**
            * Move o componente para cima de todos os outros do container onde o mesmo faz parte.
            */
            moveToFront: function(){
               //TODO:
               return this;
            },
            
            /**
            * Move o componente para baixo de todos os outros do container onde o mesmo faz parte.
            */
            moveToBack: function(){
               //TODO:
               return this;
            },
                    
            designMode: function(){
                this._designMode = true;
            }
        },
        
        _static: {
            dragOverTarget: null,
            
            /**
             * Retorna o componente referente ao HTMLElement
             */
            getByElement: function(element, getDisabled){
                var target=null, ui;
                
                while (element){
                    if (element._UID || element._idPopupUI){
                        ui = jsf.Control.ALL[element._UID || element._idPopupUI];
                        
                        ui._targetChild = element._captureMouseEvent ? element : target;
                        
                        return (getDisabled || ui._designMode) ? ui : (ui._enabled ? ui : null);
                    }
                    
                    if (!target && (element._captureMouseEvent || (element.getAttribute && element.getAttribute('_captureMouseEvent')))){
                        target = element;
                    }
                    
                    element = element.parentNode;
                }
                
                return null;
            }
        }
    });
    
    /**
     * retorna as definições das regras css para o componente
     * @param {jsf.ui.DisplayObject} o
     * @returns {Object}
     */
    function initRules(o){
        var i, defaultRules = o._rules, rules;
        
        rules = jsf.Sheet.getThemeRule( o._CLASS_ ) || {};
        
        if (defaultRules){
            for (i in rules){
                defaultRules[i] = rules[i] || defaultRules[i];
            }
            o._rules = defaultRules;
        }
        
        return defaultRules;
    }
}());
