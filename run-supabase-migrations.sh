#!/bin/bash

# Verificar se as variáveis de ambiente estão definidas
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias"
  echo "Execute: source .env.local"
  exit 1
fi

# Executar o script SQL usando curl
echo "Executando migrações SQL no Supabase..."

curl -X POST \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  --data @supabase/migrations/db_structure_complete.sql \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/exec_sql" \
  | jq .

echo "Migrações concluídas!"
