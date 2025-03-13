# Scripts de Verificação e Implementação do Banco de Dados

Este diretório contém scripts para verificar e implementar componentes do banco de dados Supabase para o Portal do Aluno.

## Scripts de Verificação

- `check-existing-tables.js` - Verifica as tabelas existentes no banco de dados
- `check-table-structures.js` - Verifica as funções e triggers existentes
- `check-storage-buckets.js` - Verifica os buckets de armazenamento existentes
- `verify-database-structure.js` - Verificação completa de todos os componentes
- `final-verification.js` - Verificação final após implementação

## Scripts de Implementação

- `create-missing-tables.js` - Script para criar tabelas faltantes (não utilizado, pois todas já existiam)
- `create-missing-functions.js` - Script para criar funções faltantes (não utilizado, pois todas já existiam)
- `create-missing-triggers.js` - Script para criar triggers faltantes (não utilizado, pois todas já existiam)
- `create-missing-buckets.js` - Script para criar buckets de armazenamento faltantes
- `create-avatars-bucket.js` - Script específico para criar o bucket 'avatars'
- `create-avatars-final.js` - Script alternativo que criou o bucket 'Avatars' com 'A' maiúsculo

## Scripts de Teste de Conexão

- `test-supabase-connection.js` - Testa a conexão com o Supabase via API
- `test-exec-sql.js` - Testa a função exec_sql para executar comandos SQL
- `list-tables.js` - Lista as tabelas existentes no banco de dados

## Como Usar

1. Instale as dependências:
   ```
   npm install @supabase/supabase-js
   ```

2. Execute o script de verificação completa:
   ```
   node verify-database-structure.js
   ```

3. Se necessário, execute os scripts de implementação para componentes faltantes.

4. Execute a verificação final:
   ```
   node final-verification.js
   ```
