"use strict";

(function() {
    var val = navigator.userAgent.toLowerCase(), b;

    define("jsf.managers.BrowserManager", {
        _alias: "jsf.BrowserManager",
        _static: {
            isIE: false,
            isIE7: false,
            isIE8: false,
            isIE9: false,
            isFF: false,
            isOP: false,
            isSafari: false,
            isChrome: false,
            isWebKit: false,
            isGecko: false,
            // True if this browser supports disabling async mode on dynamically
            // created script nodes. See
            // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            async: document.createElement('script').async === true
        }
    });

    b = jsf.managers.BrowserManager;

    if (val.indexOf("chrome") > -1) {
        b.isChrome = true;
    } else if (val.indexOf("firefox") > -1) {
        b.isFF = true;
    } else if (val.indexOf("opera") > -1) {
        b.isOP = true;
    } else if (val.indexOf("msie") > -1) {
        b.isIE = true;
        b.isIE7 = val.indexOf("msie 7") > -1;
        b.isIE8 = val.indexOf("msie 8") > -1;
        b.isIE9 = val.indexOf("msie 9") > -1;
    } else if (val.indexOf("safari") > -1) {
        b.isSafari = true;
    }

    if (val.indexOf("webkit") > -1) {
        b.isWebKit = true;
    } else if (val.indexOf("gecko") > -1) {
        b.isGecko = true;
    }

    b.jsCssPrefix = b.isWebKit ? 'webkit' :
            b.isFF ? '' :
            b.isOP ? 'O' :
            b.isIE ? 'ms' : '';
}());
