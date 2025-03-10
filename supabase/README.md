# Estrutura do Banco de Dados - Portal do Aluno

Este diretório contém os scripts de migração e configuração do banco de dados Supabase para o Portal do Aluno.

## Estrutura

- `migrations/` - Scripts SQL para criação e atualização das tabelas, funções e políticas
  - `db_structure_complete.sql` - Script para adicionar componentes faltantes
  - `email_config.sql` - Script para configuração de email

## Como Executar

### Usando o CLI do Supabase

Se você tem o CLI do Supabase instalado:

```bash
supabase db push
```

### Usando o Script de Migração

Alternativamente, você pode usar o script `run-supabase-migrations.sh`:

```bash
./run-supabase-migrations.sh
```

## Verificação da Estrutura

Para verificar se todas as tabelas, funções e buckets necessários estão presentes:

```bash
node scripts/check-supabase-structure.js
```

## Criação de Buckets

Para criar os buckets de armazenamento necessários:

```bash
node scripts/create-supabase-buckets.js
```

## Documentação

Para mais detalhes sobre a estrutura do banco de dados, consulte:

- `docs/database_structure_review.md` - Revisão completa da estrutura
- `docs/database_structure_missing.md` - Análise dos componentes faltantes
