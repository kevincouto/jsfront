"use strict";
/*global System */

/**
 * Classe base para todos os componentes do JsFront.
 * @constructor
 */
var Class = function() {
   /* if (this._extending==true) return;  this._construct(arguments); */
};

// protected methods:
Class.prototype._construct = function() {};
Class.prototype._destruct = function() {};
Class.prototype._init_ = function(p1, p2, p3, p4, p5) {
    if (this._extending == true){
        return;
    }
    
    this._construct(p1, p2, p3, p4, p5);
};
Class.prototype._call = function(f, p1, p2, p3, p4, p5) {
    if (this._extending == true){
        return;
    }
    
    this[f](p1, p2, p3, p4, p5);
};

// public methods:
/**
 * Libera memória referento ao objeto.
 */
Class.prototype.destroy = function() {
    this._destruct();
    System.destroy(this);
    return null;
};

function Extend(cls) {
    if (!cls){
        return null;
    }
    
    cls.prototype._extending = true;
    var o = new cls();
    cls.prototype._extending = false;
    
    o.$parentClass = cls;
    
    return o;
}
