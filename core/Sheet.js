"use strict";

(function() {
    var head = document.getElementsByTagName("head")[0], rulesDef;

    /**
     * Carrega um arquivo css
     * @param {string} file
     */
    define("jsf.core.Sheet", {
        _alias: "jsf.Sheet",
        _static: {
            load: function(file, id) {
                var sheet = document.createElement('link');

                sheet.setAttribute('rel', 'stylesheet');
                sheet.setAttribute('type', 'text/css');
                sheet.setAttribute('href', file);
                sheet.setAttribute('id', id);

                head.appendChild(sheet);

                return sheet;
            },
            disabled: function(file) {
                var link = this.getLink(file);

                if (link) {
                    link.disabled = true;
                }
            },
            getSheet: function(file) {
                var i, r; // href: no IE(nome do arquivo), CHR,FF,OP,SAF(url completa)

                file = file.toLowerCase();

                for (i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].href) {
                        r = document.styleSheets[i].href.toLowerCase();
                        if (r.indexOf(file) > -1) {
                            return document.styleSheets[i];
                        }
                    }
                }

                return null;
            },
            getLink: function(file) {
                var i, link_tag = document.getElementsByTagName('link');

                file = file.toLowerCase();

                for (i = 0; i < link_tag.length; i++) {
                    if ((link_tag[i].rel.indexOf('stylesheet') != -1) && link_tag[i].title == file) {
                        return link_tag[i];
                    }
                }

                return null;
            },
            getStyle: function(el, styleProp) {
                if (el.currentStyle) {
                    return el.currentStyle[styleProp];
                }

                if (window.getComputedStyle) {
                    return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
                }

                return null;
            },
            addRule: function(sheet, rule, style) {
                var r = null;

                if (jsf.isObject(rule)) {
                    for (r in rule) {
                        if (sheet.addRule) {
                            sheet.addRule(r, rule[r]);
                        } else {
                            sheet.insertRule(r + '{' + rule[r] + '}', 0);
                        }
                    }
                } else {
                    if (sheet.addRule) {
                        sheet.addRule(rule, style);
                    } else {
                        sheet.insertRule(rule + '{' + style + '}', 0);
                    }
                }

                return this;
            },
            updateRule: function(sheet, rule, style) {
                var i = this.deleteRule(sheet, rule);

                if (sheet.addRule) {
                    sheet.addRule(rule, style, i);
                } else {
                    sheet.insertRule(rule + '{' + style + '}', i);
                }
            },
            deleteRule: function(sheet, rule) {
                var i, index = null;

                for (i = 0; i < sheet.rules.length; i++) {
                    if (sheet.rules[i].selectorText == rule) {
                        index = i;
                        if (sheet.removeRule) {
                            sheet.removeRule(i);
                        } else {
                            sheet.deleteRule(i);
                        }
                        break;
                    }
                }

                return index;
            },
            getRule: function(sheet, rule) {
                return null;
                var i, s, config;

                if (!rulesDef) {
                    config = jsf.config();
                    rulesDef = {};

                    sheet = jsf.Sheet.getSheet(config.THEME + '_components.css')

                    for (i = 0; i < sheet.rules.length; i++) {
                        if (sheet.rules[i].selectorText.substring(0, 6) == ".rule-") {
                            s = sheet.rules[i].style.content.replaceAll("'", "");
                            rulesDef[sheet.rules[i].selectorText.substring(6)] = JSON.parse("{" + s + "}");
                        }
                    }
                }



                return null;
            },
            getThemeRule: function(ruleComponent) {
                var i, s, config, sheet;

                if (!rulesDef) {
                    config = jsf.config();
                    sheet = jsf.Sheet.getSheet(config.THEME + '_components.css')
                    rulesDef = {};

                    for (i = 0; i < sheet.rules.length; i++) {
                        if (sheet.rules[i].selectorText.substring(0, 7) == ".class-") {
                            s = sheet.rules[i].style.content.replaceAll("'", "");
                            rulesDef[sheet.rules[i].selectorText.substring(7)] = JSON.parse("{" + s + "}");
                        }
                    }
                }

                ruleComponent = ruleComponent.toLowerCase().replaceAll(".", "_");

                return rulesDef[ruleComponent];
            }
        }
    });
}());