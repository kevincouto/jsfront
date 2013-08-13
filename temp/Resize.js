"use strict";
/*global Effect */

var Resize;
(function() {
	/*
	 * efeito resize options = {target:DisplayObject, widthTo:100, heightTo:200,
	 * widthFrom:10, heightFrom:10}
	 */
	Resize = function(op) {
		var properties = [
			{
				name : 'width',
				start : 'offsetWidth'
			},
			{
				name : 'height',
				start : 'offsetHeight'
			}
		];
		
		op.effectName = 'Resize';
		
		return Effect.create(op, properties, Resize._applyValue);
	};
	Resize._beforePlay = function(options){
		if (options.widthFrom===undefined){
			options.element.style.width = options.widthFrom + 'px';
		}
	    
		if (options.heightFrom===undefined){
			options.element.style.height = options.heightFrom + 'px';
		}
	};
	Resize._applyValue = function(target, element, property, value) {
		element.style[property] = parseInt(value, 10) + 'px';
	};
}());