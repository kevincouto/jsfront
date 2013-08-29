
"use strict";

/*
MAPEAMENTO DOS EVENTOS
	touchstart : none
	touchmove  : mousewheel
	touchend   : mousedown / mouseup / click
	dragstart  :
	drag       :
	dragend    :
	tap        : click
	doubletap  : TODO
	longpress  : TODO
*/

window._cancel_selection = true;
window._cancel_contextmenu = true;

document.oncontextmenu = function() {
	return false;
};
document.onselectstart = function() {
	return !window._cancel_selection;
};

(function() {
// private vars:
	var mdTarget = null,
            mdElementTarget=null,
            mdEvent,
            mdX = -1,
            mdY = -1,
            dragStarted = false,
            touchTarget = null,
            targetWithScrollbar = null,
            mOverUI = null,
            mOverElement = null,
            mouseOverDispatched = false,
            moved = false,
            moveStarted = false,
            startX = 0,
            startY = 0,
            lastTouchY = 0,
            lastTouchYDir = null,
            BOTTOM = 1,
            TOP = 2;
    
        define("jsf.event.MouseEvent",{
            _alias: "jsf.MouseEvent",
            _require: ["jsf.event.Event", "jsf.managers.FocusManager"],
            
            _constructor: function(evt) {
                return mouseEventObject(evt);
            },
		
            _static: {
                initialize: function() {
                    if (jsf.isTouchDevice){
                        document.body.addEventListener("touchstart", onTouchStart);
                        document.body.addEventListener("touchend", onTouchEnd);
                        document.body.addEventListener("touchmove", onTouchMove);
                    }else{
                        document.onmouseover = onMouseOver;
                        document.onclick     = onClick;
                        document.onmouseup   = onMouseUp;
                        document.onmousedown = onMouseDown;
                        document.onmousemove = onMouseMove;
                        if (window.addEventListener){ /** DOMMouseScroll is for mozilla. */
                            window.addEventListener('DOMMouseScroll', onMouseWheel, false);
                        }

                        window.onmousewheel = document.onmousewheel = onMouseWheel;
                    }
                },
			
            add: function(control, eventName, callback, context) {
                jsf.Event.add(control, eventName, callback, context);
            },
            activeContol: function() {
                return mdTarget;
            },
            getMouseEvent:function(){
                return mdEvent;
            },                    
            enabledEvents: function(e) {
                e._captureMouseEvent = true;
            },
            dispatch: function(control, eventName, event) {
                jsf.Event.dispatch(control, eventName, event);
            },
            isOver: function(control) {
                return control._mouseState.over;
            },
            isDown: function(control) {
                return control._mouseState.down;
            },
            
            CLICK       : 'onclick',
            DOUBLECLICK : 'DOUBLECLICK',
            MOUSE_DOWN  : 'onmousedown',
            MOUSE_UP    : 'onmouseup',
            MOUSE_OVER  : 'onmouseover',
            MOUSE_OUT   : 'onmouseout',
            DRAG_START  : 'ondragstart',
            DRAG_END    : 'ondragend',
            CONTEXT     : 'oncontext',
			
            MB_LEFT: 1,
            MB_RIGHT: 3
        }
    });
    
// private functions:
    function mouseEventDispatcher(ui, element, mouseEventName, eventObj){
        if (ui){
            //dispara o evento onDesignModeSelected da aplicação caso o componente esteja designMode = true 
            if (ui.designMode()) {
                if (ui._onComponentSelected && mouseEventName==jsf.event.MouseEvent.MOUSE_DOWN) {
                    ui._onComponentSelected(ui, eventObj);
                }
            }else{
                if (ui["_"+mouseEventName]){
                    ui["_"+mouseEventName](element, eventObj);
                }
                ui.dispatch(mouseEventName, eventObj);
            }
        }
    }
    
    function dispatchMouseOver(ui, element, evt) {
        if (!mouseOverDispatched) {
            ui._mouseState.over = true;
            mouseEventDispatcher(ui, element, jsf.event.MouseEvent.MOUSE_OVER, evt);
        }
        mouseOverDispatched = true;
    }

    function dispatchMouseOut(ui, element, evt) {
        ui._mouseState.over = false;
        mouseEventDispatcher(ui, element, jsf.event.MouseEvent.MOUSE_OUT, evt);
    }
	
    function processTouchStart(evt) {
        var ui;

        ui = touchTarget = jsf.Display.getByElement(evt.target);

        //encontra o componente que tem barra de rolagem, para dispachar o evento _onmousewheel
        targetWithScrollbar = ui;
        while (ui) {
            if (ui._withVScrollbarVisible || ui._withHScrollbarVisible) {
                targetWithScrollbar = ui;
                break;
            }
            ui = ui._parent;
        }

        startX = evt.touches[0].clientX;
        startY = evt.touches[0].clientY;

        moveStarted = false;
        moved = false;
    }
	
    function processTouchMove(evt) {
        var delta = {}, x, y;

        y = evt.touches[0].clientY;
        x = evt.touches[0].clientX;

        //se o apontador moveu-se mais de 10 pixel, define como movido e posteriormente(processTouchEnd) não dispara o evento TAP
        if ((x > 10) || (y > 10)) {
            moved = true;
        }

        if (moved && targetWithScrollbar) {
            delta.x = x - startX;
            delta.y = y - startY;
            delta.start = !moveStarted;

            targetWithScrollbar._onmousewheel(delta);

            moveStarted = true;
        }
    }

    function processTouchEnd(evt) {
        var target;

        lastTouchYDir = null;

        if (touchTarget) {
            if (!moved) { //tab event
                target = touchTarget._targetChild;

                touchTarget._mouseState.down = true;
                touchTarget._onmousedown(target || touchTarget._canvas, evt);
                touchTarget.dispatch(MouseEvent.MOUSE_DOWN, evt);

                setTimeout(function() {
                    touchTarget._mouseState.down = false;
                    touchTarget._onmouseup(target || touchTarget._canvas, evt);
                    touchTarget.dispatch(MouseEvent.MOUSE_UP, evt);

                    touchTarget._onclick(target || touchTarget._canvas, evt);
                    touchTarget.dispatch(MouseEvent.CLICK, evt);
                }, 100);
            } else {
                targetWithScrollbar._onmousewheel({end: true});
            }
        }
    }

    function onTouchStart(nativeEvent) {
        processTouchStart(touchEventObject(nativeEvent));
    }

    function onTouchEnd(nativeEvent) {
        processTouchEnd(touchEventObject(nativeEvent));
    }
    
    function onTouchMove(nativeEvent) {
        processTouchMove(touchEventObject(nativeEvent));
    }

    function onMouseDown(nativeEvent) {
        var target, evt, element;
        
        jsf.ui.DisplayObject.dragOverTarget = null;
        
        if (window.PopupOnMouseDown) {
            PopupOnMouseDown(nativeEvent);
        }

        evt = mdEvent = mouseEventObject(nativeEvent);

        mdTarget = jsf.Display.getByElement(evt.target);
        mdElementTarget = evt.target;

        if (mdTarget) {
            while (mdElementTarget && !mdElementTarget._captureMouseEvent && mdElementTarget!=mdTarget._canvas){
                mdElementTarget = mdElementTarget.parentNode;
            }
            
            mdTarget._mouseState.down = true;
            target = mdTarget._targetChild;
            element = target || (mOverElement || mdTarget._canvas);
            
            mouseEventDispatcher(mdTarget, element, jsf.event.MouseEvent.MOUSE_DOWN, evt);
            jsf.FocusManager.activeFocus(mdTarget);

            if (evt.mouseButton == jsf.MouseEvent.MB_RIGHT) {
                mouseEventDispatcher(mdTarget, element, jsf.event.MouseEvent.CONTEXT, evt);
            }
            
            //guarda as posições x e y
            mdX = evt.x;
            mdY = evt.y;
            
            dragStarted = false;
        }
    }

    function onMouseUp(nativeEvent) {
        var target, evt, ui, element;

        jsf.managers.DragManager._onmouseup(nativeEvent);

        if (mdTarget && mdTarget._enabled) {
            if (!mdTarget.designMode()) {
                evt = mouseEventObject(nativeEvent);
                target = mdTarget._targetChild;
                element= target || (mOverElement || mdTarget._canvas);
                
                //dispara o evento onmouseup
                mdTarget._mouseState.down = false;
                mouseEventDispatcher(mdTarget, element, jsf.event.MouseEvent.MOUSE_UP, evt);

                //dispara o evento ondragend
                if (dragStarted){
                    mouseEventDispatcher(mdTarget, element, jsf.event.MouseEvent.DRAG_END, evt);
                }

                //dispara o evento onclick
                ui = jsf.Display.getByElement(evt.target)
                if (ui == mdTarget) {
                    mouseEventDispatcher(ui, target || evt.target, jsf.event.MouseEvent.CLICK, evt);

                    if (ui._parent && ui._parent._captureChildMouseClick) {
                        mouseEventDispatcher(ui._parent, target || evt.target, jsf.event.MouseEvent.CLICK, evt);
                    }
                }
            }
        }
        
        mdTarget = null;
        dragStarted = false;
        
        return false;
    }

    function onClick(nativeEvent) {
        
    }

    function onMouseOver(nativeEvent) {
        var 
            evt = mouseEventObject(nativeEvent),
            ui = jsf.Display.getByElement(evt.target),
            target, isChild;

        if (ui) {
            if (ui.designMode()) {
                return;
            }

            mouseOverDispatched = false;
            target = ui._targetChild;

            if (mOverElement && mOverElement !== target) {
                dispatchMouseOut(ui, mOverElement, evt);
                mOverElement = null;
            }

            if (!mOverElement && target) {
                dispatchMouseOver(ui, target, evt);
                mOverElement = target;
            }

            if (mOverUI != ui) { // entrou no DisplayObject (ui)
                dispatchMouseOver(ui, ui._canvas, evt);

                if (mOverUI) {   // saiu do DisplayObject (mOverUI)
                    isChild = (mOverUI._isContainer && mOverUI.isChild(ui));
                    if (!isChild) {
                        dispatchMouseOut(mOverUI, mOverUI._canvas, evt);
                    }
                }
            }

            mOverUI = ui;
        }
    }
    
    var oldTargetUI;
    
    function onMouseMove(nativeEvent) {
        var evt, targetUI; 
        return;
        if (mdTarget){
            evt = mouseEventObject(nativeEvent);
            targetUI = jsf.Display.getByElement( evt.target );
                    
            if (!dragStarted){
                if (Math.abs(mdX - evt.x)>=4 || Math.abs(mdY - evt.y)>=4){
                    evt.x = mdX;
                    evt.y = mdY;
                    dragStarted = true;
                    mouseEventDispatcher(mdTarget, mdElementTarget, jsf.event.MouseEvent.DRAG_START, evt);
                }
            }else{
                if (targetUI != oldTargetUI){
                    console.log(targetUI)
                }
                oldTargetUI = targetUI;
            }
        }
    }

    function onMouseWheel(nativeEvent) {
        var 
            sb, ui, evt,
            delta = {
                x: null,
                y: null
            };

        evt = nativeEvent || window.event;

        if (evt.wheelDelta) { /* IE/Opera. */
            delta.x = evt.wheelDeltaX / 120;
            delta.y = evt.wheelDeltaY / 120;

            //In Opera 9, delta differs in sign as compared to IE.
            if (window.opera) {
                delta.x = -delta.x;
                delta.y = -delta.y;
            }
        } else if (evt.detail) { /** Mozilla case. */
            //In Mozilla, sign of delta is different than in IE. Also, delta is multiple of 3.
            delta.x = 0;//-(evt.detail/3);
            delta.y = -(evt.detail / 3);
        }

        evt = mouseEventObject(evt);
        ui = jsf.Display.getByElement(evt.target);
        sb = ui;

        //chama o evento mousewheel para o primeiro parent que encontrar
        while (ui) {
            if (ui._withVScrollbarVisible || ui._withHScrollbarVisible) {
                if (ui._onmousewheel) {
                    ui._onmousewheel(delta);
                }

                return;
            }
            ui = ui._parent;
        }

        if (sb && sb._onmousewheel) {
            sb._onmousewheel(delta);
        }
    }
    
    function mouseEventObject(nativeEvent) {
        var e = nativeEvent || window.event;

        return {
            type: 'mouseEvent',
            mouseButton: e.which || e.button,
            keyCode: e.which || e.keyCode,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            target: e.target || e.srcElement,
            // source: e,
            x: e.clientX,
            y: e.clientY
        };
    }
	
    function touchEventObject(nativeEvent) {
        var e = nativeEvent || window.event;

        nativeEvent.preventDefault();

        return {
            type: 'touchEvent',
            mouseButton: e.which || e.button,
            keyCode: e.which || e.keyCode,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            target: e.srcElement,
            touches: e.touches,
            // source: e,
            x: e.clientX,
            y: e.clientY
        };
    }
	
}());