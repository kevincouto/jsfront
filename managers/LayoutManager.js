"use strict";

var Layout = {};
(function() {
//private vars:
    var cssFloat;

//private functions:
    function _setPos(component, x, y, w, h) {
        var style = component._canvas.style;

        component._canvas.style.left = x + 'px';
        component._canvas.style.top = y + 'px';

        if (w != null || h != null) {
            if (w != null && w >= 0) {
                style.width = w + 'px';
            }

            if (h != null && h >= 0) {
                style.height = h + 'px';
            }
        }
    }

    function _alignChildsAbsolute(container) {
        var i, t = [], l = [], r = [], b = [], c = [], ct = [],
                w = container._client.clientWidth,
                h = container._client.clientHeight,
                children = container.children(),
                x = 0, y = 0,
                px = container._grap, py = container._grap, pr = container._grap, pb = container._grap;

        // coloca cada componente em um array especifico de acordo com align
        for (i = 0; i < children.length; i++) {
            children[i]._canvas.style.position = 'absolute';

            if (!(children[i]._style && children[i]._style.marginLeft != '')) {
                children[i]._canvas.style.marginLeft = 0;
            }

            if (!(children[i]._style && children[i]._style.marginRight != '')) {
                children[i]._canvas.style.marginRight = 0;
            }

            children[i]._canvas.style[cssFloat] = '';

            if (children[i]._visible) {
                switch (children[i]._align) {
                    case 'top' :
                        t.push(children[i]);
                        break;
                    case 'left' :
                        l.push(children[i]);
                        break;
                    case 'right' :
                        r.push(children[i]);
                        break;
                    case 'bottom' :
                        b.push(children[i]);
                        break;
                    case 'center' :
                    case 'hcenter':
                    case 'vcenter':
                        ct.push(children[i]);
                        break;
                    case 'client' :
                        c.push(children[i]);
                        break;
                    default:
                        if (children[i]._horizontalCenter != null) {
                            jsf.Dom.style(children[i], {
                                left: "50%",
                                marginLeft: ((-(children[i]._canvas.offsetWidth / 2)) + children[i]._horizontalCenter) + "px"
                            });
                        }

                        if (children[i]._verticalCenter != null) {
                            jsf.Dom.style(children[i], {
                                top: "50%",
                                marginTop: ((-(children[i]._canvas.offsetHeight / 2)) + children[i]._verticalCenter) + "px"
                            });
                        }
                }
            }
        }

        // alinha os tops
        for (i = 0; i < t.length; i++) {
            py += t[i]._marginTop;
            _setPos(t[i], px + t[i]._marginLeft, py, w - pr - px - t[i]._marginRight - t[i]._marginLeft, null);

            if (i > 0) {
                t[i]._topElement = t[i - 1];
            }

            py += t[i]._canvas.offsetHeight + t[i]._marginBottom + container._grap;
        }

        // alinha os bottoms
        for (i = 0; i < b.length; i++) {
            pb += b[i]._marginBottom;

            _setPos(b[i], px + b[i]._marginLeft, h - pb - b[i]._canvas.offsetHeight, w - pr - px - b[i]._marginRight - b[i]._marginLeft, null);

            if (i > 0) {
                b[i]._bottomElement = b[i - 1];
            }

            pb += b[i]._canvas.offsetHeight + b[i]._marginTop + container._grap;
        }

        // alinha os lefts
        for (i = 0; i < l.length; i++) {
            px += l[i]._marginLeft;

            _setPos(l[i], px, py + l[i]._marginTop, null, h - pb - py - l[i]._marginBottom - l[i]._marginTop);
            if (i > 0) {
                l[i]._leftElement = l[i - 1];
            }

            px += l[i]._canvas.offsetWidth + l[i]._marginRight + container._grap;
        }

        // alinha os rights
        for (i = 0; i < r.length; i++) {
            pr += r[i]._marginRight;

            _setPos(r[i], w - pr - r[i]._canvas.offsetWidth, py + r[i]._marginTop, null, h - pb - py - r[i]._marginBottom - r[i]._marginTop);

            if (i > 0) {
                r[i]._rightElement = r[i - 1];
            }

            pr += r[i]._canvas.offsetWidth + r[i]._marginLeft + container._grap;
        }

        // alinha os clients
        for (i = 0; i < c.length; i++) {
            x = px + c[i]._marginLeft;
            y = py + c[i]._marginTop;

            _setPos(c[i], x, y, w - x - pr - c[i]._marginRight, h - pb - py - c[i]._marginBottom - c[i]._marginTop);
        }

        // alinha os centers
        for (i = 0; i < ct.length; i++) {
            x = (ct[i]._align == 'center' || ct[i]._align == 'hcenter') ? (w / 2) - (ct[i]._canvas.offsetWidth / 2) : null;
            y = (ct[i]._align == 'center' || ct[i]._align == 'vcenter') ? (h / 2) - (ct[i]._canvas.offsetHeight / 2) : null;

            if (x !== null) {
                ct[i]._canvas.style.left = x + 'px';
            }

            if (y !== null) {
                ct[i]._canvas.style.top = y + 'px';
            }
        }
    }

    function _alignChildsHorizontal(container) {
        var i, w = 0, w2, h, h2, x = 0, y = 0, q = container.children().length, children = container.children(),
                gt, g = container._grap;

        switch (container._flex) {
            case 0 :// o container é dividido horizontalmente em partes iguais,
                // uma para cada filho. cadas filho assume a largura definida
                gt = (q + 1) * g;
                w = (container._client.clientWidth - gt) / q;

                for (i = 0; i < q; i++) {
                    if (children[i]._visible) { // aplica apenas para os componentes visáveis
                        w2 = w - (children[i]._marginLeft + children[i]._marginRight);
                        y = children[i]._marginTop + g;
                        x += children[i]._marginLeft + g;
                        children[i]._canvas.style.top = y + 'px';
                        children[i]._canvas.style.left = x + 'px';
                        children[i]._canvas.style.width = w2 + 'px';
                        children[i]._canvas.style.position = 'absolute';
                        children[i]._canvas.style.marginLeft = 0;
                        children[i]._canvas.style.marginRight = 0;
                        children[i]._canvas.style.marginTop = 0;
                        children[i]._canvas.style.marginBottom = 0;
                        children[i]._canvas.style[cssFloat] = '';
                        x += children[i]._marginRight;
                        x += w2;
                    }
                }
                break;

            case 1 :// cada filho permanesce no seu tamanho original, e dispostos horizotalmente
                for (i = 0; i < q; i++) {
                    if (children[i]._visible) {
                        y = children[i]._marginTop + g;
                        x += children[i]._marginLeft + g;
                        children[i]._canvas.style.top = y + 'px';
                        children[i]._canvas.style.left = x + 'px';
                        children[i]._canvas.style.position = 'absolute';
                        children[i]._canvas.style.marginLeft = 0;
                        children[i]._canvas.style.marginRight = 0;
                        children[i]._canvas.style.marginTop = 0;
                        children[i]._canvas.style.marginBottom = 0;
                        children[i]._canvas.style[cssFloat] = '';
                        x += children[i]._marginRight;
                        x += children[i]._canvas.offsetWidth;
                    }
                }
                break;

            case 2 :// cada filho assume a altura do container, e ficam dispostos horizotalmente
                h = container._client.clientHeight - (g * 2);
                for (i = 0; i < q; i++) {
                    if (children[i]._visible) {
                        y = children[i]._marginTop + g;
                        x += children[i]._marginLeft + g;
                        h2 = h - (children[i]._marginTop + children[i]._marginBottom);
                        children[i]._canvas.style.top = y + 'px';
                        children[i]._canvas.style.left = x + 'px';
                        children[i]._canvas.style.height = h2 + 'px';
                        children[i]._canvas.style.position = 'absolute';
                        children[i]._canvas.style.marginLeft = 0;
                        children[i]._canvas.style.marginRight = 0;
                        children[i]._canvas.style.marginTop = 0;
                        children[i]._canvas.style.marginBottom = 0;
                        children[i]._canvas.style[cssFloat] = '';
                        x += children[i]._marginRight;
                        x += children[i]._canvas.offsetWidth;
                    }
                }
                break;

            case 3 :// os filhos juntos, ocupar&atilde;o todo o container, e ficam dispostos horizotalmente
                gt = (q + 1) * g;
                h = container._client.clientHeight - (g * 2);
                w = (container._client.clientWidth - gt) / q;
                for (i = 0; i < q; i++) {
                    if (children[i]._visible) {
                        y = children[i]._marginTop + g;
                        x += children[i]._marginLeft + g;
                        h2 = h - (children[i]._marginTop + children[i]._marginBottom);
                        w2 = w - (children[i]._marginLeft + children[i]._marginRight);
                        children[i]._canvas.style.top = y + 'px';
                        children[i]._canvas.style.left = x + 'px';
                        children[i]._canvas.style.height = h2 + 'px';
                        children[i]._canvas.style.width = w2 + 'px';
                        children[i]._canvas.style.position = 'absolute';
                        children[i]._canvas.style.marginLeft = 0;
                        children[i]._canvas.style.marginRight = 0;
                        children[i]._canvas.style.marginTop = 0;
                        children[i]._canvas.style.marginBottom = 0;
                        children[i]._canvas.style[cssFloat] = '';
                        x += children[i]._marginRight;
                        x += w2;
                    }
                }
                break;
        }
    }

    function _alignChildsVertical(container) {
        var i, w = 0, w2, h, h2 = 0, x = 0, y = 0, children = container.children(), q = children.length,
                gt, g = container._grap;

        switch (container._flex) {
            case 0 : // o container é dividido verticalmente em partes iguais, uma para cada filho. cadas filho assume a altura definida
                gt = (q + 1) * g;
                h = (container._client.clientHeight - gt) / q;

                for (i = 0; i < q; i++) {
                    if (children[i]._visible) { // tá visivel
                        h2 = h - (children[i]._marginTop + children[i]._marginBottom);
                        x = children[i]._marginLeft + g;
                        y += children[i]._marginTop + g;
                        children[i]._canvas.style.top = y + 'px';
                        children[i]._canvas.style.left = x + 'px';
                        children[i]._canvas.style.height = h2 + 'px';
                        children[i]._canvas.style.position = 'absolute';
                        children[i]._canvas.style.marginLeft = 0;
                        children[i]._canvas.style.marginRight = 0;
                        children[i]._canvas.style.marginTop = 0;
                        children[i]._canvas.style.marginBottom = 0;
                        children[i]._canvas.style[cssFloat] = '';
                        y += children[i]._marginBottom;
                        y += h2;
                    }
                }
                break;

            case 1 : // cada filho permanesce no seu tamanho original, e
                // dispostos verticalmente
                for (i = 0; i < q; i++) {
                    if (children[i]._visible) { // tá visivel
                        x = children[i]._marginLeft + g;
                        y += children[i]._marginTop + g;
                        children[i]._canvas.style.top = y + 'px';
                        children[i]._canvas.style.left = x + 'px';
                        children[i]._canvas.style.position = 'absolute';
                        children[i]._canvas.style.marginLeft = 0;
                        children[i]._canvas.style.marginRight = 0;
                        children[i]._canvas.style.marginTop = 0;
                        children[i]._canvas.style.marginBottom = 0;
                        children[i]._canvas.style[cssFloat] = '';
                        y += children[i]._marginBottom;
                        y += children[i]._canvas.offsetHeight;
                    }
                }
                break;

            case 2 :// cada filho assume a largura do container, e ficam
                // dispostos verticalmente
                w = container._client.clientWidth - (g * 2);
                for (i = 0; i < q; i++) {
                    if (children[i]._visible) { // tá visivel
                        x = children[i]._marginLeft + g;
                        y += children[i]._marginTop + g;
                        w2 = w - (children[i]._marginLeft + children[i]._marginRight);
                        children[i]._canvas.style.top = y + 'px';
                        children[i]._canvas.style.left = x + 'px';
                        children[i]._canvas.style.width = w2 + 'px';
                        children[i]._canvas.style.position = 'absolute';
                        children[i]._canvas.style.marginLeft = 0;
                        children[i]._canvas.style.marginRight = 0;
                        children[i]._canvas.style.marginTop = 0;
                        children[i]._canvas.style.marginBottom = 0;
                        children[i]._canvas.style[cssFloat] = '';
                        y += children[i]._marginBottom;
                        y += children[i]._canvas.offsetHeight;
                    }
                }
                break;

            case 3 :// os filhos juntos, ocupar&atilde;o todo o container, e
                // ficam dispostos verticalmente
                gt = (q + 1) * g;
                w = container._client.clientWidth - (g * 2);
                h = (container._client.clientHeight - gt) / q;
                for (i = 0; i < q; i++) {
                    if (children[i]._visible) { //tá visivel
                        x = children[i]._marginLeft + g;
                        y += children[i]._marginTop + g;
                        h2 = h - (children[i]._marginTop + children[i]._marginBottom);
                        w2 = w - (children[i]._marginLeft + children[i]._marginRight);
                        h2 = h2 < 0 ? 0 : h2; // for ie7
                        w2 = w2 < 0 ? 0 : w2; // for ie7
                        children[i]._canvas.style.top = y + 'px';
                        children[i]._canvas.style.left = x + 'px';
                        children[i]._canvas.style.height = h2 + 'px';
                        children[i]._canvas.style.width = w2 + 'px';
                        children[i]._canvas.style.position = 'absolute';
                        children[i]._canvas.style.marginLeft = 0;
                        children[i]._canvas.style.marginRight = 0;
                        children[i]._canvas.style.marginTop = 0;
                        children[i]._canvas.style.marginBottom = 0;
                        children[i]._canvas.style[cssFloat] = '';
                        y += children[i]._marginBottom;
                        y += h2;
                    }
                }
                break;
        }
    }

    function _alignChildsFloat(container) {
        var i, g = container._grap, children = container.children(), q = children.length;

        for (i = 0; i < q; i++) {
            children[i]._canvas.style.top = null;
            children[i]._canvas.style.left = null;
            children[i]._canvas.style.position = 'relative';
            children[i]._canvas.style.marginTop = (g + children[i]._marginTop) + 'px';
            children[i]._canvas.style.marginBottom = (g + children[i]._marginBottom) + 'px';
            children[i]._canvas.style.marginLeft = (g + children[i]._marginLeft) + 'px';
            children[i]._canvas.style.marginRight = (g + children[i]._marginRight) + 'px';
            children[i]._canvas.style[cssFloat] = 'left';
        }
    }

    function _alignChildsGrid(container) {
        var cols = 2, itens = container.children(true), q = itens.length, r, c, i, j;

        if (!container._grid_layout) {
            container._grid_layout = Dom.create('table', 'position:absolute');
            container._grid_layout.border = 0;

            for (i = 0; i < q; i++) {
                r = container._grid_layout.insertRow(container._grid_layout.rows.length);
                for (j = 0; j < cols; j++) {
                    if (itens[i]) {
                        c = r.insertCell(j);
                        c.vAlign = 'middle';
                        c.appendChild(itens[i]._canvas);

                        itens[i]._canvas.style.top = null;
                        itens[i]._canvas.style.left = null;
                        itens[i]._canvas.style.position = 'relative';
                    }

                    i++;
                }
                i--;
            }

            (container._scrollArea || container._client).appendChild(container._grid_layout);
        }

        i = (container._client.offsetWidth / 2) - (container._grid_layout.offsetWidth / 2);

        container._grid_layout.style.left = i + 'px';

        container._scrollX = i + container._grid_layout.offsetWidth;
        container._scrollY = container._grid_layout.offsetHeight;
    }
    	
    define("jsf.managers.LayoutManager", {
        _alias: "jsf.Layout",
        _require: "jsf.managers.BrowserManager",
		
        _static: {
            render: function(container) {
                if (container && !(container._client.offsetWidth == 0 || container._children.length == 0)) {
                    switch (container._layout) {
                        case 'absolute' :
                            _alignChildsAbsolute(container);
                            break;
                        case 'horizontal' :
                            _alignChildsHorizontal(container);
                            //container.adjustHorizontal();
                            break;
                        case 'vertical' :
                            _alignChildsVertical(container);
                            break;
                        case 'float' :
                            _alignChildsFloat(container);
                            break;
                        case 'grid' :
                            _alignChildsGrid(container);
                            break;
                    }
                }
            },
			
            checkResize: function(control) {
                if (!control._init) {
                    return;
                }

                var a = (control._width != control._canvas.offsetWidth) || (control._height != control._canvas.offsetHeight);

                control._height = control._canvas.offsetHeight;
                control._width = control._canvas.offsetWidth;

                if (a) {
                    control._onresize();
                }
            }
        }
    }, function() {
        cssFloat = jsf.managers.BrowserManager.isFF ? 
            'cssFloat' : jsf.managers.BrowserManager.isIE ? 
            'styleFloat' : 
            'float';
    });
	
}());