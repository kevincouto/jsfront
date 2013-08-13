var Class = (function(){
    /*private static var*/
    var counter = 0;
    
    /*private static method*/
    function incrementCounter(){
        return counter++;
    };
    
    /*constructor*/
    function constructor(){
        /*private var*/
        var 
            name = "";
        
        console.log("Class.constructor");
        
        /*public property id (read only)*/
        Object.defineProperty(this, "ID", {
            value: "id_" + (counter++),
            writable: false
        });
        
        /*public property name*/
        Object.defineProperty(this, "name", {
            get: function(){
                console.log(name);
                return name;
            },
            set: function(value){
                name = value;
                console.log("Class.setName(" + value + ")");
            }
        });
    };
    
    /*protected static method*/
    constructor.count = function(){
        return counter;
    };
    
    constructor.extend = function(fn){
        fn.prototype = Object.create(this);
        fn.constructor = fn();
        return fn;
    };
    
    return constructor;
})();

var Button = Class.extend(function(){
    /*private static var*/
    var counter = 0;
    
    /*private static method*/
    function incrementCounter(){
        return counter++;
    };
    
    /*constructor*/
    function constructor(){
        /*private var*/
        var 
            name = "";
        
        console.log("Button.constructor");
        
        /*public property name*/
        Object.defineProperty(this, "name", {
            get: function(){
                console.log(name);
                return name;
            },
            set: function(value){
                name = value;
                console.log("set name " + value);
            }
        });
    };
    
    /*protected static method*/
    constructor.count = function(){
        return counter;
    };
    
    return constructor;
});

bt = new Button();
bt.name="oi";

/*
a= new Class();
a.name = "fabio";

b= new Class();
b.name = "luz";

x = a.name;
x = b.name;

console.log(b.ID);
*/