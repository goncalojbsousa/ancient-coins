# Sessão 1 - 4 de junho de 2026

## Objetivo:

Implementar e melhorar a área de Mercado e Perfil da aplicação Ancient Coins, aproximando a interface ao protótipo definido no Figma e preparando a navegação entre listagem de moedas, detalhe de moeda e perfil de utilizador.

## Atividades realizadas:

* Corrigi a estrutura da página Mercado (`Tab3`) para eliminar conflitos entre componentes standalone e módulos Angular;
* Reestruturei completamente os ficheiros `tab3.page.ts`, `tab3.page.html` e `tab3.page.scss`;
* Implementei a pesquisa de moedas por nome e origem;
* Implementei filtros por categoria:

  * Todas;
  * À Venda;
  * Para Troca;
* Corrigi os estilos dos filtros para garantir contraste adequado e visibilidade dos textos;
* Criei os cartões de moedas com:

  * imagem;
  * nome;
  * origem;
  * ano;
  * preço;
  * vendedor;
  * classificação;
  * estado de conservação;
* Adicionei a secção informativa "Negocie com Segurança";
* Corrigi referências de imagens armazenadas na pasta `assets/img`;
* Resolvi problemas de compilação relacionados com a configuração Angular/Ionic;
* Configurei a navegação para que a seleção de uma moeda no Mercado abra a respetiva página de detalhe;
* Implementei a página de detalhe da moeda baseada no design do Figma;
* Estruturei a página de detalhe com:

  * imagem principal;
  * informação histórica da moeda;
  * origem;
  * material;
  * ano;
  * estado de conservação;
  * descrição;
  * informações do vendedor;
  * botão para iniciar negociação;
* Iniciei a reformulação completa da página Perfil (`Tab5`);
* Desenvolvi uma nova estrutura de perfil inspirada no protótipo do Figma;
* Adicionei estatísticas do utilizador:

  * total de vendas;
  * trocas realizadas;
  * taxa de satisfação;
* Adicionei área de gastos anuais preparada para futura integração com gráficos;
* Adicionei sistema de conquistas e badges do utilizador;
* Adicionei secção de avaliações recentes;
* Adicionei secção de configurações da conta;
* Mantive a funcionalidade de logout integrada com o `AuthService`.

## Problemas:

* O Angular identificava o componente `Tab3Page` como standalone, impedindo a compilação do módulo;
* Existiam conflitos entre a estrutura gerada pelo Ionic e as alterações realizadas manualmente;
* Os filtros do Mercado apresentavam texto branco sobre fundo claro, tornando-os praticamente invisíveis;
* Algumas imagens não eram apresentadas corretamente devido a caminhos incorretos nos assets;
* O layout inicial do Perfil estava demasiado simples e não correspondia ao protótipo definido;
* A navegação entre a listagem e o detalhe das moedas ainda não estava implementada.

## Solução:

* Reestruturei os módulos e componentes da Tab3 para garantir compatibilidade com Angular Modules;
* Corrigi a configuração do decorator `@Component`;
* Ajustei os estilos SCSS dos filtros para garantir contraste adequado;
* Uniformizei a organização dos assets e referências de imagens;
* Criei uma estrutura de cartões reutilizável para o Mercado;
* Implementei a navegação para páginas de detalhe das moedas;
* Recriei a página Perfil seguindo a estrutura visual do Figma;
* Organizei o perfil em secções independentes para facilitar futuras integrações com Supabase.

## Decisões:

* Manter a arquitetura baseada em Tabs do Ionic;
* Utilizar dados mockados nesta fase para acelerar o desenvolvimento da interface;
* Preparar todas as páginas para futura integração com Supabase;
* Separar claramente a listagem de moedas da página de detalhe;
* Estruturar o Perfil de forma modular para permitir expansão futura com estatísticas reais, histórico de compras, vendas, avaliações e conquistas;
* Seguir o design do Figma como referência principal para consistência visual da aplicação.
