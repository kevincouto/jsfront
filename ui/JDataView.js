"use strict";

(function(){
    
	define("jsf.ui.JDataView",{
		_require: ["jsf.ui.JScrollBase"],
        
        _alias: "jsf.JDataView",
        
        _extend: "scrollbase",
		
        _xtype: "dataview",
		
		_constructor : function(properties){
			jsf.ui.JScrollBase.call(this);
			
			this._focuset = true;
			
            this._itemWidth = 100;
            this._itemHeight= 100;
            this._grap = 10;
            
            this._template = '<div style="bottom:2px; width:100%; text-align:center;">#{label}</div>';
            
			this._applyProperties(properties);
		},
		
		_event: {
			mouseover: function(element) {
				if ( element.getAttribute("isDataViewItem") ){
					jsf.Dom.addClass(element, this._rules.itemOver);
                    //this._mouseOverEL = element;
				}
			},
			
			mouseout: function(element) {
				if ( element.getAttribute("isDataViewItem") ){
                    jsf.Dom.removeClass(element, this._rules.itemOver);
                    //this._mouseOverEL = null;
                    //this._updateActiveItem();
				}
			},
            
            mousedown: function(element){
                if ( element.getAttribute("isDataViewItem") ){
					if (this._activeItem){
                        this._activeItem.className = this._rules.item;
                    }
                    this._activeItem = element;
					this._updateActiveItem();
                }
            },
            
            enter: function(){
                this._updateActiveItem();
            },
            
            exit: function(){
                this._updateActiveItem();
            }
		},
		
        _protected: {
            rules: {
                canvas: "b1 dtv",
                item: "dtv-item",
                itemFocusIn: " i1",
                itemFocusOut: " i2",
                itemOver: " dtv-item-over",
            },
            
            updateActiveItem: function(){
                if (this._activeItem){
					this._activeItem.className = this._rules.item +
                        (this._hasFocus ? this._rules.itemFocusIn : this._rules.itemFocusOut) +
                        (this._mouseOverEL==this._activeItem ? this._rules.itemOver : "");
				}
            }
        },
        
		_public: {
            itemWidth: function(value){
				// get
				if (value === undefined){
					return this._itemWidth;
				}
				
				// set
				this._itemWidth = value;
				
                this.updateDisplay();
                
				return this;
			},
            
            itemHeight: function(value){
				// get
				if (value === undefined){
					return this._itemHeight;
				}
				
				// set
				this._itemHeight = value;
				
                this.updateDisplay();
                
				return this;
			},
            
			template: function(value){
				// get
				if (value === undefined){
					return this._template;
				}
				
				// set
				this._template = value;// ex: <div>#{name}<br><span>R$#{value}</span></div>
				this._parts = jsf.Util.templateToArray(value);
				
				return this;
			},
			
			dataProvider: function(value){
				var i, el, html="";
                
                // get
				if (value === undefined){
					return this._dataProvider;
				}
				
				// set
				this._dataProvider = value;
				
                if ( !this._parts ){
                    this._parts = jsf.Util.templateToArray( this._template );
                }
                
                // cria os elementos html
                for ( i=0; i<this._dataProvider.length; i++ ){
                    //cria o elemento html correspondente a um item
                    html += ('<div style="width:' + this._itemWidth + 'px;height:' + this._itemWidth + 'px; margin-top:' + this._grap + 'px;margin-left:' + this._grap + 'px" class="' + this._rules.item + '" isDataViewItem="1" _captureMouseEvent="1" itemIndex="'+i+'">' +
                                jsf.Util.fillTemplate(this._parts, this._dataProvider[i]) +
                            '</div>' );
                }
				
                this._scrollArea.innerHTML = html;
                this._scrollArea.style.paddingBottom = this._grap + "px";
                
				this.updateDisplay();
				
				return this;
			},
            
            render: function(){
                var i, w=0, ww=this._canvas.offsetWidth, hh=this._canvas.offsetHeight;
                
                //calcula a largura da scrollArea
                w = parseInt(ww / (this._itemWidth + this._grap), 10);
                w = (w * (this._itemWidth + this._grap)) + 1;
                
                this._scrollArea.style.width = ww + "px";
                
                if (this._scrollArea.offsetHeight>hh){
                    this._scrollArea.style.width = (ww-jsf.JScrollbar.getWidth()-2) + "px";
                }
                
                this._updateScrollBars();
            }
		}
	});
	
}());