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
    // Ler arquivos de migração
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const migrationFiles = [
      'profiles_table.sql',
      'students_table.sql',
      'auth_tables.sql'
    ];
    
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Arquivo de migração não encontrado: ${file}`);
        continue;
      }
      
      console.log(`Executando migração: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Executar migração
      const { data, error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`❌ Erro ao executar migração ${file}:`, error.message);
      } else {
        console.log(`✅ Migração ${file} executada com sucesso!`);
      }
    }
    
    console.log('\nMigrações concluídas!');
    
  } catch (error) {
    console.error('Erro durante a execução das migrações:', error.message);
  }
}

runMigrations();
