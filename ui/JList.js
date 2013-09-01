"use strict";

(function(){
    define("jsf.ui.JList", {
        _require: ["jsf.ui.JListBase"],
        _extend: "listbase",
        _xtype: "list",
        
	_constructor: function(properties) {
            jsf.ui.JListBase.call(this);

            this._focuset = true;

            //default properties
            this._listField = 'label';
            this._rowHeight = 30;
            this._border = true;
            this._styleClass = "";

            this._applyProperties(properties);
        },
        _event: {
            mousedown: function(element, evt) {
                if (element._captureMouseEvent && this._selectedIndex != element.itemIndex) {
                    setItemSelected(this, element.itemIndex);
                }
            },
            mouseup: function(element) {
                if (this._selectedItem && this._selectedItem == this._dataProvider[element.itemIndex]) {
                    this.dispatch(jsf.Event.ON_ITEM_CLICK, this._selectedItem);
                }
            },
            mouseover: function(element) {
                var item;

                if (element._captureMouseEvent) {
                    item = this._dataProvider[element.itemIndex];
                    if (!item._sel_) {
                        this._elOver = element;
                        jsf.Dom.addClass(element, "over");
                    }
                }
            },
            mouseout: function(element) {
                if (this._elOver) {
                    jsf.Dom.removeClass(this._elOver, "over");
                }
            }
        },
        
        _protected: {
            renderItem: function(item, element, elementIndex){
                var cls = "item";
                
                if ( item.selectable!==false ){
                    cls += item._sel_ ? (this._hasFocus ? " selected focus" : " selected") : '';
                }
                
                element.className = cls + (item.style ? " " + item.style : this._styleClass);
                
                //adiciona o conteúdo da linha
                if (this._itemRender){  //itemRender
                    this._valueRows[elementIndex].innerHTML = this._itemRender(item, this._listField);
                }else if (this._parts){ //template
                    //this._elementRows[elementIndex]._captureMouseEvent=true;
                    this._elementRows[elementIndex].innerHTML = jsf.Util.fillTemplate(this._parts, item);
                }else{                  //texto comum
                    this._valueRows[elementIndex].nodeValue = item[this._listField];
                }
            }
        },
        
	_property: {
            multiSelect: {
                type: "Boolean",
                get: function() {
                    return this._multiSelect;
                },
                set: function(value) {
                    this._multiSelect = value;
                }
            },
            styleClass: {
                type: "String",
                get: function() {
                    return this._styleClass;
                },
                set: function(value) {
                    this._styleClass = value ? " " + value : "";
                    this.updateDisplay();
                }
            },
            rowHeight: {
                type: "Number",
                get: function() {
                    return this._rowHeight;
                },
                set: function(value) {
                    this._rowHeight = value;
                    this.updateDisplay();
                }
            },
            itemRender: {
                type: "Function",
                get: function() {
                    return this._itemRender;
                },
                set: function(value) {
                    this._itemRender = value;
                }
            },
            template: {
                type: "String",
                get: function(value) {
                    return this._template;
                },
                set: function(value) {
                    this._template = value;
                    this._parts = jsf.core.Util.templateToArray(value);
                    this.updateDisplay();
                }
            },
            fieldName: {
                type: "String",
                get: function() {
                    return this._fieldName;
                },
                set: function(value) {
                    value = this._fieldName;
                }
            },
            data: {
                type: "Object",
                get: function(value) {
                    var item = this.selectedItem();
                    return item ? item[this._dataField || this._name] : null;
                },
                set: function(value) {
                    this.find(this._dataField, value);
                }
            },
            listField: {
                type: "String",
                get: function() {
                    return this._listField;
                },
                set: function(value) {
                    this._listField = value;
                }
            },
            dataField: {
                type: "String",
                get: function() {
                    return this._dataField;
                },
                set: function(value) {
                    this._dataField = value;
                }
            }
        },
		
        _method: {
            render: function() {
                jsf.ui.JListBase.prototype.render.call(this);
            },
            find: function(field, value) {
                var i, index = -1;

                for (i = 0; i < this._dataProvider.length; i++) {
                    if (this._dataProvider[i][field] == value) {
                        index = i;
                        break;
                    }
                }

                this._dataProviderChanged = true;
                setItemSelected(this, index);

                return index;
            },
            sort: function(field, direction) {
                this._dataProvider.sortObject(field, direction);
                this._dataProviderChanged = true;
                return this.render();
            },
            updateRow: function(index, newRow) {
                var i, item = this._dataProvider[index];

                if (item && newRow) {
                    for (i in newRow) {
                        item[i] = newRow[i];
                    }
                }

                this.render();

                return this;
            },
            removeRow: function(index) {
                this._dataProvider = jsf.Array.removeByIndex(this._dataProvider, index);

                this.dataProvider(this._dataProvider);

                if (index == this.selectedIndex()) {
                    this.selectedIndex(-1);
                }

                return this;
            },
            addRow: function(newRow) {
                this._dataProvider.push(newRow);
                this.dataProvider(this._dataProvider);

                return this;
            },
            removeSelectedItems: function() {
                var i, dp = [];
                for (i = 0; i < this._dataProvider.length; i++) {
                    if (!this._dataProvider[i]._sel_) {
                        dp.push(this._dataProvider[i]);
                    }
                }
                this.dataProvider(dp);
                return this;
            },
            selectedItem: function() {
                return this._dataProvider[this._selectedIndex];
            },
            selectedItems: function() {
                var i, e, items = [];

                for (i = 0; i < this._dataProvider.length; i++) {
                    if (this._dataProvider[i].__selected__) {
                        e = items.push(Util.getClone(this._dataProvider[i]));
                        delete(items[e - 1]._sel_);
                    }
                }

                return items;
            },
            selectedIndex: function(value) {
                //get
                if (value === undefined) {
                    return this._selectedIndex;
                }

                //set
                setItemSelected(this, value);

                return this;
            },
            measureHeight: function() {
                var h = this._dataProvider.length * this._rowHeight;

                if (h == 0) {
                    h = this._rowHeight;
                }

                return h + 6;
            },
            clear: function() {
                this.selectedIndex(-1);
            }
        }
    });
	
//private functions:
    function setItemSelected(lst, index){
        var i = lst._selectedIndex;
        
        if (lst._dataProvider[index] && lst._dataProvider[index].selectable===false){
            return;
        }
        
        if (!lst._multiSelect && lst._selectedIndex>=0){
            if (lst._dataProvider[lst._selectedIndex]){
                delete(lst._dataProvider[lst._selectedIndex]._sel_);
            }
        }
        
        lst._oldSelectedItem = lst._selectedItem;
        lst._selectedItem = lst._dataProvider[index] || null;
        
        lst._selectedIndex = index;
        if (lst._selectedItem){
            lst._selectedItem._sel_ = true;
        }
        
        if (i != lst._selectedIndex) {
            if (lst._onchange) {
                lst._onchange(lst._selectedItem);
            }

            lst._fireBindableProperty("selectedItem", lst._selectedItem);

            lst.dispatch(jsf.Event.ON_CHANGE, lst._selectedItem);
        }
        
        lst._updateList();
    }
    
}());
