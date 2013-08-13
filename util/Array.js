"use strict";
/*global System, Type */

function Array_compareAsc(a, b) {
	if (a[window.att] < b[window.att]){
		return -1;
	}
    
	if (a[window.att] > b[window.att]){
		return 1;
	}
    
	return 0;
}

function Array_compareDesc(a, b) {
	if (a[window.att] < b[window.att]){
		return 1;
	}
    
	if (a[window.att] > b[window.att]){
		return -1;
	}
    
	return 0;
}

Array.prototype.removeByIndex = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

/**
 * @param {String} att
 * @param {String} order
 * @returns {Array}
 * @memberOf Array
 */
Array.prototype.sortObject = function(att, order) {
	window.att = att;
    return (order == 'desc') ? this.sort(Array_compareDesc) : this.sort(Array_compareAsc);
};

Array.prototype.remove = function(start, end) {
	end = (end === undefined ? 1 : end);
	var array = this;
	array.splice(start, end);
	return array;
};

Array.prototype.insert = function(pos, item) {
	var array = this;
	array.splice(pos, 0, item);
	return array;
};

/**
 * @param {String}  att
 * @param {Object}  value
 * @param {String}  operator
 * @returns {Array}
 * @memberOf Array
 */
Array.prototype.filter = function(att, value, operator) {
	var i, j, o, a = [], p = this[0];

	operator = operator || '=';

	if (Type.isFunction(value)) {
		for (i = 0; i < this.length; i++) {
			if (value(this[i])) {
				a.push(this[i]);
			}
		}
	} else {
		if (p && Type.isObject(p)) { // array com objetos
			p = att.split('.');
			
            for (i = 0; i < this.length; i++) {
				o = this[i][p[0]];
				for (j = 0; j < p.length; j++) {
					if (operator == '=') {
						if (o == value) {
							a.push(this[i]);
							break;
						} else {
							o = o[p[j + 1]];
						}
					} else {
						if (o != value) {
							a.push(this[i]);
							break;
						} else {
							o = o[p[j + 1]];
						}
					}
				}
			}
		} else { // array normal
			for (i = 0; i < this.length; i++) {
				if (this[i] == att) {
					a.push(this[i]);
				}
			}
		}
	}

	return a;
};

/**
 * @param {String} att
 * @param {Object} value
 * @param {String} operator
 * @returns {Object}
 * @memberOf Array
 */
Array.prototype.find = function(att, value, operator) {
	var i, j, o, p = this[0];

	operator = operator || '=';

	if (Type.isFunction(value)) {
		for (i = 0; i < this.length; i++) {
			if (value(this[i])) {
				return this[i];
			}
		}
	} else {
		if (p && Type.isObject(p)) { // array com objetos
			p = att.split('.');
			
            for (i = 0; i < this.length; i++) {
				o = this[i][p[0]];
				for (j = 0; j < p.length; j++) {
					if (operator == '=') {
						if (o == value) {
							return this[i];
                        }
                        
						o = o[p[j + 1]];
					} else {
						if (o != value) {
							return this[i];
						}
                        
                        o = o[p[j + 1]];
					}
				}
			}
		} else { // array normal
			for (i = 0; i < this.length; i++) {
				if (this[i] == att) {
					return this[i];
				}
			}
		}
	}

	return null;
};
