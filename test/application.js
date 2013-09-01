"use strict";

App = {
    onCreationComplete: function(){
        var i, dp=[];
        
        for (i=0; i<100; i++){
            dp.push({label:"item " + i});
        }
        
        this.lstEsquerda.dataProvider(dp);
    },
    
    actionNewProject: function(sender, evt){
        jsf.Alert.show("msgbox ok");
    },
    
    lstUI_onChange: function(sender, evt){
        var item = this.lstUI.selectedItem();
        this.moduleLoader.load( item.module );
    }
};

