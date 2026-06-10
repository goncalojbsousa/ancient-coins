# Sessão 2 - Junho de 2026

## Objetivo

Melhorar a integração entre as áreas de Mercado, Perfil e Mensagens da aplicação Ancient Coins, como uniformizar visualmente a página Perfil de acordo com o design utilizado nas restantes áreas da aplicação.

## Atividades realizadas

* Reformulei completamente a interface da página Perfil (`Tab5`);
* Removi a secção de conquistas por utilizar dados estáticos (hardcoded);
* Uniformizei a página Perfil com o design utilizado nas restantes Tabs da aplicação;
* Reestruturei os cartões informativos utilizando o mesmo padrão visual do Mercado;
* Reorganizei a apresentação das estatísticas do utilizador;
* Reformulei a área de reputação utilizando o mesmo estilo visual adotado noutras páginas;
* Simplifiquei a gestão de sessão mantendo apenas a funcionalidade de logout;
* Uniformizei:

  * tipografia;
  * tamanhos de texto;
  * espaçamentos;
  * bordas;
  * sombras;
  * badges;
  * ícones;
  * cartões informativos;
  * cores da aplicação;
* Ajustei a responsividade da página Perfil para dispositivos móveis e desktop;
* Mantive compatibilidade total com os serviços existentes (`AuthService`, `UsersService`, `CoinsService` e `MessagesService`).

## Problemas

* A página Perfil utilizava uma estrutura visual diferente das restantes áreas da aplicação;
* A secção de conquistas apresentava dados estáticos que não refletiam informação real da plataforma;
* Existiam inconsistências de tipografia, espaçamento e hierarquia visual entre as Tabs.

## Solução

* Removi elementos visuais dependentes de dados não implementados;
* Reestruturei completamente o HTML e SCSS da página Perfil;
* Reutilizei os padrões de design já existentes no Mercado e na Coleção;
* Uniformizei os componentes visuais para garantir consistência em toda a aplicação.

## Decisões

* Utilizar a página Perfil como área comum para perfis próprios e perfis públicos;
* Remover funcionalidades visuais dependentes de dados fictícios;
* Seguir os padrões visuais já consolidados nas páginas Mercado e Coleção;
* Manter a lógica de negócio centralizada nos serviços da aplicação;
* Priorizar consistência visual e experiência de utilização antes da implementação de funcionalidades adicionais.
