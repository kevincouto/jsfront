"use strict";
/*global Lang */

/*
Os pontos fundamentais para internacionalização e localização incluem:
	-A língua, contendo a codificação do texto em diferentes sistemas de escrita (Alfabetos), diferentes sistemas numerais, scripts da esquerda-para-direita e scripts da direita-para-esquerda (por exemplo, para língua hebraica). Os sistemas atuais utilizam Unicode para solucionar problemas de codificação de caracteres. Contendo também a representação gráfica do texto, o áudio e os subtítulos para vídeos.
	-O formato de data e tempo, incluindo diferentes calendários.
	-As diferentes formatações de números.
	-O fuso horário (UTC) de cada país para coincidir com a língua a ser internacionalizada.
	-Os números pré-definidos governamentalmente como: passaportes, RG, CPF.
	-Os padrões de números de telefones, endereço e códigos postais internacionais.
	-Os pesos e medidas de cada país.
	-O tamanho de papéis.
	-A moeda local.
	-Nomes e títulos locais.
*/

Lang.values({
    "jsf.aWeek"     : ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    "jsf.aMonths"   : ['Janeiro', 'Fevereiro', 'Mar\u00E7o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    "jsf.today"     : 'hoje',
    "jsf.loading"   : 'Carregando',
    "jsf.component" : 'Componente',
    "jsf.invalidFuncion" : "O Componente {componentName} está tentando anexar o evento {eventName} a uma função inválida.",
    
    "app.title" : 'T\u00EDtulo da Aplica\u00E7\u00E3o'
});