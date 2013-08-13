"use strict";
/*global Effect */

var Move;
(function() {
    /*
     * efeito mover
     *     options = {
     *         target: DisplayObject, 
     *         leftTo: 100, 
     *         topTo : 200,
     *         leftFrom: 10,
     *         topFrom : 10
     *     }
     */
    Move = function(op) {
        var properties = [{
            name : 'top',
            start : 'offsetTop'
        }, {
            name : 'left',
            start : 'offsetLeft'
        }];
    
        op.effectName = 'Move';
    
        return Effect.create(op, properties, Move._applyValue);
    };
    Move._applyValue = function(target, element, property, value) {
        element.style[property] = parseInt(value, 10) + 'px';
    };
}());
