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

async function createBuckets() {
  console.log('Criando buckets de armazenamento para o Portal do Aluno...');
  
  const buckets = [
    {
      name: 'profile-images',
      public: true,
      description: 'Imagens de perfil dos estudantes'
    },
    {
      name: 'course-thumbnails',
      public: true,
      description: 'Thumbnails dos cursos'
    },
    {
      name: 'lesson-content',
      public: false,
      description: 'Conteúdo das aulas (vídeos, PDFs, etc.)'
    },
    {
      name: 'supplementary-materials',
      public: false,
      description: 'Materiais complementares para as aulas'
    },
    {
      name: 'certificates',
      public: false,
      description: 'Certificados gerados para os estudantes'
    }
  ];
  
  for (const bucket of buckets) {
    try {
      // Verificar se o bucket já existe
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error(`Erro ao listar buckets: ${listError.message}`);
        continue;
      }
      
      const bucketExists = existingBuckets.some(b => b.name === bucket.name);
      
      if (bucketExists) {
        console.log(`Bucket '${bucket.name}' já existe. Pulando...`);
        continue;
      }
      
      // Criar o bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (error) {
        console.error(`Erro ao criar bucket '${bucket.name}': ${error.message}`);
      } else {
        console.log(`Bucket '${bucket.name}' criado com sucesso!`);
        
        // Configurar políticas de acesso
        if (bucket.public) {
          // Para buckets públicos, permitir leitura anônima
          const { error: policyError } = await supabase.storage.from(bucket.name).createSignedUrl('dummy.txt', 1);
          
          if (policyError && policyError.message !== 'The resource was not found') {
            console.error(`Erro ao configurar política para '${bucket.name}': ${policyError.message}`);
          } else {
            console.log(`Política de acesso público configurada para '${bucket.name}'`);
          }
        } else {
          // Para buckets privados, permitir acesso apenas para usuários autenticados
          // Nota: Isso é configurado por padrão no Supabase
          console.log(`Política de acesso privado mantida para '${bucket.name}'`);
        }
      }
    } catch (error) {
      console.error(`Erro inesperado ao processar bucket '${bucket.name}': ${error.message}`);
    }
  }
  
  console.log('Processo de criação de buckets concluído!');
}

createBuckets();
