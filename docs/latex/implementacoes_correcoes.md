# Implementações e possíveis correções - AncientCoins

## Implementações detetadas no código

- Routing com `authGuard` aplicado à área principal em `src/app/app-routing.module.ts`.
- Autenticação/registo via Supabase em `src/app/services/auth.service.ts`.
- Serviços separados para moedas, mercado, utilizadores, mensagens e avaliações em `src/app/services/`.
- Formulário reativo para adicionar/editar moedas, com campos obrigatórios, validação numérica do ano e validação condicional de preço/preferência de troca.
- Upload de fotografias para Supabase Storage no serviço de moedas.
- Feedback com toasts de sucesso/erro nas operações principais.
- Confirmação antes de eliminar uma moeda.
- Cartões dos destaques do mercado com ação de clique para abrir detalhe.
- Sistema de mensagens e avaliação de utilizadores representado nas páginas e serviços.

## Possíveis correções no relatório

- Confirmar a numeração do grupo: o ficheiro indica `G43`, mas a capa do Word diz `Grupo nº46`.
- Corrigir a numeração das secções: havia secções numeradas manualmente e outras sem número. Na versão LaTeX isto foi normalizado com numeração automática.
- Substituir o índice manual por `\tableofcontents`.
- Adicionar o URL real em `Link: Protótipos de Alta-Fidelidade`, porque no Word só aparece o texto do link.
- Inserir capturas de ecrã/protótipos, se forem exigidas, porque o `.docx` analisado não tem imagens embutidas.
- Confirmar se os anexos citados existem e se devem ser anexados/exportados no PDF final.

## Correções textuais sugeridas

- `Autores Grupo nº46` -> confirmar `Grupo nº43` ou `Grupo nº46`.
- `45 54 anos` -> `45-54 anos`.
- `folhas de calculo` -> `folhas de cálculo`.
- `apps moveis` -> `apps móveis`.
- `menos obvias` -> `menos óbvias`.
- `A coleção e privada por defeito` -> `A coleção é privada por defeito`.
- `referencias do Numista` -> `referências do Numista`.
- `Interface mais rica e detalhada e aceitável` -> `Interface mais rica e detalhada é aceitável`.
- `sistema de denuncia` -> `sistema de denúncia`.
- `Confiar e Segurança nas Transações` -> `Confiança e Segurança nas Transações`.
- `As 3 Tarefas` -> `As Três Tarefas` ou `Tarefas Principais`.

## Possíveis correções/melhorias no código

- Centralizar a formatação de preços e avaliações num pipe/helper, porque há formatos diferentes espalhados entre Home, Mercado, Detalhe e Perfil.
- Ao desligar `availableForSale` ou `availableForTrade`, limpar também o valor visível do campo `price`/`tradePreference`, não apenas enviar `null` ao guardar.
- Adicionar confirmação ao fechar o modal de adicionar/editar moeda quando o formulário estiver `dirty`.
- Rever textos sem acentos visíveis na UI, como `avaliacao` e `comentario`, para manter consistência linguística.
- Criar estados de carregamento/vazio/erro consistentes para coleção, mercado e mensagens.
- Se for para cumprir as ideias levantadas no relatório, implementar favoritos, histórico de atividade, notificações e modo offline/sincronização posterior.
- Confirmar que as políticas RLS do Supabase impedem edição/leitura indevida entre utilizadores.
- Acrescentar testes unitários para validadores de ano, preço obrigatório, preferência de troca e fluxos de autenticação/roteamento.
