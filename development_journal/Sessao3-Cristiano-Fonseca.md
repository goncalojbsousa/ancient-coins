# Sessão 3 - 2 de junho de 2026

## Objetivo:
Implementar e melhorar a página de login, com validação através de Reactive Forms, proteção das rotas principais da aplicação e atualização do design para ficar coerente com a identidade visual do projeto.

## Atividades realizadas:
- Criei a página de login da aplicação;
- Configurei a rota inicial da app para redirecionar para a página de login;
- Integrei o login com o `AuthService`, permitindo verificar se o utilizador já se encontrava autenticado;
- Implementei um formulário reativo para o login, com os campos de e-mail e palavra-passe;
- Adicionei validações obrigatórias ao formulário, incluindo validação do formato do e-mail;
- Criei mensagens de validação para orientar o utilizador quando os campos não estavam preenchidos corretamente;
- Adicionei a submissão do formulário com chamada ao método de login do `AuthService`;
- Configurei o redirecionamento para a página inicial após autenticação bem-sucedida;
- Criei um `authGuard` para proteger as rotas das tabs e impedir o acesso direto sem autenticação;
- Removi rotas duplicadas ou fora da estrutura principal das tabs, melhorando a organização da navegação;
- Ajustei o `LoginPage` para usar a estrutura tradicional com `NgModule` e `standalone: false`;
- Atualizei o `LoginPageModule` para importar `ReactiveFormsModule`;
- Simplifiquei a lógica da `Tab1Page`, reutilizando o método `getRecentMarketCoins` do `MarketService`;
- Adicionei uma área simples de perfil com botão para terminar sessão;
- Atualizei o design do login com cartão central, logótipo da aplicação, cores consistentes e mensagens de erro menos agressivas;
- Adicionei assets do logótipo da aplicação para reforçar a identidade visual.

## Problemas:
- Inicialmente, as rotas das tabs podiam ser abertas diretamente sem passar pelo login;
- Algumas páginas estavam registadas fora da estrutura das tabs, o que podia quebrar a navegação esperada;
- A página de login começou com uma estrutura standalone, enquanto o restante projeto seguia uma organização por módulos;
- A validação inicial do formulário ainda era simples e precisava de mensagens mais claras para o utilizador;
- O design inicial do login ainda não estava alinhado com o estilo visual pretendido para a aplicação.

## Solução:
- Criei um guard funcional com `CanActivateFn`, usando o `AuthService` para confirmar se existia uma sessão ativa;
- Apliquei o guard à rota principal das tabs, garantindo que apenas utilizadores autenticados conseguem aceder à área privada da app;
- Reorganizei o routing para manter as tabs dentro do `tabs-routing.module.ts`, respeitando a estrutura ensinada na documentação;
- Converti o login para `standalone: false`, mantendo o padrão de `NgModule` usado no projeto;
- Usei `ReactiveFormsModule`, `NonNullableFormBuilder` e `Validators` para criar um formulário mais robusto e simples de manter;
- Mantive a lógica de autenticação no `AuthService`, deixando o componente responsável pela interação com o formulário e pela navegação;
- Atualizei o design do login com uma interface limpa, centrada e consistente com as cores da aplicação;
- Usei mensagens de erro em tom laranja para informar o utilizador sem criar uma sensação visual demasiado agressiva.

## Decisões:
- Usar Reactive Forms no login por serem adequados para validação estruturada e manutenção futura;
- Proteger a rota das tabs com um guard simples, em vez de verificar autenticação em cada página individualmente;
- Manter o padrão de módulos tradicionais no login para ficar coerente com a estrutura do projeto e com a documentação do professor;
- Colocar a lógica de autenticação no service e a lógica de apresentação no componente;
- Usar linguagem clara e positiva nas mensagens de erro, ajudando o utilizador a perceber o que deve corrigir;
- Manter o design do login simples, com foco na legibilidade, consistência visual e facilidade de utilização.
