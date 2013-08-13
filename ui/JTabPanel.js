"use strict";

(function(){
    
    define("jsf.ui.JTabPanel", {
        _require: ["jsf.managers.SystemManager", "jsf.ui.JContainer"],
        _alias: "jsf.JTabPanel",
        _extend: "container",
        _xtype: "tabpanel",
        
        _constructor: function(properties) {
            jsf.JContainer.call(this);

            this._grap = 0;

            this._canvas.className = 'tbp b1 tbp-border';
            this._canvas.innerHTML = 
                    '<div class="ui-hl h3 tbp-tabs"></div>'+
                    '<div style="left:4px;right:8px;top:3px;height:32px;">'+
                        '<div style="width:100000px;height:32px;overflow:hidden"></div>'+
                    '</div>'+
                    '<div class="tbp-client"></div>';
            
            this._tabs = this._canvas.childNodes[1].childNodes[0];
            this._client = this._canvas.childNodes[2];
            
            this._elementTabs = [];

            this._applyProperties(properties);
        },
        
        _event: {
            click: function(element){
                if (element.isTab){
                    this.tabIndex(element.index);
                }
            },
            
            containerchange:function(sender, property, value){
                if (property=='caption'){
                    HE(this._tabs).each(function(item){
                        if (item.container==sender){
                            HE(child).html(value);
                        }
                    });
                }
            }
        },
        
        _property:{
            border: { //override
                type:"Boolean",
                set: function(value){
                    this._border = value;
                    this._canvas.className = value ? 'tbp b1 tbp-border' : 'tbp';
                }
            },
            tabIndex: {
                type:"Number",
                get: function(){
                    return this._tabIndex;
                },
                set: function(value){
                    if (value < this._elementTabs.length && value != this._tabIndex){
                        var div1 = this._elementTabs[this._tabIndex],
                            div2 = this._elementTabs[value];

                        this._tabIndex = value;

                        if (div1){
                            jsf.Dom.removeClass(div1, 'tbp-tab-active');
                            jsf.Dom.remove(div1.container._canvas);
                        }

                        jsf.Dom.addClass(div2, 'tbp-tab-active');

                        this._client.appendChild(div2.container._canvas);

                        this.updateDisplay();
                    }
                }
            },            
            caption:{ 
                type:"String",
                get:function(){
                    return this._caption;
                },
                set:function(value){
                    this.showCaption(true);
                    this._caption = this._ecaption.innerHTML = value;
                    this.updateDisplay();
                }
            },            
            showCaption:{ 
                type:"Boolean",
                get:function(){
                    return this._showCaption;
                },
                set:function(value){
                    this._showCaption = !!value;

                    if (value){
                        createCaption(this);
                    }

                    if (this._ecaption){
                        this._ecaption.style.display = value ? '' : 'none';
                    }

                    this.updateDisplay();
                }
            }
        },
                
        _method: {
            add: function(container){
                var r, d = this._tabs.appendChild( jsf.Dom.create('div', 'position:relative;float:left', 'bd1 b1 ui-cp tbp-tab') );
                
                d.innerHTML = container._caption;
                d.container = container;
                d.index     = this._elementTabs.length;
                d.isTab     = true;
                d._captureMouseEvent = true;
                
                container.align('client');
                
                if (container.border){
                    container.border(false);
                }
                
                this._elementTabs.push(d);
                
                r = jsf.ui.JContainer.prototype.add.call(this, container);
                jsf.Dom.remove( container.canvas() );
                
                if (this._elementTabs.length==1){
                    this.tabIndex(0);
                }
                
                return r;
            }
        }
    });
    
//private methods:
    function createCaption(pnl) {
        if (!pnl._ecaption) {
            pnl._ecaption = pnl._canvas.insertBefore(Dom.create('div', null, 'bd1 b1 ui-cp pnl-caption'), pnl._client);
        }
    }

}());
