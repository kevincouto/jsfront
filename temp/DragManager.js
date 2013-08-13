"use strict";

(function(){
    //informações sobre o que está sendo arrastado
    //private vars
    var 
        divBackground,
        startDragEvent,
        isDragging = false,
        dragData = {
            ui: null,
            element: null,
            clientX: 0,
            clientY: 0
        },
        startDragObj = {
            dragImage: function(){
                startDragEvent.dataTransfer.setDragImage(crt, 0, 0);
            }
        };
    
    var icon = document.createElement('img');icon.src = "http://twitter.com/api/users/profile_image/twitter?size=mini";
    
    /**
     * @class jsf.managers.DragManager
     */
    define("jsf.managers.DragManager", {
        _alias: "jsf.DragManager",
        
        _static:{
            //true se existe arrasto em progresso
            isDragging: function(){
                return isDragging;
            },
            
            /**
             * @lends jsf.managers.DragManager
             * @param {type} uiOrElement
             * @returns {undefined}
             */
            setDraggable: function(uiOrElement){
                if (uiOrElement instanceof jsf.ui.DisplayObject){
                    uiOrElement._client.setAttribute("draggable", "true");
                }else{
                    uiOrElement.setAttribute("draggable", "true");
                }
            },
            
            //define que um componente poderá receber objetos arrastados
            setDropped: function(ui, flag){
                var e=ui._client;
                
                e.removeEventListener("dragover",  onDragMove);
                e.removeEventListener("dragleave", onDragExit);
                e.removeEventListener("dragenter", onDragEnter);
                e.removeEventListener("drop",      onDrop);
                
                if (flag){
                    e.addEventListener("dragover",  onDragMove, false);
                    e.addEventListener("dragleave", onDragExit, false);
                    e.addEventListener("dragenter", onDragEnter, false);
                    e.addEventListener("drop",      onDrop, false);
                }
            },
                    
            //Chame esse método a partir de seu manipulador de eventos dragEnter se você aceitar os dados de arrastar / soltar. 
            //Normalmente, você joga event.target para o tipo de destino de soltar dados. No exemplo a seguir, o destino de soltar é um recipiente Canvas MX:
            acceptDragDrop: function(ui){
                
            },
            
            /**
             * 
             * @param {jsf.ui.DisplayObject} dragUIInitiator
             * @param {Object} dragSource
             * @param {type} dragImage
             * @param {Number} xOffset
             * @param {Number} yOffset
             * @param {Boolean} allowMove
             * @returns {undefined}
             */
            doDrag: function(dragUIInitiator, dragSource, dragImage, xOffset, yOffset, allowMove){
                jsf.managers.DragManager.setDraggable(dragUIInitiator);
            }
        }
    });        
    
    //ao iniciar o arrasto
    function onDragStart(evt){
        var 
            r,
            ui = jsf.ui.DisplayObject.getByElement(evt.target);
        
        dragData.ui = ui;
        dragData.element = evt.target;
        dragData.clientX = null;
        dragData.clientY = null;
        
        if (ui){
            r = ui._ondragstart(dragData);
            //evt.dataTransfer.setDragImage(icon, -2, -2);
            //return true;
        }console.log(9)
        evt.preventDefault();
        return false;
    }
    
    //arrastando sobre área dropped
    function onDragMove(evt){
        var ui;
        
        evt.preventDefault();
        
        if (dragData.clientX != evt.offsetX || dragData.clientY != evt.offsetY){
            dragData.clientX = evt.offsetX;
            dragData.clientY = evt.offsetY;
            
            ui = jsf.ui.DisplayObject.getByElement(evt.target);
            
            if (dragData.ui){ console.log(0)
                dragData.ui._ondragenter(evt);
            }

            if (ui){
                ui._ondragmove(dragData);
            }
        }
    }
    
    //entrar
    function onDragEnter(evt){
        evt.preventDefault();
        setDragOverClass(evt, true);
        
        if (dragData.ui){
            dragData.ui._ondragenter(evt);
        }
    }
    
    //sair
    function onDragExit(evt) {
        setDragOverClass(evt, false);
        if (dragData.ui){
            dragData.ui._ondragexit(evt);
        }
    }
    
    //soltar
    function onDrop(evt) {
        setDragOverClass(evt, false);
        if (dragData.ui){
            dragData.ui._ondrop(evt);
        }
    }
    
    function setDragOverClass(evt, flag){
        var ui = jsf.ui.DisplayObject.getByElement(evt.target);
        
        if (ui){
            if (ui._rules && ui._rules.dragOver){
                flag ? jsf.Dom.addClass(evt.target, ui._rules.dragOver) : jsf.Dom.removeClass(evt.target, ui._rules.dragOver);
            }
        }
    }
    
    function dragEventObject(nativeEvent) {
        nativeEvent.preventDefault();

        return {
            type: 'dragEvent',
            dataTransfer: nativeEvent.dataTransfer,
            keyCode: nativeEvent.keyCode,
            alt    : nativeEvent.altKey,
            ctrl   : nativeEvent.ctrlKey,
            shift  : nativeEvent.shiftKey,
            target : nativeEvent.srcElement,
            touches: nativeEvent.touches,
            x: nativeEvent.offsetX,
            y: nativeEvent.offsetY
        };
    }
    
    function showBackgroundBase(flag, cursor) {
        if (!divBackground) {
            divBackground = document.body.appendChild(jsf.Dom.create('div', 'cursor:move;position:absolute;top:0;left:0;width:100%;height:100%;display:none;background:transparent', 'noselect'));
        }

        if (divBackground._flag === flag) {
            return;
        }

        divBackground.style.cursor = cursor || 'move';
        divBackground.style.zIndex = 999999;
        divBackground.style.display = flag ? '' : 'none';
        
        divBackground.flag = flag;
    }
    
    function onMouseMove(evt) {
        var x, y, r;

        if (!dragTarget) {
            return null;
        }

        showBackgroundBase(true, _cursor);

        r = true;
        evt = evt || window.event;

        y = evt.clientY - dragOffsetY;
        x = evt.clientX - dragOffsetX;

        // chama o ondraging do DisplayObject
        if (dragTarget instanceof jsf.ui.DisplayObject) {
            r = dragTarget._ondraging(dragTarget, x, y, evt.clientX, evt.clientY);
        }

        // Se a função do evento ondraging retornar false, não arrasta, isso fica por conta da função chamada
        if (r) {
            dragTarget.style.top = y + 'px';
            dragTarget.style.left = x + 'px';
        }
        
        return false;
    }
    
    document.addEventListener("mousemove", function(evt){
        
    }, false);
    
    document.addEventListener("dragstart", onDragStart, false);
    //document.addEventListener("dragover",  onDragMove, false);
}());
