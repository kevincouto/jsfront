"use strict";

(function(){
    var _datasources = [];

    define("jsf.rpc.RemoteService", {
        _require: ["jsf.rpc.HttpService", "jsf.core.Control"],
        _alias: "jsf.RemoteService",
        _extend: "control",
        _xtype: "service",
        
        constructor: function(properties) {
            jsf.core.Control.call(this);

            this._defaultGateway = '';
            this._container = null;
            this._components = null;
            this._editmode = 'none';
            this._autoLock = true;
            this._gateway = jsf.managers.RemoteService.defaultGateway;
            this._targets = [];
            this._executed = null;
            this._children = {};
            this._autoLoad = false;

            this._indexDS_ = _datasources.length;
            _datasources.push(this);

            this._applyProperties(properties);
        },
        _destructor: function() {
            _datasources.slice(this._indexDS_, 0);
        },
        _event: {
            change: function(record) {
                recordsetChanged(this, record);
            }
        },
        _static: {
            defaultGateway: "",
            clearCache: function(id) {
                sessionStorage.removeItem(id);
                return this;
            }
        },
        _public: {
            action: function(value) {
                // get
                if (value === undefined) {
                    return this._action;
                }

                // set
                this._action = value;

                return this;
            },
            autoLoad: function(value) {
                // get
                if (value === undefined) {
                    return this._autoLoad;
                }

                // set
                this._autoLoad = value;

                return this;
            },
            editMode: function(value) {
                // get
                if (value === undefined) {
                    return this._editmode;
                }

                // set
                this._editmode = value;

                return this;
            },
            targets: function(value) {
                // get
                if (value === undefined) {
                    return this._targets;
                }

                // set
                if (!Type.isArray(value)) {
                    value = [value];
                }

                this._targets = value;

                return this;
            },
            add: function(value) {
                var i;

                if (Type.isArray(value)) {
                    for (i = 0; i < value.length; i++) {
                        this.add(value[i]);
                    }
                    return value;
                }

                this._children[value._id] = value._UIIndex;

                return this;
            },
            gateway: function(value) {
                // get
                if (value === undefined) {
                    return this._gateway;
                }

                // set
                this._gateway = value;

                return this;
            },
            cache: function(value) {
                // get
                if (value === undefined) {
                    return this._cache;
                }

                // set
                this._cache = value;

                return this;
            },
            clear: function() {
                var i, children = getChildren(this);

                for (i = 0; i < children.length; i++) {
                    if (children[i].clear) {
                        children[i].clear();
                    }
                }

                return this;
            },
            data: function(data) {
                var i, f, children = getChildren(this);

                for (i = 0; i < children.length; i++) {
                    //limpa
                    if (children[i].clear) {
                        children[i].clear();
                    }

                    //atualiza o componente
                    if (children[i].data && children[i].fieldName) {
                        f = children[i].fieldName();
                        if (!f) {
                            f = children[i].name();
                        }

                        children[i].data(data[f] || null);
                    }
                }

                return this;
            },
            root: function(value) {
                // get
                if (value === undefined) {
                    return this._root;
                }

                // set
                this._root = value;

                return this;
            },
            execute: function(options) {
                var i, a = null, url, displayObject,
                        data = {},
                        me = this,
                        children = [],
                        valid = true;

                /*
                 options = {
                 action : Class.method, //require
                 gateway: String,       //optional
                 message: String,       //optional
                 param  : Object,       //optional
                 success: Function,     //optional
                 failure: Function      //optional
                 }
                 */

                options = options || {};
                options.action = options.action || this._action;

                url = this._gateway || jsf.managers.RemoteService.defaultGateway;

                // obtém os componentes filhos
                children = getChildren(this);

                // monta os dados para envio
                for (i = 0; i < children.length; i++) {
                    displayObject = children[i];

                    //valida o dado do componente
                    if (jsf.core.Validator.validate(displayObject, true) == jsf.core.Validator.INVALID) {
                        valid = false;
                    }

                    if (displayObject.data) {
                        data[displayObject._fieldName || displayObject._name] = displayObject.data();
                    }
                }

                if (!valid) {
                    return this;
                }

                // monta a url
                if (this._methods && this._methods[options.action]) {
                    url += this._methods[options.action];
                } else {
                    url += '?action=' + jsf.rpc.HttpService.encode(options.action);
                }

                // adiciona param à url
                /*if (options.param) {
                 e = (url.indexOf('?') == -1) ? '?' : '&';
                 
                 for (i in options.param) {
                 url += e + (i + '=' + options.param[i]);
                 e = '&';
                 }
                 }*/
                if (options.param) {
                    for (i in options.param) {
                        data[i] = options.param[i];
                    }
                }

                this._status = 'wait';

                if (options.message) {
                    a = Alert.show({
                        text: options.message || 'Aguarde...',
                        buttons: {},
                        modal: true
                    });
                }

                if (jsf.isFunction(options.onBeforePost)) {
                    options.onBeforePost();
                }

                data.cache = this._cache;

                this._cache = false;

                jsf.HttpService.post(data, url, function(result) {
                    me._status = 'complete';

                    //oculta a mensagem
                    if (Boolean(a)) {
                        a.hide();
                        a = null;
                    }

                    if (jsf.isFunction(options.onResponse)) {
                        options.onResponse(result.data);
                    }

                    if (result.status == jsf.rpc.HttpService.STATUS_OK) {
                        var root = me._root ? result.data[me._root] : result.data;

                        dispatchSuccess(me, result);

                        if (jsf.isFunction(options.onSuccess)) {
                            options.onSuccess(result);
                        } else {
                            /*Alert.show({
                             text   : root.message, 
                             modal  : true
                             });*/
                        }
                    } else {
                        if (options.onFailure) {
                            options.onFailure(result);
                        } else {
                            /*jsf.Alert.show({
                             text   : result.data,
                             modal  : true
                             });*/
                        }
                    }
                });

                return this;
            },
            methods: function(value) {
                // get
                if (value === undefined) {
                    return this._methods;
                }

                // set
                this._methods = value;

                return this;
            },
            select: function(param, fnSuccess, fnFailure) {
                var me = this;

                this.execute('select', param,
                        function(result) {
                            dispatchSuccess(me, result);

                            if (fnSuccess) {
                                fnSuccess(result);
                            }
                        },
                        function(result) {
                            if (fnFailure) {
                                fnFailure(result);
                            }
                        }
                );
            }
        }
    });

    function getControls(module, container, dataSource, ignoreName) {
        var children, controls = [], i, c;

        if (container) {
            // se o DS faz parte do módulo ou
            // a propriedade dataSource="nomeDoDataSource" foi definido no container
            //    nesse caso o nome pode ter sido dado no código this.nomeDoDataSource ou {xtype... name:"nomeDoDataSource"}
            if (module[dataSource._name] || (container._dataSource == dataSource._name || module[container._dataSource] == dataSource) || ignoreName) {
                children = container.children();
                for (i = 0; i < children.length; i++) {
                    c = children[i];

                    if (c.dataProvider || c.data) {
                        controls.push(c);
                    }

                    if (c instanceof jsf.ui.JContainer) {
                        controls = controls.concat(/*module, */getControls(module, c, dataSource, true));
                    }
                }
            } else {
                children = container.children();
                for (i = 0; i < children.length; i++) {
                    c = children[i];

                    if (c instanceof jsf.ui.JContainer) {
                        controls = controls.concat(getControls(module, c, dataSource));
                    }
                    else if (module[c._dataSource] || c._listSource == dataSource._name) {
                        controls.push(c);
                    }
                }
            }
        }

        return controls;
    }

    //retorna os componentes do módulo pai do dataSource que está definida a propriedade dataSource=dataSource.name()
    function getChildren(dataSource) {
        var module = dataSource._module || dataSource._parent;
        return getControls(module, module, dataSource);
    }

    /**
     * @param {DataSource} ds
     * @param {Object} result
     */
    function dispatchSuccess(ds, result) {
        var root = ds._root ? result.data[ds._root] : result.data,
                controls = getChildren(ds),
                module = ds._module || ds._parent,
                i, v, c, data;

        //todos os componentes do array controls devem conter dataProvider ou data
        for (i = 0; i < controls.length; i++) {
            c = controls[i];
            data = c._dataRoot ? result[c._dataRoot] : root;

            if (data) {
                //define a lista do componente
                if (c.dataProvider) {
                    if (c._listSource !== undefined) {
                        if (module[c._listSource] && c._listSource == ds.name()) {
                            c.dataProvider(data);
                        }
                    } else {
                        if (module[c._listSource]) {
                            c.dataProvider(data);
                        }
                    }
                }

                //define o dado do componente
                if (c.data) {
                    //tenta encontrar o dado enviado para o componente comparando com o dataField e name
                    v = data[c._dataField];
                    if (v == undefined) {
                        v = data[c._name];
                    }

                    //se o valor existe nos dados enviados, passa esse valor para o componente
                    if (v !== undefined) {
                        c.data(v);
                    }
                }
            }
        }
    }
    
}());
