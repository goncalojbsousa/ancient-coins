# Sessão 1 - 29 de maio de 2026

## Objetivo:
Preparar a estrutura principal da interface da aplicação Ancient Coins, através da personalização da navegação por tabs, criação das páginas em falta e definição inicial do tema visual da aplicação.

## Atividades realizadas:
- Atualizei a barra de navegação inferior da aplicação, substituindo os nomes genéricos das tabs por nomes adequados ao contexto do projeto;
- Defini as tabs principais da aplicação: Início, Coleção, Mercado, Mensagens e Perfil;
- Substituí os ícones provisórios por ícones mais representativos de cada área funcional;
- Criei as páginas `tab4` e `tab5`, destinadas às áreas de mensagens e perfil;
- Configurei os módulos e ficheiros de routing das novas páginas;
- Adicionei as rotas de `tab4` e `tab5` ao `tabs-routing.module.ts`, mantendo a navegação dentro da estrutura de tabs;
- Ajustei a configuração geral de routing da aplicação para integrar as novas páginas;
- Personalizei a cor selecionada das tabs para manter coerência com a identidade visual da aplicação;
- Ajustei o fundo global da aplicação para branco, evitando interferências do tema escuro automático do Ionic;
- Atualizei variáveis de tema em `variables.scss`, criando uma base visual mais uniforme.

## Problemas:
- Não foram identificados problemas funcionais relevantes nesta sessão.

## Solução:
- Usei os componentes de tabs do Ionic para organizar a navegação principal da aplicação;
- Criei páginas independentes para `tab4` e `tab5`, cada uma com o seu módulo, routing, template, stylesheet e ficheiro de testes;
- Registei as novas páginas no `tabs-routing.module.ts`, seguindo a estrutura indicada na documentação do professor sobre tabs;
- Defini labels e ícones descritivos para tornar a navegação mais clara para o utilizador;
- Ajustei o `global.scss` e as variáveis de tema para remover a dependência visual do modo escuro automático.

## Decisões:
- Utilizar a navegação por tabs como estrutura principal da aplicação, por ser adequada a uma aplicação móvel com várias áreas funcionais;
- Manter nomes curtos e diretos nas tabs, facilitando a leitura em ecrãs pequenos;
- Usar a cor laranja como cor de destaque da interface, alinhada com a identidade visual do projeto;
- Criar as páginas de mensagens e perfil nesta fase, ainda com conteúdo inicial simples, para preparar a evolução futura da aplicação.
