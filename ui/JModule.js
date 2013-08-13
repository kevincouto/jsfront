"use strict";

(function(){
	
    define("jsf.ui.JModule", {
        _require: ["jsf.managers.SystemManager", "jsf.ui.JContainer"],
        _alias: "jsf.JModule",
        _extend: "container",
        _xtype: "module",
        
	_constructor: function(properties) {
            jsf.JContainer.call(this);

            this._module = this;

            this._applyProperties(properties);
        },
        _event: {
            //updateDisplay será chamado por todos os componentes filhos do módulo, quando for chamado o método render do componente.
            updateDisplay: function() {
                //dispara o evento updateDisplay somente se a criação dos componentes estiver completa 
                if (this._creationComplete) {
                    this._creationComplete = false;
                    this.dispatch(EventBase.ON_UPDATE_DISPLAY);
                    this._creationComplete = true;
                }
            }
        },
		
        _public: {
            get: function(name) {
                return this[name];
            },
            create: function(def) {
                var i, id, b, control, properties, property, a, v;

                if (this._creationComplete) {
                    return this;
                }

                def = def || this._def_ || {};

                //cria os componentes definidos em view
                if (def._view) {
                    xtypeToDisplay(this, this, def._view);
                }

                //define a propriedade module de cada componente, apontando para JModule
                setModule(this, this);

                //aplica as propriedades bindables
                if (this._bindableChildren) {
                    for (id in this._bindableChildren) {
                        properties = this._bindableChildren[id];
                        for (property in properties) {
                            a = properties[property];
                            control = this.get(a[1]);
                            
                            if (control){
                                i = control.id();

                                if (!jsf.core.Control.BINDABLES[ i ]) {
                                    jsf.core.Control.BINDABLES[ i ] = {};
                                }

                                a = [
                                    a[2].replace("(", "").replace(")", ""),
                                    property
                                ];

                                v = control[ a[0] ]() || null;
                                jsf.core.Control.BINDABLES[ i ][id] = a;

                                jsf.core.Control.get(id)[property](v);
                            }
                        }
                    }
                }

                delete(this._bindableChildren);

                //chama o método indicando que a criação dos componentes foi completada
                this.onCreationComplete();
                this._creationComplete = true;

                //remove o json da definição temporária e o método create pq este não pode mais ser chamado
                delete(this._def_);
                delete(this.create);

                //executa os datasources caso autoLoad=true
                for (i in this._datasource) {
                    if (this._datasource[i].autoLoad()) {
                        this._datasource[i].execute();
                    }
                }

                return this;
            },
            onInitialize: jsf.EMPTY_FUNCTION, //os componentes ainda não existem
            onCreationComplete: jsf.EMPTY_FUNCTION, //os componentes já existem mais a aplicação ainda não é visível
            onShow: jsf.EMPTY_FUNCTION  //os componentes já existem e a aplicação está visível
        }
    });
    
    function xtypeToDisplay(module, container, xtypeArray) {
        var i, item, control, children = null, cls;

        for (i = 0; i < xtypeArray.length; i++) {
            item = xtypeArray[i];

            //se xtype não foi definido, xtype será igual a xtypeChild
            if (!item.xtype) {
                item.xtype = container._xtypeChild;
            }

            //se xtype ainda não foi definido, gera erro
            if (!item.xtype) {
                if (console && console.log) {
                    console.log(item);
                }

                jsf.System.exception('xtype is undefined. verify log.');
                return;
            }

            //guarda os filhos se form o caso
            if (item.add) {
                children = item.add;
                delete (item.add);
            }

            //obtém a classe
            cls = jsf.Super(item.xtype);

            //se a classe não existe, gera erro
            if (!cls) {
                jsf.exception('xtype[' + item.xtype + '] is undefined. verify log.');
                return;
            }

            //instancia a classe
            control = new cls(item);

            //adiciona uma referência dentro do módulo aou objeto criado
            if (item.name) {
                if (jsf.Super(module._CLASS_).prototype[item.name]) {
                    jsf.exception("<b>" + item.name + "</b> is invalid name!");
                } else {
                    module[item.name] = control;
                }
            } else {
                module[control._id] = control;
            }

            if (control._bindables) {
                if (!module._bindableChildren) {
                    module._bindableChildren = {};
                }

                module._bindableChildren[control._id] = control._bindables;
            }

            //
            if (container._xtypeChild == control._type || (!cls._noParent && (control instanceof jsf.Display))) {
                container.add(control);
            } else {
                control._module = module;

                if (cls._parentProperty && container[cls._parentProperty]) {
                    container[cls._parentProperty](control);
                }
            }

            //se tem filhos, adiciona os filhos
            if (children) {
                xtypeToDisplay(module, control, children);
                children = null;
            }
        }
    }

    function setModule(module, control) {
        var i, l, n = control.name();

        control._module = module;

        if (module[n] === undefined && control._id != n) {
            if (module.prototype[n]) {
                jsf.exception(n + "is invalid name!");
            } else {
                console.log(n);
                module[n] = control;
            }
        }

        if (control._children) {
            l = control._children.length;

            for (i = 0; i < l; i++) {
                setModule(module, control._children[i]);
            }
        }
    }

    function module(name, def) {
        var Super, mod, dep, m, defs;

        if (jsf.isString(name) && def === undefined) {
            return (window[name] instanceof jsf.ui.JModule) ? window[name] : null;
        }

        def = def || name;

        //dependencias
        if (def._require) {
            jsf.require(def._require);
        }

        //define a super classe, se nao definida usa Class
        Super = jsf.Super(def._extend || "module");

        //instacia o módulo
        mod = new Super(def._properties);

        //não permite criar módulo que não seja derivado da classe JModule ou superior
        if (!(mod instanceof jsf.JModule)) {
            throw "module error!";
        }

        delete(def._extend);
        delete(def._require);

        mod._def_ = def;

        if (def.onInitialize) {
            def.onInitialize.call(mod);
            delete(def.onInitialize);
        }

        mod.onShow = def.onShow || jsf.EMPTY_FUNCTION;
        mod.onCreationComplete = def.onCreationComplete || jsf.EMPTY_FUNCTION;

        if (jsf.isString(name)) {
            window[name] = mod;
        }

        return mod;
    }
    
    window.module = module;
}());
