"use strict";

Main.actionNewProject = function(sender, evt){
    jsf.Alert.show("msgbox ok");
};

Main.lstUI_onChange = function(sender, evt){
    var item = this.lstUI.selectedItem();
    
    this.moduleLoader.load( item.module );
};

