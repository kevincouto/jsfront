"use strict";

(function(){
   var 
        _sheet, varIconElement,    
        _ruleIndex = 0, 
        cssNode = document.createElement('style');

    cssNode.type  = 'text/css';
    cssNode.rel   = 'stylesheet';
    cssNode.media = 'screen';
    cssNode.title = 'spritesSheet';
    document.getElementsByTagName("head")[0].appendChild(cssNode);	
   
    define("jsf.core.Sprites", {
        _require: ["jsf.core.Sheet", "jsf.core.Control"],
        _alias: "jsf.Sprites",
        _extend: "control",
        _xtype: "sprites",
      
        _constructor : function(properties) {
            var i, sheet;
            
            jsf.Control.call(this);
            
            if (!_sheet) {
                for (i = 0; i < document.styleSheets.length; i++) {
                    sheet = document.styleSheets[i];
                    if (sheet.title == 'spritesSheet') {
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
            _parentProperty: 'sprites'
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
            
            // altura do sprite
            height: function(value) {
                this._height = value;
            },
            
            // largura do sprite
            width: function(value) {
                this._width = value;
            },
            
            // uma folhas de estilos especificas para serem adicionadas as regras css
            sheet: function() {
                return _sheet;
            },
         
            // retorna uma regra css (.className) referente a posição do sprite dentro
            // da imagem
            sprite: function(row, col) {
                if (jsf.isArray(row)){
                    col = row[1];
                    row = row[0];
                }
                
                if (!this._rules[row]){
                    this._rules[row] = [];
                }
               
                if (!this._rules[row][col]) {
                    var s = 'width:' + this._width + 'px;height:' + this._height + 'px;background-image:url(' + this._image + ');background-repeat:no-repeat;';
                    this._rules[row][col] = 'spr' + String(this._ruleIndex) + row + String(col);
                    
                    jsf.Sheet.addRule(_sheet, '.' + this._rules[row][col], s + 'background-position:-' + (this._width * col) + 'px -' + (this._height * row) + 'px;' + (this._rule || ''));
                    // console.log('.' + this._rules[row][col] + ' : ' + s +
                    // 'background-position:-' + (this._width * col) + 'px -' +
                    // (this._height * row) + 'px;' + (this._rule || '') );
                }
               
                return this._rules[row][col];
            },
            
            iconElement: function(row, col){
                if (!varIconElement){
                    varIconElement = jsf.util.Dom.create("div", "left:110%;width:"+this._width+"px;height:"+this._height+"px;");
                    varIconElement.className = this.sprite(row, col);
                    document.body.appendChild(varIconElement);
                }
                
                return varIconElement;
            }
        }
    });
    
}());

