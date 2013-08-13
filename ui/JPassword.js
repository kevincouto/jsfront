"use strict";
/*global Extend, DisplayObject, Event, Dom, Keyboard*/

var JPassword = function(properties){
    this._init_(properties);
};
(function(){
    var p = JPassword.prototype = Extend(DisplayObject);

//private vars:

//private functions:
    
//protected methods:
    p.DisplayObject__construct = p._construct;
    p._construct = function(properties){
		this.DisplayObject__construct();
        
		this._canvas.className = 'txt ui-bd txt-border';
        this._canvas.innerHTML = '<input type="password" />';
        
		this._focuset = true;
		this._type = 'JPassword';
        
        this._input = this._canvas.childNodes[0];
        this._input.onkeydown = this._inputKeyDown;
        this._input._parentId = this._id;
        this._input.onfocus    = this._onenter;
        this._input.onblur     = this._onexit;
        this._input.onkeypress = this._onkeypress;
		
        this._applyProperties(properties);
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

    p.text = function(value){
        // get
		if (value === undefined) {
			return this._input.value; 
		}
        
        // set
        this._textOld = this._input.value;
        this._input.value = value;
		
		return this;
    };
    
    p.maxLength = function(value){
        // get
		if (value === undefined) {
			return this._maxLength; 
		}
        
        // set
        this._maxLength = this._input.maxLength = value;
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