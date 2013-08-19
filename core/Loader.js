"use strict";

var JSFRONT_BUILD = '0.6.0.0';

window.onerror = function(event, file, line) {
    var msg = event.message || event, i;

    if (event.filename) {
        file = event.filename;
    }

    if (event.lineno) {
        line = event.lineno;
    }

    if (file) {
        i = file.lastIndexOf('?');
        if (i >= 0) {
            file = file.substring(0, i); /* retira os parÃ¢metros ?a=xx */
        }

        i = file.lastIndexOf('/');

        if (i >= 0) {
            file = file.substring(i + 1); /* retira o path */
        }

        jsf.exception(msg + ' ' + file + '( line:' + line + ')');
    }

    window._error_ = true;
};

(function(){
    var 
        _defs = {
            alias: {}, //apelidos de uma classe
            names: {}, //nome real(com namespace) da classe
            xtype: {}, //aponta para a classe real
            prop: {}
        },
        abstractClass={},
        edv,
        timeOut = 300,
        head = document.getElementsByTagName("head")[0],
        CONFIG = {},
        _pendencies = {},
        _scripts = {},
        _readyCallbacksId = 0,
        _readyCallbacks = {},
        _readyCallbacksTime,
        waitForDependenciesTimer;

    function Array_compareAsc(a, b) {
        if (a[window.att] < b[window.att]) {
            return -1;
        }

        if (a[window.att] > b[window.att]) {
            return 1;
        }

        return 0;
    }

    function Array_compareDesc(a, b) {
        if (a[window.att] < b[window.att]) {
            return 1;
        }

        if (a[window.att] > b[window.att]) {
            return -1;
        }

        return 0;
    }

    //classe base do qual extende todas as classes definidas com a funÃ§Ã£o define
    function Class() {
    }

    function realpath(path) {
        return path;
        var k, p = 0, arr = [], r = window.location.href;

        path = path.substring(0, path.lastIndexOf('/') + 1);

        path = String(path).replace('\\', '/');
        if (path.indexOf('://') !== -1) {
            p = 1;
        }

        if (!p) {
            path = r.substring(0, r.lastIndexOf('/') + 1) + path;
        }

        arr = path.split('/');
        path = [];

        for (k = 0; k < arr.length; k++) {
            if (arr[k] == '.') {
                continue;
            }

            if (arr[k] == '..') {
                if (path.length > 3) {
                    path.pop();
                }
            }
            else {
                if ((path.length < 2) || (arr[k] !== '')) {
                    path.push(arr[k]);
                }
            }
        }

        return path.join('/') + '/';
    }

    //cria os namespace de str, caso nÃ£o exista ainda.
    //retorna o namespace criado e o nome da classe
    function createNamespace(str) {
        var i, a, s, ns = window;

        a = str.split(".");
        s = a.pop();

        for (i = 0; i < a.length; i++) {
            if (!ns[ a[i] ]) {
                ns[ a[i] ] = {};
            }
            ns = ns[ a[i] ];
        }

        return {
            namespace: ns,
            className: s
        };
    }

    //separa o namespace do nome da classe.
    //retorna o namespace e o nome da classe
    function splitNamespace(str) {
        var i, a, s, ns = window, sns = "";

        a = str.split("/");
        if (a.length > 1) {
            str = a[a.length - 1];
        }

        a = str.split(".");
        s = a.pop();

        for (i = 0; i < a.length; i++) {
            if (ns) {
                sns += a[i];
                ns = ns[ a[i] ];
            }
        }

        return {
            strns: sns,
            namespace: ns,
            className: s
        };
    }

    //retorna true se a classe(cls) jÃ¡ foi carregada(jÃ¡ existe na memÃ³ria)
    function classIsLoaded(cls) {
        var ns, i, r, x, a, n;

        if (jsf.isArray(cls)) {
            r = true;
            for (i = 0; i < cls.length; i++) {
                if (!classIsLoaded(cls[i])) {
                    r = false;
                }
            }
            return r;
        }

        ns = splitNamespace(cls);

        r = Boolean(window[ns.className]);

        if (!r) {
            n = _defs.names[cls];
            a = _defs.alias[cls];
            x = _defs.xtype[cls];

            r = (n || a || x ? true : false);
        }

        return r;
    }

    //retorna true se a classe estÃ¡ pendente de dependÃªncias para ser criada
    function classIsPending(cls) {
        return Boolean(_pendencies[cls]);
    }

    function classCreationComplete(cls, file) {
        var m;

        //como o arquivo jÃ¡ foi carregado, a classe tem extistir nesse arquivo.
        //verifica de a classe existe
        if (!classIsLoaded(cls)) {
            jsf.exception("The class <b>[" + cls + "]</b> is not found in file <b>[" + file + "]</b>");
        }

        //verifica se a classe foi registrada corretamente. somente a aplicaÃ§Ã£o e os mÃ³dulos nÃ£o necessitam de registro.
        else {
            m = window[cls];
            if (!(m && jsf.JModule && m instanceof jsf.JModule)) { //nÃ£o Ã© aplicaÃ§Ã£o nem mÃ³dulo porque nÃ£o Ã© instÃ¢ncia de jsf.JModule
                if (!_defs.names[ cls ]) {
                    jsf.exception('The class <b>' + cls + '</b> was not registered, use "<b>jsf.register()</b>" method.');
                }
            }
        }
    }

    //traduz o nome da classe para um objeto contendo o pacote, a url para a classe e o namespace
    function prepareUrl(cls) {
        var a, url, pac;

        //é uma url
        if (cls.indexOf("/") > -1 || cls.indexOf(".js") > -1 || cls.indexOf(":") > -1) {
            url = cls;
            pac = null;
        }

        //é uma classe
        else {
            a = cls.split(".");

            if (a.length > 1) {
                pac = a[0];    //o primeiro Ã© o nome do pacote
                cls = a.pop(); //o Ãºltimo Ã© o nome da classe, tambÃ©m remove o Ãºltimo
                a = jsf.Array.removeByIndex(a, 0); //remove o primeiro ( nome do pacote)

                if (a.length > 0) {
                    url = a.join("/") + "/" + cls + ".js";
                } else {
                    url = cls + ".js";
                }
            } else {
                pac = null;
                url = cls + ".js";
            }

            if (pac) {
                url = CONFIG.PACKAGES[pac] + url;
                //console.log('pac ' + url);
            } else {
                url = CONFIG.URL_BASE + url;
                //console.log('base ' + url);
            }
        }

        //console.log("[" + cls + "] pac:" + pac + ", ns:" + ns + ", url:" + url );

        return {
            url: url,
            pac: pac,
            cls: cls
        };
    }
    
    //carrega um ou muitos scripts
    function loadScript(cls, callback, group/* parâmetro interno*/) {
        var script, i, o = {};

        if (!cls) {
            return null;
        }

        if (jsf.isArray(cls)) {
            group = {
                length: cls.length,
                status: "success"
            };

            for (i = 0; i < cls.length; i++) {
                loadScript(cls[i], callback, group);
            }

            return null;
        }

        if (!CONFIG.APP) {
            jsf.run({});
        }
        
        //inicio teste
        if (cls=='JIDE.custom.JSelector' ){
            //console.log(cls);
        }
        //fim teste
        
        o = prepareUrl(cls);
        
        //se o script já existe, elemento <script id="ds_xxx" ...
        if (document.getElementById("ds_" + cls)) {
            if (callback) {
                callback("loaded");
            }
            return null;
        }
        
        //o.url = o.url.replace("")
        
        //cria o HTMLElement <script ...></script> e define os atributos
        script = document.createElement("script");
        script.setAttribute('ns', o.ns || "");
        script.setAttribute('id', "ds_" + cls);
        script.setAttribute('type', "text/javascript");
        script.setAttribute('src', o.url + (CONFIG.VERSION ? '?ver=' + CONFIG.VERSION : ''));
        
        //jsf.exception(o.url);
        
        _scripts[cls] = "pending";

        script.onScriptComplete = function(status) {
            this.onload = this.onreadystatechange = this.onerror = script.onScriptSuccess = script.onScriptError = script.onScriptComplete = null;

            if (callback) {
                if (group) {
                    if (status == "error") {
                        group.status = status;
                    }

                    group.length--;

                    if (group.length == 0) {
                        callback(group.status);
                    }
                } else {
                    callback(status);
                }
            }

            delete(_scripts[cls]);

            cls = null;
            callback = null;
            group = null;
        };

        script.onScriptSuccess = function() {
            var n = this.getAttribute('ns'), s = this.getAttribute('src');

            if (n) {
                if (!classIsPending(n)) {
                    classCreationComplete(n, s);
                }
            }

            this.onScriptComplete("success");
        };

        script.onScriptError = function() {
            var n = this.getAttribute('ns'), s = this.getAttribute('src');

            jsf.exception((n || s) + " 404 (Not Found)");

            this.onScriptComplete("error");
        };

        if (script.addEventListener) {
            script.onload = script.onScriptSuccess;
        } else if (script.readyState) {// <IE9 Compatability
            script.onreadystatechange = function() {
                if (this.readyState == 'loaded' || this.readyState == 'complete') {
                    this.onScriptSuccess();
                }
            };
        } else {
            script.onload = script.onScriptSuccess;
        }

        script.onerror = script.onScriptError;

        head.appendChild(script);

        return script;
    }

    //carrega um arquivo css
    function loadSheet(url) {
        var sheet = document.createElement('link');

        sheet.setAttribute('rel', 'stylesheet');
        sheet.setAttribute('type', 'text/css');
        sheet.setAttribute('href', url);

        head.appendChild(sheet);

        return sheet;
    }
	
    //carrega uma imagem
    function loadImage(url, callback) {
        var image = new Image();

        image.onload = function() {
            image.onload = image.onerror = null;
            if (callback) {
                callback("success");
            }
        };
        image.onerror = function() {
            image.onload = image.onerror = null;
            if (callback) {
                callback("error");
            }
        };
        image.src = url;

        return image;
    }
	
    function readyLoop(){
        var i=null, f, max = _readyCallbacksId;
        
        for (i in _scripts){
            if (_scripts[i] == "pending"){
                return;
            }
        }
        
        for (i in _pendencies){
            if ( _pendencies[i] ){
                return;
            }
        }
        
        for (i in _readyCallbacks){
            if (i<=max){
                f = _readyCallbacks[i];
                
                delete (_readyCallbacks[i]);
                
                if ( jsf.isFunction(f) ){
                    f();
                }
            }
        }
        
        if ( jsf.isEmpty(_readyCallbacks) ){
            clearInterval(_readyCallbacksTime);
        }
    }
    
    function ready(callback){
        clearInterval(_readyCallbacksTime);
        
        _readyCallbacksId++;
        _readyCallbacks[ _readyCallbacksId ] = callback;
        
        _readyCallbacksTime = setInterval(readyLoop, 200);
    }
    
    function waitForDependenciesLoop() {
        var i, j, p, m, complete;

        for (i in _pendencies) {
            p = _pendencies[i];

            if (p) {
                complete = true;

                for (j = 0; j < p.wait.length; j++) {
                    m = p.wait[j];

                    if (!classIsLoaded(m)) {
                        complete = false;

                        if (p.meta.time > timeOut) {
                            complete = true;
                            jsf.exception("a classe [<b>" + i + "</b>] estÃ¡ aguardando uma dependÃªncia [<b>" + m + "</b>] que nÃ£o pÃ´de ser carregada");
                        }
                    }

                }

                if (complete && p.init) {
                    define(i, p.meta.def, p.meta.callback);
                    classCreationComplete(i, p.file);

                    delete(_pendencies[i]);
                }

                p.meta.time++;
            }
        }

        if (jsf.isEmpty(_pendencies)) {
            clearInterval(waitForDependenciesTimer);
        }
    }

    //aguarda uma ou mais dependÃªncias carregarem e chama define
    function waitForDependencies(cls, def, callback, dependecies) {
        var i, n, d, p;

        clearInterval(waitForDependenciesTimer);

        if (_pendencies[cls]) {
            jsf.exception(cls + " redefined.");
        }

        _pendencies[cls] = {
            wait: [],
            meta: {
                time: 0,
                def: def,
                callback: callback || null
            },
            init: false
        };

        p = _pendencies[cls];

        if (!jsf.isArray(dependecies)) {
            dependecies = [dependecies];
        }

        for (i = 0; i < dependecies.length; i++) {
            if (!classIsLoaded(dependecies[i])) {
                p.wait.push(dependecies[i]);
                loadScript(dependecies[i]);
            }
        }

        waitForDependenciesTimer = setInterval(waitForDependenciesLoop, 100);

        p.init = true;
    }

    //registra uma classe como já requida o carregamento ou carregada
    function register(classObject, name, alias, xtype) {
        var i, ns, p;

        _defs.names[name] = classObject;

        if (alias) {
            if (typeof(alias) == "string") {
                alias = [alias];
            }

            for (i = 0; i < alias.length; i++) {
                ns = createNamespace(alias[i]);
                ns.namespace[ns.className] = _defs.alias[ alias[i] ] = classObject;
            }
        }

        if (xtype) {
            if (typeof(xtype) == "string") {
                xtype = [xtype];
            }

            for (i = 0; i < xtype.length; i++) {
                _defs.xtype[ xtype[i] ] = classObject;
            }
        }
        
        p = prepareUrl(name);
        
        classObject.prototype._CLASS_ = name;
        classObject._PATH_ = p.url.substring(0, p.url.lastIndexOf("/")+1);

        return classObject;
    }
    
    function createProperty(prototype, propertyName, p) {
        if (p.get){
            prototype["get_"+propertyName] = p.get;
        }
        if (p.set){
            prototype["set_"+propertyName] = p.set;
        }
        prototype[propertyName] = function(newValue) {
            var f, parentClass, pt, cls;

            cls = jsf.Super(this._CLASS_);
            
            //get
            if (newValue === undefined) {
                return this["get_"+propertyName] ? cls.prototype["get_"+propertyName].call(this) : undefined;
                /*if (p.get){
                    return p.get.call(this);
                }else{
                    parentClass = jsf.Super( jsf.Super(this._CLASS_)._EXTENDS_ );
                    pt = parentClass.prototype;
                    if (pt && pt[propertyName]){
                        return pt[propertyName].call(this);
                    }
                }*/
            
            //set
            }else{
                if (this["set_"+propertyName]){
                    cls.prototype["set_"+propertyName].call(this,newValue);
                    this._fireBindableProperty(propertyName, newValue);
                    return this;
                }
                
                /*
                if (p.set) {
                    //analisa o tipo de dado
                    f = jsf["is" + p.type];
                    if (null != newValue) {
                        //tipo de dado nativo, String, Number, Date, Array, Boolean...
                        if (f) {
                            if (!f(newValue)) {
                                console.log(newValue + " is invalid for type " + p.type);
                            }
                        } else {

                        }
                    }

                    //define o valor da propriedade
                    p.set.call(this, newValue);

                    //define os valores das propriedades que foram definidas com valores dinâmicos,
                    this._fireBindableProperty(propertyName, newValue);

                    return this;
                }else{
                    parentClass = jsf.Super( jsf.Super(this._CLASS_)._EXTENDS_ );
                    pt = parentClass.prototype;
                    if (pt && pt[propertyName]){
                        return pt[propertyName].call(this,newValue);
                    }
                }*/
            }

            //error, only get
            return undefined;
        };
    }
	
    /**
     * @param {String} cls nome da classe incluindo o namespace
     * @param {Object} obj json que define a estrutura da classe
     * @param {Function} callback funÃ§Ã£o de retorno após a classe ter sido criada
     */
    function define(cls, obj, callback) {
        var Super, i = null, prototype, properties, ns, p, n, s, a, x, d = [];

        obj = obj || {};

        if (obj._require) {
            jsf.isArray(obj._require) ? d = obj._require : d.push(obj._require);
        }

        /*if (obj._extend){
         jsf.isArray(obj._extend) ? d = d.concat(obj._extend) : d.push(obj._extend);
         }*/

        //se tem dependência(s) não carregada(s), carrega e aguarda o carregamento
        if (d.length > 0 && !classIsLoaded(d)) {
            waitForDependencies(cls, obj, callback, d);
            return null;
        }

        //define a super classe, se nao definida usa Class
        Super = window["jsf"] ? jsf.Super(obj._extend) : function() {};

        if (!Super) {
            throw "class " + obj._extend + " not loaded";
        }

        prototype = {};

        n = createNamespace(cls);

        ns = n.namespace; //namspace ex: jsf.core
        s = n.className; //class ex: Class

        //não permite que a classe seja definida mais de uma vez
        if (ns[s]) {
            throw "class " + cls + " has defined";
        }

        //propriedades protegidas
        if (obj._protected) {
            for (i in obj._protected) {
                prototype['_' + i] = obj._protected[i];
            }
        }

        //eventos internos
        if (obj._event) {
            for (i in obj._event) {
                prototype['_on' + i] = obj._event[i];
            }
        }

        //propriedades publicas
        if (obj._public) {
            for (i in obj._public) {
                prototype[i] = obj._public[i];
            }
        }

        //métodos
        if (obj._method) {
            for (i in obj._method) {
                prototype[i] = obj._method[i];
            }
        }

        //propriedades publicas
        properties = JSON.parse(JSON.stringify(Super._PROPERTIES_ || {}));
        if (obj._property) {
            for (i in obj._property) {
                p = obj._property[i];
                createProperty(prototype, i, p);
                
                properties[i] = properties[i] || {};
                properties[i].inheritedFrom = cls;
                
                p.type  ? properties[i].type  = p.type : null;
                p.list  ? properties[i].list  = p.list : null;
                p.value ? properties[i].value = p.value : null;

                /*
                 Object.defineProperty(prototype, "year", {
                 get: function() {return this.getFullYear() },
                 set: function(y) { this.setFullYear(y) }
                 });				
                 Object.defineProperty(o, "b", {get : function(){ return bValue; },
                 set : function(newValue){ bValue = newValue; },
                 enumerable : true,
                 configurable : true}
                 );
                 */
            }
        }

        //aplica a herança
        function Base(properties) {
            //extendendo
            if (properties == "__inherit__") {
                return null;
            }
            
            //se é abstrata, não pode ser instanciada diretamente
            if (this && abstractClass[this._CLASS_]){
                //console.log(this._CLASS_);
                throw "["+Base._CLASS_+"] Class can't be instantiated.";
            }
            
            //usando o operador new
            if (Base.prototype._constructor) {
                return Base.prototype._constructor.apply(this, arguments);
            }
            
            return null;
        }
        Base.prototype = new Super("__inherit__");
        for (i in prototype) {
            Base.prototype[i] = prototype[i];
        }

        //propriedades staticas
        if (obj._static) {
            for (i in obj._static) {
                Base[i] = obj._static[i];
            }
        }

        //constructor
        if (obj._constructor) {
            Base.prototype._constructor = obj._constructor;
        }

        //destructor
        if (obj._destructor) {
            Base.prototype._destructor = obj._destructor;
        }
        
        //destructor
        if (obj._abstract) {
            abstractClass[cls] = true;
        }
        
        //referencia global
        ns[s] = Base;

        //define algumas propriedades estáticas que serão usadas principalmente no modo designer
        Base._CLASS_ = cls;
        Base._EXTENDS_ = obj._extend;
        Base._PROPERTIES_ = properties;

        //registra a classe
        n = register(Base, cls, obj._alias, obj._xtype);

        if (callback) {
            callback(n);
        }

        return n;
    }

    define("jsf", {
        _static:{
            EMPTY_FUNCTION: function(){},
            isTouchDevice: false,//!!('ontouchstart' in window),
            isObject: function(obj)  {return Object.prototype.toString.call(obj) === "[object Object]";},
            isString: function(obj)  {return Object.prototype.toString.call(obj) === "[object String]";},
            isNumber: function(obj)  {return typeof obj === 'number' && isFinite(obj);},
            isBoolean: function(obj) {return Object.prototype.toString.call(obj) === "[object Boolean]";},
            isArray: function(obj)   {return Object.prototype.toString.call(obj) === "[object Array]";},
            isFunction: function(obj){return Object.prototype.toString.call(obj) === "[object Function]";},
            isDate: function(obj)    {return Object.prototype.toString.call(obj) === "[object Date]";},
            isRegExp: function(obj)  {return Object.prototype.toString.call(obj) === "[object RegExp]";},
            isEmpty: function(obj){
                var p;
                
                for (p in obj) {
                    if(obj.hasOwnProperty(p)){
                        return false;
                    }		
                }
                
                return true;
            },
            Object: {
                destroy: function(obj) {
                    var i;

                    for (i in obj) {
                        delete(obj[i]);
                    }
                }
            },
            String: {
                replace: function(string, findStrOrObj, replace) {
                    var i, s;

                    if (jsf.isObject(findStrOrObj)) {
                        //substitui todas as ocorrências de texto do tipo {texto} definido como chave de um objeto, pelo seu valor
                        //ex: var o={a:"new"}, s="{old} text"; s = String.supplant(s,o); // s = "new text"
                        for (i in findStrOrObj) {
                            s = "{" + i + "}";
                            string = jsf.String.replace(string, s, findStrOrObj[i]);
                        }
                        return string;
                    }

                    return string.split(findStrOrObj).join(replace);
                },
                trim: function(string) {
                    return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                },
                lpad: function(string, padString, length) {
                    while (string.length < length) {
                        string = padString + string;
                    }
                    return string;
                }
            },
            Array:{
                removeByIndex: function(array, from, to) {
                    var rest = array.slice((to || from) + 1 || array.length);
                    
                    array.length = from < 0 ? array.length + from : from;
                    array.push.apply(array, rest);
                    
                    return array;
                },
                
                sortObject: function(array, att, order) {
                    window.att = att;
                    return (order == 'desc') ? array.sort(Array_compareDesc) : array.sort(Array_compareAsc);
                }
            },
            exception: function(txt) {
                var r, f;
                
                if (!edv) {
                    f = 'font: normal 12px "Helvetica Neue", Helvetica, Arial, sans-serif;';
                    
                    //tabela
                    edv = document.createElement('table');
                    edv.style.cssText = 'background:#ffffc1;position:absolute;top:2px;left:2px;right:4px;margin-right:4px;border:solid 1px #ff0000;z-index:99999999;';
                    edv.border=0;
                    r = edv.insertRow(0);
                    r.insertCell(0);
                    r.insertCell(1);
                    
                    //botÃ£o fechar
                    r.cells[1].vAlign = "top";
                    r.cells[1].innerHTML = "close";
                    r.cells[1].style.cssText = f+"font-weight:bold;color:blue;cursor:pointer;text-decoration:underline;padding-right: 4px;";
                    r.cells[1].onclick = function(){
                        edv.parentNode.removeChild(edv);
                        edv.rows[0].cells[0].innerHTML = "";
                    };
                    
                    //conteÃºdo
                    r.cells[0].style.cssText = f+"padding:4px 0px 4px 4px;color:red;width:100%";
                }
                
                document.body.appendChild(edv);
                edv.rows[0].cells[0].innerHTML += '<p style="padding:2px;margin:0;margin-top:-1px;border:solid 1px #c0c0c0;border-style:solid none solid none">' + txt + "</p>";
            }
        }
    });
	
    function runApp(){
        var app;
        
        if ( !jsf.managers.BrowserManager.isWebKit && !jsf.managers.BrowserManager.isGecko ){
            document.body.innerHTML = '<div class="app-nocompatible">' +
                                        '<h1>sorry!</h1>' + 
                                        '<h2>Your browser is not compatible with this application, please update it!</h2>' +
                                        '<br>' +
                                        '<h3>Compatible browsers: Chome 7+, Firefox 4+, Safari 5+, Opera 10+, Internet Explorer 8+</h3>' +
                                      '</div>';
            return;
        }
        app = window[CONFIG.APP];
        
        //define a aplicação atual
        jsf.managers.SystemManager.application(app);
        
        app.create().updateDisplay();
        
        //exibe a aplicaÃ§Ã£o aplicando o efeito fadeIn
        jsf.Effect.cssTransition({
            target: app,
            properties: {
                visibility: {from:"visible"},
                opacity: {from:0, to:1, duration:'0.3s', timing:'ease-in'}
            },
            complete: function(){
                app.onShow();
            }
        });
        
        //inicializa a captura dos eventos do mouse e do teclado
        jsf.MouseEvent.initialize();
        jsf.KeyboardEvent.initialize();
        return;
        //inicializa a contagem de tempo para definir se o usuÃ¡rio estÃ¡ ou nÃ£o ativo
        //System.idleTimeout(CONFIG.IDLE_SECONDS);
    }
    
    jsf.run = function(config) {
        var s, link, i, url = document.getElementById('loader').getAttribute('src');
        
        url = url.replace("core/Loader.js", "");

        // tema
        s = config.theme ? config.theme.split('/') : [];
        s = s.length > 1 ? s[s.length - 1] : s[0];
        CONFIG.THEME = s || 'default';

        // linguagem
        s = config.language ? config.language.split('/') : [];
        s = s.length > 1 ? s[s.length - 1] : s[0];
        CONFIG.LANGUAGE = s || 'en_US';

        CONFIG.URL_BASE = "";//realpath(location.href);                                  // pasta do index
        CONFIG.URL_LIB = realpath(CONFIG.URL_BASE + url);                           // pasta do jsfront (framework)
        CONFIG.URL_THEMES = realpath(config.themes || CONFIG.URL_LIB + 'themes/');  // pasta dos temas
        CONFIG.URL_LANG = realpath(config.language || CONFIG.URL_LIB + 'lang/');    // pasta das linguagens
        CONFIG.VERSION = config.version || '1.0';                                   // versão da aplicação
        CONFIG.URL_STORE = realpath(config.store || CONFIG.URL_BASE);               // pasta de busca de dados
        CONFIG.APP = config.application || 'Main';                                  // nome da aplicação
        CONFIG.IDLE_SECONDS = config.inactiveTime || null;                          // tempo que definirá a inatividade do usuário

        //mapeamento dos pacotes que serÃ£o utilizados pela aplicaÃ§Ã£o e suas pastas
        CONFIG.PACKAGES = {};
        CONFIG.PACKAGES["jsf"] = CONFIG.URL_LIB;
        CONFIG.PACKAGES[CONFIG.APP] = CONFIG.URL_BASE;
        
        if (config.packages) {
            for (i in config.packages) {
                s = config.packages[i];

                //adiciona a barra no final caso nÃ£o exista
                s = s.lastIndexOf("/") != s.length - 1 ? s + "/" : s;

                if (s.indexOf("/") > -1 && s.indexOf(":") > -1) {//Ã© uma url completa
                    CONFIG.PACKAGES[i] = s;
                } else { //a url serÃ¡ Ã  partir da aplicaÃ§Ã£o
                    CONFIG.PACKAGES[i] = realpath(s);
                }
            }
        }
        
        //carrega o favicon
        link = document.createElement('link');
        link.setAttribute('rel', 'shortcut icon');
        link.setAttribute('type', 'image/x-icon');
        link.setAttribute('href', CONFIG.URL_BASE + 'icon.ico');
        head.appendChild(link);

        //carrega o tema do framework jsfront
        loadSheet(CONFIG.URL_THEMES + 'core.css');
        loadSheet(CONFIG.URL_THEMES + CONFIG.THEME + '/' + CONFIG.THEME + '.css');
        loadSheet(CONFIG.URL_THEMES + CONFIG.THEME + '/' + CONFIG.THEME + '_components.css');

        //carrega as imagens do tema do jsfront
        loadImage(CONFIG.URL_THEMES + CONFIG.THEME + '/' + 'h.gif');
        loadImage(CONFIG.URL_THEMES + CONFIG.THEME + '/' + 'v.gif');
        loadImage(CONFIG.URL_THEMES + CONFIG.THEME + '/' + 'icons16.gif');
        loadImage(CONFIG.URL_THEMES + CONFIG.THEME + '/' + 'icons32.gif');

        //carrega temas dos outros pacotes
        for (i in CONFIG.PACKAGES) {
            if (i != "jsf" && i != CONFIG.APP) {
                s = CONFIG.PACKAGES[i];
                loadSheet(s + "themes/" + CONFIG.THEME + "/" + CONFIG.THEME + ".css");
            }
        }
        
        loadScript("jsf.core.Sheet");     //loadScript("jsf.core.Alert");
        loadScript("jsf.core.Control");
        loadScript("jsf.core.Keyboard");
        loadScript("jsf.core.Lang");
        loadScript("jsf.core.Control");
        loadScript("jsf.core.Sprites");
        
        loadScript("jsf.managers.BrowserManager");
        loadScript("jsf.managers.SystemManager");
        loadScript("jsf.managers.FocusManager");
        loadScript("jsf.managers.LayoutManager");   //loadScript("jsf.managers.PopupManager");  //loadScript("jsf.managers.DragManager");    //loadScript("jsf.managers.TemplateManager");
        
        loadScript("jsf.util.Dom");
        loadScript("jsf.util.Util");
        loadScript("jsf.util.Object");
        loadScript("jsf.util.String");
        
        //loadScript("jsf.rpc.HttpService");  //loadScript("jsf.rpc.RemoteService");
        
        loadScript("jsf.event.Event");
        
        loadScript("jsf.effect.Effect");
        
        loadScript("jsf.event.KeyboardEvent");
        loadScript("jsf.event.MouseEvent");

        //carrega a linguagem
        loadScript(CONFIG.URL_LANG + CONFIG.LANGUAGE + '.js');

        //carrega componentes visuais básicos
        loadScript("jsf.ui.DisplayObject");
        loadScript("jsf.ui.JScrollbar");
        loadScript("jsf.ui.JContainer");
        loadScript("jsf.ui.JModule");
        loadScript("jsf.ui.JApplication");
        loadScript("jsf.ui.JWindow");

        //aguarda todas as dependÃªncias serem carregadas e inicializa a aplicaÃ§Ã£o
        ready(function() {
            jsf.require(CONFIG.APP);
            ready(runApp);
        });
    };
	
    jsf.getContentRule = function(rule){
        var s, o={}, r=jsf.Sheet.getRule( jsf.Sheet.getSheet(CONFIG.THEME + '_components.css'), rule );
        
        /*
            define as classes que serÃ£o usadas
                head:'h1',
                face:'f1',
                border:'b1',
                item:['i1','i2','i3'], 0=item com foco, 1=item sem foco, 2=item over
                shadow:'s1',
                over:'o1',
                dowm:'d1',
                focus:'c1' 
        */
        if (r){
            s = r.content.replaceAll("'", "");
            s = "{" + s + "}";
            console.log(s);
            o = JSON.parse(s);
            console.log(o);
        }
        
        return o;
    };
    
    jsf.Super = function(cls) {
        var s;

        if (cls) {
            if (typeof cls == "string") {
                s = (_defs.names[cls] || _defs.alias[cls] || _defs.xtype[cls]);
            } else {
                s = cls;
            }
        } else {
            s = Class;
        }

        return s;
    };
    
    jsf.ready    = ready;
    jsf.register = register;
    jsf.require  = loadScript;
    jsf.loadImage= loadImage;
    jsf.define   = window.define  = define;
    jsf.config   = function(){return CONFIG; };
    jsf.splitNamespace = splitNamespace;
    jsf.classDef = function(cls){
        return _defs.names[cls] || _defs.alias[cls] || _defs.xtype[cls];
    };
    jsf.classDefs = function(){
        return _defs;
    };
    jsf.classIsAbstract = function(cls){
        return Boolean(abstractClass[cls]);
    }
}());
