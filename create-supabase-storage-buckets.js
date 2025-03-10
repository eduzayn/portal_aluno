// Script para criar buckets de armazenamento no Supabase
const { createClient } = require('@supabase/supabase-js');

// Credenciais diretas do Supabase
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de buckets a serem criados
const buckets = [
  {
    id: 'profile-images',
    name: 'Imagens de Perfil',
    public: true,
    fileTypes: ['image/jpeg', 'image/png', 'image/gif']
  },
  {
    id: 'course-thumbnails',
    name: 'Miniaturas de Cursos',
    public: true,
    fileTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  {
    id: 'lesson-content',
    name: 'Conteúdo de Aulas',
    public: false,
    fileTypes: ['application/pdf', 'video/mp4', 'audio/mpeg', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  },
  {
    id: 'supplementary-materials',
    name: 'Materiais Complementares',
    public: false,
    fileTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip']
  },
  {
    id: 'certificates',
    name: 'Certificados',
    public: true,
    fileTypes: ['application/pdf', 'image/png']
  }
];

// Função para criar um bucket
async function createBucket(bucket) {
  console.log(`Criando bucket ${bucket.id}...`);
  
  try {
    // Verificar se o bucket já existe
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      console.error(`Erro ao listar buckets:`, listError);
      return false;
    }
    
    const bucketExists = existingBuckets.some(b => b.name === bucket.id);
    
    if (bucketExists) {
      console.log(`Bucket ${bucket.id} já existe.`);
      return true;
    }
    
    // Criar o bucket
    const { data, error } = await supabase
      .storage
      .createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: bucket.fileTypes
      });
    
    if (error) {
      console.error(`Erro ao criar bucket ${bucket.id}:`, error);
      return false;
    }
    
    console.log(`Bucket ${bucket.id} criado com sucesso!`);
    return true;
  } catch (error) {
    console.error(`Erro ao criar bucket ${bucket.id}:`, error);
    return false;
  }
}

// Função principal para criar todos os buckets
async function createAllBuckets() {
  console.log('Iniciando criação de buckets de armazenamento...');
  
  const results = [];
  
  for (const bucket of buckets) {
    const success = await createBucket(bucket);
    results.push({ bucket: bucket.id, success });
  }
  
  console.log('\nResumo da criação de buckets:');
  results.forEach(result => {
    console.log(`- ${result.bucket}: ${result.success ? 'Criado/Existente' : 'Falha'}`);
  });
  
  console.log('\nCriação de buckets concluída!');
}

// Executar o script
createAllBuckets().catch(error => {
  console.error('Erro ao executar o script:', error);
  process.exit(1);
});
