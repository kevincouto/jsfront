"use strict";

(function() {
    //TODO: internalTip não tá funcionando

    define("jsf.ui.JText", {
        _require: ["jsf.ui.DisplayObject", "jsf.core.Keyboard"],
        _extend: "display",
        _alias: "jsf.JText",
        _xtype: "textbox",
        _tag: "input[type=text]",
        
        _constructor: function(properties) {
            jsf.ui.DisplayObject.call(this);
            this._applyProperties(properties);
        },
                
        _event: {
            invalidate: function() {
                this.render();
            },
            enter: function() {
                this._canvas.focus();
                return false;
            },
            exit: function(evt) {
                this.dispatch(jsf.event.Event.ON_EDIT_END, evt);
                return false;
            },
            keypress: function(evt) {
                if (evt.keyCode == jsf.Keyboard.KEY_ENTER) {
                    this.dispatch(jsf.Event.ON_EDIT_END, evt);
                }
                this._updateInternalTip();
            },
            keydown: function() {
                this._updateInternalTip();
            },
            keyup: function() {
                this._updateInternalTip();
            }
        },
        _protected: {
            rules: {
                canvas: "b1 txt",
                focus: "b2",
                disabled: "b3 txt-disabled",
                notvalid: "txt-notvalid"
            },
            mask: '',
            remote: null,
            focuset: true,
            textOld: '',
            maskInit: false,
            multiline: null,
            labelWidth: 0,
            labelAlign: 'left',
            updateInternalTip: function() {
                if (this._internalTipEl) {
                    this._internalTipEl.innerHTML = (this._input.value == '' ? this._internalTip || '' : '');
                }
            }
        },
        _public: {
            icon: function(value) {
                // get
                if (value === undefined) {
                    return this._icon;
                }

                // set
                this._icon = this.firePropertyChange('icon', value);
                this.updateDisplay();

                return this;
            },
            text: function(value) {
                // get
                if (value === undefined) {
                    return this._input.value;
                }

                // set
                this._textOld = this._input.value;
                this._input.value = this.firePropertyChange('text', value);

                return this;
            },
            textAlign: function(value) {
                // get
                if (value === undefined) {
                    return this._textAlign;
                }

                // set
                this._textAlign = this._input.style.textAlign = this.firePropertyChange('textAlign', value);
                return this;
            },
            maxLength: function(value) {
                // get
                if (value === undefined) {
                    return this._maxLength;
                }

                // set
                this._maxLength = this._input.maxLength = this.firePropertyChange('maxLength', value);
                return this;
            },
            mask: function(value) {
                // get
                if (value === undefined) {
                    return this._mask;
                }

                // set
                this._mask = this.firePropertyChange('mask', value);

                if (this._mask == "password") {
                    createInput(this, "password");
                } else {
                    jsf.Keyboard.createInputMask({
                        target: this._input,
                        mask: value
                    });
                }

                this.updateDisplay();
                return this;
            },
            customChars: function(value) {
                // get
                if (value === undefined) {
                    return this._customChars;
                }

                // set
                this._customChars = this.firePropertyChange('customChars', value);
                this.updateDisplay();

                return this;
            },
            readOnly: function(value) {
                // get
                if (value === undefined) {
                    return this._input.readOnly;
                }

                // set
                this._input.readOnly = this.firePropertyChange('readOnly', value);
                return this;
            },
            internalTip: function(value) {
                // get
                if (value === undefined) {
                    return !this._internalTip;
                }

                // set
                this._internalTip = this.firePropertyChange('internalTip', value);

                if (!this._internalTipEl) {
                    this._internalTipEl = this._canvas.insertBefore(jsf.Dom.create('div', null, 'txt-in-tip'), this._input);
                    this._input.style.background = 'transparent';
                }

                this._updateInternalTip(this);
                return this;
            },
            render: function() {
                var pl = 0, sprites;
                return;
                //sprite do ícone
                if (this._icon !== undefined) {
                    sprites = this.getSprites();

                    if (!this._elIcon) {
                        this._elIcon = this._canvas.appendChild(jsf.Dom.create('div', null, 'txt-icon'));
                    }

                    if (sprites) {
                        this._elIcon.setAttribute('class', 'txt-icon ' + sprites.sprite(this._icon, this._enabled ? 0 : 1));
                    }
                }

                //ícone
                if (this._elIcon) {
                    pl = this._elIcon.offsetLeft + this._elIcon.offsetWidth + 4;
                }

                this._input.style.paddingLeft = pl + 'px';

                //texto de dica
                if (this._internalTipEl) {
                    jsf.Dom.style(this._internalTipEl, {
                        lineHeight: this._canvas.offsetHeight + 'px',
                        paddingLeft: pl + 'px'
                    });
                }

                //define a máscara
                if (this._mask && this._mask != "password") {
                    jsf.Keyboard.createInputMask({
                        input: this._input,
                        mask: this._mask,
                        customChars: this._customChars,
                        decimal: this._decimal,
                        thousand: this._thousand,
                        precision: this._precision,
                        rightToLeft: true
                    });
                }

                this._input.disabled = !this._enabled;

                if (this._borderRadius) {
                    this._input.style.borderRadius = (this._borderRadius + 'px');
                }
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
            },
            data: function(value) {
                // get
                if (value === undefined) {
                    return this._input.value;
                }

                // set
                this._input.value = value;

                return this;
            },
            clear: function() {
                this._input.value = '';
            }
        }
    });
}());
