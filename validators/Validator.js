"use strict";

(function() {

    var validateFunctions = {};

    define("jsf.core.Validator", {
        _constructor: function() {
            throw "Validator cannot be instantiated";
        },
        _static: {
            UNAVALIABLE: 0,
            VALID: 1,
            INVALID: 2,
            //retorna 0 se não fez validação, 1 se fez e é válido, 2 se fez e não é válido
            
            validate: function(component) {
                var p = component.parent(), m = component.module(), item = component.validator(), d, f, r = jsf.core.Validator.UNAVALIABLE;

                if (item && component.data && component.enabled()) {
                    d = component.data();

                    //se é uma função de validação definida pelo usuário
                    if (jsf.isFunction(item)) {
                        r = item(d, item);
                    } else {
                        //validação dos itens maxLength, minLength e allowBlanck
                        if (item.maxLength != undefined && d.length > item.maxLength) {
                            r = jsf.core.Validator.INVALID;
                        } else if (item.minLength != undefined && d.length < item.minLength) {
                            r = jsf.core.Validator.INVALID;
                        } else if (d == "" && item.allowBlank === false) {
                            r = jsf.core.Validator.INVALID;
                        } else {
                            //validação de tipo de dado: email, cpf, cnpj...
                            f = validateFunctions["v_" + item.type];
                            if (jsf.isFunction(f)) {
                                r = f(d, item);
                            }
                        }
                    }
                }

                component._hasValidate = r;

                if (r == jsf.core.Validator.INVALID) {
                    component.updateDisplay();
                    component._oninvalidate();
                }

                return r;
            },
            clear: function(component) {
                var i, children;

                delete(component._hasValidate); // _hasValidate definido no FocusManager

                if (component.children) {
                    children = component.children();

                    for (i = 0; i < children.length; i++) {
                        jsf.core.Validator.clear(children[i]);
                    }
                }
            },
            isInvalidator: function(component) {
                return Boolean(component._hasValidate == INVALID);
            },
            custom: function(fnName, content) {
                validateFunctions["v_" + fnName] = content;
            }
        }
    });

    jsf.core.Validator.custom("string", function(value, item) {
        return jsf.isString(value) ? jsf.core.Validator.VALID : jsf.core.Validator.INVALID;
    });

    jsf.core.Validator.custom("email", function(value, item) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value) ? jsf.core.Validator.VALID : jsf.core.Validator.INVALID;
    });

    jsf.core.Validator.custom("cpf", function(value, item) {
        return isCpf(value) ? jsf.core.Validator.VALID : jsf.core.Validator.INVALID;
    });

    jsf.core.Validator.custom("cnpj", function(value, item) {
        return isCnpj(value) ? jsf.core.Validator.VALID : jsf.core.Validator.INVALID;
    });

    jsf.core.Validator.custom("date", function(value, item) {
        var dt, dd, mm, aa, d, m, a, mask = item.mask || "dd/MM/yyyy";

        d = mask.indexOf("dd");
        m = mask.indexOf("MM");
        a = mask.indexOf("yyyy");

        dd = value.substring(d, d + 2);
        mm = value.substring(m, m + 2);
        aa = value.substring(a, a + 4);

        dt = new Date(aa, mm, dd);
        return isNaN(dt.getDate()) ? jsf.core.Validator.INVALID : jsf.core.Validator.VALID;
    });

    function unformatNumber(pNum) {
        return String(pNum).replace(/\D/g, "").replace(/^0+/, "");
    }

    function isCpf(cpf) {
        var soma, resto, i;

        cpf = unformatNumber(cpf);

        if ((cpf.length != 11) || (cpf == "00000000000") || (cpf == "11111111111") || (cpf == "22222222222") || (cpf == "33333333333") || (cpf == "44444444444") || (cpf == "55555555555") || (cpf == "66666666666") || (cpf == "77777777777") || (cpf == "88888888888") || (cpf == "99999999999")) {
            return false;
        }

        soma = 0;

        for (i = 1; i <= 9; i++) {
            soma += Math.floor(cpf.charAt(i - 1)) * (11 - i);
        }

        resto = 11 - (soma - (Math.floor(soma / 11) * 11));

        if ((resto == 10) || (resto == 11)) {
            resto = 0;
        }

        if (resto != Math.floor(cpf.charAt(9))) {
            return false;
        }

        soma = 0;

        for (i = 1; i <= 10; i++) {
            soma += cpf.charAt(i - 1) * (12 - i);
        }

        resto = 11 - (soma - (Math.floor(soma / 11) * 11));

        if ((resto == 10) || (resto == 11)) {
            resto = 0;
        }

        if (resto != Math.floor(cpf.charAt(10))) {
            return false;
        }

        return true;
    }

    function isCnpj(s) {
        var i, c = s.substr(0, 12), dv = s.substr(12, 2), d1 = 0;

        for (i = 0; i < 12; i++) {
            d1 += c.charAt(11 - i) * (2 + (i % 8));
        }

        if (d1 == 0) {
            return false;
        }

        d1 = 11 - (d1 % 11);

        if (d1 > 9) {
            d1 = 0;
        }

        if (dv.charAt(0) != d1) {
            return false;
        }

        d1 *= 2;

        for (i = 0; i < 12; i++) {
            d1 += c.charAt(11 - i) * (2 + ((i + 1) % 8));
        }

        d1 = 11 - (d1 % 11);

        if (d1 > 9) {
            d1 = 0;
        }

        if (dv.charAt(1) != d1) {
            return false;
        }

        return true;
    }

    function isCpfCnpj(valor) {
        var retorno = false, numero = valor;

        numero = unformatNumber(numero);
        if (numero.length > 11) {
            if (isCnpj(numero)) {
                retorno = true;
            }
        } else {
            if (isCpf(numero)) {
                retorno = true;
            }
        }

        return retorno;
    }

}());