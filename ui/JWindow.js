"use strict";

(function(){
    
    define("jsf.ui.JWindow", {
        _require: ["jsf.ui.JModule"],
        _alias: "jsf.JWindow",
        _extend: "module",
        _xtype: "window",
        
	_constructor: function(properties){
			jsf.ui.JModule.call(this);
            
            this._grap = 0;
            
            this._canvas.style.display = 'none';
            this._canvas.className = 'win';
            this._canvas.innerHTML = 
                    '<div class="ui-bg win-title">'+
                        '<div class="win-icon"></div>' +
                        '<div class="t1 win-caption" _captureMouseEvent="true" el="caption">caption</div>' +
                        '<div class="win-button" el="button" _captureMouseEvent="true"></div>' +
                    '</div>' +
                    '<div class="win-client"></div>';
            this._client = this._canvas.childNodes[1];
            this._el_icon = this._canvas.childNodes[0].childNodes[0];
            this._el_caption = this._canvas.childNodes[0].childNodes[1];
            this._el_close = this._canvas.childNodes[0].childNodes[2];
            
            this._applyProperties(properties);
        },
        
        _event: {
            mousedown : function(element, evt){
                if (element.getAttribute('el')=='caption'){
                    jsf.Drag.start(evt, this);
                }
            },		
            mouseover : function(element){
                if (element.getAttribute('el')=='button'){
                    element.className = 'win-button win-button-over';
                }
            },
            mouseout : function(element){
                if (element.getAttribute('el')=='button'){
                    element.className = 'win-button';
                }
            },
            click : function(element){
                if (element.getAttribute('el')=='button'){
                    this.close(true);
                }
            }
        },
        
        _property: {
            caption: {
                type: "String",
                get: function() {
                    return this._caption;
                },
                set: function(value) {
                    this._el_caption.innerHTML = value;
                }
            },
        },
		
        _method: {            
            show: function(container, modal){
                this.create();
                
                container = container || jsf.System.application();
                
                hideCanvas(this);
                
                container._client.appendChild(this._canvas);
                
                //if (this._center){
                    jsf.Dom.setCenter(this._canvas);
                    if (!this._top){
                        this._top = this._canvas.offsetTop;
                    }
                    if (!this._left){
                        this._left = this._canvas.offsetLeft;
                    }
                //}
                
                var r = jsf.Dom.rect(this._canvas);
                showWindow(this, r, modal);
                
                return this;
            },
            
            showModal: function(container){
                this.show(container, true);
            },
            
            close: function(cancelable){
                var r = this.dispatch(jsf.Event.ON_CLOSE);
                
                if ( !(cancelable===true && r===false) ){
                    closeWindow(this);
                }
                
                return this;
            }
        },
        
        _static: {
            showMessageDialog: function(message, caption, buttons, callback){
                buttons = buttons || [JWindow.BT_YES];
            },
            
            showInputDialog: function(label, caption, callback){
                
            },
            
            showConfirmDialog: function(label, caption, callback){
                JWindow.showMessageDialog(label, caption, [JWindow.BT_YES, JWindow.BT_NO], callback);
            },
        
            BT_YES   : 'Yes',
            BT_NO    : 'No',
            BT_CANCEL: 'Cancel'
        }
    });
    
    function hideCanvas(win) {
        win._canvas.style.display = null;
        win._canvas.style.visibility = 'hidden';
    }

    function showCanvas(win) {
        win._canvas.style.display = null;
        win._canvas.style.visibility = null;
    }
	
    function showWindow(win, rect, modal) {
        hideCanvas(win);
        jsf.Popup.add({
            target: win,
            modal: modal,
            autohide: false
        });
        win.render();
        showCanvas(win);

        win._canvas.style.left = (win.left() || 5) + 'px';

        jsf.Effect.cssTransition({
            target: win,
            properties: {
                top: {from: '-100%', to: (win.top() || 5) + 'px'},
                opacity: {from: 0, to: 1}
            },
            complete: function() {
                win.onShow();
                win.dispatch(jsf.event.Event.ON_SHOW);
            }
        });
    }
	
    function closeWindow(win){
        jsf.core.Validator.clear( win );
        
        jsf.Effect.cssTransition({
            target    : win,
            properties: {
                top :   {to:'-100%'},
                opacity:{to:0}
            },
            complete: function(){
                jsf.Popup.remove(win);
                //win.dispatch(Event.ON_HIDE);
            }
        });
    }

}());
