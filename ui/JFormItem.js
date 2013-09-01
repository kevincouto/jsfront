"use strict";

(function(){
    define("jsf.ui.JFormItem", {
        _require: ["jsf.ui.JContainer"],
        _extend: "container",
        _alias: "jsf.JFormItem",
        _xtype: "formitem",
        
        _constructor: function(properties) {
            jsf.ui.JContainer.call(this);
            
            this._itensMaxWidth = 0;
            this._canvas.innerHTML = '<div class="formitem_client"><div class="formitem_caption"></div></div>';
            this._client = this._canvas.firstChild;
            this._caption_el = this._client.childNodes[0];

            this._applyProperties(properties);
        },
        _event: {
            resize: function(){}
        },
        _property: {
            caption:{
                type:"String",
                get: function(){
                    return this._caption;
                },
                set: function(value){
                    this._captionChanged = true;
                    this._caption = value;
                    this._caption_el.innerHTML = '<div class="formitem_subcaption">' + value + '</div>';
                }
            },
            requerid:{
                type:"Boolean",
                get: function(){
                    return this._requerid;
                },
                set: function(value){
                    this._requerid = value;
                }
            }            
        },
        _method: {
            render: function(){
                if (this._captionChanged){
                    calculateCaptionWidth(this);
                }                
                
                delete(this._captionChanged);
            }
        }
        
    });

//private functions:
    function calculateCaptionWidth(formItem){
         var 
            p, i, children,
            w = 0, m;

        p = formItem.parent();

        if (p){
            children = p.children();
            for (i=0; i<children.length; i++){
                if (children[i] instanceof jsf.ui.JFormItem){
                    m = jsf.util.Dom.textMetrics(children[i]._caption_el.firstChild.innerHTML, null, "formitem_caption");
                    if (m.width > w){
                        w = m.width;
                    }
                }
            }
            
            for (i=0; i<children.length; i++){
                if (children[i] instanceof jsf.ui.JFormItem){
                    children[i]._itensMaxWidth = w;
                    children[i]._caption_el.firstChild.style.width = w + 'px';
                }
            }
        }
    }
    
}());
