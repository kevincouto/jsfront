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
                type: "String",
                list: ["left", "top", "right", "bottom", "client", "center", "none"],
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
             * @returns {DisplayObject}
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
             * @returns {DisplayObject}
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
             * @returns {DisplayObject}
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
             * @returns {DisplayObject}
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
             * @returns {DisplayObject}
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
             * @returns {DisplayObject}
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
             * @returns {DisplayObject}
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
        },
        
        _public: {
            validator: function(value){
                //get
                if (value === undefined) {
                    return this._validator;
                }
                
                //set
                this._validator = value;            
                return this;
            },
            
            designMode: function(value){
                //get
                if (value === undefined) {
                    return this._designMode;
                }
                
                //set
                this._designMode = value;            
                return this;
            },
            
            className: function(value){
                //get
                if (value === undefined) {
                    return this._className;
                }
                
                //set
                this._className = this.firePropertyChange('className', value);
                this._canvas.className = (this._canvasClass ? this._canvasClass+' ' : '') + value;
                this.updateDisplay();
                return this;
            },
                    
            /**
             * Define/retorna o raio da borda do componente.<br>
             * Percentuas também são aceitos nessa propriedade
             * @param {String|Number} value Um valor inteiro ou um percentual, default: undefined
             * @default undefined
             * @example
             * obj1.borderRaius(6);
             * obj2.borderRaius('50%');
             * @returns {DisplayObject}
            */
            borderRadius: function(value){
                //get
                if (value === undefined){
                    return this._borderRadius;
                }
                
                //set
                this._canvas.style.mozBorderRadius = this._canvas.style.webkitBorderRadius = this._canvas.style.borderRadius = (value + 'px');
                this._borderRadius = this.firePropertyChange('borderRadius', value);
                
                return this;
            },
            
            border: function(value){
                //get
                if (value === undefined){
                    return this._border;
                }
                
                //set
                this._canvas.style.borderStyle = (value ? 'solid' : 'none');
                this._border = this.firePropertyChange('border', value);
                
                return this;
            },
            
            background: function(value){
                //get
                if (value === undefined){
                    return this._background;
                }
                
                //set
                this._canvas.style.background = value;
                this._background = this.firePropertyChange('background', value);
                
                return this;
            },
            
            borderLeft: function(value){
                //get
                if (value === undefined){
                    return this._borderLeft;
                }
                
                //set
                this._canvas.style.borderLeftStyle = (value ? 'solid' : 'none');
                this._borderLeft = this.firePropertyChange('borderLeft', value);
                
                return this;
            },
            
            borderRight: function(value){
                //get
                if (value === undefined){
                    return this._borderRight;
                }
                
                //set
                this._canvas.style.borderRightStyle = (value ? 'solid' : 'none');
                this._borderRight = this.firePropertyChange('borderRight', value);
                
                return this;
            },
            
            borderTop: function(value){
                //get
                if (value === undefined){
                    return this._borderTop;
                }
                
                //set
                this._canvas.style.borderTopStyle = (value ? 'solid' : 'none');
                this._borderTop = this.firePropertyChange('borderTop', value);
                
                return this;
            },
            
            borderBottom: function(value){
                //get
                if (value === undefined){
                    return this._borderBottom;
                }
                
                //set
                this._canvas.style.borderBottomStyle = (value ? 'solid' : 'none');
                this._borderBottom = this.firePropertyChange('borderBottom', value);
                
                return this;
            },
            
            /**
             * Define/retorna a distância (y) entre o centro do container e o centro do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {DisplayObject}
            */
            verticalCenter: function(value){
                //get
                if (value === undefined){
                    return this._verticalCenter;
                }
                
                //set
                this._verticalCenter = value;
                this._updateParentDisplay();
                
                return this;
            },
            
            /**
             * Define/retorna a distância horizontal entre o centro a posição top do componente
             * @param {Number} value Um valor inteiro, default: undefined
             * @default undefined
             * @returns {DisplayObject}
            */
            horizontalCenter: function(value){
                //get
                if (value === undefined){
                    return this._horizontalCenter;
                }
                
                //set
                this._horizontalCenter = this.firePropertyChange('horizontalCenter', value);
                this._updateParentDisplay();
                
                return this;
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
             * @returns {DisplayObject}
            */
            style: function(value){
                var i=null;
                
                //get
                if (value === undefined) {
                    return this._style;
                }
                
                //set
                this._style = this.firePropertyChange('style', value);
                for (i in value){
                    this._canvas.style[i] = value[i];
                }
                
                this.updateDisplay();
                return this;
            },
            
            /**
             * Define/retorna as margens esquerda, direita, superior e inferior<br>
             * OBS: <i>O mesmo que definir valores iguais para as propriedades marginLeft, marginTop, marginRight e marginBottom</i>
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {DisplayObject}
            */
            margin: function(value){
                //get
                if (value === undefined) {
                    return this._margin;
                }
                
                //set
                this._margin = this.firePropertyChange('margin', parseInt(value, 10) || 0);
                this._marginTop = this._marginRight = this._marginBottom = this._marginLeft = this._margin;
                this._updateParentDisplay();
                return this;
            },
            
            /**
             * Define/retorna a margem esquerda do componente.
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {DisplayObject}
            */
            marginLeft: function(value){
                //get
                if (value === undefined) {
                    return this._marginLeft;
                }
                
                //set
                this._marginLeft = this.firePropertyChange('marginLeft', parseInt(value, 10) || 0);								
                this._updateParentDisplay();
                
                return this;
            },
            
            /**
             * Define/retorna a margem superior do componente.
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {DisplayObject}
            */
            marginTop: function(value){
                //get
                if (value === undefined) {
                    return this._marginTop;
                }
                
                //set
                this._marginTop = this.firePropertyChange('marginTop', parseInt(value, 10) || 0);
                this._updateParentDisplay();
                
                return this;
            },
            
            /**
             * Define/retorna a margem inferior do componente.
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {DisplayObject}
            */
            marginBottom: function(value){
                //get
                if (value === undefined) {
                    return this._marginBottom;
                }
                
                //set
                this._marginBottom = this.firePropertyChange('marginBottom', parseInt(value, 10) || 0);
                this._updateParentDisplay();
                
                return this;
            },
            
            /**
             * Define/retorna a margem direita do componente.
             * @param {Number} value Um valor inteiro, default: undefined
             * @returns {DisplayObject}
            */
            marginRight: function(value){
                //get
                if (value === undefined) {
                    return this._marginRight;
                }
                
                //set
                this._marginRight = this.firePropertyChange('marginRight', parseInt(value, 10) || 0);
                this._updateParentDisplay();
                
                return this;
            },
            
            /**
             * Define/retorna o texto de dica do componente
             * @param {String} value O texto a ser mostrado quando o mouse estive sobre o componente, default: undefined
             * @default undefined
             * @returns {DisplayObject}
            */
            tipText: function(value){
                //get
                if (value === undefined) {
                    return this._tipText;
                }
                
                //set
                this._tipText = Lang.bind(this, 'tipText', this.firePropertyChange('tipText', value));
                this._canvas.title = value;
                
                return this;
            },
            
            /**
             * Define/retorna o efeito que será aplicado quando o componente for exibido.
             * @param {Object} value
             * @default undefined
             * @returns {DisplayObject}
            */
            showEffect: function(value){
                //get
                if (value === undefined) {
                    return this._showEffect;
                }
                
                //set
                this._showEffect = this.firePropertyChange('showEffect', value);
                return this;
            },
            
            /**
             * Define/retorna o efeito a ser aplicado no componente a ficar oculto
             * @returns {DisplayObject}
            */
            hideEffect: function(value){
                //get
                if (value === undefined) {
                    return this._hideEffect;
                }
                
                //set
                this._hideEffect = this.firePropertyChange('hideEffect', value);
                return this;
            },
            
            rule: function(value){
                //get
                if (value === undefined) {
                    return this._rule;
                }
                
                //set
                this._rule = this.firePropertyChange('rule', value);
                this.updateDisplay();
                
                return this;
            },
        
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
             * @returns {DisplayObject}
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
               this._canvas.style.zIndex = PopuDisplayObject.prototype.indexOrder()+2;
               return this;
            },
            
            /**
            * Move o componente para baixo de todos os outros do container onde o mesmo faz parte.
            */
            moveToBack: function(){
               this._canvas.style.zIndex = null;
               return this;
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
                        
                        return (getDisabled || ui.designMode()) ? ui : (ui._enabled ? ui : null);
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

    function initRules(o){
        var i, defaultRules = o._rules, rules;
        
        rules = jsf.Sheet.getThemeRule( o._CLASS_ ) || {};
        
        if (defaultRules){
            for (i in rules){
                defaultRules[i] = rules[i] || defaultRules[i];
            }
            o._rules = defaultRules;
        }
    }
}());
