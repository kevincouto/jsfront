"use strict";

(function() {
    var 
        lastExecThrottle = 500, // limit to one call every "n" msec
        lastExec = new Date(),
        timer = null;
	
    define("jsf.event.Event", {
        _alias: "jsf.Event",
        _static: {
            add: function(control, eventName, callback, context) {
                var ev;

                if (eventName) {
                    ev = '__' + eventName;

                    if (context) {
                        if (!callback._contexts_event) {
                            callback._contexts_event = {};
                        }
                        callback._contexts_event[control._id] = context;
                    }

                    if (!control._dispatchs[ev]) {
                        control._dispatchs[ev] = [];
                    }

                    control._dispatchs[ev].push(callback);
                }
            },
            dispatch: function(control, eventName, event, context) {
                var i, c, s = "", r, ev, callbacks, cb;

                if (eventName) {
                    if (control._suspend && control._suspend[eventName]) {
                        control._suspend[eventName] = false;
                    } else {
                        r = null;
                        ev = '__' + eventName;
                        callbacks = control._dispatchs[ev];

                        if (callbacks) {
                            for (i = 0; i < callbacks.length; i++) {
                                cb = callbacks[i];

                                if (jsf.isString(cb)) {
                                    s = cb;
                                    c = control._module || jsf.System.application();
                                    cb = c[cb];
                                } else {
                                    if (cb._contexts_event && cb._contexts_event[control._id]) {
                                        c = cb._contexts_event[control._id];
                                    } else {
                                        c = context || control.module();
                                    }
                                }

                                if (cb) {
                                    r = cb.apply(c, [control, event]);
                                } else {
                                    jsf.exception(control.id() + " dispatch event error: <b>" + s + "</b> not found.");
                                }
                            }
                        }

                        return r;
                    }
                }

                return null;
                //callback.apply(context, Type.isArray(params) ? params : [ params ]);
            },
            nativeAdd: function(target, eventName, handlerName) {
                if (target.addEventListener) {
                    target.addEventListener(eventName, handlerName, false);
                }
                else if (target.attachEvent) {
                    target.attachEvent("on" + eventName, handlerName);
                }
            },
            remove: function(target, eventName, handlerName) {
                if (target.removeEventListener) {
                    target.removeEventListener(eventName, handlerName);
                }
                else if (target.detachEvent) {
                    target.detachEvent("on" + eventName, handlerName);
                }
            },
            stopPropagation: function(e) {
                if (e) {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    if (e.cancelBubble) {
                        e.cancelBubble = true;
                    }
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e.returnValue) {
                        e.returnValue = false;
                    }
                }

                return false;
            },
            register: function(constName, name) {
                constName = constName.toUpperCase();

                if (!this[constName]) {
                    this[constName] = name.toLowerCase();
                }
            },
            observer: function(eventName, callback, context) {
                if (!this._observer[eventName]) {
                    this._observer[eventName] = [];
                }

                this._observer[eventName].push({callback: callback, context: context || window});
            },
            _observer: {},
            ON_ACTIVE: 'onactive',
            ON_CLICK: 'onclick',
            ON_EDIT_END: 'oneditend',
            ON_EDIT_START: 'edit_start',
            ON_DOUBLECLICK: 'dblclick',
            ON_MOUSE_DOWN: 'onmousedown',
            ON_MOUSE_UP: 'mouseup',
            ON_MOUSE_OVER: 'onmouseover',
            ON_MOUSE_OUT: 'onmouseout',
            ON_DRAG_OVER: 'ondragover',
            ON_DRAG_OUT: 'ondragout',
            ON_DRAG_ENTER: 'ondragenter',
            ON_CHANGE: 'onchange',
            ON_HIDE: 'hide',
            ON_SHOW: 'onshow',
            ON_CLOSE: 'onclose',
            ON_CONTEXT: 'context_menu',
            ON_ITEM_CLICK: 'onitemclick',
            ON_ITEM_ENTER: 'onitementer',
            ON_ITEM_EXIT: 'onitemexit',
            ON_KEY_PRESS: 'onkeypress',
            ON_UPDATE_DISPLAY: "onupdatedisplay",
            ON_USER_STATUS: "ON_USER_STATUS",
            MB_LEFT: 1,
            MB_RIGHT: 3,
            MB_MIDDLE: 2,
        }
    });

    window.onresize = function() {
        var d = new Date(), app;

        if (d - lastExec < lastExecThrottle) {
            if (timer) {
                window.clearTimeout(timer);
            }
            timer = setTimeout(window.onresize, lastExecThrottle);
            return false;
        }

        lastExec = d;

        app = jsf.managers.SystemManager.application();

        if (app) {
            app.invalidateSize();
            app._onresize();
        }

        return true;
    };
	
}());