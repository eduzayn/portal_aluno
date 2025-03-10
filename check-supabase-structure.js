// Script para verificar a estrutura do banco de dados no Supabase
const { createClient } = require('@supabase/supabase-js');

// Credenciais diretas do Supabase
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de tabelas esperadas
const expectedTables = [
  'students',
  'courses',
  'modules',
  'lessons',
  'enrollments',
  'lesson_progress',
  'certificates',
  'financial_records',
  'notifications',
  'email_configurations',
  'learning_paths',
  'learning_path_courses',
  'learning_path_enrollments',
  'supplementary_materials',
  'course_ratings',
  'portal_settings'
];

// Lista de buckets esperados
const expectedBuckets = [
  'avatars',
  'course-thumbnails',
  'certificates',
  'receipts',
  'profile-images',
  'lesson-content',
  'supplementary-materials'
];

// Função para verificar tabelas
async function checkTables() {
  console.log('Verificando tabelas...');
  
  try {
    // Obter lista de tabelas
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (error) {
      console.error('Erro ao obter lista de tabelas:', error);
      return { success: false, existingTables: [], missingTables: expectedTables };
    }
    
    // Extrair nomes das tabelas
    const existingTables = data ? data.map(table => table.tablename) : [];
    
    // Verificar tabelas faltantes
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));
    
    console.log('Tabelas existentes:', existingTables.join(', '));
    console.log('Tabelas faltantes:', missingTables.length > 0 ? missingTables.join(', ') : 'Nenhuma');
    
    return {
      success: missingTables.length === 0,
      existingTables,
      missingTables
    };
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
    return { success: false, existingTables: [], missingTables: expectedTables };
  }
}

// Função para verificar buckets
async function checkBuckets() {
  console.log('\nVerificando buckets de armazenamento...');
  
  try {
    // Obter lista de buckets
    const { data, error } = await supabase
      .storage
      .listBuckets();
    
    if (error) {
      console.error('Erro ao obter lista de buckets:', error);
      return { success: false, existingBuckets: [], missingBuckets: expectedBuckets };
    }
    
    // Extrair nomes dos buckets
    const existingBuckets = data.map(bucket => bucket.name);
    
    // Verificar buckets faltantes
    const missingBuckets = expectedBuckets.filter(bucket => !existingBuckets.includes(bucket));
    
    console.log('Buckets existentes:', existingBuckets.join(', '));
    console.log('Buckets faltantes:', missingBuckets.length > 0 ? missingBuckets.join(', ') : 'Nenhum');
    
    return {
      success: missingBuckets.length === 0,
      existingBuckets,
      missingBuckets
    };
  } catch (error) {
    console.error('Erro ao verificar buckets:', error);
    return { success: false, existingBuckets: [], missingBuckets: expectedBuckets };
  }
}

// Função principal para verificar a estrutura
async function checkStructure() {
  console.log('Iniciando verificação da estrutura do banco de dados...');
  
  // Verificar tabelas
  const tablesResult = await checkTables();
  
  // Verificar buckets
  const bucketsResult = await checkBuckets();
  
  // Resumo da verificação
  console.log('\n=== RESUMO DA VERIFICAÇÃO ===');
  console.log(`Tabelas: ${tablesResult.success ? 'OK' : 'INCOMPLETO'}`);
  console.log(`Buckets: ${bucketsResult.success ? 'OK' : 'INCOMPLETO'}`);
  
  // Recomendações
  console.log('\n=== RECOMENDAÇÕES ===');
  
  if (tablesResult.missingTables.length > 0) {
    console.log('Para criar as tabelas faltantes, execute:');
    console.log('1. Acesse o Console SQL do Supabase: https://uasnyifizdjxogowijip.supabase.co');
    console.log('2. Navegue até "SQL Editor"');
    console.log('3. Copie e cole o conteúdo do arquivo supabase/migrations/db_structure_complete.sql');
    console.log('4. Execute o script');
  }
  
  if (bucketsResult.missingBuckets.length > 0) {
    console.log('Para criar os buckets faltantes, execute:');
    console.log('node create-supabase-storage-buckets.js');
  }
  
  if (tablesResult.success && bucketsResult.success) {
    console.log('A estrutura do banco de dados está completa!');
  }
  
  return {
    success: tablesResult.success && bucketsResult.success,
    tables: tablesResult,
    buckets: bucketsResult
  };
}

// Executar a verificação
checkStructure().catch(error => {
  console.error('Erro ao executar a verificação:', error);
  process.exit(1);
});
