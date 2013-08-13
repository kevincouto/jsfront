"use strict";

(function(){
    var 
        _ruleIndex = 0, 
        _sheet, 
        cssNode = document.createElement('style');

    cssNode.type  = 'text/css';
    cssNode.rel   = 'stylesheet';
    cssNode.media = 'screen';
    cssNode.title = 'spritesSheet';
    document.getElementsByTagName("head")[0].appendChild(cssNode);	
   
    define("jsf.core.ImageMap", {
        _require: ["jsf.core.Sheet", "jsf.core.Control"],
        _alias: "jsf.ImageMap",
        _extend: "control",
        _xtype: "imagemap",
      
        _constructor: function(properties) {
            var i, sheet;
            
            jsf.Control.call(this);
            
            if (!_sheet) {
                for (i = 0; i < document.styleSheets.length; i++) {
                    sheet = document.styleSheets[i];
                    if (sheet.title == 'ImageMapSheet') {
                        _sheet = sheet;
                        break;
                    }
                }
            }
            
            this._cols = 1;
            this._rules = [];
            this._ruleIndex = _ruleIndex++;
            
            this._applyProperties(properties);
        },
      
        _static: {
            _parentProperty: 'imagemap'
        },
      
        _public: {
            // imagem com os sprites
            image: function(value) {
                this._image = value;
            },
            
            // uma regra que será adiconada a todos os sprites
            rule: function(value) {
                this._rule = value;
            },
                    
            // altura da ícone
            iconHeight: function(value) {
                this._height = value;
            },
            
            // largura do ícone
            iconWidth: function(value) {
                this._width = value;
            },
                    
            // retorna uma regra css (.className) referente a posição do sprite dentro
            // da imagem
            sprite: function(row, col) {
                if (!this._rules[row]){
                    this._rules[row] = [];
                }
               
                if (!this._rules[row][col]) {
                    var s = 'width:' + this._width + 'px;height:' + this._height + 'px;background-image:url(' + this._image + ');background-repeat:no-repeat;';
                    this._rules[row][col] = 'spr' + String(this._ruleIndex) + row + String(col);
                    
                    jsf.Sheet.addRule(_sheet, '.' + this._rules[row][col], s + 'background-position:-' + (this._width * col) + 'px -' + (this._height * row) + 'px;' + (this._rule || ''));
                }
               
                return this._rules[row][col];
            }
        }
    });
}());

