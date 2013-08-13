"use strict";

(function() {    
    /*
     * Properties
     *      [OK] duration="500"
     *      [OK] repeatCount="1"
     *      [OK] repeatDelay="0"
     *      [OK] startDelay="0"
     *      [OK] target="effect target"
     *      targets="array of effect targets"
     *      suspendBackgroundProcessing="false|true"
     *      filter=""
     *      hideFocusRing="false"
     *      perElementOffset="0"
     *      customFilter=""
     * 
     * Events
     *      [OK] effectEnd="No default"
     *      [OK] effectStart="No default"
     *      effectStop
     * 
     * Methods
     *      [OK] play()
     *      end()
     *      resume()
     *      reverse()
     * 
     * Events Protected
     *      applyValueToTarget(property, value, target)
    */
    
    define("jsf.effect.Effect", {
        _alias: "jsf.Effect",
        
        _constructor: function(){
            throw "Effect cannot be instantiated";
        },
        
        _static: {
            /*
             * options = {
             *     target:HTMLElement|DisplayObject
             *     properties:{
             *         {top: {from:'0', to:'100%', duration:'0.3s', timing:'ease-in'}}
             *     },
             *     complete:function(target){}
             * }
            */
           cssTransition: function(options){
               var p='', from={}, to={}, v = '', s='', i, el, prefix = jsf.managers.BrowserManager.jsCssPrefix;
               
               if (!options || (options && !options.target)){
                   return;
               }
               
               el = (options.target instanceof jsf.Display) ? options.target._canvas : options.target;
               
               //prepara o css da transição
               for (i in options.properties){
                   p = options.properties[i];
                   
                   p.duration = p.duration || '0.3s';
                   p.timing = p.timing || 'ease';
                   
                   if (p.from != undefined){
                       switch (i){
                           case 'scale': from['-'+prefix+'-transform'] = 'scale('+p.from+')'; break;
                           default: from[i] = p.from;
                       }
                   }
                   
                   if (p.to != undefined){
                       switch (i){
                           case 'scale': to['-'+prefix+'-transform'] = 'scale('+p.to+')'; break;
                           default: to[i] = p.to;
                       }
                   }
                   
                   if (i=='scale'){
                       i = '-'+prefix+'-transform';
                   }
                   
                   s += v + i + (p.duration?' '+p.duration:'') + (p.timing?' '+p.timing:'');
                   v = ', ';
               }
               
               //aplica os valores iniciais
               transitionStart(el, from, options.start);
               
               //aplica os valores finais               
               setTimeout(function(){trasitionEnd(el, to, options.complete, s);},1);
           },
           
           view: function(activeView, deactiveView, effect){
                effect = effect || jsf.effect.Effect.FADE;
                
                //oculta a view desativada
                if (deactiveView){
                    jsf.Effect.cssTransition({
                        target    : deactiveView,
                        properties: effect.deactive,
                        complete  : function(e){
                            
                        }
                    });
                }
                
                //exibe a view ativada
                if (activeView) {
                    jsf.Effect.cssTransition({
                        target    : activeView,
                        properties: effect.active,
                        start: function(e){
                            activeView.visible(true).parent().render();
                        },
                        complete  : function(e){
                            
                        }
                    });	
                }
                
           },
           
           FADE:{
                deactive:{
                    "opacity": {to:0},
                    "display": {to:"none"}
                },
                active:{
                    "opacity": {from:0, to:1},
                    "display": {from:"block"}
                }
           }
        }
    });
    
    jsf.core.ViewState = function() {
        var views = [], activeIndex=0,
            tran,
            trans={
                FADE:{
                    deactive:{
                        "opacity": {to:0},
                        "display": {to:"none"}
                    },
                    active:{
                        "opacity": {from:0, to:1},
                        "display": {from:"block"}
                    }
               },
               HSLIDE:{
                    deactive:[
                        {
                            "left":    {from:"0", to:"-100%"},
                            "display": {to:"none"}
                        },
                        {
                            "left":    {from:"0", to:"100%"},
                            "display": {to:"none"}
                        }
                    ],
                    active:[
                        {
                            "left": {from:"100%", to:"0"},
                            "display": {from:"block"}
                        },
                        {
                            "left": {from:"-100%", to:"0"},
                            "display": {from:"block"}
                        }
                    ]
               }
            };
        
        tran = trans.HSLIDE;
        
        this.transition = function(value){
            
        }
        
        this.add = function(container){
            var i;
            
            for (i=0; i<views.length; i++) {
                if (views[i].id() == container.id()) {
                    return;
                }
            }
            views.push(container);
        }
        
        this.next = function(){
            var i = activeIndex+1, v1, v2, e={deactive:{}, active:{}}, ii;
            
            if (i>views.length-1) {
                i = 0;
            }
            
            v1 = views[activeIndex];
            v2 = views[i];
            
            ii = i>activeIndex ? 0 : 1;
            
            e.deactive = (jsf.isArray(tran.deactive)) ? tran.deactive[ii]: tran.deactive;
            e.active   = (jsf.isArray(tran.active))   ? tran.active[ii]:   tran.active;
            
            //console.log(e);  console.log("deactive"); console.log(v1.canvas());  console.log("active"); console.log(v2.canvas());
            
            jsf.effect.Effect.view(v2, v1, e);
            
            activeIndex = i;
            //console.log(activeIndex);
        }
        
        this.previous = function(){
            
        }
    }
    
    function transitionStart(el, from, startCallback) {
        var i;
        
        if (el._transitionInProgress_) {
            transitionStop(el);
        }
        
        el._transitionInProgress_ = true;
        
        el.style[jsf.managers.BrowserManager.jsCssPrefix+'Transition'] = '';
        for (i in from){
            el.style[i] = from[i];
        }
        
        if (startCallback){
            startCallback(el);
        }
        
        for (i in from){
            el.style[i] = from[i];
        }
    }
    
    function trasitionEnd(el, to, endCallback, style) {
        var i;
        
        el.style[jsf.managers.BrowserManager.jsCssPrefix+'Transition'] = style;
        for (i in to){
            if (i=="display") {
                el._endDisplay = "none";
            }else{
                el.style[i] = to[i];
            }
        }
        
        el.onTransitionEndCallback = function(e){
            jsf.event.Event.stopPropagation(e);
            
            transitionStop(e.target);
            
            if (endCallback){
                endCallback(e.target);
            }
        }
        
        el.addEventListener(jsf.managers.BrowserManager.jsCssPrefix+"TransitionEnd", el.onTransitionEndCallback, true);
    }
    
    function transitionStop(el) {
        el.removeEventListener(jsf.managers.BrowserManager.jsCssPrefix+"TransitionEnd", el.onTransitionEndCallback, true);
        el.style[jsf.managers.BrowserManager.jsCssPrefix+'Transition'] = '';
        
        if (el._endDisplay) {
            el.style.display = "none";
        }
        
        delete(el._endDisplay);
        delete(el._transitionInProgress_);
        delete(el.onTransitionEndCallback);
    }
    
    /*
    Effect.create = function(options, f){
        if (options && options.target){
            return {
                _repeatCount:0,
                fRun: f,
                fEffectEnd:function(){
                    if (options.effectEnd){
                        options.effectEnd(options.target, this._repeatCount);
                    }
                    
                    if (options.repeatCount && options.repeatCount<this._repeatCount){
                        this.run();
                    }                    
                },
                run : function(){
                    var delay = this._repeatCount==0 ? options.startDelay : options.repeatDelay;
                    
                    if (delay){
                        setTimeout(function(){
                            this._repeatCount++;
                            this.fRun(options, this.fEffectEnd);
                        }, delay);
                    }else{
                        this._repeatCount++;
                        this.fRun(options, this.fEffectEnd);
                    }
                }
            };
        }
        
        return {
            run : function(){}
        };
    };
    
    Effect.fade = function(options){
        var func;
        
        func = function(opt, effectEnd){
            var i=0, f=1, d='1s';
            
            if (opt.mode=='out'){
                i=1;
                f=0;
                d='0.6s';
            }
            
            Effect.cssTransition({
                target  : opt.target,
                start   : opt.effectStart,
                complete: effectEnd,
                properties:{
                    opacity:{from:i, to:f, duration:opt.duration || d}
                }
            });
        };
        
        return Effect.create(options, func);
    };
    
    //fadeZomm
    Effect.fadeZoom = function(options){
        var func;
        
        func = function(opt, effectEnd){
            var i=0, f=1;
            
            if (opt.mode=='in'){
                i=1;
                f=0;
            }
            
            Effect.cssTransition({
                target  : opt.target,
                start   : opt.effectStart,
                complete: effectEnd,
                properties:{
                    opacity:{from:i, to:f, duration:opt.duration || '0.6s'},
                    scale:{from:i, to:f, duration:opt.duration || '0.6s'}
                }
            });
        };
        
        return Effect.create(options, func);
    };
    
    //piscar
    Effect.pulsate = function(options){
        var func;
        
        func = function(opt, effectEnd){
            var count=0, i=1, f=0, max=opt.count || 3, el=opt.target;
            
            function execute(){
                Effect.cssTransition({
                    target  : el,
                    start   : function(){
                        if (count==0 && opt.effectStart){
                            opt.effectStart(el);
                        }
                    },
                    complete: function(){
                        if (count==max){
                            effectEnd();
                        }else{
                            i = i==0 ? 1 : 0;
                            f = f==0 ? 1 : 0;
                            count++;
                            
                            execute();
                        }                    
                    },
                    properties:{
                        opacity:{from:i, to:f, duration:opt.duration || '0.1s'}
                    }
                });
            }
            
            execute();
        };
        
        return Effect.create(options, func);
    };
    
    function preparePuffProperties (opt, rect, inOut){
        var show, prop, h, w, p, d, t;
        
        w = Dom.getWidth(document.body);
        h = Dom.getHeight(document.body);
        
        d = opt.duration || '0.7s';
        t = opt.timing || 'ease-out';
                
        show = {
            'top-left':{
                left : {from:'-'+rect.width+'px'},
                top  : {from:'-'+rect.height+'px'}
            },
            'top-right':{
                left : {from:w+'px'},
                top  : {from:'-'+rect.height+'px'}
            },
            'top-middle':{
                left : {from:(parseInt(w/2,10)-parseInt(rect.width/2,10))+'px'},
                top  : {from:'-'+rect.height+'px'}
            },
            'bottom-left':{
                left : {from:'-'+rect.width+'px'},
                top  : {from:h+'px'}
            },
            'bottom-right':{
                left : {from:w+'px'},
                top  : {from:h+'px'}
            },
            'bottom-middle':{
                left : {from:(parseInt(w/2,10)-parseInt(rect.width/2,10))+'px'},
                top  : {from:h+'px'}
            }
        };
        
        prop = show[opt.position] || show['top-left'];
            
        prop.left.duration = prop.top.duration = d;
        prop.left.timing   = prop.top.timing   = t;
        prop.left.to       = rect.left+'px';
        prop.top.to        = rect.top+'px';
        prop.opacity       = {from:0, to:1, duration:d, timing:t};
        prop.height        = {from:rect.height+'px'};
        prop.width         = {from:rect.width+'px'};
        prop['z-index']    = {from:999999};
        
        if (inOut=='out'){
            p = prop.left.from; prop.left.from = prop.left.to; prop.left.to = p;
            p = prop.top.from;  prop.top.from  = prop.top.to;  prop.top.to = p;
            prop.opacity = {from:1, to:0, duration:d, timing:t};
        }
        
        return prop;        
    }
    
    //aparecer de um canto da tela até a posição original
    Effect.puffIn = function(options){
        var func;
        
        func = function(opt, effectEnd){
            var el    = opt.target,
                e     = (el instanceof DisplayObject) ? el._canvas : el,
                parent= e.parentNode,
                before= e.nextSibling,
                css   = e.style.cssText,
                rect, prop;
            
            Dom.style(e,{
                display:'',
                visibility:'hidden'
            });
            
            rect = Dom.rect(e);
            prop = preparePuffProperties(options, rect, 'in');
            prop.visibility = {from:''};
            
            Effect.cssTransition({
                target  : el,
                start   : function(){
                    document.body.appendChild(e);
                    if (opt.effectStart){
                        opt.effectStart(el);
                    }
                },
                complete: function(){
                    e.style.cssText = css;
                    
                    Dom.style(e,{
                        display:null,
                        visibility:null
                    });
                    
                    if (parent){
                        parent.insertBefore(e, before);
                    }
                    
                    effectEnd();
                },
                properties: prop
            });
        };
        
        return Effect.create(options, func);
    };
    
    //desaparece para um canto da tela
    Effect.puffOut = function(options){
        var func;
        
        func = function(opt, effectEnd){
            var el    = opt.target,
                e     = (el instanceof DisplayObject) ? el._canvas : el,
                parent= e.parentNode,
                before= e.nextSibling,
                css   = e.style.cssText,
                rect  = Dom.rect(e),
                prop = preparePuffProperties(options, rect, 'out');
            
            if (e.offsetWidth==0){
                return;
            }
            
            Effect.cssTransition({
                target  : el,
                start   : function(){
                    document.body.appendChild(e);
                    if (opt.effectStart){
                        opt.effectStart(el);
                    }
                },
                complete: function(){
                    e.style.cssText = css;
                    e.style.display = 'none';
                    
                    if (parent){
                        parent.insertBefore(e, before);
                    }
                    
                    effectEnd();
                },
                properties: prop
            });
        };
        
        return Effect.create(options, func);
    };
    */
}());