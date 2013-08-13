"use strict";

(function(){

	define("JMenubar", {
		extend: "DisplayObject",
		
		_constructor : function(properties){
			DisplayObject.call(this);
			
	        var me = this;
	        
			//this._captureChildMouseClick = true;
			this._xtypeChild = 'JMenu';
	        this._menusIndex = 0;
	        this._menus = {};
	        this._el_captions = [];
	        this._elOver = null;
			
	        this._align= 'top';		
			
			this._canvas.className = 'ui-fc ui-bd mnb';
	        this._client = this._canvas.appendChild(Dom.create('div', false, 'mnb-client'));
			
	        //context = JMenu
	        this._onhideMenu = function(){
	            this._JMenu__onhide();
	            
	            if (me._activeCaption){
	                Dom.removeClass(me._activeCaption, 'ui-ac-it');
	                Dom.removeClass(me._activeCaption, 'ui-hl');
	                me._activeCaption = null;
	            }
	        };
	        
			this._applyProperties(properties);
		}
	});
	
	var p = JMenubar.prototype = Extend(DisplayObject);
	
//protected methods:	
    p._onmouseover = function(el, evt){
        if (el.isCaption){
            if (this._activeCaption){
                this._showMenu(el);
            }else{
                Dom.addClass(el, 'ui-hl');
            }
            
            this._elOver = el;
        }
    };
    
    p._onmouseout = function(el, evt){
        if (this._elOver && !this._activeCaption){
            if (this._elOver != this._elDown){
                Dom.removeClass(this._elOver, 'ui-hl');
                this._elOver = null;
            }
        }
    };
    
    p._onmousedown = function(el, evt){
        if (el.isCaption){
            this._showMenu(el);
        }
    };
    
    p._showMenu = function(el){
        var m, r;
        
        //já está visivel, retorna
        if (el==this._activeCaption){
            return;
        }
        
        //existe um outro sendo exibido, oculta
        if (this._activeCaption){
            this._hideMenu(this._activeCaption);
        }
        
        //exibe o menu
        r = Dom.rect(el);
        m = DisplayObject.get(el.menuUIIndex);
        m.caption(null).show(r.left, r.top+r.height);
        this._activeCaption = el;
        
        Dom.addClass(el, 'ui-ac-it');
    };
    
    p._hideMenu = function(el){
        var m = DisplayObject.get(el.menuUIIndex);
        m.hide();
        
        Dom.removeClass(el, 'ui-hl');
        this._activeCaption = null;
    };
    
	/*p._onclick = function(element, evt, child){
		if (child instanceof DisplayObject){
			this.dispatch(Event.ON_ITEM_CLICK, child);
		}
	};*/

//public methods:	
    p.add = function(menu){
        var id = this._menusIndex + '_' + menu._id;
        
        menu._JMenu__onhide = menu._onhide;
        menu._onhide = this._onhideMenu;
        menu._id2_ = id;
        
        this._menusIndex++;
        this._menus[id] = menu;
        this.updateDisplay();
    };
    
    p.remove = function(menu){
        delete(this._menus[menu._id2_]);
        this.updateDisplay();
    };
    
	p.render = function(){
        var i=null, m, j=0, e;
        
		for (i in this._menus){
            m = this._menus[i];
            
            if (!this._el_captions[j]){
                e = this._client.appendChild(Dom.create('div', false, 'mnb-item'));
                e.isCaption = true;
                e.menuUIIndex = m._UIIndex;
                e.caption = m._caption;
                MouseEvent.enabledEvents(e);
                this._el_captions.push(e);
            }
            
            e = this._el_captions[j];
            e.innerHTML = e.caption;
            
            j++;
        }
	};
}());

Class.register('JMenubar', JMenubar);