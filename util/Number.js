"use strict";

Number.isInteger = function(s) {
	var i = parseInt(s, 10);

	if (isNaN(i)){
		return false;
	}

	s += '';

	return (s.toString().search(/^-?[0-9]+$/) == 0);
};

Number.isUnsignedInteger = function(s) {
	return (s.toString().search(/^[0-9]+$/) == 0);
};
