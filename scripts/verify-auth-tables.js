const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase credentials not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAuthTables() {
  console.log('Verificando tabelas de autenticação...');
  
  try {
    // Verificar tabela profiles
    const { data: profilesInfo, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Tabela profiles não encontrada ou erro ao acessar:', profilesError.message);
    } else {
      console.log('✅ Tabela profiles encontrada e acessível');
    }
    
    // Verificar tabela students
    const { data: studentsInfo, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .limit(1);
    
    if (studentsError) {
      console.error('❌ Tabela students não encontrada ou erro ao acessar:', studentsError.message);
    } else {
      console.log('✅ Tabela students encontrada e acessível');
    }
    
    // Verificar políticas RLS
    console.log('\nVerificando políticas de segurança (RLS)...');
    
    const { data: policies, error: policiesError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT tablename, policyname, permissive, roles, cmd
          FROM pg_policies
          WHERE schemaname = 'public' AND (tablename = 'profiles' OR tablename = 'students')
          ORDER BY tablename, policyname;
        `
      });
    
    if (policiesError) {
      console.error('❌ Erro ao verificar políticas RLS:', policiesError.message);
    } else if (!policies || policies.length === 0) {
      console.error('❌ Nenhuma política RLS encontrada para as tabelas de autenticação');
    } else {
      console.log('✅ Políticas RLS encontradas:');
      console.log(JSON.stringify(policies, null, 2));
    }
    
    console.log('\nVerificação concluída!');
    
  } catch (error) {
    console.error('Erro durante a verificação:', error.message);
  }
}

verifyAuthTables();
