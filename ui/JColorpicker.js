"use strict";

define("jsf.ui.JColorpicker", {
    _require: ["jsf.ui.DisplayObject", "jsf.core.Keyboard"],
    _alias: "jsf.JColorpicker",
    _extend: "display",
    _xtype: "datapicker",
    
    _constructor: function(properties) {
        jsf.ui.DisplayObject.call(this);

        this._canvas.innerHTML = 
                '<input type="text" />' +
                '<div class="txt-date">' +
                    '<div _captureMouseEvent="dt" class="txt-date-ico"></div>' +
                '</div>';

        this._input = this._canvas.childNodes[0];
        this._el_date = this._canvas.childNodes[1];
        this._input.onkeydown = this._inputKeyDown;
        this._input._parentId = this._id;
        this._input.onfocus = this._onenter;
        this._input.onblur = this._onexit;

        jsf.Keyboard.createInputMask({
            target: this._input,
            mask: '99/99/9999'
        });

        this._focuset = true;

        this._applyProperties(properties);
    },
    _event: {
        enter: function() {
            //console.log(this);
            //this._canvas.className = 'txt ui-bd txt-border txt-focus';
        },
        exit: function(evt) {
            //this._canvas.className = 'txt ui-bd txt-border';
            //this.dispatch(EventBase.ON_EDIT_END, evt);
        },
        keypress: function(evt) {
            var ui = jsf.DisplayObject.getByElement(this);
            evt = Event.keyboard(evt);

            ui.dispatch(Event.ON_KEY_PRESS, evt);
            if (evt.keyCode == Keyboard.KEY_ENTER) {
                ui.dispatch(Event.ON_EDIT_END, evt);
            }
        },
        mousedown: function(element) {
            var me = this, e = element.getAttribute('_captureMouseEvent'), d;

            if (e) {
                d = Date.strToDate(this._input.value, 'd/m/Y', new Date());
                jsf.JCalendar.show(jsf.Dom.rect(element), d, function(date) {
                    me._input.value = date.format('d/m/Y');
                });

                setTimeout(function() {
                    me._input.focus();
                }, 1);
            }
        }
    },
    _protected: {
        rules: {
            canvas: "b1 txt"
        }
    },
    _public: {
        value: function(value) {
            // get
            if (value === undefined) {
                return this._input.value;
            }

            // set
            this._textOld = this._input.value;
            this._input.value = value;

            return this;
        },
        enabled: function(value) {
            // get
            if (value === undefined) {
                return !this._input.disabled;
            }

            // set
            this._input.disabled = !value;
            return this;
        },
        focus: function() {
            this._input.focus();
        },
        dataField: function(value) {
            // get
            if (value === undefined) {
                return this._dataField;
            }

            // set
            this._dataField = value;

            return this;
        }
    }
});
