"use strict";

(function(){
    var binds={}, observers={}, _values={};

    define("jsf.core.Lang", {
        _alias: "Lang",
        
        _constructor: function(key){
            if (_values[key]){
                return {
                    _lang_: true,
                    _key_ : key,
                    value : _values[key]
                };
            }
            
            return null;
        },
        
        _static: {
            values: function(obj){
                _values = obj;
            },
            
            get: function(key){
                return _values[key];
            },
            
            phrase: function(id, values){
                var s = Lang.get(id), i=null;
                
                if (s){
                    for (i in _values){
                        s = s.replaceAll("{"+i+"}", values[i]);
                    }
                    return s;
                }else{
                    return "lang phrase error!";
                }
            },
            
            change: function(values){
                var key=null, prop=null, v, objectProperties, object, app = System.application();
                
                _values = values;
                
                for (key in binds){
                    object = Control.get(key);
                    if (object){
                        objectProperties = binds[key];
                        
                        for (prop in objectProperties){
                            v = objectProperties[prop][0];
                            if (object[prop]){
                                object[prop]( _values[v] );
                            }
                            if (object._onlangchanged && objectProperties[prop][1]){
                                object._onlangchanged(objectProperties[prop][1], _values[v]);
                            }
                        }                    
                    }else{
                        delete binds[key];
                    }
                }
                
                for (key in observers){
                    object = Control.get(key);
                    if (object){
                        object._onlangchanged();
                    }else{
                        delete observers[key];
                    }
                }
                
                if (app._langChanged){
                    app._langChanged(values);
                }
            },
            
            bind: function(object, property, value, param){
                if (value && value._lang_){
                    var id = object._id;
                    
                    if (!binds[id]){
                        binds[id] = {};
                    }
                    
                    binds[id][property] = [value._key_, param];
                    return value.value;
                }
                
                return value;
            },
            
            observer: function(object){
                observers[object._id] = 1;
            }
        }
    });        
}());
Lang('d')