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
