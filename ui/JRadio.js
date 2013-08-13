"use strict";
/*global Extend, DisplayObject, System, Event, Popup, Type, Sheet, Util, Dom, Config, Loader, JContainer */

var JRadio = function(properties){
    this._init_(properties);
};
(function(){
	var p = JRadio.prototype = Extend(DisplayObject);
	
//protected methods:
	p.DisplayObject__construct = p._construct;
	p._construct = function(properties){
		this.DisplayObject__construct();
		
		this._type = 'JRadio';
		this._focuset = true;
		
		this._caption = 'JRadio';
		this._canvas.innerHTML = '<span class="opt-icon"></span><span class="opt-text">JRadio</span>';
		this._echeck   = this._canvas.childNodes[0];
		this._ecaption = this._canvas.childNodes[1];
		
        this._iconAlign = 'left';
        
		this._applyProperties(properties);
	};
	
	p._onclick = function(){
		if (!this.checked()){
			this.checked(true);
		}
	};
	
	p._onmouseover = function(){
		this.render();
	};
	
	p._onmouseout = function(){
		this.render();
	};

//public methods:	
	p.caption = function(value){
        //get
		if (value === undefined){
			return this._caption;
		}
        
        //set
        this._caption = this._ecaption.innerHTML = value;
		
		return this;
	};
	
	p.checked = function(value){
        //get
		if (value === undefined){
			return this._checked;
		}
        
        //set
        this._oldChecked = !!this._checked;
        this._checked = !!value;			
        this.updateDisplay();
		
		return this;
	};
	
	p.group = function(value){
        //get
		if (value === undefined){
			return this._group;
		}
        
        //set
        this._group = value;
		
		return this;
	};
	
    p.iconAlign = function(value){
        //get
		if (value === undefined){
			return this._iconAlign;
		}
        
        //set
        this._iconAlign = value;
		this.updateDisplay();
        
		return this;
    };
    
    p.iconStyle = function(value){
        //get
		if (value === undefined){
			return this._iconStyle;
		}
        
        //set
        this._echeck.className = 'opt-icon' + (value==0 ? '' : value==1 ? ' opt-icon1' : value==2 ? ' opt-icon2' : '');
        this._iconStyle = value;
		this.updateDisplay();
        
		return this;
    };
    
	p.render = function(){
		var i, o, children;
		
        //desmarca os outros componentes do grupo caso este esteja marcado.
		if (this._checked) {
			children = this._parent.children();
			for (i = 0; i < children.length; i++) {
				o = children[i];
				if (o && o._type == 'JRadio' && o._group == this._group && this._id != o._id) {// é JRadio, faz parte do meu grupo e não sou eu
					o.checked(false);
				}
			}
		}
		
        //define a class css do componente
        this._canvas.className = 'opt opt-' + this._iconAlign + 
		                         (this._checked ? ' opt-checked' : '') +
		                         (this._mouseState.over ? ' opt-over' : '') +
		                         (this._enabled ? '' : ' opt-disabled');
        
        //posiciona o icone
        switch (this._iconAlign){
            case 'left':
                this._canvas.appendChild(this._ecaption);
                this._echeck.style.cssText = 'margin-top:' + ((this._canvas.offsetHeight - this._echeck.offsetHeight)/2) + 'px';
                break;
            case 'right':
                this._canvas.appendChild(this._echeck);
                this._echeck.style.cssText = 'margin-top:' + ((this._canvas.offsetHeight - this._echeck.offsetHeight)/2) + 'px';
                break;
            case 'top':
                this._canvas.appendChild(this._ecaption);
                this._echeck.style.cssText = 'margin-left:' + ((this._canvas.offsetWidth - this._echeck.offsetWidth)/2) + 'px';
                break;
            case 'bottom':
                this._canvas.appendChild(this._echeck);
                this._echeck.style.cssText = 'margin-left:' + ((this._canvas.offsetWidth - this._echeck.offsetWidth)/2) + 'px';
                break;
        }
		
		if (this._oldChecked != this._checked){
			this.dispatch(Event.ON_CHANGE, this._checked);
			this._oldChecked = this._checked;
		}
	};
}());
