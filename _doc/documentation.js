jsf={};
jsf.core={};
jsf.effect={};
jsf.event={};
jsf.ui={};

//jsf
(function(){	
   /**
	* Retorna true se o parâmetro for do tipo Object
	* @returns{Boolean}
   */
   jsf.isObject= function(obj){};
   
   /**
	* Retorna true se o parâmetro for do tipo String
	* @returns{Boolean}
	*/
   jsf.isString= function(obj){};
   
   /**
	* Retorna true se o parâmetro for do tipo Number
	* @returns{Boolean}
	*/
   jsf.isNumber= function(obj){};
   
   /**
	* Retorna true se o parâmetro for do tipo Boolean
	* @returns{Boolean}
	*/
   jsf.isBoolean= function(obj){};
   
   /**
	* Retorna true se o parâmetro for do tipo Array
	* @returns{Boolean}
	*/
   jsf.isArray= function(obj){};
   
   /**
	* Retorna true se o parâmetro for do tipo Function
	* @returns{Boolean}
	*/
   jsf.isFunction= function(obj){};
   
   /**
	* Retorna true se o parâmetro for do tipo Date
	* @returns{Boolean}
	*/
   jsf.isDate= function(obj){};
   
   /**
	* Retorna true se o parâmetro for uma expressão regular
	* @returns{Boolean}
	*/
   jsf.isRegExp= function(obj){};
   
   /**
	* Retorna true se o parâmetro for undefined ou null
	* @returns{Boolean}
	*/
   jsf.isEmpty= function(obj){};
   
   /**
	* Chama a função de retorno (parâmetro callback) quando todas as dependências que iniciaram o carregamento anteriormente forem completadas.
	* @param{Function} callback Função de retorno
	*/
   jsf.ready = function(callback){};
   
   /**
	* Registra uma classe definindo seu status para "carregamento iniciado" ou "carregada".
	* @param{Function} classObject Objeto que representa a classe 
	* @param{String} name Nome completo da classe incluindo o namespace
	* @param{String} alias Apelido para a classe
	* @param{String} xtype Apelito xtype que poderá ser usado em _view na criação de um módulo
	*/
   jsf.register = function(classObject, name, alias, xtype){};
   
   /**
	* Carrega uma ou mais classes ou scripts
	* @param{String|Array} uma classe/script ou um array de classes/scripts
	* @param{Function} callback Função de retorno que será chamada após a(s) classe(s) ter(em) sido carregada(s).
	*/
   jsf.require = function(className, callback){};
   
   /**
	* Carrega uma imagem a partir de uma url
	* @param{String} url Caminho para a imagem
	* @param{Function} callback Função de retorno a ser chamada após a imagem ter sido completamente carregada.<br />
	* OBS: Na função de retorno será passado um parâmetro com um dos valores: "success" ou "error"
	*/
   jsf.loadImage = function(url, callback){};
   
   /**
	* Define uma classe
	* @param{String} className nome da classe incluindo o namespace
	* @param{Object} object json que define a estrutura da classe
	* @param{Function} callback função de retorno após a classe ter sido criada
   */
   jsf.define = function(className, object, callback){};
   
   /**
	* Retorna um objeto(json) com a configuração atual da aplicação.
	* @returns{Object}
	*/
   jsf.config = function(){};
   
   jsf.exception=function(txt){};
   
   jsf.Array={
	   /**
		* @param{String} att
		* @param{String} order
		* @returns{Array}
		* @memberOf Array
		*/
	   sortObject:function(array, att, order){},
	   
	   remove:function(start, end){},
	   
	   insert:function(array, pos, item){},
	   
	   /**
		* @param{String}  att
		* @param{Object}  value
		* @param{String}  operator
		* @returns{Array}
		* @memberOf Array
		*/
	   filter:function(array, att, value, operator){},
	   
	   /**
		* @param{String} att
		* @param{Object} value
		* @param{String} operator
		* @returns{Object}
		* @memberOf Array
		*/
	   find:function(array, att, value, operator){},
	   
	   each:function(array){}
   };
   
   jsf.Date={
	   format:function(format){},
	   parseDate:function(str, mask, default_){},
	   validMask:function(str, mask){},    
	   split:function(str, mask){},
	   
	   /**
		* Retorna o último dia do mês da data informada
		*/
	   lastDay:function(date){},
	   
	   //retorna a data referente ao último dia do mês anterior
	   monthPrevious:function(date){},
	   
	   //retorna a data referente ao primeiro dia do mês posterior
	   monthNext:function(date){}
   };
   
   jsf.Number={
	   isInteger:function(s){},
	   isUnsignedInteger:function(s){}
   };
   
   jsf.String={
	   latinise:function(){},
	   replaceAll:function(string,searchExpr, replaceExpr){},
	   trim:function(string){},
	   lpad:function(string, padString, length){}
   };

}());

//jsf.core.Alert
(function(){
	jsf.core.Alert = function(){};
	jsf.core.Alert.NORMAL=1;
	jsf.core.Alert.ACTION=2;
	jsf.core.Alert.DANGER=3;
	jsf.core.Alert.WARNING=4;
	jsf.core.Alert.SUCCESS=5;
	jsf.core.Alert.INFO=6;
	jsf.core.Alert.show = function(options){};
}());

//jsf.managers.BrowserManager
(function(){
	jsf.managers.BrowserManager = function(){};
	jsf.managers.BrowserManager.isIE = false;
	jsf.managers.BrowserManager.isIE7 = false;
	jsf.managers.BrowserManager.isIE8 = false;
	jsf.managers.BrowserManager.isIE9 = false;
	jsf.managers.BrowserManager.isFF = false;
	jsf.managers.BrowserManager.isOP = false;
	jsf.managers.BrowserManager.isSafari = false;
	jsf.managers.BrowserManager.isChrome = false;
	jsf.managers.BrowserManager.isWebKit = false;
	jsf.managers.BrowserManager.isGecko  = false;
	jsf.managers.BrowserManager.async = true;
}());

//jsf.core.Control
(function(){
	/**
	 * Classe base de todos os componentes jsfront
	 * @class
	 * @constructor
	 */
	jsf.core.Control = function(){};
	jsf.core.Control.prototype.name = function(value){};
	
	jsf.core.Control.prototype.enabled = function(value){};
	jsf.core.Control.prototype.addEventListener = function(eventName, callback, context){};
	jsf.core.Control.prototype.removeEventListener = function(event, callback){};
	jsf.core.Control.prototype.dispatch = function(eventName, event){};
	jsf.core.Control.prototype.id = function(){};
	
	/**
	 * @returns{jsf.ui.JModule}
	 */
	jsf.core.Control.prototype.module = function(){};
	
	/**
	 * @returns{jsf.ui.JContainer}
	 */
	jsf.core.Control.prototype.parent = function(){};
	
	/**
	 * @returns{null}
	 */
	jsf.core.Control.prototype.destroy = function(){};
}());

//jsf.managers.RemoteService
(function(){
	/**
	 * Representa uma fonte de dados
	 * @constructor
	 * @extends jsf.core.Control
	 * @requires jsf.rpc.HttpService
	 * @requires jsf.core.Control
	 */
	jsf.managers.RemoteService = function(){};
	jsf.managers.RemoteService.prototype = new jsf.core.Control();
	jsf.managers.RemoteService.defaultGateway = "";
	
	/**
	 * Define se os dados serão carregados de forma automática ao carregar a aplicação ou módulo
	 * @param{Boolean} value
	 */
	jsf.managers.RemoteService.prototype.autoLoad = function(value){};
	jsf.managers.RemoteService.prototype.container= function(value){};
	jsf.managers.RemoteService.prototype.editMode= function(value){};
	jsf.managers.RemoteService.prototype.targets= function(value){};
	jsf.managers.RemoteService.prototype.add= function(value){};
	jsf.managers.RemoteService.prototype.gateway= function(value){};
	jsf.managers.RemoteService.prototype.cache= function(value){};
	jsf.managers.RemoteService.prototype.clear= function(){};
	jsf.managers.RemoteService.prototype.data= function(data){};
	jsf.managers.RemoteService.prototype.root= function(value){};
	jsf.managers.RemoteService.prototype.execute= function(options){};
	jsf.managers.RemoteService.prototype.methods= function(value){};
	jsf.managers.RemoteService.prototype.select= function(param, fnSuccess, fnFailure){};
	jsf.managers.RemoteService.prototype.clearCache= function(){};
}());

//jsf.util.Dom
(function(){
	jsf.util.Dom={};
	jsf.util.Dom.get= function(el, att, value) {};
	jsf.util.Dom.getUI= function(el) {};
	jsf.util.Dom.create= function(tagName, cssText, className) {};
	jsf.util.Dom.moveChildren= function(from, to) {};
	jsf.util.Dom.remove= function(htmlElement) {};
	jsf.util.Dom.getStyle= function(o, property, camelProperty) {};
	jsf.util.Dom.rect= function(el, parent) {};
	jsf.util.Dom.style= function(e,s){};
	jsf.util.Dom.positionByRect= function(options) {};
	jsf.util.Dom.getWidth= function(el) {};
	jsf.util.Dom.getHeight= function(el) {};
	jsf.util.Dom.setCenter= function(div) {};
	jsf.util.Dom.setOpacity= function(el, value) {};
	jsf.util.Dom.isChild= function(parent, child) {};
	jsf.util.Dom.addClass= function(el, cls) {};
	jsf.util.Dom.removeClass= function(el, cls) {};
	jsf.util.Dom.measure= function(element) {};
}());

//jsf.core.Drag
(function(){
	jsf.core.Drag = {};
	jsf.core.Drag.clearDropZone= function(control) {};
	jsf.core.Drag.registerDropZone= function(container, control) {};
	jsf.core.Drag.start= function(evt, control, clone, f, cursor) {};
}());

//jsf.managers.FocusManager
(function(){
	jsf.managers.FocusManager = {};
	jsf.managers.FocusManager.canReceiveFocus= function(component){};
	jsf.managers.FocusManager.activeFocus= function(component){};
	jsf.managers.FocusManager.childFocus= function(component, focus){};
	jsf.managers.FocusManager.getNextFocusManagerComponent= function(){};
}());

//jsf.rpc.HttpService
(function(){
	jsf.rpc.HttpService = {};
	jsf.rpc.HttpService.getContent= function(url, callback) {};
	jsf.rpc.HttpService.get= function(url, callback) {};
	jsf.rpc.HttpService.post= function(data, url, callbackResult) {};
	jsf.rpc.HttpService.socket= function(url) {};
	jsf.rpc.HttpService.STATUS_OK= 200;
	jsf.rpc.HttpService.STATUS_CONFIRM= 4001;
	jsf.rpc.HttpService.STATUS_AUTH= 4002;
	jsf.rpc.HttpService.STATUS_EXPIRED= 4003;
	jsf.rpc.HttpService.STATUS_EMPTY= 10010;
	jsf.rpc.HttpService.STATUS_JSON_INVALID= 10011;
}());

//jsf.core.Keyboard
(function(){
	jsf.core.Keyboard = {};
	jsf.core.Keyboard.getCaret= function(ctl){};
	jsf.core.Keyboard.setCaret= function(ctl, pos, mask, dir, count){};
	jsf.core.Keyboard.selectText= function(ctl, start, count){};
	jsf.core.Keyboard.getSelectedText= function(input){};
	jsf.core.Keyboard.createInputMask= function(options){};
	jsf.core.Keyboard.removeInputMask= function(input){};
	
	jsf.core.Keyboard.KEY_ESC   = 27;
	jsf.core.Keyboard.KEY_ENTER = 13;
	jsf.core.Keyboard.KEY_SPACE = 32;
	jsf.core.Keyboard.KEY_PAGEDOWN = 35;
	jsf.core.Keyboard.KEY_PAGEUP = 33;
	jsf.core.Keyboard.KEY_HOME = 36;
	jsf.core.Keyboard.KEY_UP = 38;
	jsf.core.Keyboard.KEY_LEFT = 37;
	jsf.core.Keyboard.KEY_DOWN = 40;
	jsf.core.Keyboard.KEY_RIGHT = 39;
	jsf.core.Keyboard.KEY_TAB = 9;
	jsf.core.Keyboard.KEY_DELETE = 46;
	jsf.core.Keyboard.KEY_BACKSPACE = 8;
}());

//jsf.core.Lang
(function(){
	jsf.core.Lang = {};
	jsf.core.Lang.values= function(obj){};
	jsf.core.Lang.get= function(key){};
	jsf.core.Lang.phrase= function(id, values){};
	jsf.core.Lang.change= function(values){};
	jsf.core.Lang.bind= function(object, property, value, param){};
	
	//Alias
	Lang = jsf.core.Lang;
}());

//jsf.managers.LayoutManager
(function(){
	jsf.managers.LayoutManager = {};
	jsf.managers.LayoutManager.render=function(container) {};
	jsf.managers.LayoutManager.checkResize=function(control){};
	
	//Alias
	jsf.Layout = jsf.managers.LayoutManager;
}());

//jsf.managers.PopupManager
(function(){
	jsf.managers.PopupManager = {};
	jsf.managers.PopupManager.indexOrder=function(){};
	jsf.managers.PopupManager.add=function(options){};
	jsf.managers.PopupManager.remove=function(popup){};
	jsf.managers.PopupManager.isPopup=function(ui){};
	
	//Alias
	jsf.Popup = jsf.managers.PopupManager;
}());

//jsf.core.Sheet
(function(){
	jsf.core.Sheet ={};
	jsf.core.Sheet.load=function(file, id){};
	jsf.core.Sheet.disabled=function(file){};
	jsf.core.Sheet.getSheet=function(file){};
	jsf.core.Sheet.getLink=function(file){};
	jsf.core.Sheet.getStyle=function(el, styleProp){};
	jsf.core.Sheet.addRule=function(sheet, rule, style){};
	jsf.core.Sheet.updateRule=function(sheet, rule, style){};
	jsf.core.Sheet.deleteRule=function(sheet, rule){};
	jsf.core.Sheet.getRule=function(sheet, rule){};
	jsf.core.Sheet.getThemeRule=function(ruleComponent){};
	
	//Alias
	jsf.Sheet = jsf.core.Sheet;
}());

//jsf.core.Sprites
(function(){
	/**
	 * @constructor
	 * @extends jsf.core.Control
	 */
	jsf.core.Sprites=function(){};
	jsf.core.Sprites.prototype = new jsf.core.Control;
	jsf.core.Sprites.prototype.image=function(value){};
	jsf.core.Sprites.prototype.rule=function(value){};
	jsf.core.Sprites.prototype.height=function(value){};
	jsf.core.Sprites.prototype.width=function(value){};
	jsf.core.Sprites.prototype.sheet=function(){};
	jsf.core.Sprites.prototype.sprite=function(row, col){};
	
	//Alias
	jsf.Sprites = jsf.core.Sprites;
	
}());

//jsf.managers.SystemManager
(function(){
	jsf.managers.SystemManager ={};
	jsf.managers.SystemManager.idleTimeout=function(seconds){};
	jsf.managers.SystemManager.idleReset=function(){};
	jsf.managers.SystemManager.analizeResize=function(control){};
	jsf.managers.SystemManager.getTime=function(){};
	jsf.managers.SystemManager.addEvent=function(target, eventName, handlerName){};
	jsf.managers.SystemManager.uid=function(){};
	jsf.managers.SystemManager.application=function(application){};
	jsf.managers.SystemManager.width=function(){};
	jsf.managers.SystemManager.height=function(){};
	jsf.managers.SystemManager.timer=function(callback, time, p1, p2, p3){};
	jsf.managers.SystemManager.scrollbarWidth=function(){};
	jsf.managers.SystemManager.scrollbarHeight=function(){};
	jsf.managers.SystemManager.textMetrics=function(txt, css, className, maxWidth){};
	jsf.managers.SystemManager.lang=function(){};
	jsf.managers.SystemManager.destroy=function(obj){};
	jsf.managers.SystemManager.resolvePath=function(path){};
}());

//jsf.managers.TemplateManager
(function(){
	jsf.managers.TemplateManager={};
	jsf.managers.TemplateManager.toArray=function(value){};
	jsf.managers.TemplateManager.fill=function(parts, obj){};
	
	//Alias
	jsf.Template = jsf.managers.TemplateManager;
}());

//jsf.core.Util
(function(){
	jsf.core.Util={};
	jsf.core.Util.debugObject=function(obj, level){};
	jsf.core.Util.fileName=function(path, ext){};
	jsf.core.Util.clone=function(obj){};
	jsf.core.Util.getClone=function(obj){};
	jsf.core.Util.findParentByAttribute=function(htmlElement, att){};
	jsf.core.Util.findJControl=function(htmlElement){};
	jsf.core.Util.formatNumber=function(value, sdecimal, smilhar, precision){};
	jsf.core.Util.unformatNumber=function(value, sdecimal, smilhar){};
}());

//jsf.effect.Effect
(function(){
	jsf.effect.Effect = {};
	jsf.effect.Effect.cssTransition=function(options){};
	
	//Alias
	jsf.Effect = jsf.effect.Effect;
}());

//jsf.event.Event
(function(){
	jsf.event.Event={};
	jsf.event.Event.add=function(control, eventName, callback, context){};
	jsf.event.Event.dispatch=function(control, eventName, event, context){};
	jsf.event.Event.nativeAdd=function(target, eventName, handlerName){};
	jsf.event.Event.remove=function(target, eventName, handlerName){};
	jsf.event.Event.stopPropagation=function(e){};
	jsf.event.Event.register=function(constName, name){};
	jsf.event.Event.observer=function(eventName, callback, context){};
	
	jsf.event.Event.ON_ACTIVE=      'onactive';
	jsf.event.Event.ON_CLICK=       'onclick';
	jsf.event.Event.ON_EDIT_END=    'oneditend';
	jsf.event.Event.ON_EDIT_START=  'edit_start';
	jsf.event.Event.ON_DOUBLECLICK= 'dblclick';
	jsf.event.Event.ON_MOUSE_DOWN=  'onmousedown';
	jsf.event.Event.ON_MOUSE_UP=    'mouseup';
	jsf.event.Event.ON_MOUSE_OVER=  'onmouseover';
	jsf.event.Event.ON_MOUSE_OUT=   'onmouseout';
	jsf.event.Event.ON_DRAG_OVER=   'ondragover';
	jsf.event.Event.ON_DRAG_OUT=    'ondragout';
	jsf.event.Event.ON_DRAG_ENTER=  'ondragenter';
	jsf.event.Event.ON_CHANGE=      'onchange';
	jsf.event.Event.ON_HIDE=        'hide';
	jsf.event.Event.ON_SHOW=        'onshow';
	jsf.event.Event.ON_CLOSE=       'onclose';
	jsf.event.Event.ON_CONTEXT=     'context_menu';
	jsf.event.Event.ON_ITEM_CLICK=  'onitemclick';
	jsf.event.Event.ON_ITEM_ENTER=  'onitementer';
	jsf.event.Event.ON_ITEM_EXIT=   'onitemexit';
	jsf.event.Event.ON_KEY_PRESS=   'onkeypress';
	jsf.event.Event.ON_UPDATE_DISPLAY= "onupdatedisplay";
	jsf.event.Event.ON_USER_STATUS= "ON_USER_STATUS";
	
	jsf.event.Event.MB_LEFT= 1;
	jsf.event.Event.MB_RIGHT= 3;
	jsf.event.Event.MB_MIDDLE= 2;
}());

//jsf.event.KeyboardEvent
(function(){
	jsf.event.KeyboardEvent=function(nativeEvent){};
	jsf.event.KeyboardEvent.initialize=function(){};
	jsf.event.KeyboardEvent.add=function(control, eventName, callback, context){};
	jsf.event.KeyboardEvent.KEY_DOWN='KEY_DOWN';
	jsf.event.KeyboardEvent.KEY_UP='KEY_UP';
	jsf.event.KeyboardEvent.KEY_PRESS='KEY_PRESS';
	
	//Alias
	jsf.KeyboardEvent=jsf.event.KeyboardEvent;
}());

//jsf.event.MouseEvent
(function(){
	jsf.event.MouseEvent=function(nativeEvent){};
	jsf.event.MouseEvent.add=function(control, eventName, callback, context){};
	jsf.event.MouseEvent.activeContol=function(){};
	jsf.event.MouseEvent.enabledEvents=function(e){};
	jsf.event.MouseEvent.dispatch=function(control, eventName, event){};
	jsf.event.MouseEvent.isOver=function(control){};
	jsf.event.MouseEvent.isDown=function(control){};
	jsf.event.MouseEvent.CLICK       = 'onclick';
	jsf.event.MouseEvent.DOUBLECLICK = 'DOUBLECLICK';
	jsf.event.MouseEvent.MOUSE_DOWN  = 'MOUSE_DOWN';
	jsf.event.MouseEvent.MOUSE_UP    = 'MOUSE_UP';
	jsf.event.MouseEvent.MOUSE_OVER  = 'MOUSE_OVER';
	jsf.event.MouseEvent.MOUSE_OUT   = 'MOUSE_OUT';
	jsf.event.MouseEvent.CONTEXT     = 'oncontext';
    jsf.event.MouseEvent.MB_LEFT = 1;
	jsf.event.MouseEvent.MB_RIGHT= 3;
	
	//Alias
	jsf.MouseEvent = jsf.event.MouseEvent;
}());

//jsf.ui.DisplayObject
(function(){
    jsf.ui.DisplayObject=function(){};
    jsf.ui.DisplayObject.prototype = new jsf.core.Control;
    
    jsf.ui.DisplayObject.prototype.enabled=function(value){};
    jsf.ui.DisplayObject.prototype.className=function(value){};
    jsf.ui.DisplayObject.prototype.visible=function(value){};
    
    /**
     * Define/retorna o raio da borda do componente.<br>
     * Percentuais também são aceitos nessa propriedade
     * @param {String|Number} value Um valor inteiro ou um percentual, default=undefined
     * @default undefined
     * @example
     * obj1.borderRaius(6);
     * obj2.borderRaius('50%');
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.borderRadius=function(value){};
    
    jsf.ui.DisplayObject.prototype.border=function(value){};
    
    jsf.ui.DisplayObject.prototype.background=function(value){};
    jsf.ui.DisplayObject.prototype.borderLeft=function(value){};
    jsf.ui.DisplayObject.prototype.borderRight=function(value){};
    jsf.ui.DisplayObject.prototype.borderTop=function(value){};
    jsf.ui.DisplayObject.prototype.borderBottom=function(value){};
    
    /**
     * Define/retorna a distância (y) entre o centro do container e o centro do componente
     * @param {Number} value Um valor inteiro, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.verticalCenter=function(value){};
    
    /**
     * Define/retorna a distância horizontal entre o centro a posição top do componente
     * @param {Number} value Um valor inteiro, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.horizontalCenter=function(value){};
    
    /**
     * Define/retorna a altura do componente
     * @param {Number} value Um valor inteiro, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.height=function(value){};
      
    /**
     * Define/retorna a largura do componente
     * @param {Number} value Um valor inteiro, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.width=function(value){};
    
    /**
     * Define/retorna a distância entre a borda superior do container e a bordar superior do componente
     * @param {Number} value Um valor inteiro, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.top=function(value){};
    
    /**
     * Define/retorna a distância entre a borda esquerda do container e a bordar esquerda do componente
     * @param {Number} value Um valor inteiro, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.left=function(value){};
    
    /**
     * Define/retorna a distância entre a borda direita do container e a bordar direita do componente
     * @param {Number} value Um valor inteiro, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.right=function(value){};
    
    /**
     * Define/retorna a distância entre a borda inferior do container e a bordar inferior do componente
     * @param {Number} value Um valor inteiro, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.bottom=function(value){};
    
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
    jsf.ui.DisplayObject.prototype.style=function(value){};
    
    /**
     * Define/retorna o alinhamento do componente dentro do seu container<br>
     * <b>OBS:</b> a propriedade <i>align</i> só será considerada caso a propriedade <i>layout</i> do container do componente tenha o valor <i>absolute</i>
     * @param {String} value Os valores possiveis são=<i>left, top, right, bottom, client e center</i>, default=undefined
     * @default undefined
    */
    jsf.ui.DisplayObject.prototype.align=function(value){};
    
    /**
     * Define/retorna as margens esquerda, direita, superior e inferior<br>
     * OBS=<i>O mesmo que definir valores iguais para as propriedades marginLeft, marginTop, marginRight e marginBottom</i>
     * @param {Number} value Um valor inteiro, default=undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.margin=function(value){};
    
    /**
     * Define/retorna a margem esquerda do componente.
     * @param {Number} value Um valor inteiro, default=undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.marginLeft=function(value){};
    
    /**
     * Define/retorna a margem superior do componente.
     * @param {Number} value Um valor inteiro, default=undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.marginTop=function(value){};
    
    /**
     * Define/retorna a margem inferior do componente.
     * @param {Number} value Um valor inteiro, default=undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.marginBottom=function(value){};
    
    /**
     * Define/retorna a margem direita do componente.
     * @param {Number} value Um valor inteiro, default=undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.marginRight=function(value){};
    
    /**
     * Define/retorna o texto de dica do componente
     * @param {String} value O texto a ser mostrado quando o mouse estive sobre o componente, default=undefined
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.tipText=function(value){};
    
    /**
     * Define/retorna o efeito que será aplicado quando o componente for exibido.
     * @param {Object} value
     * @default undefined
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.showEffect=function(value){};
    
    /**
     * Define/retorna o efeito a ser aplicado no componente a ficar oculto
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.hideEffect=function(value){};
    
    jsf.ui.DisplayObject.prototype.rule=function(value){};
    jsf.ui.DisplayObject.prototype.updateDisplay=function(child){};
    
    /**
     * Retorna o container do componente
     * @returns {jsf.ui.JContainer}
    */
    jsf.ui.DisplayObject.prototype.parent=function(){};
    
    /**
     * Retorna o HTMLElement do componente
     * @returns {HTMLElement}
    */
    jsf.ui.DisplayObject.prototype.canvas=function(){};
     
    /**
     * Redesenha o componente
     * @returns {jsf.ui.DisplayObject}
    */
    jsf.ui.DisplayObject.prototype.render=function(){};
    
    jsf.ui.DisplayObject.prototype.getSprites=function(){};
    
    /**
    * Move o componente para cima de todos os outros do container onde o mesmo faz parte.
    */
    jsf.ui.DisplayObject.prototype.moveToFront=function(){};
    
    /**
    * Move o componente para baixo de todos os outros do container onde o mesmo faz parte.
    */
    jsf.ui.DisplayObject.prototype.moveToBack=function(){};
	
	//Alias
	jsf.Display=jsf.ui.DisplayObject;
}());

//jsf.ui.JContainer
(function(){
    jsf.ui.JContainer=function(properties){};
    jsf.ui.JContainer.prototype=new jsf.ui.DisplayObject;
    
    /**
     * Define/retorna o conteúdo do componente como html
     * @param {String} value Um texto do tipo html, default=undefined
     * @default undefined
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.html=function(value){};
    
    /**
     * Define/retorna o layout do componente.<br>
     * @param {String} value Os valores possiveis são:<i>absolute, horizontal, vertical e float</i> default=undefined
     * @default undefined
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.layout=function(value){};
    
    /**
     * Define/retorna o titulo que será usado por determinados componentes como o JTabPanel
     * @param {String} value Um texto referente ao titulo desejado, default=undefined
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.caption=function(value){};
    
    /**
     * Define/retorna um valor boleando referente à mostrar ou não a barra de rolagem quando existirem componentes filhos fora da área visivel.
     * @param {Boolean} value Um valor boleando (true|false), default=undefined
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.scroll=function(value){};
    
    /**
     * Define/retorna um valor que informa ao Layout como ele deve dispor os componentes filhos nos casos
     * onde a propriedade align for horizontal ou vertical.
     * @param {Boolean} value Um valor entre 0 e 3, default=0
     * @example
     * obj.layout('horizontal');
     * obj.flex(0); //o container será dividido horizontalmente em partes iguais, uma para cada filho. cada filho assume a largura definida.
     * obj.flex(1); //cada filho permanesce no seu tamanho original, e dispostos horizotalmente.
     * obj.flex(2); //cada filho assume a altura do container e ficam dispostos horizotalmente.
     * obj.flex(3); //os filhos juntos ocuparão todo o container e ficam dispostos horizotalmente.
     * @returns {JContainer}
    */
    jsf.ui.JContainer.flex=function(value){};
    
    /**
     * Define/retorna o valor referento ao espaço entre os filhos que estão dispostos no componente.
     * @param {Number} value O espaçamento desejado, default=0
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.grap=function(value){};
    
    /**
     * Define/retorna o componente Sprites que esrá utilizado pelo pelo componente e por todos os seus filhos.
     * @param {Sprites} value Um componente do tipo Sprite, default=undefined
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.sprites=function(value){};
    
    jsf.ui.JContainer.prototype.dataSource=function(value){};
     
    jsf.ui.JContainer.prototype.isChild=function(value){};
    
    /**
     * Retorna um array contendo todos os filhos do componente.
     * @param {Boolean} flag define se serão retornados apenas os filhos visiveis(true) ou não(false|undefined), default=undefined
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.children=function(flag){};
    
    /**
     * Adiciona um componente filho.
     * @param {DisplayObject} control O componente filho a ser adicionado
     * @returns {DisplayObject}
    */
    jsf.ui.JContainer.prototype.add=function (control){};
    
    /**
     * Remove um componente filho.
     * @param {DisplayObject} control O componente filho a ser removido
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.remove=function(control){};
    
    /**
     * Remove todos os componentes filhos.
     * @returns {JContainer}
    */
    jsf.ui.JContainer.prototype.removeAll=function(){};
    
	//Alias
    jsf.JContainer = jsf.ui.JContainer;
}());

//jsf.ui.JScrollBase
(function(){
    jsf.ui.JScrollBase=function(){};
    jsf.ui.JScrollBase.prototype=new jsf.ui.DisplayObject;
}());

//jsf.ui.JListBase
(function(){
    jsf.ui.JListBase=function(){};
    jsf.ui.JListBase.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JListBase.prototype.dataProvider=function(value){};
}());

//jsf.ui.JAccordion
(function(){
	jsf.ui.JAccordion=function(properties){};
	jsf.ui.JAccordion.prototype=new jsf.ui.JContainer;
	
	/**
	 * override jsf.ui.JContainer.add
	 * @param {jsf.ui.JContainer} container
	 */
	jsf.ui.JAccordion.add=function(container){};
	jsf.ui.JAccordion.activeIndex=function(value){};
	
	//Alias
	jsf.JAccordion=jsf.ui.JAccordion;
}());

//jsf.ui.JApplication
(function(){
	jsf.ui.JApplication=function(properties){};
	jsf.ui.JApplication.prototype=new jsf.ui.JModule;
	
	jsf.ui.JApplication.prototype.title=function(value){};
	jsf.ui.JApplication.prototype.create=function(def){};
	jsf.ui.JApplication.prototype.container=function(value){};
	
	//Alias
	jsf.JApplication=jsf.ui.JApplication;
}());

//jsf.ui.JButton
(function(){
	jsf.ui.JButton=function(properties){};
	jsf.ui.JButton.prototype=new jsf.ui.DisplayObject();
	
	jsf.ui.JButton.IA_LEFT  ='left';
	jsf.ui.JButton.IA_TOP   ='top';
	jsf.ui.JButton.IA_RIGHT ='right';
	jsf.ui.JButton.IA_BOTTOM='bottom';
	jsf.ui.JButton.BS_NORMAL='normal';
	jsf.ui.JButton.BS_ACTION='action';
	jsf.ui.JButton.BS_DANGER='danger';
	jsf.ui.JButton.showPopup=function(btn){};
	
	jsf.ui.JButton.prototype.popup=function(value){};
	jsf.ui.JButton.prototype.caption=function(value){};
	jsf.ui.JButton.prototype.sprites=function(value){};
	jsf.ui.JButton.prototype.icon=function(value){};
	jsf.ui.JButton.prototype.iconOver=function(value){};
	jsf.ui.JButton.prototype.iconAlign=function(value){};
	jsf.ui.JButton.prototype.border=function(value){};
	jsf.ui.JButton.prototype.group=function(value){};
	jsf.ui.JButton.prototype.selected=function(value){};
	jsf.ui.JButton.prototype.togglet=function(value){};
	jsf.ui.JButton.prototype.buttonStyle=function(value){};
	
	//Alias
	jsf.JButton=jsf.ui.JButton;
}());

//jsf.ui.JCalendar
(function(){
	jsf.ui.JCalendar=function(properties){};
	jsf.ui.JCalendar.prototype=new jsf.ui.DisplayObject;
	
	jsf.ui.JCalendar.show=function(rect, date, callbackItemClick){};
	jsf.ui.JCalendar.prototype.date=function(value){};
	
	//Alias
	jsf.JCalendar=jsf.ui.JCalendar;
}());

//jsf.ui.JModule
(function(){
	jsf.ui.JModule=function(properties){};
	jsf.ui.JModule.prototype=new jsf.ui.JContainer;
	
	jsf.ui.JModule.prototype.get=function(name){};
	jsf.ui.JModule.prototype.create=function(def){};
}());

//jsf.ui.JSeparator
(function(){
	jsf.ui.JSeparator=function(){};
}());

//jsf.ui.JSpace
(function(){
	jsf.ui.JSpace=function(){};
}());

//jsf.ui.JCheck
(function(){
    jsf.ui.JCheck=function(){};
    jsf.ui.JCheck.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JCheck.prototype.caption=function(value){};
    jsf.ui.JCheck.prototype.checked=function(value){};
    jsf.ui.JCheck.prototype.checkStyle=function(value){};
}());

//jsf.ui.JCombo
(function(){
    jsf.ui.JCombo=function(){};
    jsf.ui.JCombo.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JCombo.prototype.caption=function(value) {};
    jsf.ui.JCombo.prototype.listHeight=function(value) {};
    jsf.ui.JCombo.prototype.listWidth=function(value) {};
    jsf.ui.JCombo.prototype.selectedIndex=function(value){};
    jsf.ui.JCombo.prototype.find=function(field, value){};
    jsf.ui.JCombo.prototype.fieldName=function(value){};
    jsf.ui.JCombo.prototype.data=function(value){};
    jsf.ui.JCombo.prototype.clear=function(){};
    jsf.ui.JCombo.prototype.listSource=function(value){};
    jsf.ui.JCombo.prototype.dataProvider=function(value){};
}());

//jsf.ui.JDataPicker
(function(){
    jsf.ui.JDataPicker=function(){};
    jsf.ui.JDataPicker.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JDataPicker.prototype.value=function(value){};
    jsf.ui.JDataPicker.prototype.enabled=function(value){};
    jsf.ui.JDataPicker.prototype.focus=function(){};
    jsf.ui.JDataPicker.prototype.dataField=function(value){};
    jsf.ui.JDataPicker.prototype.data=function(value){};
}());

//jsf.ui.JDataView
(function(){
    jsf.ui.JDataView=function(){};
    jsf.ui.JDataView.prototype=new jsf.ui.JScrollBase;
    
    jsf.ui.JDataView.prototype.itemWidth=function(value){};
    jsf.ui.JDataView.prototype.itemHeight=function(value){};
    jsf.ui.JDataView.prototype.template=function(value){};
    jsf.ui.JDataView.prototype.dataProvider=function(value){};
}());

//jsf.ui.JGrid
(function(){
    jsf.ui.JGrid=function(){};
    jsf.ui.JGrid.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JGrid.prototype.cols=function(value){};
    jsf.ui.JGrid.prototype.lineNumber=function(value){};
    jsf.ui.JGrid.prototype.horizontalScroll=function(value){};
    jsf.ui.JGrid.prototype.dataProvider=function(value){};
    jsf.ui.JGrid.prototype.selectedItem=function(value){};
    jsf.ui.JGrid.prototype.listSource=function(value){};
}());

//jsf.ui.JImage
(function(){
    jsf.ui.JImage=function(){};
    jsf.ui.JImage.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JImage.prototype.stretch=function(value){};
    jsf.ui.JImage.prototype.image=function(value){};
}());

//jsf.ui.JLabel
(function(){
    jsf.ui.JLabel=function(){};
    jsf.ui.JLabel.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JLabel.prototype.caption=function(value){};
    jsf.ui.JLabel.prototype.transparent=function(value){};
    jsf.ui.JLabel.prototype.editable=function(value){};
}());

//jsf.ui.JList
(function(){
    jsf.ui.JList=function(){};
    jsf.ui.JList.prototype=new jsf.ui.JListBase;
    
    jsf.ui.JList.prototype.multiSelect=function(value){};
    jsf.ui.JList.prototype.styleClass=function(value){};
    jsf.ui.JList.prototype.rowHeight=function(value){};
    jsf.ui.JList.prototype.itemRender=function(value){};
    jsf.ui.JList.prototype.template=function(value){};
    jsf.ui.JList.prototype.find=function(field, value){};
    jsf.ui.JList.prototype.sort=function(field, direction){};
    jsf.ui.JList.prototype.updateRow=function(index, newRow){};
    jsf.ui.JList.prototype.removeRow=function(index){};
    jsf.ui.JList.prototype.removeSelectedItems=function(){};
    jsf.ui.JList.prototype.selectedItem=function(){};
    jsf.ui.JList.prototype.selectedItems=function(){};
    jsf.ui.JList.prototype.selectedIndex=function(value){};
    jsf.ui.JList.prototype.measureHeight=function(){};
    jsf.ui.JList.prototype.fieldName=function(value){}; //nome do campo que será enviado com o valor
    jsf.ui.JList.prototype.data=function(value){};    //retorna ou define o valor atual do componente
    jsf.ui.JList.prototype.clear=function(){};
    jsf.ui.JList.prototype.listField=function(value){}; //campo que será listado
    jsf.ui.JList.prototype.dataField=function(value){};//campo que será considerado o valor atual do componente
}());

//jsf.ui.JMenu
(function(){
    jsf.ui.JMenu=function(){};
    jsf.ui.JMenu.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JMenu.prototype.itens=function(value){};
    jsf.ui.JMenu.prototype.item=function(value){};
    jsf.ui.JMenu.prototype.addItem=function(item){}; /* {label:'', icon:0, checked:true} */
    jsf.ui.JMenu.prototype.addChild=function(item, popup){};
    jsf.ui.JMenu.prototype.updateItem=function(item){};
    jsf.ui.JMenu.prototype.caption=function(value){};
    jsf.ui.JMenu.prototype.sprites=function(value){};
    jsf.ui.JMenu.prototype.show=function(x,y,direction){};
    jsf.ui.JMenu.prototype.hide=function(){};
}());

//jsf.ui.JModuleLoader
(function(){
    jsf.ui.JModuleLoader=function(){};
    jsf.ui.JModuleLoader.prototype=new jsf.ui.JContainer;
    
    jsf.ui.JModuleLoader.prototype.transition=function(value){};
    jsf.ui.JModuleLoader.prototype.load=function(module, params, callback){};
    jsf.ui.JModuleLoader.prototype.active=function(value, params){};
}());

//jsf.ui.JOption
(function(){
    jsf.ui.JOption=function(){};
    jsf.ui.JOption.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JOption.prototype.caption=function(value){};
    jsf.ui.JOption.prototype.checked=function(value){};
    jsf.ui.JOption.prototype.group=function(value){};
    jsf.ui.JOption.prototype.iconAlign=function(value){};
    jsf.ui.JOption.prototype.iconStyle=function(value){};
}());

//jsf.ui.JPanel
(function(){
    jsf.ui.JPanel=function(){};
    jsf.ui.JPanel.prototype=new jsf.ui.JContainer;
    
    jsf.ui.JPanel.prototype.caption=function(value){};
    jsf.ui.JPanel.prototype.showCaption=function(value){}; 
}());

//jsf.ui.JScrollbar
(function(){
    jsf.ui.JScrollbar=function(){};
    jsf.ui.JScrollbar.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JScrollbar.prototype.parentComponent=function(value){};
    jsf.ui.JScrollbar.prototype.orientation=function(value){};
    jsf.ui.JScrollbar.prototype.scrollSize=function(value){};
    jsf.ui.JScrollbar.prototype.canvasSize=function(value){};
    jsf.ui.JScrollbar.prototype.largeStep=function(value){};
    jsf.ui.JScrollbar.prototype.showJButtons=function(value){};
    jsf.ui.JScrollbar.prototype.autoHide=function(value){};
    jsf.ui.JScrollbar.prototype.value=function(value){};
}());

//jsf.ui.JSplitter
(function(){
    jsf.ui.JSplitter=function(){};
    jsf.ui.JSplitter.prototype=jsf.ui.DisplayObject;
    
    jsf.ui.JSplitter.prototype.align=function(value){};
}());

//jsf.ui.JText
(function(){
    jsf.ui.JText=function(){};
    jsf.ui.JText.prototype=new jsf.ui.DisplayObject;
    
    jsf.ui.JText.prototype.icon=function(value){};
    jsf.ui.JText.prototype.text=function(value){};
    jsf.ui.JText.prototype.textAlign=function(value){};
    jsf.ui.JText.prototype.maxLength=function(value){};
    jsf.ui.JText.prototype.mask=function(value){};
    jsf.ui.JText.prototype.customChars=function(value){};
    jsf.ui.JText.prototype.readOnly=function(value){};
    jsf.ui.JText.prototype.internalTip=function(value){};
    jsf.ui.JText.prototype.focus=function(){};
    jsf.ui.JText.prototype.dataField=function(value){};
    jsf.ui.JText.prototype.data=function(value){};
    jsf.ui.JText.prototype.clear=function(){};
}());

//jsf.ui.JToolbar
(function(){
    jsf.ui.JToolbar=function(){};
    jsf.ui.JToolbar.prototype=new jsf.ui.JContainer;
    
    jsf.ui.JToolbar.prototype.toolbarStyle=function(value){};
    jsf.ui.JToolbar.prototype.indent=function(value){};
    jsf.ui.JToolbar.prototype.caption=function(value){};            
}());

//jsf.ui.JTree
(function(){
    jsf.ui.JTree=function(){};
    jsf.ui.JTree.prototype=new jsf.ui.JListBase;
    
    jsf.ui.JTree.prototype.icons=function(value){};
    jsf.ui.JTree.prototype.dataProvider=function(value){};
    jsf.ui.JTree.prototype.border=function(value){};
    jsf.ui.JTree.prototype.rowHeight=function(value){};
}());

//
(function(){
jsf.ui.JWindow=function(){};
jsf.ui.JWindow.prototype=new jsf.ui.JModule;

jsf.ui.JWindow.prototype.caption=function(value){};
jsf.ui.JWindow.prototype.show=function(container, modal){};
jsf.ui.JWindow.prototype.showModal=function(container){};
jsf.ui.JWindow.prototype.close=function(cancelable){};

jsf.ui.JWindow.showMessageDialog=function(message, caption, buttons, callback){};
jsf.ui.JWindow.showInputDialog=function(label, caption, callback){};
jsf.ui.JWindow.showConfirmDialog=function(label, caption, callback){};

}());

//
(function(){

}());

//
(function(){

}());

/**
 * @returns {jsf.ui.JModule}
 */
function module(def){}
