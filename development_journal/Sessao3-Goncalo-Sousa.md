# Sessão 3 - 4 de junho de 2026

## Objetivo:
Implementar o sistema de mensagens da aplicação Ancient Coins, incluindo conversas, envio de mensagens, notificações de mensagens não lidas, avaliações de utilizadores e seed inicial a partir de JSON.

## Atividades realizadas:
- Desenvolvi a página de mensagens na `Tab4Page`, com listagem de conversas, pesquisa e visualização da conversa selecionada;
- Implementei o envio de mensagens e a atualização automática das conversas, para evitar que o utilizador tenha de sair e voltar a entrar na página;
- Adicionei indicação do número de mensagens não lidas e guardei localmente a última mensagem lida com Ionic Storage;
- Criei o `ChatStorageService` para separar a lógica de armazenamento local da lógica da página;
- Implementei o modal de avaliação de utilizadores, permitindo criar ou atualizar uma avaliação por conversa;
- Atualizei o `MessagesService` para gerir mensagens, reviews e atualização de avaliações existentes;
- Ajustei o `supabase-setup.sql` com as restrições, policies e triggers necessários para conversas e avaliações;
- Configurei o cálculo automático da média de avaliações através de um trigger na base de dados;
- Mantive os dados iniciais no `seed-data.json` e criei um script de seed para popular o Supabase e o Supabase Auth;
- Adicionei `.env.example` para guardar a chave secreta localmente;
- Reconfigurei o Ionic Storage no `AppModule`;
- Ajustei o design da página de mensagens para ficar coerente com o estilo da aplicação;
- Aumentei o limite de orçamento CSS no `angular.json` para suportar os novos estilos.

## Problemas:
- As mensagens novas não apareciam para o outro utilizador sem recarregar manualmente a página;
- As notificações de mensagens não lidas não eram atualizadas corretamente depois de abrir uma conversa;
- O sistema de reviews permitia comportamentos inconsistentes, como várias avaliações para a mesma negociação ou atualização sem efeito visível;
- A atualização direta do rating do utilizador pelo frontend causava problemas com as permissões RLS;
- O modal de avaliação ficava menos fluido quando a página continuava a atualizar em segundo plano;
- A seed precisava de criar dados nas tabelas públicas e também utilizadores no Supabase Auth;
- O ficheiro `supabase-setup.sql` ficou demasiado complexo quando a seed foi inicialmente colocada dentro da base de dados.

## Solução:
- Usei atualização automática simples com `setInterval` para recarregar conversas periodicamente;
- Passei a marcar a conversa como lida ao ser aberta e guardei essa informação no Ionic Storage;
- Calculei as mensagens não lidas comparando a última mensagem lida com as mensagens recebidas de outros utilizadores;
- Defini a review como única por conversa e utilizador avaliador, permitindo atualização em vez de duplicação;
- Passei o cálculo da média de avaliações para um trigger no Supabase;
- Pausei a atualização automática enquanto o modal de avaliação está aberto;
- Separei a seed num script Node que lê o `seed-data.json`, usa uma `SUPABASE_SECRET_KEY` local e cria também utilizadores no Auth;
- Mantive o `supabase-setup.sql` focado apenas na estrutura da base de dados, policies, permissões e triggers.

## Decisões:
- Usar Ionic Storage apenas para dados locais do dispositivo, como mensagens já lidas;
- Considerar a avaliação única por negociação, ou seja, por conversa e por utilizador avaliador;
- Separar a seed da estrutura da base de dados, deixando o JSON como fonte dos dados iniciais;