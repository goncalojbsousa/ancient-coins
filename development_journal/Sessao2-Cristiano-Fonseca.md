# Sessão 2 - 1 de junho de 2026

## Objetivo:
Desenvolver o conteúdo inicial da página de início e integrar dados reais do mercado, utilizando os services existentes e os dados carregados a partir do ficheiro JSON da aplicação.

## Atividades realizadas:
- Adicionei conteúdo à página inicial da aplicação;
- Criei uma área de boas-vindas para apresentar o objetivo principal da app ao utilizador;
- Adicionei cartões de acesso rápido para as principais ações: adicionar moeda, consultar a coleção e explorar o mercado;
- Criei uma secção de destaques do mercado para apresentar moedas adicionadas recentemente;
- Integrei a página inicial com o `MarketService`, permitindo obter moedas disponíveis para venda ou troca;
- Adicionei o método `getRecentMarketCoins` ao `MarketService`, centralizando a lógica de obtenção das moedas mais recentes;
- Atualizei o `Tab1Page` para carregar dados de forma assíncrona no `ngOnInit`;
- Adicionei imagens de moedas aos assets da aplicação para melhorar a apresentação visual;
- Atualizei o ficheiro `seed-data.json` para associar imagens às moedas e melhorar alguns dados de exemplo;
- Adicionei documentação de apoio fornecida pelo professor relacionada com dados JSON, Capacitor, Supabase e Reactive Forms.

## Problemas:
- A página inicial ainda estava pouco desenvolvida e não comunicava claramente as funcionalidades principais da aplicação;
- Os dados do mercado precisavam de ser reutilizados através dos services, evitando duplicação de lógica no componente;
- As moedas de exemplo não tinham imagens associadas, tornando a interface menos representativa;
- Era necessário garantir que os dados eram carregados apenas depois da inicialização do service.

## Solução:
- Estruturei a página inicial em blocos simples: boas-vindas, ações rápidas e destaques do mercado;
- Usei componentes Ionic como `ion-card`, `ion-button` e `ion-icon`, mantendo coerência com a framework utilizada;
- Criei o método `getRecentMarketCoins` no `MarketService`, permitindo que a página pedisse diretamente as moedas recentes;
- Atualizei o `Tab1Page` para implementar `OnInit` e carregar os dados do mercado através de `async/await`;
- Associei imagens às moedas no ficheiro de dados iniciais, tornando a apresentação mais próxima de um cenário real;
- Mantive os dados de demonstração no `seed-data.json`, seguindo a lógica de carregamento local estudada nos documentos do professor.

## Decisões:
- Colocar a lógica de seleção das moedas recentes no service, deixando a página responsável apenas pela apresentação;
- Usar dados iniciais com imagens para melhorar a demonstração da aplicação;
- Manter a página inicial simples, mas com conteúdo suficiente para orientar o utilizador;
- Continuar a usar armazenamento local e dados JSON como base do protótipo nesta fase do projeto.
