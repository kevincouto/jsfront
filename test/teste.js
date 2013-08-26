function createFunction(name, callback){
                
            }
            
            var Control = {
                extend: function(obj){
                    var p, n, f, instance  = Object.create(this);
                    
                    for (p in obj){
                        for (n in obj[p]){
                            if (n=="set"){
                                f = "set_"+p;
                                console.log(f);
                            }
                        }
                    }
                    
                    return instance;
                },
                create: function(properties){
                    return Object.create(this);
                },
                name: {
                    set: function(value){
                        console.log("Control.setName("+value+")")
                    }
                }
            };
            
            var Display = Control.extend({
                name: {
                    set: function(value){
                        console.log("Display.setName("+value+")")
                    }
                },
                displayName: {
                    set: function(value){
                    
                    }
                },
            });
            
            
            var Button = Display.extend({
                name: {
                    set: function(value){
                        //Display.name.call( this, value );
                        console.log("Button.setName("+value+")")
                    }
                },
                buttonName: {
                    set: function(value){
                    
                    }
                },
            });
            
            var bt = Button.create();
            bt.name = "fabio";
            console.log(typeof(bt));
            
var Class = function(){
    /*private static var*/
    var private_static_var = 0, _name;
    
    /*private static method*/
    function private_static_function(){
        return private_static_var++;
    };
    
    console.log("Class.constructor");
    
    /*public methods*/
    return Object.defineProperties({},{
        name: {
            get: function name() {
                console.log("Class.getName: " + _name);
                return name;
            },
            set: function name(value) {
                console.log("Class.setName: " + value);
                _name=value;
            }
        }
    });
};
Class.extend = function(fn){
    
};

var Button = Class.extend(function(){
    
});


/*
a= new Class();
a.name = "fabio";

b= new Class();
b.name = "luz";

x = a.name;
x = b.name;

console.log(b.ID);
*/
