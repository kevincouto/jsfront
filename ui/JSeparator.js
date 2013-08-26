"use strict";

define("jsf.ui.JSeparator", {
    _require: ["jsf.ui.DisplayObject"],
    _extend: "display",
    _alias: "jsf.JSeparator",
    _xtype: "separator",
    _constructor : function(properties){
        jsf.Display.call(this);
        this._applyProperties(properties);
    }
});
