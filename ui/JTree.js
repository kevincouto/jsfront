"use strict";

(function(){
    var cls = jsf.getContentRule(".jlist-class" ),
        cBorder1 = cls[0] || "b1",
        cItem1 = " " + (cls[1] || "i1"),
        cItem2 = " " + (cls[2] || "i2"),
        cItem3 = (cls[3] || "i3") + " lst-item-over";
    
	define("jsf.ui.JTree", {
        _require: ["jsf.ui.JListBase"],
        
		_extend: "listbase",
		
        _xtype: "treeview",
        
		_constructor : function(properties){
			jsf.ui.JListBase.call(this);
            
			this._focuset = true;
			
			this._client.className = "lst-client";
			this._el_data.className = "lst-data";
            
            this._dataProvider2 = [];
            
            //default properties
            this._listField = 'label';
			this._rowHeight = 21;
			this._border = true;
            this._styleClass = "";
            
            this._arrowClass = ['tvw-item-arrow-none', ' tvw-item-arrow-opened', ' tvw-item-arrow-closed'];
	        this._iconClass  = ['', ' tvw-item-icon-opened', ' tvw-item-icon-closed'];
            this._applyProperties(properties);
		},
		
		_event: {
			mousedown : function(element, evt) {
                var i, item, q, l, arr1, arr2;
                
                if (element.getAttribute('isArrow')){
                    i = element.parentNode.parentNode.itemIndex;
                    item = this._dataProvider[i];
                    
                    if (item.children){
                        //fecha
                        if (item.opened){
                            
                            //remove os itens filhos
                            q = childrenCount(item);
                            this._dataProvider.splice(i+1, q);
                            item.opened = false;
                        
                        //abre
                        }else{
                            item.opened = true;
                            
                            //adiciona os itens filhos
                            arr2 = this._dataProvider.splice(i+1,99999999);
                            arr1 = this._dataProvider;
                            
                            q = arr1.length;
                            l = arr1[q-1].level+1;
                            arr1 = arr1.concat(childrenItens(item));
                            for (i=q; i<arr1.length; i++){
                                arr1[i].level = l;
                            }
                            
                            this._dataProvider = arr1.concat(arr2);
                        }
                        
                        jsf.ui.JListBase.prototype.dataProvider.call(this, this._dataProvider);
                        
                        this.render();
                    }
                }else if (element.isItem){
					setItemSelected(this, element.itemIndex);
					this.render();
					
					if ( evt.mouseButton == jsf.event.MouseEvent.MB_RIGHT){
						showPopupItem(this, element.itemIndex, evt);
					}
                }
			},
			mouseup : function(element){   
				if (this._selectedItem && this._selectedItem==this._dataProvider[element.itemIndex]){
					this.dispatch(jsf.Event.ON_ITEM_CLICK, this._selectedItem);
				}
			},
			mouseover : function(element) {
				var item;
				
				if (element._captureMouseEvent){
					item = this._dataProvider[element.itemIndex];
					if (!item._sel_){
						this._elOver = element;
						jsf.Dom.addClass(element, cItem3);
					}
				}
			},
			mouseout : function(element) {
				if (this._elOver){
					jsf.Dom.removeClass(this._elOver, cItem3);
				}
			}
		},
        
        _protected: {
            renderItem: function(item, element, elementIndex){
                var cls = "lst-item", status;
                
                if (item.selectable===false){
                    cls = 'lst-item';
                }else{
                    cls += item._sel_ ? (this._hasFocus ? cItem1 : cItem2) : '';
                }
                
                //cria os elementos(html) internos do item, caso ainda não tenham sidos criados.
                if ( !element.ident ){
                    createItem(element);
                    //element._captureMouseEvent = true;
                    element.style.height = this._rowHeight + 'px';
                }
                
                //define o índice do ícone (0, 1 ou 2)
                status  = (item.children ? (item.opened ? 1 : 2) : 0);
                
                //define o css do html do item
                element.className = cls + (item.style ? " lst-" + item.style : this._styleClass);
                element.ident.style.left = (item.level * 16) + 'px';
                element.arrow.className = 'tvw-item-arrow' + this._arrowClass[status];
                element.icon.className  = 'tvw-item-icon' + (this._icons ? ' '+this._iconsCls[status] : this._iconClass[status]);
                
                //define o texto do nó
                element.value.nodeValue = item[this._listField];
            }
        },
        
        _public: {
            render: function(){
                var sprites, cls = this._border ? 'lst ui-bd' : 'lst lst-noborder';
                
                //define a classe css
                this._canvas.className = this._enabled ? cls : cls+" lst-disabled";
                
                //define os ícones
                if (this._iconsChanged){
                    sprites = this.getSprites();
                    this._iconsCls = [
                        sprites.sprite(this._icons[0], 0), //sem filho
                        sprites.sprite(this._icons[1], 0), //aberto
                        sprites.sprite(this._icons[2], 0)  //fechado
                    ];
                    this._iconsChanged = false;
                }
                
                jsf.ui.JListBase.prototype.render.call(this);
            },
            
            icons: function(value){
                // get;
                if (value === undefined) {
                    return this._icons;
                }
                
                // set
                this._icons = value;
                this._iconsChanged = true;
                
                return this;
            },
            
            dataProvider: function(value){
                //get
                if (value === undefined){
                    return this._dataProvider2;
                }
                    
                //set
                
                // TESTE 
                /*value = [
                    {label:'01'},
                    {label:'02', opened:true, children:[
                        {label:'02.A'},
                        {label:'02.B'},
                        {label:'02.C', opened:false, children:[
                            {label:'02.C.i'},
                            {label:'02.C.ii'},
                            {label:'02.C.iii'}
                        ]},
                        {label:'02.D'}
                    ]},
                    {label:'03', opened:true, children:[
                        {label:'03.A'},
                        {label:'03.B'},
                        {label:'03.C'}
                    ]},
                    {label:'04'},
                    {label:'05'},
                    {label:'06'}
                ];*/
                //  FIM TESTE
                
                value = removeNull( (!value ? [] : value) );
				this._dataProvider2 = value;
                
                jsf.ui.JListBase.prototype.dataProvider.call(this, initializeDataProvider(value, 0));
                
                this.updateDisplay();
                
                return this;
            },
            
			openItem: function(id, field){
				var item;
				
				field = field || "id";
				item = this._dataProvider[field];
				
				if (item && item.children){
					item.opened = true;
				}
				
				this.updateDisplay();
			},
			
			removeItem: function(itemId, field){
				field = field || "id";
				setItemValue(this._dataProvider2, itemId, field, null);
				this.dataProvider( this._dataProvider2 );
			},
			
			updateItem: function(newItem, field){
				field = field || "id";				
				setItemValue(this._dataProvider2, newItem[field], field, newItem);
				this.dataProvider( this._dataProvider2 );
			},
			
			addItem: function(item, parentId, field){
				var i, it;
				
				if (parentId){
					field = field || "id";
					it = getItem(this._dataProvider2, parentId, field);
					
					if (it){
						if (!it.children){
							it.children = [];
						}
						
						it.children.push(item);
					}
				}else{
					this._dataProvider2.push(item);
				}
				
				this.dataProvider( this._dataProvider2 );
			},
			
            border: function(value){
                //get
                if (value === undefined) {
                    return this._border;
                }
                
                //set
                this._border = this.firePropertyChange("border", Boolean(value));
                this._canvas.className = value ? 'lst ui-bd' : 'lst lst-noborder';
                
                return this;
            },
            
            rowHeight: function(value){
                //get
                if (value === undefined){
                    return this._rowHeight;
                }
                
                //set
                this._rowHeight = value;
                this.updateDisplay();
                
                return this;
            },
			
			selectedItem: function(){
                return this._selectedItem;
            },
			
			item: function(id, field){
				var i
				
				field = field || "id";
				
				for (i=0; i<this._dataProvider.length; i++){
					if (this._dataProvider[i][field] == id){
						return this._dataProvider[i];
					}
				}
				
                return null;
            }
        }
	});
	
//private functions:
	function Item(item){
		return {
			open: function(){
				
			},
			close: function(){
				
			},
			enabled: function(){
				
			},
			add: function(itens){
				
			}
		}
	}
	
	function removeNull(dp){
		var i, item, arr = [];
		
		for (i=0; i<dp.length; i++){
			item = dp[i];
			
			if (item){
				arr.push(item);
				if (item.children){
					item.children = removeNull(item.children);
					if (item.children.length==0){
						delete(item.children);
					}
				}
			}			
        }
		
		return arr;
	}
	
	function getItem(dp, itemId, field){
		var i, item, arr = [], it;
		
		field = field || "id";
		
		for (i=0; i<dp.length; i++){
			item = dp[i];
			
			if (item){
				if (item[field]==itemId){
					return item;
				}
				
				if (item.children){
					it = getItem(item.children, itemId, field);
					if (it){
						return it;
					}
				}
			}
        }
		
		return null;
	}
	
	function setItemValue(dp, itemId, field, newItem){
		var i, j, item;
		
		field = field || "id";
		
		for (i=0; i<dp.length; i++){
			item = dp[i];
			
			if (item){
				if (item[field]==itemId){
					if (newItem==null){
						dp[i]=null;
					}else{
						for (j in newItem){
							dp[i][j] = newItem[j];
						}
					}
					
					return;
				}
				
				if (item.children){
					setItemValue(item.children, itemId, field, newItem);
				}
			}
        }
	}
	
    function initializeDataProvider(dp, level){
        var i, item, arr = [];
        
        for (i=0; i<dp.length; i++){
			item = dp[i];
			
			if (item){
				item.level = level;
				
				arr.push(item);
				
				if (item.opened && item.children){
					arr = arr.concat( initializeDataProvider(item.children, level+1) );
				}
			}
        }
		
        return arr;
    }
    
    //retorna a quantidade de filhos e subfilhos que estejam abertos
    function childrenCount(item){
        var q = 0, i;
        
        if (item.opened && item.children){
            q = item.children.length;
            for (i=0; i<item.children.length; i++){
                q += childrenCount(item.children[i]);
            }
        }
        
        return q;
    }
    
    //retorna os filhos e subfilhos que estejam abertos
    function childrenItens(item){
        var a = [], i;
        
        if (item.opened && item.children){
            for (i=0; i<item.children.length; i++){
                a.push(item.children[i]);
                a = a.concat(childrenItens(item.children[i]));
            }
        }
        
        return a;
    }
    
    function createItem(div){
        div.isItem = true;
        div.innerHTML = '<div class="tvw-item-ident">'+
                            '<div class="tvw-item-arrow" isArrow="1" _captureMouseEvent="true"></div>'+
                            '<div class="tvw-item-icon" ></div>'+
                            '<div class="tvw-item-label"></div>'+
                        '</div>';
        div.ident = div.childNodes[0];
        div.arrow = div.ident.childNodes[0];
        div.icon  = div.ident.childNodes[1];
        div.value = div.ident.childNodes[2].appendChild(document.createTextNode(''));
        
        return div;
    }
    
	function showPopupItem(lst, index, evt){
		var component, item = lst._dataProvider[index] || null;
		
		if (item){
			component = lst.module().get(item.popup);
			if (component){
				if (component instanceof jsf.ui.JMenu){
					component.show(evt.x, evt.y);
				}else{
					
				}
			}
		}
	}
	
    function setItemSelected(lst, index){
        var i = lst._selectedIndex;
        
        if (lst._dataProvider[index] && lst._dataProvider[index].selectable===false){
            return;
        }
        
        if (!lst._multiSelect && lst._selectedIndex>=0){
            if (lst._dataProvider[lst._selectedIndex]){
                delete(lst._dataProvider[lst._selectedIndex]._sel_);
            }
        }
        
        lst._oldSelectedItem = lst._selectedItem;
        lst._selectedItem = lst._dataProvider[index] || null;
        
        lst._selectedIndex = index;
        if (lst._selectedItem){
            lst._selectedItem._sel_ = true;
        }
        
        if (i != lst._selectedIndex){
            if (lst._onchange){
                lst._onchange(lst._selectedItem);
            }
            
            lst.dispatch(jsf.Event.ON_CHANGE, lst._selectedItem);
        }
    }
    
}());
