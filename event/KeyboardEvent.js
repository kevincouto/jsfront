"use strict";

(function() {
    define("jsf.event.KeyboardEvent", {
        _alias: "jsf.KeyboardEvent",
        _require: ["jsf.event.Event", "jsf.managers.FocusManager"],
        
        _constructor: function(evt) {
            return EventKeyObject(evt);
        },
        _static: {
            initialize: function() {
                document.onkeydown = onKeyDown;
                document.onkeyup = onKeyUp;
                document.onkeypress = onKeyPress;
            },
            add: function(control, eventName, callback, context) {
                jsf.Event.add(control, eventName, callback, context);
            },
            KEY_DOWN: 'KEY_DOWN',
            KEY_UP: 'KEY_UP',
            KEY_PRESS: 'KEY_PRESS'
        }
    });
	
// private functions:
    function onKeyDown(event) {
        var ui, evt;

        jsf.managers.SystemManager.idleReset();

        evt = EventKeyObject(event);

        if (evt.keyCode == 9) {// TAB
            ui = jsf.FocusManager.getNextFocusManagerComponent();
            if (ui) {
                jsf.FocusManager.activeFocus(ui);
                console.log(ui.id());
            }
            jsf.Event.stopPropagation(event);
            return false;
        } else {
            ui = jsf.FocusManager.activeFocus();
            if (ui) {
                ui._onkeydown(evt);
            }
        }

        return true;
    }

    function onKeyUp(evt) {

    }

    function onKeyPress(evt) {

    }

    function EventKeyObject(evt) {
        var e = evt || window.event;

        return {
            type: 'keyboardEvent',
            keyCode: e.which || e.keyCode,
            ctrl: e.ctrlKey,
            shift: e.shiftKey
                    // source:e
        };
    }
    
}());
