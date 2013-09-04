"use strict";

(function() {

    define("jsf.ui.JCalendar", {
        _require: ["jsf.ui.DisplayObject", "jsf.util.Date"],
        _alias: "jsf.JCalendar",
        _extend: "display",
        _xtype: "calendar",
        
        _constructor: function(properties) {
            jsf.ui.DisplayObject.call(this);

            this._focuset = true;

            this._canvas.innerHTML = 
                '<div class="head">' +
                    '<div class="button lbutton" _captureMouseEvent="lbutton"></div>' +
                    '<div class="month">MONTH/YEAR</div>' +
                    '<div class="button rbutton" _captureMouseEvent="rbutton"></div>' +
                '</div>' +
                '<div class="week"></div>' +
                '<div class="days"></div>' +
                '<div class="footer">' +
                    '<span class="now" _captureMouseEvent="today">now</span>' +
                '</div>';
        
            this._ebtl = this._canvas.childNodes[0].childNodes[0];
            this._emonth = this._canvas.childNodes[0].childNodes[1];
            this._ebtr = this._canvas.childNodes[0].childNodes[2];
            this._eweek = this._canvas.childNodes[1];
            this._edays = this._canvas.childNodes[2];
            this._efooter = this._canvas.childNodes[3];

            Lang.observer(this);

            this._date = new Date();

            this._applyProperties(properties);
        },
        _event: {
            langchanged: function() {
                this._calender_init = false;
                this.updateDisplay();
            },
            click: function(element) {
                var m = element.getAttribute('_captureMouseEvent'), d;

                //click nos botões: próximo e anterior
                if (m == 'lbutton') {
                    this.date(Date.monthPrevious(this._date));
                } else if (m == 'rbutton') {
                    this.date(Date.monthNext(this._date));
                }

                //click no botão "today"
                if (m == 'today') {
                    this.date(new Date());
                }

                //click em um número (dia)
                if (m == 'day') {
                    if (element.enabled) {
                        this._elOverActive = null;
                        d = new Date(element.date.year, element.date.month, element.date.day);

                        this.date(d);

                        if (jsf.managers.PopupManager.isPopup(popupCalendar)) {
                            if (callback) {
                                callback(d);
                                callback = null;
                            }

                            jsf.managers.PopupManager.remove(popupCalendar);
                        }

                        this.dispatch(jsf.Event.ON_ITEM_CLICK, this._date);
                    }
                }
            },
            mouseover: function(element) {
                var m = element.getAttribute('_captureMouseEvent');
                
                //botões < e >
                if (m == 'lbutton' || m == 'rbutton') {
                    element.className = m + ' button mouseover';
                    element.cls = m + ' button';
                    this._elOverActive = element;
                }

                //dia
                if (m == 'day') {
                    //jsf.Dom.addClass(element, ' ui-ov ' + (element._enabled ? 'cld-day-a-over' : 'cld-day-d-over'));
                    //this._elOverActive = element;
                }
            },
            mouseout: function() {
                if (this._elOverActive) {
                    this._elOverActive.className = this._elOverActive.cls;
                    this._elOverActive = null;
                }
            }
        },
        _property:{
            date: {
                type:"Date",
                get: function() {
                    return this._date;
                },
                set: function(value){
                    var d = this._date;

                    if (jsf.isDate(value)) {
                        this._date = value;
                        this.updateDisplay();

                        if (jsf.isDate(d)) {
                            if (!(d.getFullYear() == value.getFullYear() && d.getMonth() == value.getMonth() && d.getDate() == value.getDate())) {
                                this.dispatch(jsf.Event.ON_CHANGE, this._date);
                            }
                        }
                    }
                }
            }
        },
        _public: {
            render: function() {
                if (!this._date || (this._date && this._lastDate == this._date)) {
                    return;
                }

                var 
                    i, w, e, c, 
                    dt= new Date(),
                    j = 0,
                    m = this._date.getMonth(),
                    d = this._date.getDate(),
                    mn= dt.getMonth(),
                    dn= dt.getDate(),
                    a = calculateInterval(this._date);
                
                init(this);
                
                this._emonth.innerHTML = Lang.get("jsf.aMonths")[this._date.getMonth()] + ' ' + this._date.getFullYear();
                
                for (i = 0; i < 6; i++) {
                    e = this._edays.childNodes[i].childNodes;
                    w = 0;
                    while (w < 7) {
                        c =  e[w].getAttribute("oclass");
                        c += (a[j].month == mn && a[j].day == dn) ? " now" : "";
                        c += (a[j].month == m && a[j].day == d) ? " active" : "";
                        c += (a[j].month == m) ? "" : " deactive";
                                
                        e[w].innerHTML = a[j].day;
                        e[w].className = c;
                        e[w].enabled   = a[j].month == m;
                        e[w].date = a[j];
                        
                        w++;
                        j++;
                    }
                }

                this._lastDate = this._date;
            }
        },
        _static: {
            show: function(rect, date, callbackItemClick) {
                var app = jsf.System.application();

                if (!popupCalendar) {
                    popupCalendar = jsf.System.application().add(new jsf.JCalendar());
                }

                if (date) {
                    popupCalendar.date(date);
                }

                //coloca o popup na aplicação
                jsf.Dom.style(popupCalendar._canvas, {
                    visibility: 'hidden',
                    display: null
                });
                app._canvas.appendChild(popupCalendar._canvas);

                popupCalendar.left(rect.left + rect.width - popupCalendar._canvas.offsetWidth);
                popupCalendar.top(rect.top + rect.height);

                callback = callbackItemClick;

                jsf.Popup.add({
                    target: popupCalendar,
                    shadow: true,
                    showEffect: {
                        properties: {
                            visibility: {from: ''},
                            display: {from: ''},
                            height: {from: 0, to: popupCalendar._canvas.offsetHeight + 'px'}
                        }
                    }
                });
            }
        }
    });

//private vars:
    var popupCalendar = null, callback;

//private functions:
    function init(o) {
        var i, j, html, wd, c;
        
        if (!o._calendar_init) {
            wd = Lang.get("jsf.aWeek");
            html = '';
            for (i = 0; i < 7; i++) {
                c = "day" + (i==0?" d0":i=="6"?" d6":"")
                html += '<div oclass="'+c+'" class="'+c+'">' + wd[i] + '</div>';
            }
            o._eweek.innerHTML = html;

            html = '';
            for (i = 0; i < 6; i++) {
                html += '<div class="row">';
                for (j = 0; j < 7; j++) {
                    c = "day" + (j==0?" d0":j=="6"?" d6":"");
                    html += '<div oclass="'+c+'" class="'+c+'" _captureMouseEvent="day"></div>';
                }
                html += '</div>';
            }
            o._edays.innerHTML = html;
            o._efooter.firstChild.innerHTML = Lang.get("jsf.today");

            o._calendar_init = true;
        }
    }

    function calculateInterval(date) {
        var 
            arr = [], i, a, m,
            dtP = Date.monthPrevious(date),
            dtN = Date.monthNext(date),
            l = dtP.getDate(),
            w = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
            f = Date.lastDay(date),
            d = 1 + (l - w);

        //dias do mês anterior
        m = dtP.getMonth();
        a = dtP.getFullYear();
        for (i = d; i <= l; i++) {
            arr.push({
                year: a,
                month: m,
                day: i
            });
        }

        //dias do mês atual
        m = date.getMonth();
        a = date.getFullYear();
        for (i = 1; i <= f; i++) {
            arr.push({
                year: a,
                month: m,
                day: i
            });
        }

        //dias do mês posterior
        d = 1;
        m = dtN.getMonth();
        a = dtN.getFullYear();
        while (arr.length < 42) {
            arr.push({
                year: a,
                month: m,
                day: d++
            });
        }

        return arr;
    }

}());