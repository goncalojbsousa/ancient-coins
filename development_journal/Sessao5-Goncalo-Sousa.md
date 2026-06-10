# Sessão 5 - 9 de junho de 2026

## Objetivo:
Simplificar a configuração e o processo de seed do Supabase.

## Atividades realizadas:
- Reorganizei o `supabase-setup.sql` para permitir recriar a estrutura da base de dados;
- Simplifiquei o script `seed-supabase.mjs`;
- Atualizei o `seed-data.json` e a ordem de inserção dos dados;
- Corrigi pequenos problemas nos serviços de autenticação, armazenamento do chat e mercado.

## Problemas:
- O processo de configuração e seed era complexo e tinha lógica repetida;
- Era necessário manter os utilizadores do Auth ligados aos perfis públicos.

## Solução:
- Concentrei a estrutura e as regras da base de dados no ficheiro de setup;
- Tornei o script de seed mais direto e alinhei os dados iniciais com as tabelas.

## Decisões:
- Manter a estrutura no `supabase-setup.sql` e os dados no `seed-data.json`;
- Usar o script Node para criar os utilizadores e carregar a seed.
