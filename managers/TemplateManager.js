"use strict";

define("jsf.managers.TemplateManager", {
    _alias: "jsf.TemplateManager",
    _static: {
        toArray: function(value) {
            // ex: <div>#{name}<br><span>R$#{value}</span></div>
            var p1, p2 = 0, leftPart, aa = null, br = true;

            if (value) {
                aa = [];
                do {
                    p1 = value.indexOf('#{', p2);
                    if (p1 > -1) {
                        leftPart = value.substring(p2, p1);
                        p2 = value.indexOf('}', p1);
                        aa.push({
                            leftPart: leftPart,
                            property: value.substring(p1 + 2, p2)
                        });
                        p2++;
                    } else {
                        aa.push({
                            leftPart: value.substring(p2),
                            property: null
                        });
                        br = false;
                    }
                } while (br);
            }

            return aa;
        },
        fill: function(parts, obj) {
            var i, html = '', v;

            for (i = 0; i < parts.length; i++) {
                html += parts[i].leftPart;
                if (parts[i].property) {
                    v = obj[parts[i].property];
                    html += v || '';
                }
            }

            return html;
        }
    }
});
