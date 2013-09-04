"use strict";

(function() {

    define("jsf.ui.JColorSelector", {
        _require: ["jsf.ui.DisplayObject"],
        _alias:  "jsf.JColorSelector",
        _extend: "display",
        _xtype:  "colorselector",
        
        _constructor: function(properties) {
            var me = this, c;
            
            jsf.ui.DisplayObject.call(this);

            this._focuset = true;
            
            this._indic = 0;
            this._y = 0;
            this._yy= 0;
            this._xx= 0;

            this._canvas.innerHTML = 
                '<div class="client">'+
                    '<div class="mask0">'+
                        '<div class="mask1">'+
                           '<div class="mask2"></div>'+
                        '</div>'+
                        '<div class="indicator1"><div></div></div>'+
                    '</div>' +
                    '<div class="mask3"></div>' +
                    '<div class="indicator2"></div>' +
                    '<div class="mask4"></div>' +
                    '<div class="r">R:<input /></div>' +
                    '<div class="g">G:<input /></div>' +
                    '<div class="b">B:<input /></div>' +
                    '<input class="code" />' +
                    '<div class="preview"></div>' +
                    '<div class="apply">aplicar</div>' +
                    '<div class="transparent">transparente</div>'+
                '</div>';
        
            c = this._canvas.firstChild;
                    
            this._elMask1 = c.childNodes[0];
            this._elMask2 = this._elMask1.childNodes[0];
            this._elIndic = c.childNodes[2];
            this._elColor = c.childNodes[3];
            this._R = c.childNodes[4].childNodes[1];
            this._G = c.childNodes[5].childNodes[1];
            this._B = c.childNodes[6].childNodes[1];
            this._H = c.childNodes[7];
            this._elPreview = c.childNodes[8];
            this._button = c.childNodes[9];
            this._transp = c.childNodes[10];

            this._button.onclick = function() {
                //me._color = '#' + toHex(me._R.value) + toHex(me._G.value) + toHex(me._B.value);
                me.dispatch(jsf.event.ON_CHANGE, me._color);
            }

            this._transp.onclick = function() {
                me.dispatch(jsf.event.ON_CHANGE, null);
            }

            this._R.onchange = this._G.onchange = this._B.onchange = function() {
                if (me._no_change){
                    return;
                }
                
                me.color('#' + toHex(me._R.value) + toHex(me._G.value) + toHex(me._B.value));
                me.render();
            }

            this._H.onchange = function() {
                if (me._no_change){
                    return;
                }
                
                me.color(this.value);
                me.redraw();
            }

            this._elMask1.onmousedown = function(evt) {
                this._md = true;
                this.onmousemove(evt);
            }

            this._elMask1.onmousemove = function(evt) {
                if (!this._md){
                    return;
                }
                
                evt = jsf.event.MouseEvent(evt);

                var r = jsf.util.Dom.rect(this), x = (evt.x - r.left) - 5, y = (evt.y - r.top) - 5;

                if (x < 0) x = 0;
                if (y < 0) y = 0;
                if (x > 150) x = 150;
                if (y > 150) y = 150;

                me._xx = x;
                me._yy = y;

                me.render();
            }

            this._elColor.onmousedown = function(evt) {
                this._md = true;
                this.onmousemove(evt);
            }

            this._onmouseup = function(evt) {
                this._elColor._md = false;
                this._elMask1._md = false;
            }

            this._elColor.onmousemove = function(evt) {
                var r;
                
                if (!this._md){
                    return;
                }
                
                r = jsf.util.Dom.rect(this);

                evt = jsf.event.MouseEvent(evt);
                me._y = (evt.y - r.top);

                me.render();
            }

            this._applyProperties(properties);
        },
        _event: {
            
        },
        _property:{
            color: {
                type:"String",
                get:function(){
                    return this._color;
                },
                set:function(value){
                    var 
                        rgb = hexToRgb(value, {r: 255, g: 255, b: 255}),
                        hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

                    //define a cor da máscara

                    //posição y do seletor vertical
                    this._y = hsv.h*150;

                    //posição x e y do círculo
                    this._xx = hsv.v*150;
                    this._yy = (1-hsv.s)*150;

                    this._color = value;
                }
            }
        },
        _public: {
            render: function() {
                var h, s, v, rgb, hsv;

                h = this._y / 150;
                s = 1 - (this._yy / 150);
                v = (this._xx / 150);

                //cor do fundo. (máscara)
                rgb = hsvToRgb(h, 1, 1);
                this._elMask2.style.backgroundColor = rgbToHex(rgb.r, rgb.g, rgb.b);

                //cor atual
                rgb = hsvToRgb(h, s, v);
                this._color = rgbToHex(rgb.r, rgb.g, rgb.b);
                this._elPreview.style.backgroundColor = this._color;

                //valores das caixas de texto
                this._no_change = true;
                this._R.value = Math.round(rgb.r * 255);
                this._G.value = Math.round(rgb.g * 255);
                this._B.value = Math.round(rgb.b * 255);
                this._H.value = this._color;
                this._no_change = false;

                //posição do indicador vertical e do círculo
                this._elIndic.style.top = (this._y + 6) + 'px';
                this._elMask1.childNodes[1].style.left = this._xx + 'px';
                this._elMask1.childNodes[1].style.top = this._yy + 'px';

                return this;
            }
        },
        _static: {
            show: function(rect, date, callbackItemClick) {
                var app = jsf.System.application();

                if (!popupCalendar) {
                    popupCalendar = jsf.System.application().add(new jsf.JCalendar());
                }

                if (date) {
                    popupCalendar.date(date);
                }

                //coloca o popup na aplicação
                jsf.Dom.style(popupCalendar._canvas, {
                    visibility: 'hidden',
                    display: null
                });
                app._canvas.appendChild(popupCalendar._canvas);

                popupCalendar.left(rect.left + rect.width - popupCalendar._canvas.offsetWidth);
                popupCalendar.top(rect.top + rect.height);

                callback = callbackItemClick;

                jsf.Popup.add({
                    target: popupCalendar,
                    shadow: true,
                    showEffect: {
                        properties: {
                            visibility: {from: ''},
                            display: {from: ''},
                            height: {from: 0, to: popupCalendar._canvas.offsetHeight + 'px'}
                        }
                    }
                });
            }
        }
    });

//private vars:
    var colorPickerPopup;

//private functions
    function colorPickerPopup_change(sender, color) {
        if (colorPickerPopup.__onChange) {
            colorPickerPopup.__onChange(color);
            delete(colorPickerPopup.__onChange);
        }

        js.popup.remove(colorPickerPopup);
    }

    function coord(value, max, min, pixels) {
        var mousePercent = value * 100 / pixels;
        var valueTotal = max - min;
        var valueMouse = parseInt(min + (valueTotal * mousePercent / max));
        return parseInt(valueMouse * 255 / 100);
    }

    function toHex(color) {
        color = parseInt(color).toString(16);
        return color.length < 2 ? "0" + color : color;
    }
    ;

    function hsvToRgb(hue, value, saturation) { //troquei saturation com value pq a imagem original é diferente
        var red;
        var green;
        var blue;
        if (value == 0.0) {
            red = 0;
            green = 0;
            blue = 0;
        } else {
            var i = Math.floor(hue * 6);
            var f = (hue * 6) - i;
            var p = value * (1 - saturation);
            var q = value * (1 - (saturation * f));
            var t = value * (1 - (saturation * (1 - f)));
            switch (i)
            {
                case 1:
                    red = q;
                    green = value;
                    blue = p;
                    break;
                case 2:
                    red = p;
                    green = value;
                    blue = t;
                    break;
                case 3:
                    red = p;
                    green = q;
                    blue = value;
                    break;
                case 4:
                    red = t;
                    green = p;
                    blue = value;
                    break;
                case 5:
                    red = value;
                    green = p;
                    blue = q;
                    break;
                case 6: // fall through
                case 0:
                    red = value;
                    green = t;
                    blue = p;
                    break;
            }
        }
        return {r: red, g: green, b: blue};
    }

    function rgbToHsv(red, green, blue) {
        var max = Math.max(Math.max(red, green), blue);
        var min = Math.min(Math.min(red, green), blue);
        var hue;
        var saturation;
        var value = max;

        if (min == max) {
            hue = 0;
            saturation = 0;
        } else {
            var delta = (max - min);

            saturation = delta / max;

            if (red == max) {
                hue = (green - blue) / delta;
            } else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            } else {
                hue = 4 + ((red - green) / delta);
            }

            hue /= 6;
            if (hue < 0) {
                hue += 1;
            }

            if (hue > 1) {
                hue -= 1;
            }
        }

        return {
            h: hue,
            v: saturation, //troquei saturation com value
            s: value
        };
    }
    ;

    function rgbToHex(r, g, b) {
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        r = r.toString(16);
        if (r.length == 1)
            r = '0' + r;

        g = g.toString(16);
        if (g.length == 1)
            g = '0' + g;

        b = b.toString(16);
        if (b.length == 1)
            b = '0' + b;

        return ('#' + r + g + b).toUpperCase();
    }
    ;

    function hexToRgb(hex_string, default_) {
        var r, g, b;

        if (default_ == undefined) {
            default_ = null;
        }

        if (!hex_string) {
            return {r: 1, g: 1, b: 1};
        }

        if (hex_string.substr(0, 1) == '#') {
            hex_string = hex_string.substr(1);
        }

        if (hex_string.length == 3) {
            r = hex_string.substr(0, 1);
            r += r;
            g = hex_string.substr(1, 1);
            g += g;
            b = hex_string.substr(2, 1);
            b += b;
        } else if (hex_string.length == 6) {
            r = hex_string.substr(0, 2);
            g = hex_string.substr(2, 2);
            b = hex_string.substr(4, 2);
        } else {
            return default_;
        }

        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return default_;
        } else {
            return {r: r / 255, g: g / 255, b: b / 255};
        }
    }
    ;

    function colorChanged(r, g, b) {
        var hex = rgbToHex(r, g, b);
        var hueRgb = hsvToRgb(hsv.h, 1, 1);
        var hueHex = rgbToHex(hueRgb.r, hueRgb.g, hueRgb.b);

        /*inputBox.style.background = hex;
         inputBox.value =hex;
         // popox ideea
         if(((rgb.r*100+rgb.g*100+rgb.b*100)/3)<65) //change text color to white if the background color is to dark
         inputBox.style.color="#fff";
         else inputBox.style.color="#000";*/

        return {
            hueHex: hueHex,
            huePos: (hsv.h * 199) - 5,
            left: (hsv.v * 150) - 10,
            top: ((1 - hsv.s) * 150) - 10
        };
    }
}());