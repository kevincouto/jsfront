"use strict";

(function(){
    var 
        cls = jsf.getContentRule(".jpanel-class"),
        cHead1  = (cls[0] || "h3") + " pnl-caption",
        cBorder1= (cls[1] || "b1") + " pnl";
    
    define("jsf.ui.JPanel", {
        _require: ["jsf.ui.JContainer"],
        _extend: "container",
        _alias: "jsf.JPanel",
        _xtype: "panel",
        
        _constructor: function(properties) {
            jsf.ui.JContainer.call(this);
            
            this._rules = {
                dragOver: "teste"
            };
            
            this._canvas.className = cBorder1;
            this._canvas.innerHTML = '<div class="pnl-client"></div>';
            this._client = this._canvas.childNodes[0];

            this._applyProperties(properties);
        },
        _event: {
            click: function(evt) {

            }
        },
        _public: {
            caption: function(value) {
                //get
                if (value === undefined) {
                    return this._caption;
                }

                //set
                this.showCaption(true);
                this._caption = this._ecaption.innerHTML = this.firePropertyChange('caption', Lang.bind(this, 'caption', value));
                this.updateDisplay();

                return this;
            },
            showCaption: function(value) {
                //get
                if (value === undefined) {
                    return this._showCaption;
                }

                //set
                this._showCaption = value;

                if (value) {
                    createCaption(this);
                }

                if (this._ecaption) {
                    this._ecaption.style.display = value ? '' : 'none';
                }

                this.updateDisplay();

                return this;
            },
            render: function() {
                var top;

                if (this._clientTop === undefined) {
                    this._clientTop = parseInt(jsf.Sheet.getStyle(this._client, 'top'), 10);
                }

                if (this._showCaption && this._captionMarginBottom === undefined) {
                    this._captionMarginBottom = parseInt(jsf.Sheet.getStyle(this._ecaption, 'margin-bottom'), 10) || 0;
                    this._captionBottom = this._ecaption.offsetTop + this._ecaption.offsetHeight;
                }

                top = this._clientTop + (this._showCaption ? (this._captionBottom + this._captionMarginBottom) : 0);

                this._client.style.top = top + 'px';

                jsf.ui.JContainer.prototype.render.call(this);
            }
        }
    });
	
//private functions:
    function createCaption(pnl) {
        if (!pnl._ecaption) {
            pnl._ecaption = pnl._canvas.insertBefore(jsf.Dom.create('div', null, cHead1), pnl._client);
        }
    }    
}());
