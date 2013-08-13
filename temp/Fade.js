"use strict";

var Fade;
(function(ns) {
	/*
	 * Aplica o nivel de opacidade no componente
	 * options = { 
	 *     target   : DisplayObject,
	 *     duration : 400,
	 *     alphaFrom: 1.0,
	 *     alphaTo  : 0.0
	 * }
	 */
	Fade = function(op) {
		var properties = [{
					name     : 'alpha',
					start    : 'style.opacity',
					"default": 0
				}];

		op.effectName = 'Fade';

		return Effect.create(op, properties, Fade._applyValue);
	};
	Fade._beforePlay = function(options){
	    options.element.style.opacity = options.alphaFrom;
	    options.target.visible(true); 
	};	
	Fade._applyValue = function(target, element, property, value) {
		element.style.opacity = value;
	};
}());
