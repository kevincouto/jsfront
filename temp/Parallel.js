"use strict";
/*global Effect */

var Parallel;
(function() {
    // efeito paralelo
    Parallel = function(effects) {
		var i, a=[], op = Effect.create({}, null, null);
		
		function onComplete(effect) {
			effect._parent.effectsCount--;
			if (effect._parent.effectsCount==0 && op.__onComplete){
				op.__onComplete();
			}
		}
		
		
		for (i = 0; i < effects.length; i++){
			if (effects[i]){
				a.push(effects[i]);
			}
		}
		
		effects = a;
		
		for (i = 0; i < effects.length; i++) {
			effects[i]._onComplete = onComplete;
			effects[i]._parent = op;
		}
		
		op.effectName = 'Parallel';
		op.effectsCount = effects.length;
		op.effects = effects;
		op.doPlay = Parallel._do;
		
		return op;
    };
    Parallel._do = function(op) {
		var i;
		
		if (!op._started) {
			for (i=0; i < op.effects.length; i++) {
				op.effects[i].play(); //considera que os efeitos irão terminar ao mesmo tempo, então o primeiro chamará o callback
			}
			op._started = true;
		}
		
		return op.effectsCount >= 0;
    };
}());
