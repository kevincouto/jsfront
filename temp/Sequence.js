"use strict";
/*global Effect */

var Sequence;
(function() {
	// efeito sequência
	Sequence = function(effects) {
		var i, op = Effect.create({}, null, null);
        
		function onComplete(effect) {
			if (effect._next){
				effect._next.play();
			}
			else{
				effect._parent._status_ = 'complete';
			}
		}
        
		for (i=0; i < effects.length; i++) {
			effects[i]._onComplete = onComplete;
			effects[i]._next = effects[i + 1];
			effects[i]._parent = op;
		}
        
		op._status_ = 'none';
		op.effects = effects;
		op.doPlay = Sequence._do;
        
		return op;
	};
	Sequence._do = function(op) {
		if (op._status_ == 'none') {
			op.effects[0].play();
			op._status_ = 'execution';
		}
        
		op.frame = 1;
		return op._status_ != 'complete';
	};
}());
