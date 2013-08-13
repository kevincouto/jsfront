"use strict";

(function() {
    define("jsf.core.Alert",{
        _alias: "jsf.Alert",
        _constructor: function() {
            throw "Alert cannot be instantiated";
        },
        _static: {
            ICON_INFORMATION: 1,
            ICON_ERROR: 2,
            ICON_WARNING: 3,
            ICON_QUESTION: 4,
            BUTTON_OK: 0,
            BUTTON_CANCEL: 1,
            BUTTON_YES: 2,
            BUTTON_NO: 3,
            BUTTON_RETRY: 4,
            BUTTON_ABORT: 5,
            BUTTON_IGNORE: 6,
            BUTTONS_TEXT: ["Ok", "Cancel", "Yes", "No", "Retry", "Abort", "Ignore"],
            show: function(content, caption, icon, buttons, modal, callback) {
                return getAlert().show(content, caption, icon, buttons, modal, callback);
            }
        }
    });
   
    var alerts = {}, count = 0, defaultShowEffect, defaultHideEffectAlert;

    defaultShowEffect = {
        target: null,
        properties: {
            visibility: {from: ""},
            top: {from: '-{height}px', to: '10px'},
            opacity: {from: 0, to: 1}
        },
        complete: function() {
        }
    };
	
    defaultHideEffectAlert = {
        target: null,
        properties: {
            top    : {to: '-{height}px'},
            opacity: {from: 1, to: 0}
        },
        complete: function() {
        }
    };

    function getAlert() {
        var i, id, o;

        for (i in alerts) {
            if (!jsf.managers.PopupManager.isPopup(alerts[i])) {
                return alerts[i];
            }
        }

        id = "alertId_" + (count++);

        o = new Alert(id);
        alerts[id] = o;
        return o;
    }

    function prepareEffect(effect, properties, ui) {
        var s = JSON.stringify(effect), o;

        s = jsf.String.replace(s, properties);

        o = JSON.parse(s);
        o.target = ui;

        return o;
    }

    function Alert(id) {
        var ui = new jsf.ui.DisplayObject();

        ui.canvas().className = "alt";
        ui.canvas().innerHTML =
                '<table border="0" cellspacing="0" cellpadding="2">' +
                '<tr class="alt-caption">' +
                    '<td></td>' +
                    '<td style="width:10px"><div class="alt-bt-close"></div></td>' +
                '</tr>' +
                '<tr>' +
                    '<td colspan="2" class="alt-text"></td>' +
                '</tr>' +
                '<tr>' +
                    '<td colspan="2" class="alt-bt-area"></td>' +
                '</tr>' +
                '</table>';
        
        ui.rows = ui.canvas().firstChild.rows;
        
        ui.rows[2].cells[0].button_onClick = function(index) {
            jsf.managers.PopupManager.remove(ui);
            if (jsf.isFunction(ui._callback_)) {
                ui._callback_(index);
            }
        }
        
        this.show = function(content, caption, icon, buttons, modal, callback) {
            var 
                i, rect, showEffect, hideEffect, htmlButtons="",
                canvas = ui.canvas();
            
            ui.rows[0].cells[0].innerHTML = caption || jsf.managers.SystemManager.application().title();
            ui.rows[1].cells[0].innerHTML = content;
            
            //define os botões
            if (buttons && jsf.isArray(buttons)){
                for (i=0; i<buttons.length; i++){
                    htmlButtons += '<span onclick="this.parentNode.button_onClick('+buttons[i]+')">'+jsf.Alert.BUTTONS_TEXT[buttons[i]]+'</span>';
                }
            }
            ui.rows[2].cells[0].innerHTML = htmlButtons;
                
            //coloca o popup na aplicação ainda oculto, para poder conseguir capturar seu dimensionamento
            jsf.Dom.setNodeDisplayable(canvas, jsf.managers.SystemManager.application().canvas()).setCenter(canvas);
            
            ui._callback_ = callback;
            
            rect = jsf.Dom.rect(canvas);

            showEffect = prepareEffect(defaultShowEffect, rect, ui);
            hideEffect = prepareEffect(defaultHideEffectAlert, rect, ui);

            jsf.managers.PopupManager.add({
                target: ui,
                modal: modal,
                shadow: true,
                showEffect: showEffect,
                hideEffect: hideEffect
            });

            return this;
        }
    }
}());
