"use strict";
(function(){
    
    define("jsf.ui.JMenubar",{
        _require: ["jsf.ui.JContainer"],
        _extend: "container",
        _alias: "jsf.JMenubar",
        _xtype: "menubar",
        
        _constructor : function(properties){
            jsf.JContainer.call(this, properties);
            this._align = 'top';
            this._applyProperties(properties);
        },
        
        _event:{
            mousedown: function(element) {
                setActiveElement(this, element);
            },
            mouseover: function(element) {
                if (this._activeElement){
                    setActiveElement(this, element);
                }else{
                    updateCssRule(this, element, "item over");
                }
            },
            mouseout: function(element) {
                updateCssRule(this, element, "item");
            },
            menuhide: function(menu){
                var e = this._activeElement;
                this._activeElement=null;
                updateCssRule(this, e, "item");
            }
        },
        
        _property:{
            itens: {
                type:"Array",
                get: function(){
                    return this._itens;
                },
                set: function(value){
                    this._itens = value;
                    this._itensCreated = false;
                }
            },
            
            menubarStyle: {
                type:"String",
                get: function(){
                    return this._toolbarStyle;
                },
                set: function(value){
                    this._toolbarStyle = value;
                }
            }
        },
        
        _public: {
            render: function(){
                createItens(this);
            }
        }
    });
    
//private functions
    function setActiveElement(menubar, element){
        var 
            menu, r,
            id = element.getAttribute("menuId"),
            e  = menubar._activeElement;
        
        if ( id ){
            menu = jsf.Control.get(id);
            menubar._activeElement = null;

            if (e){
                jsf.managers.PopupManager.remove( jsf.Control.get(e.getAttribute("menuId")) );
                updateCssRule(menubar, e, "item");
            }
            
            //exibe o menu
            if (menu){
                r = jsf.Dom.rect(element);
                menu.shadow(true);
                jsf.managers.PopupManager.add({
                    target: menu,
                    owner:  menubar,
                    position:{
                        x: r.left,
                        y: r.top + r.height
                    },
                    onhide: menubar._onmenuhide
                });
            }
            updateCssRule(menubar, element, "item down");
            menubar._activeElement = element;
        }
    }
    
    function updateCssRule(component, element, cls){
        if (element && element.getAttribute("menuId") && !component._activeElement && component._activeElement!=element && element.getAttribute('_captureMouseEvent') ){
            element.className = cls;
            component._updateCssRule();
        }
    }
    
    function createItens(component){
        var 
            i, c, html="";
        
        if (component._itensCreated){
            return;
        }
        
        if (component._itens){
            for (i=0; i<component._itens.length; i++){
                c = component.module()[ component._itens[i] ];
                if (c){
                    html += '<div menuId="' + c.id() + '" class="item" _captureMouseEvent="true">'+
                                '<div>' + (c._caption || component._itens[i]) + '</div>'+
                                '<span class="item-r"></span>'+
                            '</div>';
                }
            }
        }
        
        component._client.innerHTML = html;
        component._itensCreated = true;
    }
}());
