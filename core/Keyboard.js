"use strict";

(function() {
    var validMask = '9LU$CA',
        _$ = ' ABCDEFGHIJKLMNOPQRSTUVXZabcdefghijklmnopqrstuvxz',
        _9 = '1234567890',
        _A = _9 + _$,
        InputMask = {};
    
//private functions:    
    // retorna o valor com a máscara aplicada
    function getMaskedValue(value, maskObj) {
        var pm, c, convert=null,
            pv     = 0,
            result = '',
            mask   = maskObj.mask,
            maskSeparators = maskObj.maskSeparators,
            customChars    = maskObj.customChars;
        
        value = value.lpad(' ', mask.length - maskSeparators.length);
        
        for (pm=0; pm<mask.length; pm++) {
            c = value.charAt(pv);
            
            if (convert) {
                c = (convert == 'L' ? c.toLocaleLowerCase() : c.toLocaleUpperCase());
            }
            
            switch (mask.charAt(pm)) {
                case '?': result += (c == '' ? '_' : c);  break;                                // qualquer caractere
                case '9': result += (c == '' || _9.indexOf(c) == -1 ? '_' : c); break;          // números
                case 'L': convert = 'L'; continue;                                              // converter para minúscula
                case 'U': convert = 'U'; continue;                                              // converter para maiúscula
                case '$': result += (c == '' || _$.indexOf(c) == -1 ? '_' : c); break;          // letras (maiúscula ou minúscula) ou espaços
                case 'C': result += (c == '' || customChars.indexOf(c) == -1 ? '_' : c); break; // caracteres definidos em customCharst
                case 'A': result += (c == '' || _A.indexOf(c) == -1 ? '_' : c); break;          // letras (maiúscula ou minúscula) ou número
                default:
                    result += mask.charAt(pm);
                    if (mask.charAt(pm) != c){
                        pv--;
                    }
            }
            
            convert = null;
            pv++;
        }
        
        return result;
    }

    function updateMaskSeparator(maskObj) {
        var s1 = '9LU$CA?', s2 = maskObj.customChars || '', m = maskObj.mask || '', i, c;
        
        maskObj.maskSeparators = '';
        
        // todo caractere de m que não esteja em s1 e s2 deve fazer parte de maskObj.maskSeparators
        for (i = 0; i < m.length; i++) {
            c = m.charAt(i);
            if (s1.indexOf(c) == -1 && s2.indexOf(c) == -1){
                maskObj.maskSeparators += c;
            }
        }
    }
    
    function isMaskSeparator(maskObj, value, pos){
        var c = value.charAt(pos);
        return maskObj.maskSeparators.indexOf(c)>=0;
    }
    
    // retorna true se o valor é válido para a máscara
    function isValid(maskObj, value) {
        var pm = 0,
            pv = 0,
            c  = '',
            r  = true,
            mask = maskObj.mask,
            customChars = maskObj.customChars;
        
        for (pm = 0; pm < mask.length; pm++) {
            c = value.charAt(pv);
            switch (mask.charAt(pm)) {
                case '9':
                    if (c != '_' && _9.indexOf(c) == -1){
                        r = false;
                    }
                    break;
                case '$':
                    if (c != '_' && _$.indexOf(c) == -1){
                        r = false;
                    }
                    break;
                case 'A':
                    if (c != '_' && _A.indexOf(c) == -1){
                        r = false;
                    }
                    break;
                case 'C':
                    if (c != '_' && customChars.indexOf(c) == -1){
                        r = false;
                    }
                    break;
                case 'L':
                case 'U':
                    continue;
                default:
                    if (mask.charAt(pm) != c){
                        pv--;
                    }
            }
            
            if (r == false){
                break;
            }
            
            pv++;
        }
        
        return r;
    }
    
    //retorna a posição para o cursor, seguindo uma direção definida em dir
    function getNextPos(valueWithMask, posStart, maskSeparators, dir){
        var c;
        
        c = valueWithMask.substr(posStart+(dir == 'left' ? -1 : 1), 1);
        
        while (maskSeparators.indexOf(c) > -1) {
            posStart += ((dir == 'left') ? -1 : 1);
            if (posStart < 1) {
                posStart = 0;
                break;
            }
            
            if (posStart > valueWithMask.length - 1) {
                posStart = valueWithMask.length - 1;
                break;
            }
            
            c = valueWithMask.substr(posStart+(dir == 'left' ? -1 : 1), 1);
        }
        
        return posStart;
    }
    
    // retorna o valor sem a máscara
    /*function removeMask(input) {
        var i, c = '', thousand = input._thousand, value = String(input.value);
        
        if (input._mask == 'float') {
            return value.replaceAll(thousand, '').replaceAll(',', '.');
        }
        
        if (input._mask && input.mask != '') {
            // remove todos os caracteres separadores
            if (input._ms_) {
                for (i = 0; i < input._ms_.length; i++) {
                c = input._ms_[i];
                value = value.replaceAll(c, '');
                }
            }
            
            // remove todos os _
            value = value.replaceAll('_', '');
        }
        
        return value;
    }*/
    
    InputMask.onkeydown = function(evt) {
        var input = this, o = input._maskObj, e=evt, p, s, i, f;
        
        evt = jsf.KeyboardEvent(evt);
        
        // especialKey indica se foi pressionada uma tecla especial (pgup, pgdn, up, down, end, left...)
        o.especialKey = ((evt.keyCode >= 35 && evt.keyCode <= 40) || evt.keyCode == 8 || evt.keyCode == 46);
        
        o.cursorPos = p = jsf.Keyboard.getCaret(input);
        o.keyDown = true;
        
        switch (evt.keyCode) {
            case jsf.Keyboard.KEY_PAGEDOWN: o.cursorPos = 9999999; if (evt.shift){return true;} break;  // end
            case jsf.Keyboard.KEY_HOME:     o.cursorPos =  0; if (evt.shift){return true;}  break;      // home
            case jsf.Keyboard.KEY_LEFT:     o.cursorPos -= 1; if (evt.shift){return true;}  break;      // left
            case jsf.Keyboard.KEY_UP:       o.cursorPos -= 1; if (evt.shift){return true;}  break;      // up
            case jsf.Keyboard.KEY_RIGHT:    o.cursorPos += 1; if (evt.shift){return true;}  break;      // right
            case jsf.Keyboard.KEY_DOWN:     o.cursorPos += 1; if (evt.shift){return true;}  break;      // down
            case jsf.Keyboard.KEY_BACKSPACE:                                        // backspace
                i = input.selectionStart;
                f = input.selectionEnd;
                if (i!=f){//tem texto selecionado
                    s = '';
                    while (s.length < f-i){
                        s += '_';
                    }
                    input.value = input.value.substring(0, i) + s + input.value.substring(f);
                    o.cursorPos = i;
                }else{
                    o.cursorPos--;
                    input.value = input.value.substring(0, o.cursorPos) + '_' + input.value.substring(o.cursorPos+1);
                }
                input.value = getMaskedValue(input.value, o);
                o.cursorPos = getNextPos(input.value, o.cursorPos, o.maskSeparators, "left");
                o.epecialKey = true;
                break;                
            case jsf.Keyboard.KEY_DELETE:                                           // delete
                i = input.selectionStart;
                f = input.selectionEnd;
                if (i!=f){//tem texto selecionado, faz o mesmo que o backspace
                    s = '';
                    while (s.length < f-i){
                        s += '_';
                    }
                    input.value = input.value.substring(0, i) + s + input.value.substring(f);
                    o.cursorPos = i;
                }else{
                    o.cursorPos = input.selectionStart;
                    if (!isMaskSeparator(input._maskObj, input.value, o.cursorPos)){
                        input.value = input.value.substring(0, o.cursorPos) + '_' + input.value.substring(o.cursorPos + 1);
                        input.value = getMaskedValue(input.value, o);
                    }
                }
                input.value = getMaskedValue(input.value, o);
                o.epecialKey = true;
                break;
            
            default:
                return true;
        }
        
        jsf.Keyboard.setCaret(input, o.cursorPos, o.mask, o.cursorPos<p?'left':'right');
        
        return jsf.Event.stopPropagation(e);
    };
    
    InputMask.onkeypress = function(evt) {
        var input = this, value, p, i, e=evt, o = input._maskObj, mask=input._maskObj.mask;
        
        evt = jsf.KeyboardEvent(evt);
        
        // se a tecla pressionada é especial (ver input_onkeydown)
        if (!o.especialKey && evt.keyCode !== jsf.Keyboard.KEY_ENTER) { 
            p = jsf.Keyboard.getCaret(input);
            
            while (validMask.indexOf(mask.substr(p, 1)) == -1) {
                p++;
                
                if (p > input.value.length) {
                    p = input.value.length;
                    break;
                }
            }
            
            value = input.value.substring(0, p) + String.fromCharCode(evt.keyCode) + input.value.substring(p + 1);
            
            if (isValid(o, value)){
                input.value = getMaskedValue(value, o);
                i = jsf.Keyboard.setCaret(input, p + 1, o.mask, 'dir');
                if ( isMaskSeparator(o, input.value, i) ){
                    jsf.Keyboard.setCaret(input, i + 1, o.mask, 'dir');
                }
            }
        }
        
        return jsf.Event.stopPropagation(e);
    };
    
    InputMask.onmouseup=function() {
        //var el = this;
        
        /*if (!(el._mask == 'int' || el._mask == 'float')) {
            el._keydown = true;
            el._cursorPos = getCaret(el);
            selectChar(el);
            checkChange(el);
        }*/
    };
    
    InputMask.onfocus=function() {
        var value = getMaskedValue(this.value, this._maskObj),
            input = this;
        
        window._cancel_selection = window._cancel_contextmenu = false;
        
        this.value = value;
        
        setTimeout(function(){jsf.Keyboard.selectText(input);}, 0);        
    };
    
    InputMask.onblur=function(){
        window._cancel_selection = window._cancel_contextmenu = true;
        
        if (this.value.indexOf('_')>=0){
            this.value = '';
        }
        
        this.value = getMaskedValue(this.value, this._maskObj);
    };
    
    InputMask.onchange=function() {
        //checkChange(this);
    };
    
    define("jsf.core.Keyboard", {
        _alias: "jsf.Keyboard",
        
        _static: {
            getCaret: function(ctl) {
                var r = 0, range;
                
                try {
                    if (ctl.setSelectionRange) {
                        r = ctl.selectionStart;
                    } else if (document.selection && document.selection.createRange) {
                        range = document.selection.createRange();
                        r = - (range.duplicate().moveStart('character', -100000));
                    }
                } catch (_e) {}
                return r;
            },
            
            setCaret: function(ctl, pos, mask, dir, count) {
                count = count || 0;
                
                if (pos > ctl.value.length){
                    pos = ctl.value.length;
                }
                
                if (pos < 0){
                    pos = 0;
                }
                
                if (dir) {
                    // não permite selecionar caracteres como / ou ( ou -
                    while (validMask.indexOf(mask.substr(pos, 1)) == -1 && validMask.indexOf(mask.substr(pos-1, 1)) == -1) {
                        pos += ((dir == 'left') ? -1 : 1);
                        if (pos < 1) {
                            pos = 0;
                            break;
                        }
                        
                        if (pos > ctl.value.length - 1) {
                            pos = ctl.value.length - 1;
                            break;
                        }
                    }
                    
                    // não conseguiu na direção recomendada, tenta na direção inversa
                    if (validMask.indexOf(mask.substr(pos, 1)) == -1 && validMask.indexOf(mask.substr(pos-1, 1)) == -1) {
                        while (validMask.indexOf(mask.substr(pos, 1)) == -1) {
                            pos = (dir == 'left') ? 1 : -1;
                            if (pos < 1) {
                                pos = 0;
                                break;
                            }
                            
                            if (pos > ctl.value.length - 1) {
                                pos = ctl.value.length - 1;
                                break;
                            }
                        }
                    }
                }
                
                if (ctl.setSelectionRange) { // FF
                    ctl.focus();
                    ctl.setSelectionRange(pos, pos + count);
                } else if (ctl.createTextRange) { // IE
                    var range = ctl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos + count);
                    range.moveStart('character', pos);
                    range.select();
                }
                
                return pos;
            },
            
            selectText: function(ctl, start, count) {
                var text = ctl.value, range;
                
                start = start || 0;
                count = count || text.length;
                
                if (ctl.setSelectionRange) { // FF
                    ctl.focus();
                    ctl.setSelectionRange(start, start + count);
                } else if (ctl.createTextRange) { // IE
                    range = ctl.createTextRange();
                    range.collapse(true);
                    range.moveStart('character', start);
                    range.moveEnd('character', start + count);
                    range.select();
                }
            },
            
            getSelectedText: function(input){
                return input.value.substring(input.selectionStart, input.selectionEnd);
                //alert(txt.value.substr(txt.selectionStart, (txt.selectionEnd - txt.selectionStart)));
            },
            
            createInputMask: function(options) {
                var input = options.target;
                
                //cria máscara para elementos <input type="text"/> e que ainda não tenha sido criada
                if (input && input.nodeName && input.nodeName.toLowerCase() == 'input' && input.type.toLowerCase() == 'text' && options.mask  && options.mask != ''){
                    if (!input._maskObj) {
                        jsf.Event.nativeAdd(input, 'keypress', InputMask.onkeypress);
                        jsf.Event.nativeAdd(input, 'keydown',  InputMask.onkeydown);
                        jsf.Event.nativeAdd(input, 'focus',    InputMask.onfocus);
                        jsf.Event.nativeAdd(input, 'blur',     InputMask.onblur);
                        jsf.Event.nativeAdd(input, 'change',   InputMask.onchange);
                    }
                    
                    input._maskObj = {
                        mask        : options.mask,
                        customChars : options.customChars || '',
                        decimal     : options.decimal || '.',
                        thousand    : options.thousand,
                        precision   : options.precision || 2,
                        rightToLeft : options.rightToLeft || false
                    };
                    
                    updateMaskSeparator(input._maskObj);
                    
                    input.value = getMaskedValue(input.value, input._maskObj);
                }
            },
            
            removeInputMask: function(input){
                if (input._maskObj){
                    EventBase.remove(input, 'keypress', InputMask.onkeypress);
                    EventBase.remove(input, 'keydown',  InputMask.onkeydown);
                    EventBase.remove(input, 'focus',    InputMask.onfocus);
                    EventBase.remove(input, 'blur',     InputMask.onblur);
                    EventBase.remove(input, 'change',   InputMask.onchange);
                }
                
                delete(input._maskObj);
            },
            
            /** @const */ KEY_ESC   : 27,
            /** @const */ KEY_ENTER : 13,
            /** @const */ KEY_SPACE : 32,
            /** @const */ KEY_PAGEDOWN : 35,
            /** @const */ KEY_PAGEUP : 33,
            /** @const */ KEY_HOME : 36,
            /** @const */ KEY_UP : 38,
            /** @const */ KEY_LEFT : 37,
            /** @const */ KEY_DOWN : 40,
            /** @const */ KEY_RIGHT : 39,
            /** @const */ KEY_TAB : 9,
            /** @const */ KEY_DELETE : 46,
            /** @const */ KEY_BACKSPACE : 8
        }
    });
    
}());