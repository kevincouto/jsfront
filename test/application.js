"use strict";

App = {
    actionNewProject: function(sender, evt){
        jsf.Alert.show("msgbox ok");
    },
    
    lstUI_onChange: function(sender, evt){
        var item = this.lstUI.selectedItem();
        this.moduleLoader.load( item.module );
    }
};

