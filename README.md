# Sistema de Inventário de TI

Aplicação web desenvolvida para gestão de ativos de hardware de TI, permitindo cadastrar, visualizar, filtrar e excluir equipamentos em uma interface responsiva e organizada.

Os dados são persistidos em um arquivo `inventario.json`, garantindo que os registros permaneçam salvos mesmo após recarregar a página.

## Funcionalidades

- Cadastro de equipamentos com os campos:
  - ID Numérico
  - Tipo
  - Modelo / Marca
  - Colaborador
  - Setor
- Listagem em tabela dos itens cadastrados
- Persistência real em arquivo `inventario.json`
- Filtro por setor
- Contador total de ativos
- Exclusão de itens cadastrados
- Interface responsiva

## Tecnologias utilizadas

- Node.js
- Express
- HTML5
- CSS3
- JavaScript

## Estrutura do projeto

```bash
inventario-ti/
├── inventario.json
├── package.json
├── server.js
└── public/
    ├── index.html
    ├── style.css
    └── script.js
