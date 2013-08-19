"use strict";

(function(){
    define("jsf.olap.OLAPGrid", {
        _require: ["jsf.event.MouseEvent", "jsf.ui.DisplayObject", "jsf.util.Dom"],
        _alias: "jsf.OLAPGrid",
        _extend: "display",
        _xtype: "olapgrid",
        
        _constructor: function(properties) {
            jsf.Display.call(this);

            this._applyProperties(properties);
        },
    });

}());
