"use strict";

(function(){
    var active=null;
    
    function canReceiveFocus(component){
        var
            c1, c2, r = Boolean(component._focuset && (component instanceof jsf.ui.DisplayObject) && component.visible() && component.enabled());
        
        if (r) {
            c1 = component.canvas();
            c2 = component.parent().canvas();
            
            r = c1.offsetTop < c2.offsetHeight && c1.offsetLeft < c2.offsetWidth;
        }
        
        return r;
    }
    
    function nextComponentInContainer(container, component){
        var
            children, i, j,
            n = component ? 1 : 0;
        
        if (!container) {
            return null;
        }
        
        if (container){
            children = container.children(true);
            for (i=0; i<children.length; i++){
                if (children[i]==component || !component){
                    for (j=i+n; j<children.length; j++){
                        if ( canReceiveFocus(children[j]) ){
                            return children[j];
                        }
                    }
                }
            }
        }
        
        return null;
    }
    
    function firstComponent(container, component){
        var
            children, i, j,
            n = component ? 1 : 0;
        
        if (!container) {
            return null;
        }
        
        if (container){
            children = container.children(true);
            for (i=0; i<children.length; i++){
                if (children[i]==component || !component){
                    for (j=i+n; j<children.length; j++){
                        if ( canReceiveFocus(children[j]) ){
                            return children[j];
                        }
                    }
                }
            }
        }
        
        return null;
    }
    
    function enterFocus(component){
        component._hasFocus = true;
        component._hasValidate = 0;
        
        if (component._onenter()===false){
            component.updateDisplay();
        }
    }
    
    function exitFocus(component){
        var app = jsf.managers.SystemManager.application();
        
        if (app){
            app._canvas.focus();
        }
        
        component._hasFocus = false;
        //component._hasValidate = jsf.core.Validator.validate(component);
        
        if (component._onexit()===false){
            component.updateDisplay();
        }
    }
    
    function nextContainer(container) {
        var
            i, j, parent, children;
        
        if (!container) {
            return null;
        }
        
        parent = container.parent(),
        children = parent.children();
        
        for (i=0; i<children.length; i++) {
            if (children[i]==container) {
                for (j=i+1; j<children.length; j++) {
                    if (children[j] instanceof jsf.ui.JContainer && children[j].visible() && children[j].enabled()) {
                        return children[j];
                    }
                }
                for (j=0; j<i; j++) {
                    if (children[j] instanceof jsf.ui.JContainer && children[j].visible() && children[j].enabled()) {
                        return children[j];
                    }
                }
            }
        }
        
        return null;
    }
    
    define("jsf.managers.FocusManager", {
        _alias: "jsf.FocusManager",
        
        _static: {
            canReceiveFocus: function(component){
                return canReceiveFocus(component);
            },
            
            //define/retorna o componente com o foco
            activeFocus: function(component){        
                //get
                if (component===undefined){
                    return active;
                }
                
                //set
                if ( null!== component && canReceiveFocus(component)){
                    if ((component !== active)){
                        if (active){
                            exitFocus(active);
                        }

                        active = component;

                        enterFocus(active);
                    }else{
                        setTimeout(function(){active._onfocusex();},1);                        
                    }
                    
                    return active;
                }
                
                return null;
            },
            
            //define um componente filho com o foco
            childFocus: function(component, focus){  
                if ( canReceiveFocus(component) ){
                    if (focus){
                        enterFocus(component);
                    }else{
                        exitFocus(component);
                    }
                }
            },
            
            //retorna o próximo componente a receber o foco
            getNextFocusManagerComponent: function(){
                var container, ca, component=null, a=active, app=jsf.managers.SystemManager.application();
                
                if (!active){
                    
                }
                
                container = active.parent();
                
                //tenta encontrar no container pai do componente com o foco atual
                component = nextComponentInContainer(container, active);
                if (component){
                    return component;
                }
                
                //não encontrou, tenta encontar no próximo container do mesmo nível
                while (container) {
                    container = nextContainer(container);
                    component = nextComponentInContainer( container, null);
                    if (component){
                        return component;
                    }
                }
                
                //não encontrou, tenta encontrar no módulo
                component = nextComponentInContainer(active.module(), null);
                if (component){
                    return component;
                }
                
                return component;
            }
        }
    });
}());