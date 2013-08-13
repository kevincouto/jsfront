"use strict";
/*global Extend, DisplayObject, Control, Event, Popup, Type, Drag, JButton, Dom, Keyboard, Loader, JContainer */

var JHeadBar = function(properties){
    this._init_(properties);
};
(function(){
	var p = JHeadBar.prototype = Extend(JContainer);

//protected methods:
	p.Container__construct = p._construct;
	p._construct = function(properties){
		this.Container__construct();
		
		this._type = 'JHeadBar';
		this._align= 'top';	
		this._canvas.className = 'ui-fc ui-bd hba';
		
		this._applyProperties(properties);
	};
    
//public methods:	
	p.Container_add = p.add;
    p.add = function (control){
        if (control._type=='JSeparator'){
            control._canvas.className = 'hba-separator';
        }
        
        return this.Container_add(control);
	};
}());
