"use strict";

(function(){
    var 
        app = null, edv = null, sbH = null, sbW = null, _tempArea = null,
        _idleTimeout=0, //segundos
        _idleSecondsCounter = 0,
        _idleTimer=null;

    define("jsf.managers.SystemManager", {
        _alias: "jsf.SystemManager",
        
        _static: {
            idleTimeout: function(seconds) {
                _idleTimeout = seconds < 30 ? 30 : seconds;

                if (_idleTimer) {
                    clearInterval(_idleTimer);
                }

                if (_idleTimeout) {
                    _idleTimer = setInterval(_checkIdleTime, 30000);
                }
            },
            //esse método é chamado pelo window.mousemove e window.keydown
            idleReset: function() {
                _idleSecondsCounter = 0;

                if (app && app._userStatus_ != 'ACTIVE') {
                    app._userStatus_ = 'ACTIVE';
                    app.dispatch(jsf.Event.ON_USER_STATUS, app._userStatus_);
                }
            },
            analizeResize: function(control) {
                var i, canvas = control._canvas;

                if (canvas.offsetWidth > 0) {
                    if (canvas.offsetWidth != canvas._offsetWidth || canvas.offsetHeight != canvas._offsetHeight) {
                        canvas._offsetWidth = canvas.offsetWidth;
                        canvas._offsetHeight = canvas.offsetHeight;

                        control._onresize();

                        if (control._children) {
                            for (i = 0; i < control._children.length; i++) {
                                System.analizeResize(control._children[i]);
                            }
                        }
                    }
                }
            },
            getTime: function() {
                var d = new Date();
                return d.getTime();
            },
            addEvent: function(target, eventName, handlerName) {
                if (target.addEventListener) {
                    target.addEventListener(eventName, handlerName, false);
                } else if (target.attachEvent) {
                    target.attachEvent("on" + eventName, handlerName);
                }
            },
            uid: function() {
                return ('uid' + (Math.random())).replace('.', '');
            },
            application: function(application) {
                if (application === undefined) {
                    return app;
                }

                app = application;
                return this;
            },
            width: function() {// largura do container da aplicação (geralmente a do body)
                var w = window.innerWidth || document.documentElement.clientWidth || 0;

                if (app && app._container) {
                    return (app._container == document.body) ? w : app._container.offsetWidth;
                }

                return w;
            },
            height: function() {// altura do container da aplicação (geralmente o body)
                var h = window.innerHeight || document.documentElement.clientHeight || 0;

                if (app && app._container) {
                    return (app._container == document.body) ? h : app._container.offsetHeight;
                }

                return h;
            },
            timer: function(callback, time, p1, p2, p3) {
                return setTimeout(function() {
                    callback(p1, p2, p3);
                }, time);
            },
            scrollbarWidth: function() {
                if (!sbW) {
                    measureScrollbars();
                }
                return sbW;
            },
            scrollbarHeight: function() {
                if (!sbH) {
                    measureScrollbars();
                }
                return sbH;
            },
            textMetrics: function(txt, css, className, maxWidth) {
                if (!_tempArea) {
                    _tempArea = jsf.Dom.create('div');
                }

                _tempArea.style.cssText = (css || '') + 'position:absolute;top:-5000px;left:0;width:' + (maxWidth || jsf.SystemManager.width() - 40) + 'px;height:5000px;visibility:hidden;display:block';
                _tempArea.innerHTML = '<span class="' + className + '" style="position:relative;">' + txt + '</span>';

                document.body.appendChild(_tempArea);

                var r = {
                    width: _tempArea.firstChild.offsetWidth,
                    height: _tempArea.firstChild.offsetHeight
                };

                jsf.Dom.remove(_tempArea);

                return r;
            },
            /*System.baseUrl: function() {
             if (!baseUrl){
             baseUrl = File.path(location + '') + '/';
             }
             
             return baseUrl;
             };*/

            lang: function() {
                return window['js_lang'] || {};
            },
            destroy: function(obj) {
                var i = null;

                for (i in obj) {
                    delete obj[i];
                }
            },
            resolvePath: function(path) {
                /*
                 * começa com app, exemplo: app.module.FormLogin = pasta da
                 * aplicação / module FormLogin.js começa com http://, exemplo:
                 * http://www.xxx.com = http://www.xxx.com qualquer outro inicio,
                 * exemplo: ui.JButton = pasta do jsfront / JButton.js
                 */

                if (path.indexOf('://') !== -1) {
                    return path;
                }

                path = path.replaceAll('.', '/') + '.js';

                if (path.substring(0, 3) == 'app') {
                    path = path.replace('app/', '');
                    path = Config.PATH_APP + path;
                } else {
                    path = Config.PATH_JSFRONT + path;
                }

                return path;
            }
        }
    });
        
 //private functions:
    function _checkIdleTime() {
        _idleSecondsCounter += 30;

        if (_idleSecondsCounter > _idleTimeout) {
            if (app && app._userStatus_ != 'INACTIVE') {
                app._userStatus_ = 'INACTIVE';
                app.dispatch(EventBase.ON_USER_STATUS, app._userStatus_);

                //cancela a setInterval atual e inicia novamente a contagem de tempo
                System.idleTimeout(_idleTimeout);
            }
        }
    }

    function measureScrollbars() {
        var i = document.createElement('p'), o, w1, h1, w2, h2;
        i.style.width = '100%';
        i.style.height = '200px';

        o = document.createElement('div');
        o.style.position = 'absolute';
        o.style.top = '0px';
        o.style.left = '0px';
        o.style.visibility = 'hidden';
        o.style.width = '200px';
        o.style.height = '150px';
        o.style.overflow = 'hidden';
        o.appendChild(i);

        document.body.appendChild(o);
        w1 = i.offsetWidth;
        h1 = i.offsetHeight;
        o.style.overflow = 'scroll';
        w2 = i.offsetWidth;
        h2 = i.offsetHeight;
        if (w1 == w2) {
            w2 = o.clientWidth;
        }

        if (h1 == h2) {
            h2 = o.clientWidth;
        }

        // window._sbH.offsetWidth
        sbW = Browser.isIE9 ? o.offsetWidth - o.clientWidth : w1 - w2;
        sbH = Browser.isIE9 ? o.offsetHeight - o.clientHeight : h1 - h2;

        document.body.removeChild(o);
    }
	
}());