"use strict";

(function() {

//private functions:
    function _adjustTop(t, e, r) {
        if ((t + e.offsetHeight) > System.height()) {
            t -= (e.offsetHeight + r.height);
        }

        if (t < 0) {
            t = 0;
        }

        return t;
    }

    //bottom|top left|right
    //bottom left
    function strPositionsToArray(pos) {
        var arr = [], a, b, i;

        a = pos.split(' ');

        for (i = 0; i < a.length; i++) {
            b = a[i].split('|');
            arr.push(b);
        }

        return arr;
    }

    function calculateTop(el, rect, margin) {
        var t = rect.top - el.offsetHeight - margin;

        if (t < 0) {
            t += margin;
        }

        return {
            value: t,
            validate: Boolean(t >= 0),
            position: 'top'
        };
    }

    function calculateLeft(el, rect, margin) {
        var l = rect.left - margin,
                w = jsf.Dom.getWidth(el.parentNode),
                v = true;

        if (l < 0) {
            v = 0;
        } else if (l + el.offsetWidth > w) {
            v = false;
        }

        return {
            value: l,
            validate: v,
            position: 'left'
        };
    }

    function calculateBottom(el, rect, margin) {
        var t = rect.top + rect.height + margin,
                h = t + el.offsetHeight,
                hh = jsf.Dom.getHeight(el.parentNode),
                v = true;

        if (h > hh) {
            t -= margin;
            h -= margin;
            if (h > hh) {
                v = false;
            }
        }

        return {
            value: t,
            validate: v,
            position: 'bottom'
        };
    }

    function calculateRight(el, rect, margin) {
        var l = rect.left + rect.width - el.offsetWidth - margin,
                v = true;

        if (l < 0) {
            v = false;
        }

        return {
            value: l,
            validate: v,
            position: 'right'
        };
    }

    define("jsf.util.Dom", {
        _alias: "jsf.Dom",
        _static: {
            get: function(el, att, value) {
                while (el) {
                    if (el[att] == value) {
                        return el;
                    }

                    el = el.parentNode;
                }
                return null;
            },
            getUI: function(el) {
                var ui = null;

                while (el) {
                    if (el._UI) {
                        ui = el._UI;
                        break;
                    }
                    el = el.parentNode;
                }

                return ui;
            },
            setDraggable: function(element, flag) {
                flag = flag === undefined ? true : flag;
                element.setAttribute("draggable", flag ? "true" : "false");
            },
            create: function(tagName, cssText, className) {
                var
                    htmlElement, i, a, attrs;
                
                a = tagName.split("[");
                tagName = a[0];
                attrs = a[1];
                
                htmlElement = document.createElement(tagName);
                
                if (attrs){
                    a = attrs.replace("]", "").split(",");
                    for (i=0; i<a.length; i++){
                        attrs = a[i].split("=");
                        htmlElement.setAttribute(attrs[0], attrs[1]);
                    }
                }
                
                if (cssText) {
                    htmlElement.style.cssText = cssText;
                }

                if (className) {
                    htmlElement.className = className;
                }

                return htmlElement;
            },
            moveChildren: function(from, to) {
                if (from && to && (from != to)) {
                    while (from.childNodes.length > 0) {
                        to.appendChild(from.childNodes[0]);
                    }
                }
            },
            remove: function(htmlElement) {
                try {
                    htmlElement.parentNode.removeChild(htmlElement);
                } catch (_e) {
                }
            },
            removeAll: function(htmlElement){
                var i, r = htmlElement.childNodes;
                
                for (i=0; i<r.length; i++){
                    htmlElement.removeChild(r[i]);
                }
                
                return r;
            },
            getStyle: function(o, property, camelProperty) {
                if (o == null) {
                    return null;
                }
                var val = null;

                camelProperty = property;// this._hyphen2camel(property); //ex: line-width para lineWidth

                // Handle "float" property as a special case
                /*
                 * if (property=="float") { val = jsf.Dom.getStyle(o,"cssFloat"); if
                 * (val==null) { val = jsf.Dom.getStyle(o,"styleFloat"); } } else
                 */
                if (o.currentStyle && o.currentStyle[camelProperty]) {
                    val = o.currentStyle[camelProperty];
                } else if (window.getComputedStyle) {
                    val = window.getComputedStyle(o, null).getPropertyValue(property);
                } else if (o.style && o.style[camelProperty]) {
                    val = o.style[camelProperty];
                }
                // For color values, make the value consistent across browsers
                // Convert rgb() colors back to hex for consistency
                /*
                 * if (/^\s*rgb\s*\(/.test(val)) { val = css.rgb2hex(val); } //
                 * Lowercase all #hex values if (/^#/.test(val)) { val =
                 * val.toLowerCase(); }
                 */
                return val;
            },
            rect: function(el, parent) {
                if (!el) {
                    return null;
                }

                el = el._canvas || el;

                var l = 0, t = 0, bl = 0, bt = 0, e = el, w, h;

                w = el.offsetWidth;
                h = el.offsetHeight;

                if (el.offsetParent) {
                    if (parent) {
                        parent = parent._canvas || parent;
                        while (el && el != parent) {
                            if (e != el) { // não pega a largura da borda do próprio elemento, pois a posição retornada deve ser a de fora.
                                bl = (parseInt(jsf.Dom.getStyle(el, 'border-left-width'), 10)) || 0;
                                bt = (parseInt(jsf.Dom.getStyle(el, 'border-top-width'), 10)) || 0;
                            }

                            l += el.offsetLeft - el.scrollLeft + bl;
                            t += el.offsetTop - el.scrollTop + bt;
                            el = el.offsetParent;
                        }
                    } else {
                        while (el) {
                            if (e != el) {
                                bl = (parseInt(jsf.Dom.getStyle(el, 'border-left-width'), 10)) || 0;
                                bt = (parseInt(jsf.Dom.getStyle(el, 'border-top-width'), 10)) || 0;
                            }

                            l += el.offsetLeft - el.scrollLeft + bl;
                            t += el.offsetTop - el.scrollTop + bt;
                            el = el.offsetParent;
                        }
                    }
                }

                return {
                    left: l,
                    top: t,
                    width: w,
                    height: h
                };
            },
            style: function(e, s) {
                var i = null;

                e = e._canvas || e;

                for (i in s) {
                    e.style[i] = s[i];
                }
            },
            /*
             * options:{
             *     rect       : Object,
             *     target     : HTMLElement||DisplayObject,
             *     position   : left|bottom top|right,
             *     paddingLeft: 0,
             *     paddingTop : 0,
             *     adjust: {
             *         top:true|false,
             *         autoHeight
             *     }
             * }
             */
            positionByRect: function(options) {
                options = options || {};

                var r = options.rect,
                        e = (options.target instanceof jsf.ui.DisplayObject) ? options.target._canvas : options.target,
                        paddingLeft = options.paddingLeft || 0,
                        paddingTop = options.paddingTop || 0,
                        paddingRight = options.paddingRight || 0,
                        paddingBottom = options.paddingBottom || 0,
                        p = 0, ot = {}, ol = {},
                        i, d, v = null, arr;

                arr = strPositionsToArray(options.position);

                d = e.style.display || '';

                jsf.Dom.style(e, {
                    visibility: 'hidden',
                    display: 'block',
                    top: null,
                    left: null,
                    right: null,
                    bottom: null
                });

                if (!e.parentNode) {
                    document.body.appendChild(e);
                }

                if (options.target.measureHeight) {
                    options.target.measureHeight();
                }

                for (p = 0; p < arr.length; p++) {
                    for (i = 0; i < arr[p].length; i++) {
                        v = arr[p][i];
                        switch (v) {
                            case 'top' :   // acima de r
                                if (!ot.validate) {
                                    ot = calculateTop(e, r, paddingTop);
                                }
                                break;

                            case 'bottom': // abaixo de r
                                if (!ot.validate) {
                                    ot = calculateBottom(e, r, paddingBottom);
                                }
                                break;

                            case 'left':   // à esquerda de r
                                if (!ol.validate) {
                                    ol = calculateLeft(e, r, paddingLeft);
                                }
                                break;

                            case 'right':  // à direita de r - width de e
                                if (!ol.validate) {
                                    ol = calculateRight(e, r, paddingRight);
                                }
                                break;
                        }
                    }
                }

                jsf.Dom.style(e, {
                    top: ot.value + 'px',
                    left: ol.value + 'px',
                    visibility: v,
                    display: d
                });

                if (options.target instanceof jsf.ui.DisplayObject) {
                    options.target.top(ot.value);
                    options.target.left(ol.value);
                }

                return {
                    leftValue: ol.value,
                    topValue: ot.value,
                    leftPos: ol.position,
                    topPos: ot.position
                };
            },
            getWidth: function(el) {
                if (el) {
                    return (el == document.body) ? (jsf.managers.BrowserManager.isIE ? document.documentElement.clientWidth : window.innerWidth) : el.offsetWidth;
                }
                return 0;
            },
            getHeight: function(el) {// altura do container da aplicação (geralmente o body)
                if (el) {
                    return (el == document.body) ? (jsf.managers.BrowserManager.isIE ? document.documentElement.clientHeight : window.innerHeight) : el.offsetHeight;
                }
                return 0;
            },
            setNodeDisplayable: function(div, parent) {
                div.style.visibility = 'hidden';
                div.style.display = 'block';
                parent.appendChild(div);
                return this;
            },
            setCenter: function(div) {
                var v = div.style.visibility || '',
                        d = div.style.display || '',
                        p = div.parentNode,
                        x, y;

                div.style.visibility = 'hidden';
                div.style.display = 'block';

                if (!p) {
                    p = document.body;
                    p.appendChild(div);
                }

                x = (jsf.Dom.getWidth(p) / 2) - (div.offsetWidth / 2);
                y = (jsf.Dom.getHeight(p) / 2) - (div.offsetHeight / 2);

                if (x < 0 || isNaN(x)) {
                    x = 0;
                }

                if (y < 0 || isNaN(y)) {
                    y = 0;
                }

                div.style.left = x + 'px';
                div.style.top = y + 'px';

                div.style.visibility = v;
                div.style.display = d;
                return this;
            },
            setOpacity: function(el, value) {
                if (Browser.isIE) {
                    el.style.filter = 'alpha(opacity=' + value * 10 + ')';
                }
                else {
                    el.style.opacity = value / 10;
                }
            },
            isChild: function(parent, child) {
                var i, p;

                if (child.parentNode == parent) {
                    return true;
                }


                p = parent.childNodes;

                for (i = 0; i < p.length; i++) {
                    if (jsf.Dom.isChild(p[i], child)) {
                        return true;
                    }
                }

                return false;
            },
            addClass: function(el, cls) {
                el = el instanceof jsf.ui.DisplayObject ? el.canvas() : el;

                var c = this.removeClass(el, cls);

                c += (c == '' ? '' : ' ') + cls;

                el.setAttribute('class', c);
                return c;
            },
            removeClass: function(el, cls) {
                var c = null;

                el = el instanceof jsf.ui.DisplayObject ? el.canvas() : el;

                if (el) {
                    c = el.getAttribute('class') || "";

                    c = c.replace(' ' + cls + ' ', ' ');
                    c = c.replace(' ' + cls, '');
                    c = c.replace(cls + ' ', '');

                    el.setAttribute('class', c);
                }

                return c;
            },
            measure: function(element) {
                var control = null, v, d, r, p = null;

                if (element instanceof jsf.ui.DisplayObject) {
                    control = element;
                    element = control._canvas;
                }

                v = element.style.visibility;
                d = element.style.display;

                element.style.visibility = 'hidden';
                element.style.display = '';

                if (!element.parentNode) {
                    p = true;
                    jsf.System.application().canvas().appendChild(element);
                }

                if (control) {
                    control.render();
                }

                r = {
                    top: element.offsetTop,
                    left: element.offsetLeft,
                    width: element.offsetWidth,
                    height: element.offsetHeight
                };

                element.style.visibility = v;
                element.style.display = d;

                if (p) {
                    jsf.Dom.remove(element);
                }

                return r;
            }
        }
    });
}());