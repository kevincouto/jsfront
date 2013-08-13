"use strict";

String.latin_map = {
	"Á" : "A",
	"À" : "A",
	"Â" : "A",
	"Ã" : "A",
	"á" : "a",
	"à" : "a",
	"â" : "a",
	"ã" : "a",
	"É" : "E",
	"È" : "E",
	"Ê" : "E",
	"é" : "e",
	"è" : "e",
	"ê" : "e",
	"Í" : "I",
	"Ì" : "I",
	"Î" : "I",
	"í" : "i",
	"ì" : "i",
	"î" : "i",
	"Ó" : "O",
	"Ò" : "O",
	"Ô" : "O",
	"Õ" : "O",
	"ó" : "o",
	"ò" : "o",
	"ô" : "o",
	"õ" : "o",
	"Ú" : "U",
	"Ù" : "U",
	"Û" : "U",
	"Ü" : "U",
	"ú" : "u",
	"ù" : "u",
	"û" : "u",
	"ü" : "u",
	"Ç" : 'C',
	"ç" : "c"
};

String.prototype.latinise = function() {
	return this.replace(/[^A-Za-z0-9\[\] ]/g, function(a) {
		return String.latin_map[a] || a;
	});
};

String.prototype.replaceAll = function(searchExpr, replaceExpr) {
	return this.split(searchExpr).join(replaceExpr); // var regexp = '' searchExpr this.replace(/\.{1}/gi,replaceExpr);
};

String.prototype.trim = function() {
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

String.prototype.lpad = function(padString, length) {
    var str = this;
    
    while (str.length < length){
       str = padString + str;
    }
    
    return str;
};