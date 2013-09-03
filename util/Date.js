"use strict";

(function() {
    var DateReplaceChars = {
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        // Day
        d: function(dt) {
            var gd = dt.getDate();
            return (gd < 10 ? '0' : '') + gd;
        },
        D: function(dt) {
            return DateReplaceChars.shortDays[dt.getDay()];
        },
        j: function(dt) {
            return dt.getDate();
        },
        l: function(dt) {
            return DateReplaceChars.longDays[dt.getDay()];
        },
        N: function(dt) {
            return dt.getDay() + 1;
        },
        S: function(dt) {
            var gd = dt.getDate();
            return (gd % 10 == 1 && gd != 11 ? 'st' : (gd % 10 == 2 && gd != 12 ? 'nd' : (gd % 10 == 3 && gd != 13 ? 'rd' : 'th')));
        },
        w: function(dt) {
            return dt.getDay();
        },
        z: function(dt) {
            var d = new Date(dt.getFullYear(), 0, 1);
            return Math.ceil((dt - d) / 86400000);
        }, // Fixed now
        // Week
        W: function(dt) {
            var d = new Date(dt.getFullYear(), 0, 1);
            return Math.ceil((((dt - d) / 86400000) + d.getDay() + 1) / 7);
        }, // Fixed now
        // Month
        F: function(dt) {
            return DateReplaceChars.longMonths[dt.getMonth()];
        },
        m: function(dt) {
            return (dt.getMonth() < 9 ? '0' : '') + (dt.getMonth() + 1);
        },
        M: function(dt) {
            return DateReplaceChars.shortMonths[dt.getMonth()];
        },
        n: function(dt) {
            return dt.getMonth() + 1;
        },
        t: function() {
            var d = new Date();
            return new Date(d.getFullYear(), d.getMonth(), 0).getDate();
        }, // Fixed now, gets #days of date
        // Year
        L: function(dt) {
            var year = dt.getFullYear();
            return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0));
        }, // Fixed now
        o: function(dt) {
            var d = new Date(dt.valueOf());
            d.setDate(d.getDate() - ((dt.getDay() + 6) % 7) + 3);
            return d.getFullYear();
        }, // Fixed now
        Y: function(dt) {
            return dt.getFullYear();
        },
        y: function(dt) {
            return String(dt.getFullYear()).substr(2);
        },
        // Time
        a: function(dt) {
            return dt.getHours() < 12 ? 'am' : 'pm';
        },
        A: function(dt) {
            return dt.getHours() < 12 ? 'AM' : 'PM';
        },
        B: function(dt) {
            return Math.floor((((dt.getUTCHours() + 1) % 24) + dt.getUTCMinutes() / 60 + dt.getUTCSeconds() / 3600) * 1000 / 24);
        }, // Fixed now
        g: function(dt) {
            return dt.getHours() % 12 || 12;
        },
        G: function(dt) {
            return dt.getHours();
        },
        h: function(dt) {
            return ((dt.getHours() % 12 || 12) < 10 ? '0' : '') + (dt.getHours() % 12 || 12);
        },
        H: function(dt) {
            return (dt.getHours() < 10 ? '0' : '') + dt.getHours();
        },
        i: function(dt) {
            return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
        },
        s: function(dt) {
            return (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();
        },
        u: function(dt) {
            var m = dt.getMilliseconds();
            return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m;
        },
        // Timezone
        e: function() {
            return "Not Yet Supported";
        },
        I: function() {
            return "Not Yet Supported";
        },
        O: function(dt) {
            return (-dt.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(dt.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(dt.getTimezoneOffset() / 60)) + '00';
        },
        P: function(dt) {
            return (-dt.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(dt.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(dt.getTimezoneOffset() / 60)) + ':00';
        }, // Fixed now
        T: function(dt) {
            var m = dt.getMonth(), result;
            dt.setMonth(0);
            result = dt.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1');
            dt.setMonth(m);
            return result;
        },
        Z: function(dt) {
            return -dt.getTimezoneOffset() * 60;
        },
        // Full Date/Time
        c: function(dt) {
            return dt.format("Y-m-d\\TH:i:sP");
        }, // Fixed now
        r: function(dt) {
            return dt.toString();
        },
        U: function(dt) {
            return dt.getTime() / 1000;
        }
    };

//private functions:
    /*function getYear(d) {
     return (d < 1000) ? d + 1900 : d;
     }*/

//public methods:
    /**
     * function format(format)
     * 
     * @memberOf Date
     * @param {String} format
     * @memberOf Date
     * @returns {String}
     */
    Date.prototype.format = function(format) {
        var i, curChar, returnStr = '';

        for (i = 0; i < format.length; i++) {
            curChar = format.charAt(i);
            if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
                returnStr += curChar;
            } else if (DateReplaceChars[curChar]) {
                returnStr += DateReplaceChars[curChar](this);
            } else if (curChar != "\\") {
                returnStr += curChar;
            }
        }
        return returnStr;
    };

    Date.strToDate = function(str, mask, default_) {
        var p = Date.split(str, mask);
        return !p ? default_ : new Date(p[0], p[1], p[2]);
    };

    /**
     * function isDateByMask(str, mask)
     * 
     * @param {String} str
     * @param {String} mask
     * @returns {Date}
     * @static
     */
    Date.isDateByMask = function(str, mask) {
        var c, p = Date.split(str, mask);

        if (!p) {
            return null;
        }

        c = new Date(p[0], p[1], p[2]);

        if ((c.getFullYear() == Number(p[0])) && (c.getMonth() == Number(p[1])) && (c.getDate() == Number(p[2]))) {
            return c;
        }

        return null;
    };

    /**
     * function split(str, mask)
     * 
     * @param {String} str
     * @param {String} mask
     * @returns {Array}
     * @static
     */
    Date.split = function(str, mask) {
        var i, j = 0, n1, n2, n3, n4, c, d = 1, m = 1, a = '', v, k, f, temDia, temMes;

        for (i = 0; i < mask.length; i++) {
            c = mask.charAt(i);
            n1 = Number(str.charAt(j));
            n2 = Number(str.charAt(j + 1));
            n3 = Number(str.charAt(j + 2));
            n4 = Number(str.charAt(j + 3));

            switch (c) {
                case 'M' :
                    f = false;
                    v = str.charAt(j) + str.charAt(j + 1) + str.charAt(j + 2);
                    for (k = 0; k < DateReplaceChars.shortMonths.length; k++) {
                        if (DateReplaceChars.shortMonths[k].toLocaleLowerCase() == v.toLocaleLowerCase()) {
                            m = (k + 1);
                            j += 3;
                            f = true;
                            temMes = true;
                            break;
                        }
                    }
                    if (!f) {
                        return null;
                    }

                    break;
                case 'd' :
                    if (isNaN(n1) || isNaN(n2)) {
                        return null;
                    }

                    j += 2;
                    d = String(n1) + String(n2);
                    temDia = true;

                    break;
                case 'm' :
                    if (isNaN(n1) || isNaN(n2)) {
                        return null;
                    }

                    j += 2;
                    m = String(n1) + String(n2);
                    temMes = true;

                    break;
                case 'y' :
                    if (isNaN(n1) || isNaN(n2)) {
                        return null;
                    }

                    j += 2;
                    a = String(n1) + String(n2);

                    break;
                case 'Y' :
                    if (isNaN(n1) || isNaN(n2) || isNaN(n3) || isNaN(n4)) {
                        return null;
                    }

                    j += 4;
                    a = String(n1) + String(n2) + String(n3) + String(n4);

                    break;
                default :
                    if (c != str.charAt(j)) {
                        return null;
                    }

                    j++;
            }
        }

        if (j != str.length) {
            return null;
        }

        m -= 1;// mês em js é de 0-11
        a = a.length == 2 ? '20' + a : a;

        // se não tem mês, considera dezembro
        /*
         * if (!temMes){ m=11; }
         */

        // se não tem dia, considera o último dia do mês
        /*
         * if (!temDia){ var dd = new Date(a, Number(m)+1, 0); d = dd.getDate(); }
         */

        // c = new Date(a,m,d);
        return [Number(a), Number(m), Number(d)];
    };

    /**
     * Retorna o último dia do mês da data informada
     */
    Date.lastDay = function(date) {
        var m = date.getMonth() + 1, a = date.getFullYear();

        if (m > 11) {
            m = 0;
            a++;
        }

        return new Date(a, m, 0).getDate();
    };

    //retorna a data referente ao último dia do mês anterior
    Date.monthPrevious = function(date) {
        var m = date.getMonth() - 1, a = date.getFullYear(), d;

        if (m < 0) {
            m = 11;
            a--;
        }

        d = new Date(a, m, 1);
        d.setDate(Date.lastDay(d));

        return d;
    };

    //retorna a data referente ao primeiro dia do mês posterior
    Date.monthNext = function(date) {
        var m = date.getMonth() + 1, a = date.getFullYear();

        if (m > 11) {
            m = 0;
            a++;
        }

        return new Date(a, m, 1);
    };

    //retorna o 1º dia(domingo) da semana referente à data
    Date.weekFirstDay = function(date) {
        var w = date.getDay(), d = date.getDate(), m = date.getMonth(), o;

        while (w > 0) {
            d = d - 1;
            if (d < 1) {
                m--;
                o = date.monthPrevious(date);

            }
            w--;
        }

    };
    
}());
