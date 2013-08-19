"use strict";


QueryObject = {
    definition:{
        id:'queryId',
        operations:[
            /*define as operações na ordem criada pelo usuário,
                linha/coluna calculada,
                ordenação por valor (deve ser o último a ser executado)
                ordenação por categoria (deve ser executado após adicionar linhas/colunas calculadas)
            */
        ],
        rows: [
            {dimension:"ano"},
            {dimension:"mes"}
        ],
        cols: [//labels definidos pelo usuário,larguras de colunas,
            {dimension:"produto"},
            {dimension:"tipo"}
        ]
    },
    data:[
        [
            null,
            null,       
            {
                id:'ano.2000',
                category:'2000',
                colspan:2
            }, 
            null,
            {   
                id:'ano.2001',
                category:'2001',
                colspan:3
            },
            null,
            null    
        ],
        [
            null,
            null,
            {
                id:'ano.2000.mes.jan',
                category:'jan'
            },  
            {
                id:'ano.2000.mes.fev',
                category:'fev'
            },
            {
                id:'ano.2001.mes.jan',
                category:'jan'
            },  
            {
                id:'ano.2001.mes.fev',
                category:'fev'
            },  
            {
                id:'ano.2001.mes.mar',
                category:'mar'
            }   
        ],
        [
            {
                id:'produto.arroz',
                category:'arroz',
                rowspan:2,
            },
            {   
                id:'produto.arroz.tipo.tipo1',
                category:'tipo 1'
            },
            0,0,0,0,0       
        ],
        [   
            null,
            {
                id:'produto.arroz.tipo.tipo2',
                category:'tipo 2'
            },
            0,0,0,0,0       
        ],
        [
            {
                id:'produto.arroz.resumo'
            },
            null,
            0,0,0,0,0       
        ]
    ]
};

/*
    {id:'ano.2000', caption:'2000', category:'2000', colspan:2]}
    \_________________________________    ______________________/
                                      \  /
    cube = [                           \/
        0 -> [null,      null,       {2000}, null,   {2001}, null,   null    ],
        1 -> [null,      null,       {jan},  {fev},  {jan},  {fev},  {mar}   ],
        2 -> [{arroz},   {tipo 1},   0,      0,      0,      0,      0       ],
        3 -> [null,      {tipo 2},   0,      0,      0,      0,      0       ],
        4 -> [null,      {tipo 1},   0,      0,      0,      0,      0       ], //id:'produto.arroz.resumo'
        5 -> [{resumo},  null,       0,      0,      0,      0,      0       ],
        6 -> [feijão,    {tipo a},   0,      0,      0,      0,      0       ],
        7 -> [null,      {tipo b},   0,      0,      0,      0,      0       ],
        8 -> [null,      {tipo c},   0,      0,      0,      0,      0       ]
    ];
    rows = [
        0 -> {dimension:"ano"},
        1 -> {dimension:"mes"}
    ];
    cols = {
        0 -> {dimension:"produto"},
        1 -> {dimension:"tipo"}
    };

    {arroz} = {
        rowspan :3
        category: 'arroz',
        caption : 'arroz',
        id      : 'produto.arroz'
    }
    
    {tipo 2} = {
        rowparent: 2,
        category : 'tipo',
        caption  : 'tipo1',
        id       : 'tipo.tipo1'
    }
*/

define("jsf.olap.OLAPCube", {
    _alias: "jsf.OLAPCube",
    _abstract: true,
    
    _static: {
        
    }
});
