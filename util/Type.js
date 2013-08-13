"use strict";

var Type = {
	isObject : function(obj)  {return Object.prototype.toString.call(obj) === "[object Object]";},
	isString : function(obj)  {return Object.prototype.toString.call(obj) === "[object String]";},
	isNumber : function(obj)  {return Object.prototype.toString.call(obj) === "[object Number]";},
	isBoolean : function(obj) {return Object.prototype.toString.call(obj) === "[object Boolean]";},
	isArray : function(obj)   {return Object.prototype.toString.call(obj) === "[object Array]";},
	isFunction : function(obj){return Object.prototype.toString.call(obj) === "[object Function]";},
	isDate : function(obj)    {return Object.prototype.toString.call(obj) === "[object Date]";},
	isRegExp : function(obj)  {return Object.prototype.toString.call(obj) === "[object RegExp]";}
};
