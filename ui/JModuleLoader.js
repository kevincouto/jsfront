"use strict";

(function(){
    /*
        <effect name="topToBottom">
            <property name="top" from="0" to="100%" duration="0.3s" />
        </effect>
        <effect name="rightToLeft">
            <property name="left" from="0" to="-100%" duration="0.3s" />
            <property name="opacity" from="1" to="0" duration="0.4s" />
        </effect>
    */
    var transitions = {
        //[sai, entra]
        'none' : [],
        'top-down'  : [
            {top: {from:'0',     to:'100%', duration:'0.3s'}},
            {top: {from:'-100%', to:'0',    duration:'0.3s'}}
        ],
        'down-top'  : [
            {top: {from:'0',    to:'-100%', duration:'0.3s'}},
            {top: {from:'100%', to:'0',     duration:'0.3s'}}
        ],
        'right-left': [
            {left: {from:'0',    to:'-100%', duration:'0.3s'}},
            {left: {from:'100%', to:'0',     duration:'0.3s'}}
        ],
        'left-right': [
            {left: {from:'0',     to:'100%', duration:'0.3s'}},
            {left: {from:'-100%', to:'0',    duration:'0.3s'}}
        ],
        'left-left-opacity': [
            {left:    {from:'0',     to:'-100%', duration:'0.3s'},
             opacity: {from:'1',     to:'0',     duration:'0.4s'}},
            {left:    {from:'-100%', to:'0',     duration:'0.6s'},
             opacity: {from:'0',     to:'1',     duration:'1s'}}
        ]
    };
    
    jsf.loadImage( jsf.config().URL_THEMES + jsf.config().THEME + "/" + "module_load_loading.gif" );
    
    define("jsf.ui.JModuleLoader", {
        _require: ["jsf.ui.JContainer", "jsf.effect.Effect"],
        _extend: "container",
        _alias: "jsf.JModuleLoader",
        _xtype: "moduleloader",
        
	_constructor: function(properties) {
            jsf.JContainer.call(this, properties);

            this._canvas.className = 'mdd';

            this._loading = false;
            this._file = null;
            this._activeModule = null;
            this._activeName = null;
            this._transition = 'left-left-opacity';

            this._applyProperties(properties);
        },
        _property: {
            transition: {
                type: "Object",
                get: function() {
                    return this._transition;
                },
                set: function(value) {
                    this._transition = transitions[value] ? value : 'top-down';
                }
            }
        },
		
        _public: {
            load: function(module, params, callback) {
                var mod, url = "", i, config = jsf.config(), ns, me = this;

                this._load_callback = callback;

                if (module === null) {
                    this.active(null);
                    return this;
                }

                if (this._loading || !module) {
                    return this;
                }

                this._loading = true;

                if (jsf.isString(module)) {
                    url = config.URL_BASE + module + '.xml';
                    ns = jsf.splitNamespace(module);

                    if (!ns.namespace) {
                        jsf.exception("Undefined namespace in [<b>" + module + "</b>]");
                        return null;
                    }

                    mod = ns.namespace[ ns.className ];
                } else {
                    mod = module;
                }

                //se já existe mod (já foi carregado anteriormente) localiza o módulo e passa-o para cima.
                if (mod && mod instanceof jsf.ui.JModule) {
                    for (i = 0; i < this._children.length; i++) {
                        if (this._children[i]._id == mod._id) {
                            this.active(mod, params);
                            return this;
                        }
                    }

                    //se chegou aqui, o módulo existe e não está dentro deste js.JModuleLoader
                    mod._client.style.visibility = 'hidden';
                    mod.create();

                    this.add(mod);
                    this.active(mod, params);

                    return this;
                }

                wait(this, true);

                //carrega o arquivo xml de modo assíncrono
                
                jsf.XML.load(url, function(xml){
                    //carrega os imports definido no xml
                    jsf.XML.each(xml, "import", function(node){
                        jsf.require(node.getAttribute("src"));
                    });

                    //aguarda carregar tudo
                    jsf.ready(function() {
                        var 
                            mod = jsf.createComponente(xml);
                        
                        wait(me, false);
                        ns.namespace[ ns.className ] = mod;

                        me.dispatch('loaded');
                        me.active(mod, params);

                        me = null;
                    });
                });
                
                return this;
                
                jsf.require(url, function(status) {
                    if (status == 'error') {
                        wait(me, false);
                        me._loading = false;
                        jsf.exception('module [<b>' + module + '</b>] not found.');
                    } else {

                        //aguarda as dependências do módulo terem sido carregadas
                        jsf.ready(function() {
                            wait(me, false);
                            mod = ns.namespace[ ns.className ];

                            me.dispatch('loaded');
                            me.active(mod, params);

                            me = null;
                        });
                    }
                });

                return this;
            },
            render: function() {
                if (this._active_) {
                    this.active(this._active_);
                    delete(this._active_);
                } else if (this._activeModule) {
                    this._activeModule.render();
                }
            },
            active: function(module, params) {
                var old, s;

                if (!this.module()) {
                    //a propriedade active só poderá ser aplicada após a criação completa do JModuleLoader
                    this._active_ = module;
                    return null;
                }

                //get
                if (module === undefined) {
                    return this._activeModule;
                }

                //set
                if (module === null) {//oculta o modulo atual
                    if (this._activeModule) {
                        //this.remove(this._activeModule);
                        applyTransition(this, this._activeModule, null);
                        this._activeModule = null;
                    }
                } else {
                    old = this._activeModule ? this._activeModule._canvas : null;

                    module.params = params;

                    //o módulo é o mesmo já ativo
                    if (this._activeModule && this._activeModule == module) {
                        this._loading = false;

                        if (this._load_callback) {
                            this._load_callback(module);
                            this._load_callback = null;
                        }

                        return this;
                    }

                    //oculta o módulo atual
                    if (this._activeModule) {
                        //this.remove(this._activeModule);
                    }

                    s = module;
                    module = jsf.isString(module) ? window[module] : module;

                    if (!module) {
                        jsf.exception("<b>" + s + "</b> is not valid module");
                        return null;
                    }

                    module.create();

                    if (module.parent() != this) {
                        this.add(module);
                    }

                    module._canvas.style.display = 'block';
                    module._canvas.style.visibility = 'hidden';
                    module._canvas.style.left = 0;
                    module._canvas.style.top = 0;
                    module._canvas.style.width = '100%';
                    module._canvas.style.height = '100%';
                    //module._canvas.style.opacity = 0;

                    this._canvas.appendChild(module.canvas());

                    //module._grap = 0;
                    module.dispatch(jsf.Event.ON_ACTIVE, null, module);
                    module.updateDisplay();

                    this.dispatch(jsf.Event.ON_ACTIVE, module);

                    module._canvas.style.visibility = 'visible';
                    this._activeModule = module;
                    this._loading = false;

                    applyTransition(this, old, module.canvas());

                    if (this._load_callback) {
                        this._load_callback(module);
                        this._load_callback = null;
                    }
                }

                return this;
            }
        }
    });
        
//privare functions:
    function wait(ctrl, loading) {
        if (loading && !ctrl._elLoading) {
            ctrl._elLoading = jsf.Dom.create('div', 'top:0;left:0;right:0;bottom:0');
            ctrl._elLoading.innerHTML = '<div class="mdd-loading"></div>';
        }

        if (loading) {
            ctrl._canvas.appendChild(ctrl._elLoading);
        } else {
            jsf.Dom.remove(ctrl._elLoading);
        }
    }

    function applyTransition(moduleLoader, oldCanvas, newCanvas) {
        //oculta o anterior
        if (oldCanvas) {
            /*jsf.Effect.cssTransition({
                target: oldCanvas,
                properties: transitions[moduleLoader._transition][0],
                complete: function(e) {
                    //jsf.Dom.remove(e);
                }
            });*/
        }

        //exibe o novo
        if (newCanvas) {
            jsf.Effect.cssTransition({
                target: newCanvas,
                properties: transitions[moduleLoader._transition] ? transitions[moduleLoader._transition][1] : 'left-left-opacity',
                complete: function(e) {
                    moduleLoader._activeModule.onShow();
                    moduleLoader.dispatch(jsf.event.Event.ON_SHOW, moduleLoader._activeModule);
                }
            });
        }
    }

}());
