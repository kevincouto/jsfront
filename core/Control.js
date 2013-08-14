"use strict";

define("jsf.core.Control", {
    _alias: "jsf.Control",
    _xtype: "control",
    _abstract: true,
    
    _constructor: function(properties) {
        var id = this._CLASS_ + "_" + (jsf.Control._count++);

        this._CLASS_ = this._CLASS_;
        this._id = this._name = id;
        this._dispatchs = {};

        jsf.Control.ALL[id] = this;

        if (properties) {
            this._applyProperties(properties);
        }

    },
	
    _static: {
        _count: 0,
        ALL: {},
        ALLN: {},
        BINDABLES: {},
        /**
         * Retorna o componente referente ao id informado
         * @static
         * @param {String} id
         * @returns {jsf.core.Control}
         */
        get: function(id) {
            return jsf.Control.ALLN[id] || jsf.Control.ALL[id];
        }
    },
    _event: {
        langchanged: function() {
        },
        propertyset: function() {
        },
        destruct: function() {
            delete(jsf.Control.ALL[this._id]);
            this.dispatch('destroy');
        }
    },
    _protected: {
        id: null,
        name: null,
        module: null,
        propertiesDependencies: function(properties, order) {
            var a = [], r = {}, p, i;

            if (!properties) {
                return properties;
            }

            for (i in properties) {
                if (this[i]) {
                    a.push({name: i, index: (order[i] === undefined ? 0 : order[i]), value: properties[i]})
                }
            }

            a = jsf.Array.sortObject(a, "index");

            for (i = 0; i < a.length; i++) {
                r[ a[i].name ] = a[i].value;
            }

            return r;
        },
        applyProperties: function(properties) {
            var p = null, evtName, v, a;

            if (properties) {
                for (p in properties) {
                    if (p.indexOf("on") == 0) {
                        evtName = p.toLowerCase();
                        this.addEventListener(evtName, properties[p]);
                    } else {
                        if (this[p]) { // propriedade
                            v = properties[p];
                            if (jsf.isString(v) && v.indexOf("{") == 0) {
                                if (!this._bindables) {
                                    this._bindables = {};
                                }

                                v = v.replace("{", "");
                                v = v.replace("}", "");
                                a = v.split(".");

                                this._bindables[p] = a;
                            } else {
                                this[p](v);
                            }
                        }
                    }
                }
            }

            delete(this._properties);
        },
        fireBindableProperty: function(property, value) {
            var control, i, a, m = this.module(), b = jsf.core.Control.BINDABLES[this.id()];

            if (m && b) {
                for (i in b) {
                    a = b[i];
                    control = m.get(i);

                    if (control) {
                        control[a[1]](value);
                    }
                }
            }
        }
    },
    _public: {
        /**
         * @property {String} name
         * @param {String} value
         * @returns {jsf.core.Control}
         */
        name: function(value) {
            // get
            if (value === undefined) {
                return this._name;
            }

            // set
            if (this._name && jsf.Control.ALLN[this._name]) {
                delete(jsf.Control.ALLN[this._name]);
            }

            jsf.Control.ALLN[value] = this;
            this._name = this.firePropertyChange('name', value);

            return this;
        },
        /**
         * @param {Boolean} value
         * @returns {jsf.core.Control}
         */
        enabled: function(value) {
            // get
            if (value === undefined) {
                return this._enabled;
            }

            // set
            this._enabled = this.firePropertyChange('enabled', !!value);

            return this;
        },
        /**
         * @param {String} eventName
         * @param {Function} callback
         * @param {Object} context
         * @returns {jsf.core.Control}
         */
        addEventListener: function(eventName, callback, context) {
            jsf.Event.add(this, eventName, callback, context);
            return this;
        },
        /**
         * @param {String} event
         * @param {Function} callback
         * @returns {jsf.core.Control}
         */
        removeEventListener: function(event, callback) {
            var i, callbacks = this['_ev' + event];

            if (callbacks) {
                for (i = 0; i < callbacks.length; i++) {
                    if (callbacks[i] == callback) {
                        callbacks.splice(i, 1);
                    }
                }
            }

            return this;
        },
        /**
         * @param {String} value
         * @returns {jsf.core.Control}
         */
        dispatch: function(eventName, event) {
            jsf.Event.dispatch(this, eventName, event);

            return this;
        },
        id: function() {
            return this._id;
        },
        /**
         * @returns {jsf.ui.JModule}
         */
        module: function() {
            if (!this._module) {
                this._module = this._parent ? this._parent.module() : null;
            }

            return this._module;
        },
        /**
         * @returns {jsf.ui.JContainer}
         */
        parent: function() {
            return this._parent;
        },
        /**
         * @returns {null}
         */
        destroy: function() {
            this._destructor();
        },
        firePropertyChange: function(property, value) {
            this._onpropertyset(property, value);
            return value;
        }
    }
});
