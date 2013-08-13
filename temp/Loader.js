"use strict";
/*global Config, alert, checkStatusLoop, setStatus, setStatus, loadInit, runApp*/
/*jslint continue:true */

var Loader = {};
(function() {
// private vars:
	var head = document.getElementsByTagName("head")[0], 
		reads = [], 
		checkStatusTimer,
		resourceIndex = 0,
		resources = {}, //todos os recursos
		pendings  = [], //recursos pendentes
		callbacks = [],
        restarted,
        checking,
		exts = {
			js : 'script',
			css : 'sheet',
			gif : 'image',
			jpg : 'image',
			jpeg : 'image',
			png : 'image'
		},
// private constants:
        CREATE  = 0, //0 - recurso criado
        PENDING = 1, //1 - recurso aguardando dependências serem carregadas
        LOADING = 2, //2 - recurso carregando
        SUCCESS = 3, //3 - recurso carregado com sucesso
        ERROR   = 4; //4 - recurso com erro no carregamento
 
// private functions:
    function createResource(type, dependencies, n) {
		var r = {
			type        : type, //script, image, sheet
			status      : CREATE,
			dependencies: [],
			index       : ++resourceIndex
		};
		
		if (dependencies){
			if (Object.prototype.toString.call(dependencies) === "[object String]") {
				r.dependencies.push(dependencies);
			}else{
				r.dependencies = dependencies;
			}
			r.status = PENDING;
		}
		
		return r;
	}
	
	function checkStatus(){
        restarted = true;
        if (!checkStatusTimer){
            checkStatusTimer = setInterval(checkStatusLoop, 50);
        }
    }
    
	function checkStatusLoop() {
		var i, j, d, resource, hasPending = false, index = -1, c1 = pendings.length, c2 = reads.length, c3 = callbacks.length;
        //return;
        checking = true;
        
		for ( i = 0; i < c1; i++) {
			resource = resources[pendings[i]];
            
			if (resource) {
			    //atualiza o status do recurso < LOADING
                if (resource.status <= PENDING) {
                    d = false;
                    for ( j = 0; j < resource.dependencies.length; j++) {
                        if (!window[resource.dependencies[j]]) {
                            d = true;
                            break;
                        }
                    }
                    
                    if (!d) {
                        if (resource.type == 'script'){
                            head.appendChild(resource.element);
                        }
                        
                        setStatus(pendings[i], LOADING);
                    }
                    
                    hasPending = true;
                }
                
				// se o recurso foi carregado e todas as suas dependências...
				if (resource.status > LOADING) {
					// guarda o indice do último recurso carregado
					if (!hasPending){
					    index = resource.index;
                        pendings[i] = null;
					}
				}else{
				    hasPending = true;
				}
			}
		}
		
		// chama as funções regstradas no método require
        for ( i = 0; i < c3; i++){
            if (callbacks[i]){
                resource = resources[callbacks[i].namespace];
                if (resource.status > LOADING) {
                    callbacks[i].callback(resource.status);
                    callbacks[i] = null;
                }
            }
        }
        
        if (!hasPending){
            // chama as funções registradas no método read
            for ( i = 0; i < c2; i++) {
                if (reads[i] && (reads[i].index <= index || !hasPending)) {
                    reads[i]();
                    reads[i] = null;
                }
            }
            
            //limpa pendings
            for ( i = 0; i < c1; i++) {
                if (pendings[i] === null){
                    pendings.splice(i,1);
                    i--;
                    c1--;
                }  
            }
            
            //limpa reads
            for ( i = 0; i < c2; i++) {
                if (reads[i] === null) {
                    reads.splice(i,1);
                    i--;
                    c2--;
                }
            }
            
            //limpa callbacks
            for ( i = 0; i < c3; i++) {
                if (callbacks[i] === null) {
                    callbacks.splice(i,1);
                    i--;
                    c3--;
                }
            }
        }
		
		checking = false;
		
		if (!hasPending) {
		    if (!restarted){
		        clearInterval(checkStatusTimer);
                checkStatusTimer = null;
		    }					
			restarted = false;
		}	
	}// end function
    
	function getType(url) {
		var n = url.toLowerCase(), a, i;
        
		a = n.split('?'); if (a.length > 1) {n = a[0];} // retira os argumentos
		i = url.lastIndexOf('.'); if (i >= 0) {n = url.substring(i + 1);} // isola a extensão
        
		return exts[n] || 'script';
	}

	function namespace(url) {
		var n = url.toLowerCase(), a;
        
		a = n.split('//'); if (a.length > 1) {n = a[1];}
		a = n.split('?'); if (a.length > 1)	{n = a[0];}
		n = n.split('/').join('.');
        
		return n;
	}

	function setStatus(n, status) {
		resources[n].status = status;
	}

	function createScript(url, n) {
		var script = document.createElement("script");

		script.setAttribute('type', "text/javascript");
		script.setAttribute('src', url + (Config.VERSION ? '?ver='+Config.VERSION : ''));
		// + '?cc=' + Config.VERSION);
		script.setAttribute('ns', n);

		script.onScriptSuccess = function() {
			this.onload = this.onreadystatechange = this.onerror = null;
			setStatus(this.getAttribute('ns'), SUCCESS);
			checkStatusLoop();
		};

		script.onScriptError = function() {
			this.onload = this.onreadystatechange = this.onerror = null;
			setStatus(this.getAttribute('ns'), ERROR);
			checkStatusLoop();
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
        
		return script;
	}

	function createImage(url, n) {
		var image = new Image();

		image._ns = n;
        
		image.onload = function(){
            image.onload = image.onerror = null;
			setStatus(this._ns, SUCCESS);
			checkStatusLoop();
        };
		image.onerror = function(){
            image.onload = image.onerror = null;
			setStatus(this._ns, ERROR);
			checkStatusLoop();
        };
		image.src = url;
        
		return image;
	}

	function createSheet(url, n) {
		var sheet = document.createElement('link');
        
		sheet.setAttribute('rel', 'stylesheet');
		sheet.setAttribute('type', 'text/css');
		sheet.setAttribute('href', url);
		sheet.setAttribute('ns', n);
        
		head.appendChild(sheet);
        
		return sheet;
	}

// public static methods:
	Loader.require = function(options) {
	    var type, resource, n;
        
	    if (!options){
            return null;
	    }
        
		//prepara options
		if (Object.prototype.toString.call(options) === "[object String]"){
            options = { url : options };
		}
		
        n = namespace(options.url);
        
        if (Object.prototype.toString.call(options.require) === "[object String]"){
            options.require = [options.require];
        }
        
        if (options.callback) {
            if (options.context){
                options.callback._context = options.context;
            }
            
            if (options.params){
                options.callback._params = options.params;
            }
            
            callbacks.push({
                namespace: n, 
                callback : options.callback
            });
        }
        
        //obtém o tipo de recurso: script, sheet ou image
		type = getType(options.url);
		if (type == 'script') {
			options.url = Loader.resolvePath(options.url);
		} else if (type == 'image') {
			options.url = Loader.resolvePath(options.url, 'image');
		}
        
		resource = resources[n] || null;
        
        //evita que seja criado o mesmo recurso mais de uma vez
		if (!resource) {
			resource = createResource(type, options.dependencies, n);
            
            resources[n] = resource;
            pendings.push(n);
            
			switch (type) {
				case 'script':
				    resource.element = createScript(options.url, n);
				    break;
				case 'image':
				    resource.element = createImage(options.url, n);
				    break;
				case 'sheet':
				    resource.element = createSheet(options.url, n);
				    setStatus(n, SUCCESS);
				    break;
			}
		}
        
		checkStatus();
        
		return resource;
	};
	
    Loader.restartStatus = function(){
	   checkStatus();    
	};
	
    Loader.getReads = function(){
		return reads;
	};
	
    Loader.read = function(callback) {
		callback.index = resourceIndex;
		reads.push(callback);
		checkStatus();
	};
    
	Loader.resolvePath = function(path, type) {
		if (path.indexOf('://') !== -1) {
			return path;
		}
        
		if (type == 'image') {
			if (path.indexOf('/') !== -1) {
				if (path[0] == '/'){
					path = path.substring(1);
				}
				path = Config.PATH_APP + path;
			} else {
				path = Config.PATH_APP + Config.PATH_IMAGES + path;
			}
		} else {
            path = path.replace('.js', '');
			path = (path.split('.').join('/')) + '.js';
            
			if (path.substring(0, 3) == 'app') {
				path = path.replace('app/', '');
				path = Config.PATH_APP + path;
			} else {
				if (path[0] == '/'){
					path = path.substring(1);
				}
				path = Config.PATH_JSFRONT + path;
			}
		}
        
		return path;
	};

	Loader.head = function() {
		return head;
	};

	Loader.run = function(app) {
		Loader._app = app;
		loadInit();
	};
     
    Loader.statusMsg = function(msg, img){
        this._statusMsg.innerHTML = msg;
        this._statusMsg.parentNode.firstChild.style.display = (img===false ? 'none' : '');
    };

}());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (!window.Config) {
    window.Config = {};
}

var Lang = {};

function realpath (path) {
    var k, p = 0, arr = [], r = window.location.href;
    
    path = String(path).replace('\\', '/');
    if (path.indexOf('://') !== -1){
        p = 1;
    }
    
    if (!p){
        path = r.substring(0, r.lastIndexOf('/') + 1) + path;
    }
    
    arr = path.split('/');
    path = [];
    
    for (k in arr) {
        if (arr[k] == '.'){
            continue;
        }
        
        if (arr[k] == '..') {
            if (path.length > 3){
                path.pop();
            }
        }
        else {
            if ((path.length < 2) || (arr[k] !== '')){
                path.push(arr[k]);
            }
        }
    }
    
    return path.join('/');
}

// pasta do jsfront (framework)
if (!Config.PATH_JSFRONT) {
    var url = window.location.toString() + document.getElementById('loader').getAttribute('src'), 
        s = (url.split('core/Loader.js')[0]).split('?')[0];
    
    Config.PATH_JSFRONT = realpath(s)  + '/';
}

// pasta do tema do jsfront
if (!Config.PATH_THEME){
    Config.PATH_THEME = Config.PATH_JSFRONT + 'themes/';
}

// pasta do lang do jsfront
if (!Config.PATH_LANG){
    Config.PATH_LANG = Config.PATH_JSFRONT + 'lang/';
}

// pasta do index
if (!Config.PATH_BASE){
    Config.PATH_BASE = window.location.toString().split('?')[0];
}

// pasta da aplicação, usada para definir as pastas PATH_IMAGES e PATH_APP_LANG
if (!Config.PATH_APP){
    Config.PATH_APP = window.location.toString().split('?')[0];
}

// pasta do icone da aplicação
if (!Config.PATH_ICON){
    Config.PATH_ICON = Config.PATH_JSFRONT;
}

// pasta das imagens da aplicação
if (!Config.PATH_IMAGES){
    Config.PATH_IMAGES = Config.PATH_APP;
}

// pasta do lang da aplicação
if (!Config.PATH_APP_LANG){
    Config.PATH_APP_LANG = Config.PATH_APP + 'lang/';
}

// tema
if (!Config.THEME){
    Config.THEME = 'default';
}

// lang do jsfront
if (!Config.LANG) {
    Config.LANG = 'pt_BR';
    Config.NO_APP_LANG = true;
}

// modo da aplicação
if (!Config.MODE){
    Config.MODE = 'dev';
}

// versão da aplicação
if (!Config.VERSION){
    Config.VERSION = '1.0';
}

// pasta de busca de dados
Config.PATH_DATA = Config.PATH_BASE + Config.PATH_DATA;

// carrega o favicon
var link = document.createElement('link');
link.setAttribute('rel', 'shortcut icon');
link.setAttribute('type', 'image/x-icon');
link.setAttribute('href', Config.PATH_ICON + 'icon.ico');
Loader.head().appendChild(link);

// carrega a imagem start.gif
var image = Loader.require({
    url : Config.PATH_IMAGES + 'start.gif'
});

// carrega a folha de estilo do tema
Loader.require(Config.PATH_JSFRONT + 'themes/core.css');
Loader.require(Config.PATH_JSFRONT + 'themes/effect.css');
Loader.require(Config.PATH_JSFRONT + 'themes/' + Config.THEME + '/' + Config.THEME + '.css');

// carrega o lang do jsfront e da aplicação
Loader.require(Config.PATH_LANG + Config.LANG + '.js');
if (!Config.NO_APP_LANG) {
    Loader.require(Config.PATH_APP_LANG + Config.LANG + '.js');
}

// aguarda carregar as imagens, e langs
Loader.read(function() {
    if (!Lang.jsf){
        Lang.jsf = {};
    }
    
    // adiciona imagem no centro da página
    var div = document.createElement('div');
    div.style.visibility = 'hidden';
    div.appendChild(image.element);
    div.innerHTML += '<div style="position:relative;text-align:center;font-size:9px;font-family:arial">' + Lang.jsf.loadingCore + '</div>';
    document.body.appendChild(div);
    div.setAttribute('style', 'position:absolute;top:50%;left:0;right:0;text-align:center;margin-top:-' + (div.offsetHeight / 2) + 'px;');
    div.setAttribute('id', '_loading_');
    Loader._statusMsg = div.childNodes[1];

    div = null;
});

function loadInit() {
    // carrega as imagens do tema
    Loader.require(Config.PATH_JSFRONT + 'themes/' + Config.THEME + '/' + 'h.gif');
    Loader.require(Config.PATH_JSFRONT + 'themes/' + Config.THEME + '/' + 'v.gif');
    Loader.require(Config.PATH_JSFRONT + 'themes/' + Config.THEME + '/' + 'icons16.gif');
    Loader.require(Config.PATH_JSFRONT + 'themes/' + Config.THEME + '/' + 'icons32.gif');

    // carregas as dependências
    Loader.require('core.Array');
    Loader.require('core.String');
    Loader.require('core.Date');
    Loader.require('core.Type');
    Loader.require('core.Alert');
    Loader.require('event.Event');
    Loader.require('event.MouseEvent');
    Loader.require('event.TouchEvent');
    Loader.require('effect.Effect');
    Loader.require('effect.Blink');
    Loader.require('effect.Fade');
    Loader.require('effect.Move');
    Loader.require('effect.Parallel');
    Loader.require('effect.Resize');
    Loader.require('effect.Sequence');
    Loader.require('core.Drag');
    Loader.require('core.Http');
    Loader.require('core.Util');
    Loader.require('core.System');
    Loader.require('core.Keyboard');
    Loader.require({
        url : 'core.Popup',
        dependencies : 'System'
    });
    Loader.require('core.Sheet');
    Loader.require('core.Dom');
    Loader.require('core.Browser');
    Loader.require({
        url : 'core.Layout',
        dependencies : 'Browser'
    });
    Loader.require('core.Class');
    Loader.require({
        url : 'core.Control',
        dependencies : 'Class'
    });
    Loader.require({
        url : 'core.DataSource',
        dependencies : ['Control', 'Http']
    });
    Loader.require({
        url : 'core.Sprites',
        dependencies : 'Control'
    });
    Loader.require({
        url : 'ui.DisplayObject',
        dependencies : 'Control'
    });
    Loader.require({
        url : 'ui.JSpace',
        dependencies : 'DisplayObject'
    });
    Loader.require({
        url : 'ui.JScrollbar',
        dependencies : 'DisplayObject'
    });
    Loader.require({
        url : 'ui.JSeparator',
        dependencies : 'DisplayObject'
    });
    Loader.require({
        url : 'ui.JButton',
        dependencies : ['DisplayObject']
    });
    Loader.require({
        url : 'ui.JContainer',
        dependencies : ['DisplayObject', 'JScrollbar']
    });
    Loader.require({
        url : 'ui.JModule',
        dependencies : 'JContainer'
    });
    Loader.require({
        url : 'ui.JApplication',
        dependencies : ['JModule', 'DataSource']
    });

    Loader.read(function() {
        if (Loader.init) {
            Loader.init();
        }
        
        Loader.require('app.' + Loader._app);
        Loader.read(runApp);
        
    });
}

function runApp() {
    if (window[Loader._app]){
        window[Loader._app].run();
    }
    else{
        alert(Loader._app+'.js not found!');
    }
}
