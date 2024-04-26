# API criada em Node.js + Sequelize / Banco Postgres em container Docker

Projeto desenvolvido para o Desafio da empresa Growdev.


### Antes de iniciar

Antes de iniciar precisamos fazer algumas coisas antes, iremos rodar tudo localmente para melhor compreensão de como foi feito.


#### Passo 1:

Primeiramente clone este repositório em sua máquina e dê o seguinte comando:

`npm install`

Se der algum problema verifique sua versão do Node, eu sugiro usar no mínimo a versão 16.

#### Passo 2:

Após finalizar a instalação dos pacotes da API iremos rodar criar um *Container Docker* com os seguintes comandos no terminal:

`docker run --name desafio -e POSTGRES_USER=root -e POSTGRES_PASSWORD=102030 -e POSTGRES_DB=desafio -d postgres`

Verifique se está rodando o container para prosseguir.

#### Passo 3:

Vamos agora fazer as atualizações do banco de dados, as migrations já estão prontas. Então rode o comando:

`npx sequelize-cli db:migrate`

Próximo passo é para fazer um Seed no banco de dados, rode o seguite comando no terminal:

`npx sequelize db:seed:all`

### Observação

No repositório tem o arquivo .env, ela contém os dados de conexão com o Banco de dados. Não esquece de configurar o DB_HOST para o endereço do teu Docker, geralmente o host é aquele que está inserido. Caso não dê mude para localhost.


## Rodando a aplicação

Após seguir todos os passos corretamente a api poderá ser iniciada. Rode o seguinte comando:

`npm start`

Agora poderá ser usada e testada.

#### Lembre-se

Nos Seeds da tabela de users tem um e-mail e senha padrão para poder acessar a API e pegar o token de validação.


## Como foi feita ?

Para esse projeto foi usado:

    - ORM Sequelize para conexão/migrations/atualização do banco;
    - Banco de dados Postgres;
    - Node.js com Typescript;
    - Arquitetura MVC (model-view-controller);
    - Jest para testes.

### Sugestão de melhorias

Caso eu tivesse mais tempo o que poderia fazer melhorar ?

Pensando nisto eu anotei algumas coisas que poderiam ser feitas, como:
    - Verificar se o CPF é válido;
    - Melhorar a forma de autenticação, melhorando a segurança;
    - Incluir mais campos de verificação como: createdBy(ID de quem criou), updatedBy(id de quem atualizou por último), deletedAt(quando foi deletado) e deletedBy(id de quem deletou);
    - Inserir permissão de usuário, definindo os níveis de acesso(Ex: visualizar somente os meus dados, gerenciar dados de equipe, gerenciar dados de todos);

Essas são algumas das anotações, no qual com tempo hábil poderiam ser feitas, sem contar as integras contínuas, mais testes, entre outros...

Todo esse projeto foi feito em pouco tempo mas com muito carinho <3.
