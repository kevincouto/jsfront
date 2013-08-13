"use strict";

(function(){
    var 
        nativeDrag,
        emulateDrag,
        background,
        doDragDefaulOptions = {
            dragSource: null,
            dragImage:null,
            dragElement:null,
            dragData:null,
            xOffset:0, 
            yOffset:0,
            allowMove:true,
            cursor:"default"
        },
        dragOptions = {};
    
    define("jsf.managers.DragManager", {
        _alias: "jsf.DragManager",
        _static: {
            //true se existe arrasto em progresso
            isDragging: function(){
                return isDragging;
            },
            
            /**
             * @lends jsf.managers.DragManager
             * @param {type} uiOrElement
             * @returns {undefined}
             */
            setDraggable: function(uiOrElement, draggable){
                var e;
                
                draggable = draggable===undefined ? true : draggable;
                
                if (uiOrElement instanceof jsf.ui.DisplayObject){
                    e = uiOrElement._client;
                }else{
                    e = uiOrElement;
                }
                
                draggable ? e.setAttribute("draggable", "true"): e.removeAttribute("draggable");
            },
            
            //define que um componente poderá receber objetos arrastados
            dropEnabled: function(ui, enabled){
                var e = ui.canvas();
                
                e.removeEventListener("dragover",  nativeDrag.onDragMove);
                e.removeEventListener("dragleave", nativeDrag.onDragExit);
                e.removeEventListener("dragenter", nativeDrag.onDragEnter);
                e.removeEventListener("drop",      nativeDrag.onDrop);
                
                if (enabled){
                    e.addEventListener("dragover",  nativeDrag.onDragMove, false);
                    e.addEventListener("dragleave", nativeDrag.onDragLeave, false);
                    e.addEventListener("dragenter", nativeDrag.onDragEnter, false);
                    e.addEventListener("drop",      nativeDrag.onDrop, false);
                }
            },
                    
            //Chame esse método a partir de seu manipulador de eventos dragEnter se você aceitar os dados de arrastar / soltar. 
            //Normalmente, você joga event.target para o tipo de destino de soltar dados. No exemplo a seguir, o destino de soltar é um recipiente Canvas MX:
            acceptDragDrop: function(ui){
                
            },
                    
            //options: {dragSource, dragImage, dragElement, xOffset, yOffset, allowMove, cursor}
            doDrag: function(control, options) {
                if (!control) {
                    return false;
                }

                dragOptions = jsf.util.Object.mergeDefaultOptions(options, doDragDefaulOptions);

                //se dragImage=null, será arrastado o próprio componente
                if (dragOptions.dragImage == null) {
                    emulateDrag.doDrag(control);
                } else {
                    nativeDrag.doDrag(control);
                }
            }
        }
    });
    
    
//private functions:
    function dragEventDispatcher(ui, element, eventName, eventObj){
        if (ui){
            if (ui["_"+eventName]){
                ui["_"+eventName](element, eventObj);
            }
            ui.dispatch(eventName, eventObj);
        }
    }
    
    emulateDrag = {
        createHtmElementlClone: function(el) {
            var
                    e = el.cloneNode(true),
                    r = jsf.Dom.rect(el);

            e.style.top = r.top + 'px';
            e.style.left = r.left + 'px';
            e.style.width = r.width + 'px';
            e.style.height = r.height + 'px';
            e.style.zIndex = 1000;

            //if (e.style.background.toUpperCase().indexOf('TRANSPARENT') >= 0) {
            e.style.opacity = '0.8';
            e.style.background = 'Highlight';
            e.style.color = 'HighlightText';
            //}

            //e.style.visibility = 'hidden';
            //e.isCloned = true;
            //e.nodeOriginal = el;

            return document.body.appendChild(e);
        },
        showBackground: function(show, cursor) {
            if (!background) {
                background = document.body.appendChild(jsf.Dom.create('div', 'position:absolute;top:0;left:0;width:100%;height:100%;background:transparent', 'noselect'));
                background.onmousemove = emulateDrag.onMouseMove;
            }

            background.style.cursor = cursor || 'move';
            background.style.zIndex = 999999;
            background.style.display = show ? '' : 'none';
        },
        onMouseMove: function(nativeEvent) {
            var
                    x, y,
                    r = true;

            y = nativeEvent.clientY - dragOptions.offsetY;
            x = nativeEvent.clientX - dragOptions.offsetX;

            //dispara o evento ondraging do DisplayObject
            r = dragOptions.dragTarget._ondraging(x, y, nativeEvent.clientX, nativeEvent.clientY);

            // Se a função do evento ondraging retornar false, não arrasta, isso fica por conta da função chamada
            if (r !== false) {
                dragOptions.dragElement.style.top = y + 'px';
                dragOptions.dragElement.style.left = x + 'px';
            }

            return false;
        },
        onMouseUp: function(evt) {
            var element;

            emulateDrag.showBackground(false);

            if (!dragOptions.allowMove) { // Se foi arrastado um clone, elimina-o
                jsf.Dom.remove(dragOptions.dragElement);
            }

            //drag drop html5 native
            if (dragOptions.dragImage) {
                element = dragOptions.dragElement || (dragOptions.dragTarget ? dragOptions.dragTarget.canvas() : null);

                if (element) {
                    jsf.managers.DragManager.setDraggable(element, false);
                }
            }

            // Se o elemento estiver o evento ondragend, chama o evento
            if (dragOptions.dragTarget) {
                dragOptions.dragTarget._ondragend(dragOptions);
                dragOptions.dragTarget._onmouseup(dragOptions.dragElement, evt);
            }

            dragOptions = {};
        },
        doDrag: function(display) {
            var
                    element = dragOptions.dragElement || display.canvas(),
                    evt = jsf.event.MouseEvent.getMouseEvent();

            //element._classNameOld = element.className;
            //element.className += ' noselect';
            element.oStyle = element.style.cssText;
            element.style.position = 'absolute';

            dragOptions.dragType = "DisplayObject";
            dragOptions.dragTarget = display;
            dragOptions.dragElement = dragOptions.allowMove ? element : emulateDrag.createHtmElementlClone(element);
            dragOptions.offsetX = evt.x - dragOptions.dragElement.offsetLeft;
            dragOptions.offsetY = evt.y - dragOptions.dragElement.offsetTop;

            emulateDrag.showBackground(true, dragOptions.cursor);

            //avisa ao componente pai do elemento a ser arrastado que está iniciando um arrasto do seu filho
            /*if (_uiTarget) {
             //c._ondragstart(htmlElement);
             }*/
        }
    };
    
    nativeDrag = {
        mouseOverElement: null,
        doDrag: function(display){
            var 
                element = dragOptions.dragElement || display.canvas();
            
            jsf.managers.DragManager.setDraggable(element);

            dragOptions.dragType = "DisplayObject";
            dragOptions.dragTarget = display;
            dragOptions.dragElement= element;
        },     
        //ao iniciar o arrasto
        onDragStart: function(evt) {
            var ui;
            
            dragOptions.dropTarget=null;
            
            evt.dataTransfer.setDragImage(dragOptions.dragImage, dragOptions.xOffset, dragOptions.yOffset);
            
            dragOptions.dragOffsetX = evt.x;
            dragOptions.dragOffsetY = evt.y;
            
            ui = jsf.ui.DisplayObject.getByElement(evt.target);
            dragEventDispatcher(ui, null, "ondragstart", dragOptions);
            
            a = 0;
        },
        
        //arrastando sobre área dropped
        onDragMove: function(evt) {
            var ui;
            
            evt.preventDefault();
            
            if (dragOptions.clientX != evt.offsetX || dragOptions.clientY != evt.offsetY) {
                ui = jsf.ui.DisplayObject.getByElement(evt.target);
                
                if (dragOptions.dropTarget != ui && (ui instanceof jsf.JContainer)){
                    nativeDrag.dispatchDragExit(dragOptions.dropTarget);
                    nativeDrag.dispatchDragEnter(ui);
                }
                
                dragOptions.clientX = evt.x-dragOptions.dropElement.rect.left;
                dragOptions.clientY = evt.y-dragOptions.dropElement.rect.top;
                
                dragEventDispatcher(dragOptions.dropTarget, null, "ondragmove", dragOptions);
            }
        },
        //ao entrar em uma elemento dropped
        onDragEnter: function(evt) {
            var ui;
            
            evt.stopPropagation();
            evt.preventDefault();
            
            if (dragOptions.dropTarget==null){
                ui = jsf.ui.DisplayObject.getByElement(evt.target);
                nativeDrag.dispatchDragEnter(ui);
            }
            a++;
        },
        //ao sair
        onDragLeave: function(evt) {
            setTimeout(function(){
                a--;
                if (a === 0) {
                    nativeDrag.dispatchDragExit(dragOptions.dropTarget);
                }
            },1);
        },
        //soltar
        onDrop: function(evt) {
            nativeDrag.setDragOverClass(dragOptions.dropElement, false);
            dragEventDispatcher(dragOptions.dropTarget, null, "ondrop", dragOptions);
        },
        dispatchDragEnter:function(ui){
            var 
                e = ui.canvas(),
                r = jsf.Dom.rect(e);
            
            //console.log('DragEnter ' + ui.id());
                            
            dragOptions.dropTarget = ui;
            dragOptions.dropElement = e;
            dragOptions.dropElement.rect = r;
            
            nativeDrag.setDragOverClass(e, true);
            dragEventDispatcher(ui, null, "ondragenter", dragOptions);
        },
        dispatchDragExit:function(ui){
            var e;
            
            if (ui){
                e = ui.canvas();
                //console.log('DragExit ' + ui.id());
                nativeDrag.setDragOverClass(e, false);
                dragEventDispatcher(ui, null, "ondragexit", dragOptions);
                dragOptions.dropTarget=null;
            }
        },        
        setDragOverClass: function(element, flag) {
            var ui = jsf.ui.DisplayObject.getByElement(element);

            if (ui) {
                if (ui._rules && ui._rules.dragOver) {
                    flag ? jsf.Dom.addClass(element, ui._rules.dragOver) : jsf.Dom.removeClass(element, ui._rules.dragOver);
                }
            }
            
            return ui;
        }
    };
    var a=[];
    
    document.addEventListener("dragstart", nativeDrag.onDragStart, false);
    //document.body.addEventListener("dragleave", nativeDrag.onDragLeave, false);    
    
    jsf.managers.DragManager._onmouseup = emulateDrag.onMouseUp;
}());