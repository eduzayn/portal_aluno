const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase credentials not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('Executando migrações de autenticação...');
  
  try {
    // Ler arquivo de migração
    const authTablesPath = path.join(__dirname, '../supabase/migrations/auth_tables.sql');
    const authTablesSQL = fs.readFileSync(authTablesPath, 'utf8');
    
    // Executar migração
    const { data, error } = await supabase.rpc('exec_sql', { sql: authTablesSQL });
    
    if (error) {
      console.error('❌ Erro ao executar migrações:', error.message);
    } else {
      console.log('✅ Migrações executadas com sucesso!');
      console.log(data);
    }
    
  } catch (error) {
    console.error('Erro durante a execução das migrações:', error.message);
  }
}

runMigrations();
