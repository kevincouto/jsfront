"use strict";
/*global Extend, DisplayObject, Event, Dom, Keyboard*/

var JNumberUpDown = function(properties){
    this._init_(properties);
};
(function(){
    var p = JNumberUpDown.prototype = Extend(DisplayObject),

//private vars:
    numbers = '0123456789';

//private functions:
    
//protected methods:
    p.DisplayObject__construct = p._construct;
    p._construct = function(properties){
		this.DisplayObject__construct();
        
		this._canvas.className = 'txt ui-bd txt-border';
        this._canvas.innerHTML = '<input type="text" />' +
                                 '<div class="ui-fc txt-arrows">' +
                                    '<div _captureMouseEvent="up" class="ui-bd ui-fc txt-arrow-up"></div>' +
                                    '<div _captureMouseEvent="dn" class="ui-bd ui-fc txt-arrow-dn"></div>' +
                                 '</div>';
        
        this._input = this._canvas.childNodes[0];
        this._el_arrows = this._canvas.childNodes[1];
        this._input.onkeydown = this._inputKeyDown;
        this._input._parentId = this._id;
        this._input.onfocus    = this._onenter;
        this._input.onblur     = this._onexit;
        this._input.onkeypress = this._onkeypress;
        
		this._focuset = true;
		this._type = 'JNumberUpDown';
        
        this._applyProperties(properties);
    };
    
    p._inputKeyDown = function(evt){
        var c;
            
        evt = Event.keyboard(evt);
        c = String.fromCharCode(evt.keyCode);
        
        if (!((evt.keyCode>=35 && evt.keyCode<=40) || evt.keyCode==46 || evt.keyCode==8)){
            if (numbers.indexOf(c)==-1){
                return false;
            }
        }
        
        return true;
    };
    
    p._onenter = function(){
		var ui = this.isUI ? this : DisplayObject.getByElement(this);
		ui._canvas.className = 'txt ui-bd txt-border txt-focus';
    };

    p._onexit = function(evt){
		var ui = this.isUI ? this : DisplayObject.getByElement(this);
        ui._canvas.className = 'txt ui-bd txt-border';
        ui.dispatch(Event.ON_EDIT_END, evt);
    };
    
    p._onkeypress = function(evt){
		var ui = DisplayObject.getByElement(this);
		evt = Event.keyboard(evt);
		
		ui.dispatch(Event.ON_KEY_PRESS, evt);
		if (evt.keyCode==Keyboard.KEY_ENTER){
			ui.dispatch(Event.ON_EDIT_END, evt);
		}
    };
    
    p._onmousedown = function(element){
        var me = this, e  = element.getAttribute('_captureMouseEvent');
        
        if (e){
            if (!this._input.value){
                this._input.value=0;
            }
            
            if (e=='up'){
                this._input.value = Number(this._input.value) + 1;
            }else if (e=='dn'){
                this._input.value = Number(this._input.value) - 1;
            }
            
            setTimeout(function(){me._input.focus();},1);
        }
    };
    
//public methods:
    //override borderRadius method
    p.DisplayObject_borderRaius = p.borderRadius;
    p.borderRadius = function(value){
		// get
        if (value === undefined){
			return this._borderRadius;
		}
        
        // set
        this.DisplayObject_borderRaius(value);
		this._input.style.mozBorderRadius = this._input.style.webkitBorderRadius = this._input.style.borderRadius = (value + 'px');
        
		return this;
    };

    p.value = function(value){
        // get
		if (value === undefined) {
			return this._input.value; 
		}
        
        // set
        this._textOld = this._input.value;
        this._input.value = value;
		
		return this;
    };
    
    p.enabled = function(value){
        // get
		if (value === undefined) {
			return !this._input.disabled;
		}
        
        // set
        this._input.disabled = !value;
        return this;
    };

    p.focus = function(){
		this._input.focus();
    };

//extend of dataControl component:
    p.dataField = function(value){
		// get
        if (value === undefined) {
			return this._dataField; 
		}
        
        // set
        this._dataField = value;        
		
		return this;
    };

    p.data = function(value){
		// get
        if (value === undefined) {
			return this._input.value; 
		}
        
        // set
        this._input.value = value;        
		
		return this;
    };
    
    p.clear = function(){
        this._input.value = '';
    };
}());