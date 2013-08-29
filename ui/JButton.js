"use strict";

(function(){

    define("jsf.ui.JButton",{
        _require: ["jsf.event.MouseEvent", "jsf.ui.DisplayObject", "jsf.util.Dom"],
        _alias: "jsf.JButton",
        _extend: "display",
        _xtype: "button",
        
        _config:{
            icon: 1, //define o índice(dentro do arquivo package.png) do ícone do componente.
            hasChild: false, //define se o componente pode ou não, ser adicionado diretamente em um container
            parents:["jsf.ui.JToolbar"] //define a lista de containers pai do componente (o componente só poderá ser filho de um dos container da lista)
        },
        
        _constructor : function(properties){
            jsf.Display.call(this);
            
            this._el_caption = this._client.firstChild;
            this._iconAlign = "center";
            this._applyProperties(properties);
        },
        
        _static: {
            IA_LEFT  : 'left',
            IA_TOP   : 'top',
            IA_RIGHT : 'right',
            IA_BOTTOM: 'bottom',
            BS_NORMAL: 'normal',
            BS_ACTION: 'action',
            BS_DANGER: 'danger'
        },
        
        _protected: {
            focuset   : true,
            iconAlign : 'left',
            border    : true
        },
        
        _event: {
            mousedown : function() {        
                var ui, me=this;
                
                if (this._group) {
                    this._selected = true;
                }
                
                if (this._popup) {
                    ui = jsf.Control.get(this._popup);
                    
                    if (ui){
                        jsf.Popup.add({
                            shadow: true,
                            target: ui,
                            owner : this,
                            position:'left|bottom right|top',
                            onhide: function(){
                                me._popupVisible = false;
                                me.render();
                            }
                        });
                        this._popupVisible = true;
                    }
                }
                
                this.updateDisplay();
            },
            mouseup : function() {
                if (this._togglet) {
                    this.selected(!this.selected());
                }
                
                this.updateDisplay();
            },
            menuhide : function() {
                this.selected(false);
            }
        },
        
        _property: {
            height:{
                value:30
            },
            width:{
                value:100
            },
            caption: {
                type: "String",
                get: function() {
                    return this._caption;
                },
                set: function(value) {
                    this._client.innerHTML = this._caption = value;
                }
            },
            
            popup: {
                type: "{jsf.ui.DisplayObject}",
                get: function() {
                    return this._popup;
                },
                set: function(value) {
                    this._popup = value;
                }
            },
            
            sprites: {
                type: "{jsf.core.Sprite}",
                get: function() {
                    return this._sprites;
                },
                set: function(value) {
                    this._sprites = value;
                    
                    if (this._el_icon){
                        this.updateDisplay();
                    }
                }
            },
            
            icon: {
                type: "Number",
                get: function() {
                    return this._icon;
                },
                set: function(value) {
                    this._icon = value;
                    
                    if (this._icon >= 0 && !this._el_icon){
                        this._el_icon = this._client.insertBefore(jsf.Dom.create('div', null, "icon left"), this._client.firstChild);
                    }
                    
                    if (this._sprites){
                        this.updateDisplay();
                    }
                }
            },
            
            //ícone mostrado quando o botão estiver desabilitado
            iconMap: {
                type:"Array",
                get: function() {
                    return this._iconMap;
                },
                set: function(value) {
                    this._iconMap = value;
                    if (!this._el_icon){
                        createIcon(this);
                    }
                }
            },
            
            iconAlign: {
                type:"String",
                get: function() {
                    return this._iconAlign;
                },
                set: function(value) {
                    this._iconAlign = value;

                    if (this._el_icon){
                        this.updateDisplay();
                    }
                }
            },
            
            buttonStyle: {
                type: "String",
                get: function() {
                    return this._buttonStyle;
                },
                set: function(value){
                    this._buttonStyle = value;
                    this._rules.custom = " " + value;
                    this.updateDisplay();
                }
            },
            
            group: {
                type: "String",
                get: function() {
                    return this._group;
                },
                set: function(value){
                    this._group = value;
                }
            },
            
            selected: {
                type: "Boolean",
                get: function() {
                    return this._selected;
                },
                set: function(value){
                    this._selected = value;
                    this.updateDisplay();
                }
            },
            
            togglet: {
                type: "Boolean",
                get: function() {
                    return this._togglet;
                },
                set: function(value){
                    this._togglet = value;
                }
            }
        },
        
        _method: {
            render: function() {
                var i, o, h, sprites, children;
                
                if (this._selected){
                    this._mouseState.down = true;
                    this._updateCssRule();
                }
                
                // se faz parte de um grupo de botões e está selecionado, todos os outros ficam não selecinados
                if (this._group && this._selected) {
                    children = this._parent.children();
                    
                    for (i = 0; i < children.length; i++) {
                        o = children[i];
                        if (o instanceof jsf.ui.JButton && o._group == this._group && this._id != o._id) {// é JButton, faz parte do meu grupo e não sou eu
                            o._mouseState.down = false;
                            o.selected(false);
                        }
                    }
                }
                
                //define o ícone
                if (this._el_icon){
                    h = this._canvas.firstChild.offsetHeight;
                    sprites = this.getSprites();
                    
                    if (sprites) {
                        this._el_icon.setAttribute('class', 'icon ' +  sprites.sprite(this._iconMap[this._enabled ? 0 : 1]));
                    }
                    
                    //centraliza o ícone verticalmente
                    
                    
                    //posiciona o ícone
                    switch (this._iconAlign){
                        case 'left':
                            this._el_icon.style.marginTop = ((h/2) - this._el_icon.offsetHeight/2) + 'px';
                            this._canvas.firstChild.style.lineHeight = h + 'px';
                            break;

                        case 'top':
                            this._el_icon.style.marginTop = '';
                            this._el_icon.style.cssText = "position:relative; margin-left:-8px; display:block; left:50%; float:none";
                            break;

                        case 'right':
                            this._el_icon.style.marginTop = ((h/2) - this._el_icon.offsetHeight/2) + 'px';
                            this._canvas.firstChild.style.lineHeight = h + 'px';
                            this._el_icon.style.float = 'right';
                            break;

                        case 'bottom':
                            break;

                        case 'center':
                            break;
                    }
                }
                
                return this;
            }
        }
    });
    
    function createIcon(bt){
        var c = bt.canvas();
        
        c.innerHTML = '<div style="position:relative;overflow:visible;width:100%;height:100%;vertical-align:middle;">'+
                            '<div class="icon"></div>'+
                            '<span></span>'+
                      '</div>';
        
        bt._el_icon= c.firstChild.childNodes[0];
        bt._client = c.firstChild.childNodes[1];
        bt._client.innerHTML = bt._caption || "";
    }

    function alignIcon(icon, align, cls){
        var p = icon.parentNode;
        
        icon.setAttribute('class', 'btn-icon ' +  cls);
        
        switch (align){
            case 'left':
                icon.setAttribute("style", "margin-top:-" + (icon.offsetHeight/2) + "px;");
                p.style.paddingLeft = (icon.offsetLeft + icon.offsetWidth) + "px";
                break;
            
            case 'top':
                icon.setAttribute("style", "margin-left:-" + (icon.offsetWidth/2) + "px;");
                p.style.paddingTop = (2) + "px";
                break;
            
            case 'right':
                icon.setAttribute('style', 'right:6px;' + 'top:' + + ((p.offsetHeight/2) - (icon.offsetHeight/2)) + 'px;');
                p.style.paddingRight = (icon.offsetWidth) + "px";
                break;
            
            case 'bottom':
                icon.setAttribute('style', 'bottom:6px;' + 'left:' + ((p.offsetWidth/2) - (icon.offsetWidth/2)) + 'px;');
                break;
            
            case 'center':
                icon.setAttribute('style', 'top:' + + ((p.offsetHeight/2) - (icon.offsetHeight/2)) + 'px;' + 'left:' + ((p.offsetWidth/2) - (icon.offsetWidth/2)) + 'px;');
                break;
        }
    }
}());


