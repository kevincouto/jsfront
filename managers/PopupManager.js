"use strict";

var PopupOnMouseDown;

(function() {
    //private
    var 
        background = [],
        _zIndex = 100,
        _popups = {};
    
    define("jsf.managers.PopupManager", {
        _alias: "jsf.PopupManager",
        _static: {
            indexOrder: function() {
                return _zIndex;
            },
            /*  options = {
                    target    : DisplayObject, //componente a ser exibido como popup
                    container : JContainer,    //container do popup
                    shadow    : true|false,    //adiciona sombra
                    autohide  : true|false,    //se o popup deve desaparecer automaticamente ao clicar fora
                    modal     : true|false,    //se é modal ou não (se true, autohide será ignorado)
                    showEffect: Object,        //efeito de exibição
                    hideEffect: Object,        //efeito ao ocultar
                    onshow    : Function,      //função a ser chamada quando o popup for exibido (após animação)
                    onhide    : Function,      //função a ser chamada quando o popup for ocultado (após animação)
                    position  : {
                       x: 0, 
                       y: 0,
                       reference: "left|top|bottom|right"
                       owner: DisplayObject
                    }
                } */
            add: function(options) {
                if (options && options.target) {
                    setTimeout(function() {
                        addPopup(options);
                        if (options.complete) {
                            options.complete(options.target);
                        }
                    }, 0);
                }
            },
            remove: function(options) { //options = options usado no add ou DisplayObject
                //var popup =  options.target || _popups[options.id];
                var popup;

                if (options instanceof jsf.ui.DisplayObject) {
                    popup = options;
                    options = _popups[options.id()];
                } else {
                    popup = options.target || _popups[options.id];
                }

                function complete() {
                    delete(popup._canvas._isPopupCanvas);

                    jsf.Dom.removeClass(popup._canvas, 'ui-pp-sd');
                    jsf.Dom.remove(popup._canvas);
                    jsf.Dom.remove(popup._bg_);

                    //chama o onhide do componente que foi oculto
                    if (popup._onhide) {
                        popup._onhide.call(popup);
                    }
                    
                    if (options.onhide) {
                        options.onhide.call(options.owner || popup, popup);                        
                    }
                   
                    delete(_popups[popup._id]);
                    delete(_popups[popup._popup_id]);
                    delete(popup._popup_id);
                    delete(popup._bg_);

                    jsf.Object.destroy(options);
                }

                if (popup) {
                    if (options && options.hideEffect) {
                        if (!options.hideEffect.target) {
                            options.hideEffect.target = options.target;
                        }

                        options.hideEffect._complete = options.hideEffect.complete;
                        options.hideEffect.complete = complete;

                        jsf.Effect.cssTransition(options.hideEffect);
                    } else {
                        complete();
                    }
                }
            },
            isPopup: function(ui) {
                var i = null;

                for (i in _popups) {
                    if (_popups[i].target == ui) {
                        return true;
                    }
                }

                return false;
            }
        }
    });
	
    PopupOnMouseDown = function(evt) {
        var ui, i = null, p, o, a;

        // se o HtmlElement for popup ou estiver dentro de um popup, não oculta
        evt = jsf.MouseEvent(evt);

        if (!evt.target._isPopupBackground) {
            //componente que recebeu o click
            ui = jsf.Display.getByElement(evt.target, true);

            //se o click foi em um DisplayObject){
            if (ui) {
                //tenta encontrar um pai que seja popup, se sim é pq o click foi em um popup
                while (ui) {
                    p = _popups[ui._id];
                    if (p && p.target == ui) {//encontrou o popup que ocorreu o click
                        //oculta todos os popups que estão acima dele
                        p = p.target;
                        a = [];
                        for (i in _popups) {
                            o = _popups[i].target;
                            if (o != p && o._canvas.style.zIndex > p._canvas.style.zIndex) {
                                a.push(_popups[i]);
                            }
                        }
                        for (i = 0; i < a.length; i++) {
                            jsf.PopupManager.remove(a[i]);
                        }

                        return;
                    }
                    ui = ui._parent;
                }

                //ocutas todos os popups exceto o tiver autohide=false
                if (!jsf.PopupManager.isPopup(ui)) {
                    for (i in _popups) {
                        if (_popups[i].autohide) {
                            jsf.PopupManager.remove(_popups[i]);
                        }
                    }
                }
            }
        } else {
            //click no background de um popup modal
            ui = jsf.ui.DisplayObject.getByElement(evt.target);

            //remove todos os popups, exceto o popup dono do background clicado ou o que tiver autohide=false
            for (i in _popups) {
                if (_popups[i].target != ui && _popups[i].autohide) {
                    jsf.PopupManager.remove(_popups[i]);
                }
            }
        }
    };
    
    function showElement(element) {
        element.style.visibility = element._oldVisibility;
        element.style.display = element._oldDisplay;
    }

    function hideElement(element) {
        element._oldVisibility = element.style.visibility;
        element._oldDisplay = element.style.display;

        element.style.visibility = 'hidden';
        element.style.display = 'block';
    }

    function getBackground(ui) {
        var b = null, i;

        for (i = 0; i < background.length; i++) {
            if (background[i]._free_) {
                b = background[i];
                break;
            }
        }

        if (!b) {
            b = jsf.Dom.create('div', null, 'p1');
            b._isPopupBackground = true;
            background.push(b);
        }

        b._free_ = false;
        b.style.zIndex = (++_zIndex);
        b._idPopupUI = ui._id;
        return b;
    }

    function onShowComplete(options, e) {
        if (options.onshow) {
            options.onshow();
        }

        if (options.showEffect && options.showEffect._complete) {
            options.showEffect._complete(e);
        }

        if (options.target instanceof jsf.ui.DisplayObject) {
            options.target.dispatch(jsf.Event.ON_SHOW);
        }
    }

    function addPopup(options) {
        var ui = options.target, canvas = ui._canvas || ui, p;

        // define a posição do popup
        if (options.position) {
            if (options.owner && options.position.x===undefined && options.position.y===undefined) {
                jsf.Dom.positionByRect({
                    rect: jsf.Dom.rect(options.owner),
                    target: options.target,
                    position: options.position.reference || 'left|bottom right|top'
                });
            } else {
                jsf.util.Dom.style(options.target, {
                    "top": (options.position.y || options.position.y) + "px",
                    "left": (options.position.x || options.position.x) + "px"
                });
            }
        }

        //define o container do popup, default=aplicação
        if (!options.container) {
            options.container = jsf.managers.SystemManager.application();
        }

        //define a sombra
        if (options.shadow) {
            jsf.Dom.addClass(canvas, 'shadow');
        }

        if (options.autohide === undefined) {
            options.autohide = true;
        }

        if (!ui._parent) {
            options.container.add(ui);
        }

        if (ui.visible) {
            ui.visible(true).render();
        }

        // adiciona os elementos na página(background e popup)
        hideElement(canvas);
        if (options.modal) {
            ui._bg_ = getBackground(ui);
            options.container._client.appendChild(ui._bg_);
        }
        canvas._isPopupCanvas = true;
        options.container._client.appendChild(canvas);
        if (canvas.style.display) {
            canvas.style.display = "";
        }

        // coloca o popup sobre todos os outros elementos
        canvas.style.zIndex = (++_zIndex);

        _popups[ui._id] = options;

        showElement(canvas);

        if (options.showEffect) {
            if (!options.showEffect.target) {
                options.showEffect.target = options.target;
            }

            options.showEffect._complete = options.showEffect.complete;
            options.showEffect.complete = function(e) {
                onShowComplete(options, e);
            };
            jsf.Effect.cssTransition(options.showEffect);
        } else {
            onShowComplete(options);
        }
    }
    
}());