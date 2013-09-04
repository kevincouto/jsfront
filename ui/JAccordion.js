"use strict";

(function() {

    define("jsf.ui.JAccordion", {
        _require: ["jsf.ui.JContainer"],
        _alias: "jsf.JAccordion",
        _extend: "container",
        _xtype: "accordion",
        
        _constructor: function(properties) {
            jsf.ui.JContainer.call(this);

            this._activeSection = 0;

            this._applyProperties(properties);
        },
        _event: {
            resize: function(){
                render(this);
            },
            click: function(element, evt) {
                var i;
                
                if (element.getAttribute("class").indexOf("accordion_head")>=0) {
                    i = element.parentNode.sectionIndex;
                    if (this._activeSection != i) {
                        this._activeSection = i;
                        render(this, true);
                    }
                }
            }
        },
        _static: {
            
        },
        _property:{
            activeSection: {
                type:"Number",
                get: function() {
                    return this._activeSection;
                },
                set: function(value){
                    this._activeSection = value;
                    this.updateDisplay();
                }
            }
        },
        _public: {
            /**
             * override jsf.ui.JContainer.add
             */
            add: function(container) {
                var d;

                if (!(container instanceof jsf.ui.JContainer)) {
                    jsf.exception("child not instance of jsf.ui.JContainer");
                    return container;
                }
                
                jsf.ui.JContainer.prototype.add.call(this, container);
                
                //cria um elemento título para o container
                d = this._client.appendChild(jsf.Dom.create("div", false, "accordion_section"));
                d.innerHTML = '<div class="accordion_head" _captureMouseEvent="true"><div class="accordion_caption">' + container._caption + '</div></div>';
                d.appendChild(container.canvas());
                
                container._section = d;
                return container;
            },
            render: function() {
                render(this);
                return this;
            }
        }
    });

//private vars:
    var _headHeight;

//private functions:
    function render(acc, effect){
        var 
            i, h, c, ht, ha;
                
        ht = acc._client.offsetHeight; //altura total
        h  = headHeight(acc);          //altura da área de título da seção
        c  = acc.children();           //seções

        //calcula a altura da seção aberta
        ha = ht - ((c.length-1)*h);

        for (i=0; i<c.length; i++) {
            c[i]._section.sectionIndex = i;
            
            if (effect){
                if (i == acc._activeSection) {
                    c[i]._section.style.height = ha+"px";
                    c[i]._section.firstChild.className="accordion_head active";
                    c[i].updateDisplay();
                    c[i]._section.style.height = h+"px";
                }else{
                    c[i]._section.firstChild.className="accordion_head";
                }

                jsf.effect.Effect.cssTransition({
                    target: c[i]._section,
                    properties: {
                        height: {to: (i == acc._activeSection ? ha : h) + 'px', timing:"ease-in-out"}
                    }
                });
            }else{
                if (i == acc._activeSection) {
                    c[i]._section.style.height = ha+"px";
                    c[i].updateDisplay();
                }else{
                    c[i]._section.style.height = h+"px";
                }
            }
        }
    }
    
    function headHeight(acc) {
        if (!_headHeight && acc._client.firstChild) {
            _headHeight = acc._client.firstChild.firstChild.offsetHeight;
        }

        return _headHeight;
    }

}());
