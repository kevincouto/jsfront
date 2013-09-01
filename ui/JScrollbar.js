"use strict";

(function() {
    var sbTemp = null, width=null, height=null;
    
    define("jsf.ui.JScrollbar", {
        _require: ["jsf.managers.DragManager", "jsf.ui.DisplayObject"],
        _extend: "display",
        _alias: "jsf.JScrollbar",
        _xtype: "scrollbar",
        
        _constructor: function(properties) {
            jsf.Display.call(this);

            // default properties
            this._orientation = 'v';
            this._scrollSize = 0;
            this._largeStep = 17;
            this._value = 0;
            this._showJButtons = true;
            this._autoHide = true;

            // control vars
            this._orientationChanged = true;
            this._invalidateDisplay = true;

            // template
            this._canvas.innerHTML = 
                      '<div class="minus"></div>'
                    + '<div class="track">'
                    +     '<div class="face"></div>'
                    + '</div>'
                    + '<div class="plus"></div>';
            
            this._rules.custom = " vertical";
            this._canvas.className = this._rules.canvas + " vertical";
            
            this._el_minus = this._canvas.childNodes[0];
            this._el_track = this._canvas.childNodes[1];
            this._el_face  = this._el_track.childNodes[0];
            this._el_plus  = this._canvas.childNodes[2];

            this._el_minus._captureMouseEvent = this._el_track._captureMouseEvent = this._el_face._captureMouseEvent = this._el_plus._captureMouseEvent = true;

            this._applyProperties(properties);
        },
        _static: {
            getHeight: function() {
                calculadeSize();
                return height;
            },
            getWidth: function() {
                calculadeSize();
                return width;
            }
        },
        _event: {
            mousedown: function(element, evt) {
                switch (element) {
                    case this._el_minus:
                        startScroll(this, -this._largeStep);
                        break;

                    case this._el_plus:
                        startScroll(this, this._largeStep);
                        break;

                    case this._el_track:
                        var r = jsf.Dom.rect(this._canvas),
                                v = (this._orientation == 'v' ? evt.y : evt.x) - (this._orientation == 'v' ? r.top : r.left);

                        this._ondraging(v, v);
                        break;

                    case this._el_face:
                        jsf.managers.DragManager.doDrag(this, {
                            dragElement: element,
                            cursor: 'default'}
                        );
                        break;
                }
            },
            mouseup: function(element) {
                stopScroll(this);
            },
            mousewheel: function(delta) {
                this._stopTimeout = false;

                if (jsf.isTouchDevice) {
                    this._stopTouthScrolling = true;
                    clearInterval(this._scrollInterval);

                    if (delta.start) {
                        this._vStart = this._value;
                    }

                    if (delta.end) {
                        this.render();
                        //continueTouthScrolling(this, delta);
                    } else {
                        this._value = this._vStart - delta.y;
                        this._lastDeltaY1 = this._lastDeltaY2;
                        this._lastDeltaY2 = delta.y;
                        this.render("scrolling");
                    }
                } else {
                    if (this._orientation == 'v') {
                        if (delta.y) {
                            executeScroll(this, true, (delta.y * -this._largeStep));
                        }
                    } else {
                        if (delta.x) {
                            executeScroll(this, true, (delta.x * -this._largeStep));
                        }
                    }
                }
            },
            draging: function(x, y) {
                var v, scrollDist; //p1

                if (this._orientation == 'v') {
                    v = y;
                } else {
                    v = x;
                }

                if (v < 0) {
                    v = 0;
                }

                if (v + this._faceSize > this._trackSize) {
                    v = this._trackSize - this._faceSize;
                }
                
                scrollDist = Math.round(this._faceSize - this._trackSize);

                this._value = -parseInt((parseInt(v, 10) * (this._scrollSize - this._canvasSize) / scrollDist), 10);

                if (this._value != this._lastValue) {
                    this.render();
                }
                
                return false;
            },
            resize: function() {
                this._trackSize = (this._orientation == 'v' ? this._el_track.offsetHeight : this._el_track.offsetWidth);

                if (!this._canvasSizeDefined) {
                    this._canvasSize = (this._orientation == 'v' ? this._canvas.offsetHeight : this._canvas.offsetWidth);
                }
            }
        },
        _property: {
            orientation: {
                type:"String",
                get: function() {
                    return this._orientation;
                },
                set: function(value){
                    this._orientation = value;

                    this._rules.custom = value == 'v' ? " vertical" : " horizontal";
                    this._canvas.className = this._rules.canvas + this._rules.custom;
                    //this._canvas.setAttribute('class', 'scb ' + (value == 'v' ? 'scb-v' : 'scb-h') + (jsf.isTouchDevice ? " scb-touch" : ""));

                    this.updateDisplay();
                }
            }
        },
        _public: {
            parentComponent: function(value) {
                //get
                if (value === undefined) {
                    return jsf.Control.ALL[this._parentComponentId];
                }

                // set
                this._parentComponentId = value._id;

                return this;
            },
            scrollSize: function(value) {
                //get
                if (value === undefined) {
                    return this._scrollSize;
                }

                // set
                this._scrollSize = value;
                this.updateDisplay();

                return this;
            },
            canvasSize: function(value) {
                //get
                if (value === undefined) {
                    return this._canvasSize;
                }

                //set
                this._canvasSize = value;
                this._canvasSizeDefined = true;
                this.updateDisplay();

                return this;
            },
            largeStep: function(value) {
                //get
                if (value === undefined) {
                    return this._largeStep;
                }

                //set
                this._largeStep = value;
                this.updateDisplay();

                return this;
            },
            showJButtons: function(value) {
                //get
                if (value === undefined) {
                    return this._showJButtons;
                }

                //set
                this._showJButtons = value;

                this._el_track.setAttribute('class', (value ? 'scb-track' : 'scb-track scb-hidebt'));
                this._el_minus.style.display = this._el_plus.style.display = (value ? '' : 'none');

                this.updateDisplay();

                return this;
            },
            autoHide: function(value) {
                //get
                if (value === undefined) {
                    return this._autoHide;
                }

                //set
                this._autoHide = value;
                this.updateDisplay();

                return this;
            },
            value: function(value) {
                //get
                if (value === undefined) {
                    return this._value;
                }

                //set
                this._value = value;
                this.updateDisplay();

                return this;
            },
            render: function(touchScrolling) {
                var max, size, pos, i, c = null, v;

                if (this._parentComponentId != undefined) {
                    c = jsf.Control.ALL[this._parentComponentId];
                }

                this._trackSize = (this._orientation == 'v' ? this._el_track.offsetHeight : this._el_track.offsetWidth);

                if (!this._canvasSizeDefined) {
                    this._canvasSize = (this._orientation == 'v' ? this._canvas.offsetHeight : this._canvas.offsetWidth);
                }

                // valida _value
                max = this._scrollSize - this._canvasSize;
                if (this._value > max) {
                    this._value = max;
                }
                if (this._value < 0) {
                    this._value = 0;
                }

                // oculta o componente se for o caso
                if (jsf.isTouchDevice) {
                    this.hidden = !(touchScrolling == "scrolling");
                } else {
                    this.hidden = Boolean(this._scrollSize <= this._canvasSize && this._autoHide);
                }

                if (this.hidden) {
                    this._canvas.style.visibility = 'hidden';
                } else {
                    // reposiciona/dimensiona os elementos internos
                    this._canvas.style.visibility = null;

                    size = Math.max(parseInt(this._trackSize * (this._canvasSize / this._scrollSize), 10), 15);
                    i = (this._value * 100) / max;
                    pos = parseInt(((i * (this._trackSize - size)) / 100), 10);

                    this._el_face.style[this._orientation == 'v' ? 'top' : 'left'] = pos + 'px';
                    this._el_face.style[this._orientation == 'v' ? 'height' : 'width'] = size + 'px';
                    this._faceSize = size;
                    this._facePos = pos;

                    if (this._value != this._lastValue) {
                        if (c) {
                            if (c._onscroll) {
                                c._onscroll(this._value, this);
                            } else {
                                this._onscroll.call(c, this._value, this);
                            }
                        } else if (this._onscroll) {
                            this._onscroll(this._value, this);
                        }
                    }

                    this._lastValue = this._value;
                }

                if (c) {
                    v = Boolean(this._canvas.offsetWidth);

                    if (this._orientation == "v") {
                        c._withVScrollbarVisible = v;
                    } else {
                        c._withHScrollbarVisible = v;
                    }
                }

                return this;
            }
        }
    });

// private functions:
    function calculadeSize() {
        if (width == undefined) {
            sbTemp = new jsf.JScrollbar();
            sbTemp._canvas.style.visibility = 'hidden';
            document.body.appendChild(sbTemp._canvas);

            width = sbTemp.orientation('v').render()._canvas.offsetWidth;
            height = sbTemp.orientation('h').render()._canvas.offsetHeight;

            sbTemp.destroy();
            sbTemp = null;
        }
    }

    function executeScroll(control, noTime, value) {
        if (control._stopTimeout) {
            return;
        }

        control._value += (value === undefined ? control._sv : value);

        if (control._lastValue != control._value && !noTime) {
            // control._sv = control._largeStep;
            setTimeout(function() {
                executeScroll(control);
            }, 100);
        }

        control.render();
    }

    function startScroll(control, value) {
        control._sv = value;
        control._stopTimeout = false;

        executeScroll(control, true);

        setTimeout(function() {
            executeScroll(control);
        }, 400);
    }

    function stopScroll(control) {
        control._stopTimeout = true;
    }

    function continueTouthScrolling(control, delta) {
        var vr, va;

        if (control._lastDeltaY1 === undefined) {
            control.render();
            return;
        }

        vr = control._lastDeltaY1 - control._lastDeltaY2;
        va = Math.abs(vr);

        control._scrollInterval = setInterval(function() {
            va -= 1;
            vr -= 1;

            if (va <= 0) {
                clearInterval(control._scrollInterval);
            }

            control._value += vr;
            control.render("scrolling");
        }, 40);
    }
	
}());
