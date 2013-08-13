"use strict";

(function(){
    
	define("jsf.ui.JApplication", {
		_require: ["jsf.ui.JModule"],
        
        _extend: "module",
        
        _xtype: "application",
        
		_constructor: function(properties){
			jsf.JModule.call(this, properties);
			
			this._canvas.style.visibility='hidden';
			this._canvas.className = 'bg1 app';
			this._canvas.tabIndex = 1;
		},
      
		_public:{
            title: function(value){
                // get
                if (value === undefined) {
                    return document.title;
                }
                
                // set
                document.title = this.firePropertyChange('title', Lang.bind(this, 'title', value));
                
                return this;
            },
            
			create: function(def){
                jsf.JModule.prototype.create.call(this, def);
				this.container().appendChild(this._canvas);
				return this;
			},
         
			container : function(value){
				//get
                if (value === undefined) {
                    return this._container || document.body;
                }
            
				//set
				this._container = value;			
				return this;
         }
      }
   });
   
}());
