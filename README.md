No post de hoje iremos mostrar um pouco como trabalhamos aqui na VAAES.

Muitos de vocês nunca ouviram falar ou não sabem quais ferramentas de desenvolvimento a SAP nos disponibiliza para desenvolvimento de aplicações, então resolvi trazer hoje um pouco sobre Cloud Application Programming Model ou CAP para os íntimos.

CAP é uma ferramenta que utilizamos para desenvolver API's de maneira simples e prática. Ele não está disponível somente em Java, mas também de NodeJs e todos sabemos como NodeJs é muito comum no desenvolvimento cloud. Trabalhar com Javascript no backend é sensacional, porém à medida que os projetos ficam maiores, a tipagem fraca do Javascript pode ser desafiadora. Então, o Typescript entra na jogada para nos fornecer tipagem mais robusta. E confesso que sou fã dessa tecnologia.

Aqui podemos ver a estrutura de pastas de um projeto normal CAP. Perceba que os arquivos `.cds` e `.js` ficam misturados dentro da pasta srv. Infelizmente não podemos movê-los para diferentes pois o CAP não consegue reconhecê-los.

![Normal CAP project](./public/images/normal-cap-project.png)

Estrutura do projeto

Além disso, os arquivos de `handlers` em Javascript acabavam realizando todas as lógicas num só lugar. Desde buscar o dado no banco de dados, regras de negócio, etc. E isso não é tão legal para manutenção de código. Como podemos ver no exemplo abaixo:

![Js code 1](./public/images/js-code-1.png)
Código em javascript

![Js code 2](./public/images/js-code-2.png)
Código em javascript

## Code

Sem mais enrolação, vamos ao que interessa. Iremos criar o famoso exemplo de livraria proposto pela SAP - O bookshop.

>Nota: Este tutorial foi feito com NodeJs v14.17.6 e @sap/cds 5.4.3

![Js code 2](./public/images/cds-version.png)

Primeiramente, vamos criar uma pasta para nosso novo projeto:

![Js code 2](./public/images/mkdir.png)

Agora, vamos instalar globalmente a biblioteca de linha de comando do CAP:

```bash
npm i -g @sap/cds-dk hana-cli
```

![Js code 2](./public/images/cds-global.png)

Feito isso, vamos criar o esqueleto do projeto:
```bash
cds init
```

![image](./public/images/cds-init.png)

Agora, vamos criar o modulo db. Este comando irá criar os arquivos necessários para o módulo db rodar corretamente:
```bash
hana-cli createModule
```

![image](./public/images/hana-cli-createModule.png)

Com o módulo db pronto, vamos criar nosso arquivo cds dentro do módulo db onde criaremos as entidades da nossa livraria posteriormente:
```bash
cd db && mkdir cds && cd cds && touch bookshop.cds
```

Agora, vamos preencher o arquivo `bookshop.cds` com as entidades:
```typescript
using {
    Currency,
    managed,
    sap
} from '@sap/cds/common';

namespace bookshop;

entity Books: managed {
    key id: UUID;
        title: localized String(111);
        descr: localized String(1111);
        author: Association to Authors;
        genre: Association to Genres;
        stock: Integer;
        price: Decimal;
        currency: Currency;
        image: LargeBinary @Core.MediaType: 'image/png';
}

entity Authors: managed {
    key id: UUID;
        name: String(111);
        dateOfBirth: Date;
        dateOfDeath: Date;
        placeOfBirth: String;
        placeOfDeath: String;
        books: Association to many Books on books.author = $self;
}

entity Genres: sap.common.CodeList {
    key id: UUID;
        parent: Association to Genres;
        children: Composition of many Genres on children.parent = $self;
}
```

>Nota: Para saber mais a respeito dos arquivos cds, visite esta [página](https://cap.cloud.sap/docs/)

Vamos criar o serviço para expor nossas entidades:
```bash
 cd ../../srv/ && touch bookshop.cds
```

Preencha o conteúdo do arquivo criado com:
```typescript
using {bookshop} from '../db/cds/bookshop';

service BookshopService {
    @readonly
    entity ListOfBooks as projection on Books excluding {
        descr
    };

    @readonly
    entity Books as projection on bookshop.Books {
        * ,
        author.name as author
    } excluding {
        createdBy,
        modifiedBy
    };
}
```

Rodando o serviço:
```bash
cd .. && cds run
```

![image](./public/images/cds-run.png)

Nosso serviço foi exposto na porta 4004 (padrão):

![image](./public/images/service-running.png)

Porém, ao tentarmos acessar alguma das entidades expostas, perceba que ocorrerá um erro. Isto ocorre porque ainda não instalamos o banco de dados para rodar nossa aplicação.

![image](./public/images/db-error.png)

![image](./public/images/db-error-2.png)

Agora que temos nossa modelagem e o serviço prontos, vamos adicionar algumas dependências para que consigamos rodar nossa aplicação corretamente:

```bash
# Production dependencies
npm i @sap/cds @sap/hana-client @sap/xsenv @sap/xssec cds-routing-handlers express npm-run-all passport reflect-metadata module-alias

# Dev dependencies
npm i -D @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser cds2types eslint eslint-config-google eslint-plugin-prettier git-commit-msg-linter jest nodemon prettier sqlite3 supertest typescript @types/jest ts-jest
```

Explicando as dependencias:
```bash
1) @sap/cds - linha de comando para que qualquer um consiga rodar o projeto sem precisar instalar o cds globalmente
2) @sap/hana-client - biblioteca utilizada para conectar ao banco hana da SAP (utilizada somente em ambiente produtivo)
3) @sap/xsenv - utilizada para buscar variáveis de ambiente dentro do container deployado no Cloud Foundry (Cloud platform da SAP)
4) @sap/xssec e passport - Responsáveis pela segurança da aplicação
5) cds-routing-handlers e express - Framework para expor nossa API e redirecionar nossos custom handlers para onde quisermos
6) reflect-metadata - Utilizada para vários propósitos, mas  no nosso projeto será utilizada para emitir dados de decorators
7) module-alias - Como utilizaremos typescript, este módulo nos permite cadastrar atalhos para acessarmos as pastas dentro do nosso código typescript. Além disso, a transpilação permite o código continuar funcionando em javascript.
```

Após a instalação das dependências, vamos criar mais duas pastas na raíz do projeto:

```
mkdir src && mkdir scripts
```

Vamos adicionar alguns arquivos responsáveis pela configuração do nosso ambiente de desenvolvimento:

.cdsrc.json
```JSON
{
    "build": {
        "target": "gen"
    },
    "hana": {
        "deploy-format": "hdbtable"
    },
    "[production]": {
        "requires": {
            "db": {
                "kind": "hana"
            },
            "uaa": {
                "kind": "xsuaa"
            }
        }
    },
    "requires": {
        "db": {
            "kind": "sqlite"
        }
    }
}
```

.eslintignore
```JSON
gen/
node_modules/
coverage/
**/*.cds
```

.eslintrc.json
```JSON
{
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint",
        "prettier"
    ],
    "extends": [
        "google"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2020
    },
    "rules": {
        "prettier/prettier": [ "error", { "endOfLine": "auto" } ],
        "@typescript-eslint/no-unused-vars": ["error", { "caughtErrors": "all", "caughtErrorsIgnorePattern": "^ignore", "ignoreRestSiblings": true }],
        "arrow-parens": "off",
        "camelcase": "off",
        "comma-dangle": "off",
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "linebreak-style": "off",
        "max-len": ["error", 120],
        "max-lines-per-function": ["warn", 30],
        "new-cap": "off",
        "no-tabs": ["error"],
        "object-curly-spacing": ["error", "always"],
        "operator-linebreak": "off",
        "prefer-rest-params": "off",
        "quote-props": ["error", "as-needed"],
        "require-jsdoc": "off",
        "space-before-function-paren": "off",
        "valid-jsdoc": "off"
    }
}
```

.gitignore
```bash
gen/
sqlite.db
coverage
*.lcov
node_modules/
```

.prettierignore
```bash
**/*.cds
```

.prettierrc.json
```JSON
{
    "trailingComma": "es5",
    "tabWidth": 4,
    "semicolons": true,
    "ternaries": false,
    "printWidth": 120,
    "singleQuote": true
}
```

nodemon.json
```JSON
{
    "watch": ["src/**/*", "srv/**/*"],
    "ignore": "./src/entities/",
    "ext": "csv,cds,ts",
    "exec": "npm run build:local && node ./gen/srv/srv/server.js",
    "env": {
        "PORT": 4004,
        "NODE_ENV": "development"
    }
}
```

tsconfig.json
```JSON
{
    "compilerOptions": {
        "lib": ["ES2019"],
        "module": "commonjs",
        "target": "ES2019",
        "esModuleInterop": true,
        "inlineSourceMap": true,
        "inlineSources": true,
        "outDir": "./gen/srv/srv",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "preserveConstEnums": true,
        "skipLibCheck": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "include": ["src"],
    "exclude": ["node_modules"]
}
```

jest-integration.config.js
```javascript
const config = require('./jest.config');
config.testMatch = ['**/*.test.ts'];
module.exports = config;
```

jest-unit.config.js
```javascript
const config = require('./jest.config');
config.testMatch = ['**/*.spec.js'];
module.exports = config;
```

jest.config.js
```javascript
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { paths } = require('./tsconfig').compilerOptions;

module.exports = {
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
    roots: ['<rootDir>/tests', '<rootDir>/srv'],
    collectCoverageFrom: ['<rootDir>/srv/**/*.js'],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    testEnvironment: 'node',
    transform: {
        '.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
    },
};
```

Agora, vamos criar os scripts no nosso package.json:
```JSON
"scripts": {
    "start": "CDS_ENV=production NODE_ENV=production cds run",
    "dev": "nodemon",
    "build": "mbt build",
    "build:local": "npm-run-all build:db-local build:cds build:ts",
    "build:cds": "node ./scripts/convert-entities-to-ts",
    "build:ts": "tsc",
    "build:db-local": "cds deploy --to sqlite:sqlite.db --no-save --with-mocks",
    "eslint:ci": "eslint --fix src",
    "test": "jest --passWithNoTests --silent --runInBand",
    "test:unit": "npm test -- --watch -c jest-unit.config.js",
    "test:integration": "npm test -- --watch -c jest-integration.config.js",
    "test:staged": "npm test -- --findRelatedTests",
    "test:ci": "npm test -- --coverage"
}
```

cds init

npm i @sap/audit-logging @sap/cds @sap/hana-client @sap/xsenv @sap/xssec cds-routing-handlers express npm-run-all passport reflect-metadata module-alias

npm i -D @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser cds2types eslint eslint-config-google eslint-plugin-prettier git-commit-msg-linter jest nodemon prettier sqlite3 supertest typescript @types/jest

npm i -g hana-cli
hana-cli createModule
