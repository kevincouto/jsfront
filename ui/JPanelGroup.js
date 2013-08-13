"use strict";
/*global Extend, DisplayObject, System, Event, Popup, Type, Sheet, Util, Dom, Config, Loader, JContainer */

var JPanelGroup = function(properties){
    this._init_(properties);
};
(function(){
	var p = JPanelGroup.prototype = Extend(JContainer);

//private functions:
    function createCaption(pnl){
		if (!pnl._ecaption){
			pnl._ecaption = pnl._canvas.appendChild(Dom.create('div', null, 'ui-cp png-caption'), pnl._client);
		}
	}
    
//protected methods:
	p.JContainer__construct = p._construct;
	p._construct = function(properties){
		this.JContainer__construct();
		
		this._type = 'JPanelGroup';
		
		this._canvas.className = 'ui-bd ui-bg png';
		this._canvas.innerHTML = '<div class="ui-bd ui-fc png-client1">'+
                                    '<div class="png-client2"></div>'+
                                 '</div>';
		this._client = this._canvas.childNodes[0].firstChild;
		
		this._applyProperties(properties);
	};
	
	p._onclick = function(evt){
		
	};

//public methods:	
	p.caption = function(value){
        //get
		if (value === undefined){
			return this._caption;
		}
        
        //set
        createCaption(this);
        this._caption = this._ecaption.innerHTML = value;
        this.updateDisplay();
		
		return this;
	};
}());
