export class ProdutoUtils {
  headersProdutos: { label: string, colSpan: string }[] = [
    { label: "Produto", colSpan: "col-span-11" },
    { label: "Vendas", colSpan: "col-span-2" },
    // { label: "Variação", colSpan: "col-span-2" },
    { label: "Categoria", colSpan: "col-span-2" },
    { label: "Visibilidade", colSpan: "col-span-2" },
  ];

  headersCategorias: { label: string, colSpan: string }[] = [
    { label: "Categoria", colSpan: "col-span-17" },
    // { label: "Slug", colSpan: "col-span-7" },
  ];

  headersCupons: { label: string, colSpan: string }[] = [
    { label: "Nome", colSpan: "col-span-3" },
    { label: "Desconto", colSpan: "col-span-1" },
    { label: "Categoria", colSpan: "col-span-1" },
    { label: "Disponíveis", colSpan: "col-span-1" },
    { label: "Compra min.", colSpan: "col-span-1" },
    { label: "Status", colSpan: "col-span-1" },
  ];
};

export const optionsStatus = [
  {
    label: "Oculto",
    value: false,
    icon: '/icons/oculto.svg'
  },
  {
    label: "Vísivel",
    value: true,
    icon: '/icons/visivel.svg'
  },
]

export const mockProdutosList = [
    {
        "id": 31,
        "nome": "Produto categoria legal",
        "preco": 0,
        "desconto": null,
        "descricao": "AAAA",
        "sku": null,
        "urlAmigavel": "/produto-categoria-legal",
        "ativo": true,
        "lojaId": 9,
        "criadoEm": "2025-05-09T18:25:10.654Z",
        "atualizadoEm": "2025-05-09T18:25:10.654Z",
        "categoria": null,
        "estoque": null,
        "variacoes": [],
        "imagensId": []
    },
    {
        "id": 34,
        "nome": "Produto muito novo",
        "preco": 0,
        "desconto": null,
        "descricao": "Descrição geral",
        "sku": null,
        "urlAmigavel": "/produto-muito-novo",
        "ativo": true,
        "lojaId": 9,
        "criadoEm": "2025-05-12T12:56:33.698Z",
        "atualizadoEm": "2025-05-12T12:56:33.698Z",
        "categoria": null,
        "estoque": null,
        "variacoes": [],
        "imagensId": [
            {
                "id": 1,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 0
            },
            {
                "id": 2,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 1
            },
            {
                "id": 3,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 2
            },
            {
                "id": 4,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 3
            },
            {
                "id": 5,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 4
            },
            {
                "id": 6,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 5
            },
            {
                "id": 7,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 6
            },
            {
                "id": 8,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 7
            },
            {
                "id": 9,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 8
            },
            {
                "id": 10,
                "url": "undefined/produto/34/imagem/4",
                "ordem": 9
            }
        ]
    },
    {
        "id": 35,
        "nome": "teste produto",
        "preco": 0,
        "desconto": null,
        "descricao": "aaa",
        "sku": null,
        "urlAmigavel": "/teste-produto",
        "ativo": true,
        "lojaId": 9,
        "criadoEm": "2025-05-12T12:57:52.979Z",
        "atualizadoEm": "2025-05-12T12:57:52.979Z",
        "categoria": null,
        "estoque": {
            "id": 2,
            "tipoEstoque": "mensagem",
            "tipoProduto": "produto",
            "mensagem": "teste.",
            "deletado": false,
            "deletadoEm": null,
            "produtoId": 35,
            "variacaoProdutoId": null,
            "lojaId": 9,
            "criadoEm": "2025-05-12T17:01:04.855Z",
            "atualizadoEm": "2025-05-12T17:01:04.855Z"
        },
        "variacoes": [
            {
                "id": 1,
                "nome": "Item legal",
                "preco": 1,
                "desconto": 0,
                "ativo": false,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-12T16:37:41.612Z",
                "atualizadoEm": "2025-05-12T16:37:41.612Z"
            },
            {
                "id": 2,
                "nome": "Item legal",
                "preco": 1,
                "desconto": 0,
                "ativo": false,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-12T16:40:11.157Z",
                "atualizadoEm": "2025-05-12T16:40:11.157Z"
            },
            {
                "id": 3,
                "nome": "Item legal",
                "preco": 1,
                "desconto": 0,
                "ativo": false,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-12T16:41:58.709Z",
                "atualizadoEm": "2025-05-12T16:41:58.709Z"
            },
            {
                "id": 4,
                "nome": "Item legal",
                "preco": 1,
                "desconto": 0,
                "ativo": false,
                "produtoId": 35,
                "estoque": {
                    "id": 1,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "asdsad",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 4,
                    "lojaId": 9,
                    "criadoEm": "2025-05-12T16:55:18.117Z",
                    "atualizadoEm": "2025-05-12T16:55:18.117Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-12T16:44:03.010Z",
                "atualizadoEm": "2025-05-12T16:44:03.010Z"
            },
            {
                "id": 5,
                "nome": "Nome legsl",
                "preco": 123,
                "desconto": 0,
                "ativo": false,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-12T16:52:42.870Z",
                "atualizadoEm": "2025-05-12T16:52:42.870Z"
            },
            {
                "id": 6,
                "nome": "Nome legsl",
                "preco": 123,
                "desconto": 0,
                "ativo": false,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-12T16:55:42.818Z",
                "atualizadoEm": "2025-05-12T16:55:42.818Z"
            },
            {
                "id": 7,
                "nome": "variante teste",
                "preco": 1,
                "desconto": 0,
                "ativo": false,
                "produtoId": 35,
                "estoque": {
                    "id": 3,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "qqqqq",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 7,
                    "lojaId": 9,
                    "criadoEm": "2025-05-12T17:01:31.589Z",
                    "atualizadoEm": "2025-05-12T17:01:31.589Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-12T17:01:31.252Z",
                "atualizadoEm": "2025-05-12T17:01:31.252Z"
            },
            {
                "id": 8,
                "nome": "variadinho",
                "preco": 1,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": {
                    "id": 4,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "aa",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 8,
                    "lojaId": 9,
                    "criadoEm": "2025-05-13T12:23:08.113Z",
                    "atualizadoEm": "2025-05-13T12:23:08.113Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-13T12:23:07.810Z",
                "atualizadoEm": "2025-05-13T12:23:07.810Z"
            },
            {
                "id": 9,
                "nome": "aaa",
                "preco": 1,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": {
                    "id": 5,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "aa",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 9,
                    "lojaId": 9,
                    "criadoEm": "2025-05-13T12:24:09.134Z",
                    "atualizadoEm": "2025-05-13T12:24:09.134Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-13T12:24:08.837Z",
                "atualizadoEm": "2025-05-13T12:24:08.837Z"
            },
            {
                "id": 10,
                "nome": "novo item",
                "preco": 12,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": {
                    "id": 6,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "12",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 10,
                    "lojaId": 9,
                    "criadoEm": "2025-05-13T12:29:38.008Z",
                    "atualizadoEm": "2025-05-13T12:29:38.008Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-13T12:29:37.706Z",
                "atualizadoEm": "2025-05-13T12:29:37.706Z"
            },
            {
                "id": 11,
                "nome": "Item legal edit",
                "preco": 12,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-14T19:14:42.674Z",
                "atualizadoEm": "2025-05-14T19:14:42.674Z"
            },
            {
                "id": 12,
                "nome": "Item legal editado",
                "preco": 12,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": {
                    "id": 7,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "aa",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 12,
                    "lojaId": 9,
                    "criadoEm": "2025-05-14T19:15:03.805Z",
                    "atualizadoEm": "2025-05-14T19:15:03.805Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-14T19:15:03.248Z",
                "atualizadoEm": "2025-05-14T19:15:03.248Z"
            },
            {
                "id": 13,
                "nome": "Item legal editado22",
                "preco": 12,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-14T19:15:29.498Z",
                "atualizadoEm": "2025-05-14T19:15:29.498Z"
            },
            {
                "id": 14,
                "nome": "Item legal editado22",
                "preco": 12,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-14T19:15:35.263Z",
                "atualizadoEm": "2025-05-14T19:15:35.263Z"
            },
            {
                "id": 15,
                "nome": "Item legal editadoa",
                "preco": 12,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-14T19:15:45.417Z",
                "atualizadoEm": "2025-05-14T19:15:45.417Z"
            },
            {
                "id": 16,
                "nome": "Item legal editadoa",
                "preco": 12,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-14T19:16:45.439Z",
                "atualizadoEm": "2025-05-14T19:16:45.439Z"
            },
            {
                "id": 17,
                "nome": "Item legal editadozinho",
                "preco": 12,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-14T19:17:42.598Z",
                "atualizadoEm": "2025-05-14T19:20:37.684Z"
            },
            {
                "id": 18,
                "nome": "Estoque novo",
                "preco": 1,
                "desconto": 0,
                "ativo": true,
                "produtoId": 35,
                "estoque": {
                    "id": 8,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "teste",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 18,
                    "lojaId": 9,
                    "criadoEm": "2025-05-14T19:26:24.837Z",
                    "atualizadoEm": "2025-05-14T19:26:24.837Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-14T19:26:24.536Z",
                "atualizadoEm": "2025-05-14T19:26:24.536Z"
            },
            {
                "id": 31,
                "nome": "aaaaasas - vermei",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 27,
                        "valor": "aaaaasas"
                    },
                    {
                        "id": 50,
                        "valor": "vermei"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.872Z",
                "atualizadoEm": "2025-05-14T20:31:05.872Z"
            },
            {
                "id": 32,
                "nome": "aaaaasas - azul",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 27,
                        "valor": "aaaaasas"
                    },
                    {
                        "id": 51,
                        "valor": "azul"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.891Z",
                "atualizadoEm": "2025-05-14T20:31:05.891Z"
            },
            {
                "id": 33,
                "nome": "aaaaasas - roxo",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 27,
                        "valor": "aaaaasas"
                    },
                    {
                        "id": 52,
                        "valor": "roxo"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.897Z",
                "atualizadoEm": "2025-05-14T20:31:05.897Z"
            },
            {
                "id": 34,
                "nome": "aaaaasas - lilas",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 27,
                        "valor": "aaaaasas"
                    },
                    {
                        "id": 53,
                        "valor": "lilas"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.901Z",
                "atualizadoEm": "2025-05-14T20:31:05.901Z"
            },
            {
                "id": 35,
                "nome": "sadasd - vermei",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 28,
                        "valor": "sadasd"
                    },
                    {
                        "id": 50,
                        "valor": "vermei"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.905Z",
                "atualizadoEm": "2025-05-14T20:31:05.905Z"
            },
            {
                "id": 36,
                "nome": "sadasd - azul",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 28,
                        "valor": "sadasd"
                    },
                    {
                        "id": 51,
                        "valor": "azul"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.908Z",
                "atualizadoEm": "2025-05-14T20:31:05.908Z"
            },
            {
                "id": 37,
                "nome": "sadasd - roxo",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 28,
                        "valor": "sadasd"
                    },
                    {
                        "id": 52,
                        "valor": "roxo"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.912Z",
                "atualizadoEm": "2025-05-14T20:31:05.912Z"
            },
            {
                "id": 38,
                "nome": "sadasd - lilas",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 28,
                        "valor": "sadasd"
                    },
                    {
                        "id": 53,
                        "valor": "lilas"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.915Z",
                "atualizadoEm": "2025-05-14T20:31:05.915Z"
            },
            {
                "id": 39,
                "nome": "as - vermei",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 29,
                        "valor": "as"
                    },
                    {
                        "id": 50,
                        "valor": "vermei"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.918Z",
                "atualizadoEm": "2025-05-14T20:31:05.918Z"
            },
            {
                "id": 40,
                "nome": "as - azul",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 29,
                        "valor": "as"
                    },
                    {
                        "id": 51,
                        "valor": "azul"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.922Z",
                "atualizadoEm": "2025-05-14T20:31:05.922Z"
            },
            {
                "id": 41,
                "nome": "as - roxo",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 29,
                        "valor": "as"
                    },
                    {
                        "id": 52,
                        "valor": "roxo"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.926Z",
                "atualizadoEm": "2025-05-14T20:31:05.926Z"
            },
            {
                "id": 42,
                "nome": "as - lilas",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 35,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 29,
                        "valor": "as"
                    },
                    {
                        "id": 53,
                        "valor": "lilas"
                    }
                ],
                "criadoEm": "2025-05-14T20:31:05.928Z",
                "atualizadoEm": "2025-05-14T20:31:05.928Z"
            }
        ],
        "imagensId": [
            {
                "id": 5,
                "url": "undefined/produto/35/imagem/5",
                "ordem": 0
            }
        ]
    },
    {
        "id": 37,
        "nome": "Produto do zero",
        "preco": 0,
        "desconto": null,
        "descricao": "Descrição",
        "sku": null,
        "urlAmigavel": "/produto-do-zero",
        "ativo": true,
        "lojaId": 9,
        "criadoEm": "2025-05-14T19:27:09.526Z",
        "atualizadoEm": "2025-05-14T19:27:09.526Z",
        "categoria": null,
        "estoque": null,
        "variacoes": [
            {
                "id": 19,
                "nome": "IOS",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 55,
                        "valor": "IOS"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:32.852Z",
                "atualizadoEm": "2025-05-14T19:31:32.852Z"
            },
            {
                "id": 20,
                "nome": "ANDROID",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 56,
                        "valor": "ANDROID"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:32.871Z",
                "atualizadoEm": "2025-05-14T19:31:32.871Z"
            },
            {
                "id": 21,
                "nome": "MAC",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 57,
                        "valor": "MAC"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:32.877Z",
                "atualizadoEm": "2025-05-14T19:31:32.877Z"
            },
            {
                "id": 22,
                "nome": "IOS",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 55,
                        "valor": "IOS"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:35.826Z",
                "atualizadoEm": "2025-05-14T19:31:35.826Z"
            },
            {
                "id": 23,
                "nome": "ANDROID",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 56,
                        "valor": "ANDROID"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:35.831Z",
                "atualizadoEm": "2025-05-14T19:31:35.831Z"
            },
            {
                "id": 24,
                "nome": "MAC",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 57,
                        "valor": "MAC"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:35.836Z",
                "atualizadoEm": "2025-05-14T19:31:35.836Z"
            },
            {
                "id": 25,
                "nome": "IOS",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 55,
                        "valor": "IOS"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:38.935Z",
                "atualizadoEm": "2025-05-14T19:31:38.935Z"
            },
            {
                "id": 26,
                "nome": "ANDROID",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 56,
                        "valor": "ANDROID"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:38.953Z",
                "atualizadoEm": "2025-05-14T19:31:38.953Z"
            },
            {
                "id": 27,
                "nome": "MAC",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 57,
                        "valor": "MAC"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:38.962Z",
                "atualizadoEm": "2025-05-14T19:31:38.962Z"
            },
            {
                "id": 28,
                "nome": "IOS",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 55,
                        "valor": "IOS"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:40.841Z",
                "atualizadoEm": "2025-05-14T19:31:40.841Z"
            },
            {
                "id": 29,
                "nome": "ANDROID",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 56,
                        "valor": "ANDROID"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:40.847Z",
                "atualizadoEm": "2025-05-14T19:31:40.847Z"
            },
            {
                "id": 30,
                "nome": "MAC",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 57,
                        "valor": "MAC"
                    }
                ],
                "criadoEm": "2025-05-14T19:31:40.863Z",
                "atualizadoEm": "2025-05-14T19:31:40.863Z"
            },
            {
                "id": 43,
                "nome": "Produto imagem",
                "preco": 23,
                "desconto": 0,
                "ativo": true,
                "produtoId": 37,
                "estoque": null,
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-15T00:27:24.706Z",
                "atualizadoEm": "2025-05-15T00:27:24.706Z"
            },
            {
                "id": 44,
                "nome": "Produto imagem",
                "preco": 2,
                "desconto": 0,
                "ativo": true,
                "produtoId": 37,
                "estoque": {
                    "id": 9,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "aaaa",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 44,
                    "lojaId": 9,
                    "criadoEm": "2025-05-15T00:30:22.947Z",
                    "atualizadoEm": "2025-05-15T00:30:22.947Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-15T00:30:22.677Z",
                "atualizadoEm": "2025-05-15T00:30:45.420Z"
            }
        ],
        "imagensId": [
            {
                "id": 12,
                "url": "undefined/produto/37/imagem/12",
                "ordem": 0
            },
            {
                "id": 13,
                "url": "undefined/produto/37/imagem/13",
                "ordem": 0
            }
        ]
    },
    {
        "id": 38,
        "nome": "produto teste sem estoque",
        "preco": 0,
        "desconto": null,
        "descricao": "alimentação",
        "sku": null,
        "urlAmigavel": "/produto-teste-sem-estoque",
        "ativo": true,
        "lojaId": 9,
        "criadoEm": "2025-05-14T20:09:26.538Z",
        "atualizadoEm": "2025-05-14T20:09:26.538Z",
        "categoria": null,
        "estoque": null,
        "variacoes": [],
        "imagensId": [
            {
                "id": 14,
                "url": "undefined/produto/38/imagem/14",
                "ordem": 0
            }
        ]
    },
    {
        "id": 39,
        "nome": "produto sem estoque pelo amor",
        "preco": 0,
        "desconto": null,
        "descricao": "aa",
        "sku": null,
        "urlAmigavel": "/produto-sem-estoque-pelo-amor",
        "ativo": true,
        "lojaId": 9,
        "criadoEm": "2025-05-14T20:11:48.494Z",
        "atualizadoEm": "2025-05-14T20:11:48.494Z",
        "categoria": null,
        "estoque": null,
        "variacoes": [],
        "imagensId": []
    },
    {
        "id": 40,
        "nome": "aaaa",
        "preco": 0,
        "desconto": null,
        "descricao": "descritivo",
        "sku": null,
        "urlAmigavel": "/aaaa",
        "ativo": true,
        "lojaId": 9,
        "criadoEm": "2025-05-14T20:28:49.648Z",
        "atualizadoEm": "2025-05-14T20:28:49.648Z",
        "categoria": null,
        "estoque": null,
        "variacoes": [],
        "imagensId": [
            {
                "id": 15,
                "url": "undefined/produto/40/imagem/15",
                "ordem": 0
            }
        ]
    },
    {
        "id": 41,
        "nome": "PRODUTO VARIADO VARIADO",
        "preco": 0,
        "desconto": null,
        "descricao": ".",
        "sku": null,
        "urlAmigavel": "/produto-variado-variado",
        "ativo": true,
        "lojaId": 9,
        "criadoEm": "2025-05-15T00:38:28.558Z",
        "atualizadoEm": "2025-05-15T01:44:58.655Z",
        "categoria": {
            "id": 46,
            "nome": "Alimentos ",
            "descricao": null,
            "lojaId": 9,
            "criadoEm": "2025-05-12T11:49:57.784Z",
            "atualizadoEm": "2025-05-12T11:49:57.784Z"
        },
        "estoque": null,
        "variacoes": [
            {
                "id": 45,
                "nome": "preto",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 41,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 58,
                        "valor": "preto"
                    }
                ],
                "criadoEm": "2025-05-15T00:38:46.677Z",
                "atualizadoEm": "2025-05-15T00:38:46.677Z"
            },
            {
                "id": 46,
                "nome": "branco",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 41,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 59,
                        "valor": "branco"
                    }
                ],
                "criadoEm": "2025-05-15T00:38:46.696Z",
                "atualizadoEm": "2025-05-15T00:38:46.696Z"
            },
            {
                "id": 47,
                "nome": "verde",
                "preco": null,
                "desconto": null,
                "ativo": true,
                "produtoId": 41,
                "estoque": null,
                "valorAtributoProduto": [
                    {
                        "id": 60,
                        "valor": "verde"
                    }
                ],
                "criadoEm": "2025-05-15T00:38:46.702Z",
                "atualizadoEm": "2025-05-15T00:38:46.702Z"
            },
            {
                "id": 48,
                "nome": "Estoque no seco123",
                "preco": 1,
                "desconto": 0,
                "ativo": true,
                "produtoId": 41,
                "estoque": {
                    "id": 10,
                    "tipoEstoque": "lista",
                    "tipoProduto": "variacao",
                    "mensagem": "",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 48,
                    "lojaId": 9,
                    "criadoEm": "2025-05-15T00:40:15.702Z",
                    "atualizadoEm": "2025-05-15T00:40:15.702Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-15T00:40:15.428Z",
                "atualizadoEm": "2025-05-15T00:48:54.247Z"
            },
            {
                "id": 49,
                "nome": "Variacaozinha234",
                "preco": 1,
                "desconto": 0,
                "ativo": true,
                "produtoId": 41,
                "estoque": {
                    "id": 11,
                    "tipoEstoque": "mensagem",
                    "tipoProduto": "variacao",
                    "mensagem": "aaaaaa",
                    "deletado": false,
                    "deletadoEm": null,
                    "produtoId": null,
                    "variacaoProdutoId": 49,
                    "lojaId": 9,
                    "criadoEm": "2025-05-15T00:47:13.933Z",
                    "atualizadoEm": "2025-05-15T00:47:13.933Z"
                },
                "valorAtributoProduto": [],
                "criadoEm": "2025-05-15T00:47:13.632Z",
                "atualizadoEm": "2025-05-15T00:49:14.600Z"
            }
        ],
        "imagensId": [
            {
                "id": 32,
                "url": "undefined/produto/41/imagem/32",
                "ordem": 0
            },
            {
                "id": 24,
                "url": "undefined/produto/41/imagem/24",
                "ordem": 1
            },
            {
                "id": 29,
                "url": "undefined/produto/41/imagem/29",
                "ordem": 2
            }
        ]
    }
]