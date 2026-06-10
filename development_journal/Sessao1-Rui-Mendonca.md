# Sessão 1 - 4 de junho de 2026

## Objetivo

Implementar e consolidar as áreas de Mercado e Perfil da aplicação Ancient Coins, integrando os dados reais provenientes do Supabase, uniformizando o design visual da aplicação e aproximando a interface ao protótipo definido no Figma.

## Atividades realizadas

* Reestruturei a página Mercado (`Tab3`) para funcionar com os dados armazenados na base de dados Supabase;
* Desenvolvi a pesquisa de moedas por nome, origem, material e descrição;
* Implementei filtros de mercado:

  * Todas;
  * À Venda;
  * Para Troca;
* Adicionei ordenação por data de publicação e preço;
* Reformulei completamente a página Perfil (`Tab5`);
* Integrei os dados reais do utilizador autenticado através do `AuthService`;
* Desenvolvi um dashboard de perfil com:

  * informações da conta;
  * localização;
  * classificação média;
  * número de avaliações;
* Calculei estatísticas automaticamente a partir das moedas do utilizador:

  * total de moedas na coleção;
  * moedas publicadas para venda;
  * moedas disponíveis para troca;
  * valor total das moedas publicadas no mercado;
* Implementei um sistema visual de conquistas baseado na atividade do utilizador;
* Adicionei uma secção de reputação baseada na classificação existente na base de dados;
* Mantive a funcionalidade de logout integrada com o Supabase Auth;
* Uniformizei o design visual da aplicação utilizando os mesmos padrões visuais da Coleção (`Tab2`);
* Reaproveitei os estilos utilizados nos modais de detalhe e gestão de moedas;
* Padronizei:

  * cartões;
  * badges;
  * sombras;
  * bordas;
  * espaçamentos;
  * tipografia;
  * cores da marca;
* Ajustei as dimensões e larguras das páginas Mercado e Perfil para manter consistência com a página Inicial (`Tab1`).

## Problemas

* O Mercado inicialmente utilizava estruturas mockadas incompatíveis com os modelos reais da aplicação;
* Existiam diferenças entre os nomes das propriedades dos objetos apresentados no frontend e os modelos provenientes do Supabase;
* A página Perfil utilizava dados estáticos e não refletia o utilizador autenticado;
* Os estilos do Mercado e Perfil eram visualmente diferentes das restantes áreas da aplicação;
* Algumas alterações de layout provocaram perda de formatação devido à utilização de classes CSS incompatíveis com o HTML existente;
* Existiam inconsistências nas larguras e espaçamentos entre as Tabs da aplicação.

## Solução

* Substituí as estruturas mockadas pelos modelos `Coin` e `User` utilizados na aplicação;
* Passei a obter os dados diretamente através dos serviços já implementados;
* Integrei o carregamento do utilizador autenticado utilizando o `AuthService`;
* Criei cálculos automáticos para gerar estatísticas reais do perfil;
* Reestruturei os componentes do Mercado para funcionar exclusivamente sobre os dados do Supabase;
* Uniformizei os estilos reutilizando a linguagem visual já utilizada na Coleção;
* Corrigi os conflitos entre classes CSS e estrutura HTML;
* Ajustei as dimensões dos componentes para manter consistência entre todas as Tabs.

## Decisões

* Utilizar exclusivamente os dados provenientes do Supabase nas páginas Mercado e Perfil;
* Manter a lógica de acesso aos dados centralizada nos serviços existentes;
* Reutilizar padrões visuais da Coleção para garantir consistência na experiência de utilização;
* Evitar duplicação de estilos entre componentes semelhantes;
* Manter a navegação de detalhe da moeda dentro da Tab Mercado;
* Preparar a página Perfil para futuras integrações com avaliações reais, histórico de transações e estatísticas avançadas;
* Utilizar o Figma como referência principal para estrutura funcional e visual da aplicação;
* Priorizar consistência visual e reutilização de componentes antes da implementação de novas funcionalidades.
