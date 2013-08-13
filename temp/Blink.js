"use strict";
/*global Effect */

var Blink;
(function() {
	/*
	 * efeito piscar
	 * 
	 */
	Blink = function(component, options) {
		var o = Effect.create(e, options, Blink._do);

		o.duration = 2000;
		o.interval = 70;
		o.frames = 12;
		o._visible = false;

		return o;
	};
	Blink._do = function(options) {
		options.element.style.display = options.frame % 2 == 0 ? '' : 'none';
	};
}());