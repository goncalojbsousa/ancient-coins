# Sessão 1 - 23 de maio de 2026

## Objetivo:
Início do projeto Ancient Coins e implementação da base da aplicação, preparação do armazenamento local, dos dados iniciais e a base dos services necessários.

## Atividades realizadas:
- Criei a estrutura inicial do projeto Ionic/Angular;
- Adicionei ao projeto a documentação de apoio fornecida pelo professor;
- Configurei o armazenamento local da aplicação com Ionic Storage e suporte para SQLite;
- Criei o ficheiro `seed-data.json` com dados iniciais para utilizadores, moedas, conversas e avaliações, com recurso a inteligência artificial;
- Criei os modelos principais da aplicação: utilizadores, moedas, mensagens, conversas e reviews;
- Implementei o `DatabaseService` para centralizar a inicialização, leitura e escrita dos dados da aplicação;
- Implementei o `UsersService` para gerir utilizadores, incluindo listagem, pesquisa por id/email, inserção e atualização;
- Implementei o `CoinsService` para gerir moedas, incluindo criação, pesquisa, atualização, eliminação e publicação para venda ou troca;
- Implementei o `MarketService` para obter moedas disponíveis no mercado, pesquisar moedas e ordenar resultados;
- Implementei o `MessagesService` para gerir conversas, mensagens, negociações e avaliações entre utilizadores;
- Implementei o `AuthService` para registo, login, logout, validação de palavra-passe e persistência do utilizador autenticado;
- Organizei o desenvolvimento em branches por funcionalidade e fiz merges progressivos para manter o histórico do projeto claro;
- Utilizei inteligência artificial para revisão de código, esclarecimento de dúvidas e identificação de possíveis melhorias durante o desenvolvimento;

## Problemas:
- Foi necessário escolher uma forma de guardar dados localmente;
- Os dados iniciais não podiam ser inseridos sempre que a aplicação fosse aberta, pois isso iria repor informação já alterada;
- Foi necessário separar bem as responsabilidades para evitar que toda a lógica da aplicação ficasse concentrada num único service.

## Solução:
- Usei Ionic Storage com driver SQLite para garantir persistência local dos dados;
- Criei uma chave de controlo para verificar se os dados iniciais já tinham sido carregados;
- Centralizei o acesso ao armazenamento no `DatabaseService`, permitindo que os restantes services reutilizassem os mesmos métodos de leitura e escrita;
- Dividi a lógica por services específicos: base de dados, utilizadores, moedas, mercado, mensagens e autenticação;
- Usei modelos para manter a estrutura dos dados mais consistente e reduzir erros durante o desenvolvimento;
- Usei métodos `async/await` nos services, garantindo que os dados eram carregados do Ionic Storage antes de serem consultados ou alterados, sem bloquear o funcionamento geral da aplicação.

## Decisões:
- Manter os dados da aplicação em armazenamento local nesta fase do protótipo, com possibilidade de migrar futuramente para uma API;
- Utilizar um ficheiro JSON com dados iniciais para facilitar testes, demonstração e cumprimento dos requisitos do projeto;
- Separar a autenticação num `AuthService`, em vez de colocar essa responsabilidade no `UsersService`;
