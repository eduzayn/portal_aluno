require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Inicializar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  console.log('Verificando estrutura do banco de dados do Portal do Aluno...');
  
  // Lista de tabelas necessárias
  const requiredTables = [
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
  
  // Lista de buckets necessários
  const requiredBuckets = [
    'profile-images',
    'course-thumbnails',
    'lesson-content',
    'supplementary-materials',
    'certificates'
  ];
  
  // Verificar tabelas
  console.log('\n=== Verificando Tabelas ===');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');
  
  if (tablesError) {
    console.error('Erro ao verificar tabelas:', tablesError.message);
  } else {
    const existingTables = tables.map(t => t.table_name);
    console.log('Tabelas existentes:', existingTables.join(', '));
    
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    if (missingTables.length > 0) {
      console.log('Tabelas faltantes:', missingTables.join(', '));
    } else {
      console.log('Todas as tabelas necessárias estão presentes!');
    }
  }
  
  // Verificar buckets
  console.log('\n=== Verificando Buckets de Armazenamento ===');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('Erro ao verificar buckets:', bucketsError.message);
  } else {
    const existingBuckets = buckets.map(b => b.name);
    console.log('Buckets existentes:', existingBuckets.join(', '));
    
    const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
    if (missingBuckets.length > 0) {
      console.log('Buckets faltantes:', missingBuckets.join(', '));
    } else {
      console.log('Todos os buckets necessários estão presentes!');
    }
  }
  
  // Verificar funções
  console.log('\n=== Verificando Funções ===');
  const { data: functions, error: functionsError } = await supabase
    .from('information_schema.routines')
    .select('routine_name')
    .eq('routine_schema', 'public')
    .eq('routine_type', 'FUNCTION');
  
  if (functionsError) {
    console.error('Erro ao verificar funções:', functionsError.message);
  } else {
    const existingFunctions = functions.map(f => f.routine_name);
    console.log('Funções existentes:', existingFunctions.join(', '));
    
    const requiredFunctions = [
      'calculate_course_progress',
      'update_module_status',
      'issue_certificate',
      'update_updated_at_column',
      'calculate_learning_path_progress',
      'update_learning_path_progress'
    ];
    
    const missingFunctions = requiredFunctions.filter(f => !existingFunctions.includes(f));
    if (missingFunctions.length > 0) {
      console.log('Funções faltantes:', missingFunctions.join(', '));
    } else {
      console.log('Todas as funções necessárias estão presentes!');
    }
  }
  
  // Verificar triggers
  console.log('\n=== Verificando Triggers ===');
  const { data: triggers, error: triggersError } = await supabase
    .from('information_schema.triggers')
    .select('trigger_name, event_object_table')
    .eq('trigger_schema', 'public');
  
  if (triggersError) {
    console.error('Erro ao verificar triggers:', triggersError.message);
  } else {
    const existingTriggers = triggers.map(t => `${t.trigger_name} (${t.event_object_table})`);
    console.log('Triggers existentes:', existingTriggers.join(', '));
    
    const requiredTriggers = [
      'after_lesson_progress_update',
      'after_lesson_progress_update_for_certificate',
      'update_email_configurations_updated_at',
      'after_enrollment_update_for_learning_path'
    ];
    
    const existingTriggerNames = triggers.map(t => t.trigger_name);
    const missingTriggers = requiredTriggers.filter(t => !existingTriggerNames.includes(t));
    if (missingTriggers.length > 0) {
      console.log('Triggers faltantes:', missingTriggers.join(', '));
    } else {
      console.log('Todos os triggers necessários estão presentes!');
    }
  }
  
  console.log('\nVerificação da estrutura do banco de dados concluída!');
}

checkDatabaseStructure();
