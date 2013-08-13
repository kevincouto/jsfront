"use strict";

(function() {
    var HASH;

    define("jsf.rpc.HttpService", {
        _alias: "jsf.HttpService",
        
        _static: /** @lends jsf.rpc.HttpService.prototype */ {
            encode: function(value) {
                if (HASH) {

                }

                return value;
            },
            /**
             * Carrega um arquivo a partir de uma url
             * @static
             * @param {String} url Endereço do arquivo que será carregado.
             * @param {Function} callback Função de retorno que será chamada após o carregamento completo.<br />
             * OBS: A função de retorno será chamada com um parâmtro contendo o conteúdo carregado.
             */
            getContent: function(url, callback) {
                var request = makeHttpObject();

                request.onreadystatechange = function() {
                    var content = '';

                    if (request.readyState == 4) {
                        content = request.responseText;

                        delete(request.onreadystatechange);

                        if (callback) {
                            callback(content);
                        }
                    }
                };

                request.open("GET", url);
                request.send(null);
            },
            /**
             * Carrega um arquivo a partir de uma url e interpreta o resultado.<br />
             * O resultado deve ser um JSON válido.
             * @static
             * @param {String} url Endereço do JSON a ser carregado.
             * @param {Function} callback Função de retorno que será chamada após o carregamento completo.<br />
             * OBS: A função de retorno será chamada com um parâmtro contendo um JSON.
             */
            get: function(url, callback) {
                var request = makeHttpObject();

                request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                        analizeResult(request, url, callback, 'GET');
                    }
                };

                request.open("GET", url);
                request.send(null);
            },
            post: function(data, url, callbackResult) {
                var cacheId, request = makeHttpObject(), r, ch = data.cache;

                delete(data.cache);

                //é para usar o cache
                if (ch) {
                    if (jsf.isBoolean(ch)) {
                        cacheId = jsf.core.Util.md5(getCacheId(url, data));
                    } else {
                        cacheId = ch;
                    }

                    //se o cache existe, retorna o conteúdo
                    r = sessionStorage.getItem(cacheId);
                    if (r && callbackResult) {
                        callbackResult(JSON.parse(r));
                        return;
                    }
                }

                request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                        analizeResult(request, url, callbackResult, 'POST', cacheId);
                    }
                };

                request.open("POST", url);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.send(prepareData(data));
            },
            socket: function(url) {
                var ws = new WebSocket("ws://" + url); // ex: "ws://localhost:9998/echo
                ws.onopen = function() {
                    // Web Socket is connected, send data using send()
                    ws.send("Message to send");
                    alert("Message is sent...");
                };
                ws.onmessage = function(evt) {
                    var received_msg = evt.data;
                    alert("Message is received..." + received_msg);
                };
                ws.onclose = function() {
                    // websocket is closed.
                    alert("Connection is closed...");
                };
            },
            download: function(url) {

            },
            STATUS_OK: 200,
            STATUS_CONFIRM: 4001,
            STATUS_AUTH: 4002,
            STATUS_EXPIRED: 4003,
            STATUS_EMPTY: 10010,
            STATUS_JSON_INVALID: 10011
        }
    });

    //limpa o cache
    sessionStorage.clear();

    function encrypt(actual, key) {
        var result = "", i;

        for (i = 0; i < actual.length; i++) {
            result += String.fromCharCode(key ^ actual.charCodeAt(i));
        }

        return result;
    }

    function decrypt(actual, key) {
        var result = "", i;

        for (i = 0; i < actual.length; i++) {
            result += String.fromCharCode(key ^ actual.charCodeAt(i));
        }

        return result;
    }

    function makeHttpObject() {
        try {
            return new XMLHttpRequest();
        } catch (_e1) {
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (_e2) {
        }
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (_e3) {
        }

        throw new Error("Could not create HTTP request object.");
    }

    function prepareData(data) {
        var r = '', e = '', v, i = null,
                re1 = new RegExp("&/g"),
                re2 = new RegExp("=/g"),
                re3 = new RegExp("\\+/g");

        for (i in data) {
            v = data[i];
            if (v === null || v === undefined) {
                v = '';
            } else {
                if (jsf.isString(v)) {
                    v = v.replace(re1, "**am**");
                    v = v.replace(re2, "**eq**");
                    v = v.replace(re3, "**pl**");
                }
            }

            r += e + (i + '=' + (v));
            e = '&';
        }

        return r;
    }

    function parseJSON(data) {
        var o;

        if (data == '') { //página em branco
            o = {
                statusText: 'empty content',
                result: null,
                status: jsf.rpc.HttpService.STATUS_EMPTY
            };
        } else {
            try {
                o = JSON.parse(data);
            } catch (_e) {
                o = null;
            }

            if (o) { //json ok
                o = {
                    statusText: o.statusText || 'OK',
                    data: o.data,
                    status: o.status == "success" ? jsf.rpc.HttpService.STATUS_OK : o.status
                };
                HASH = o.hash;
            } else { //json inválido
                o = {
                    statusText: 'invalid JSON',
                    data: data,
                    status: jsf.rpc.HttpService.STATUS_JSON_INVALID
                };
            }
        }

        return o;
    }

    function analizeResult(request, url, callbackResult, requestMethod, cacheId) {
        var r;

        if (request.status == 200) {
            r = parseJSON(request.responseText);
        } else {
            r = {
                status: request.status,
                statusText: request.statusText
            };
        }

        r.requestMethod = requestMethod;
        r.requestURL = url;

        delete(request.onreadystatechange);

        //se o resultado foi ok, guarda no cache
        if (r.status == jsf.rpc.HttpService.STATUS_OK && cacheId) {
            sessionStorage.setItem(cacheId, JSON.stringify(r));
        }

        if (callbackResult) {
            callbackResult(r);
        }
    }

    function getCacheId(url, data) {
        var i, s = url;

        for (i in data) {
            s += data[i] ? String(data[i]) : "";
        }

        return s;
    }
	
}());