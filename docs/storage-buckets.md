# Guia de Uso dos Buckets de Armazenamento

Este documento descreve como utilizar os buckets de armazenamento do Supabase no Portal do Aluno.

## Buckets Disponíveis

| Nome do Bucket | Descrição | Uso Recomendado |
|----------------|-----------|-----------------|
| `Avatars` | Avatares de usuários | Imagens de perfil de usuários (note o 'A' maiúsculo) |
| `course-thumbnails` | Miniaturas de cursos | Imagens de capa para cursos |
| `certificates` | Certificados | Certificados gerados para alunos |
| `receipts` | Recibos | Comprovantes de pagamento e recibos |
| `profile-images` | Imagens de perfil | Fotos de perfil completas |
| `lesson-content` | Conteúdo de aulas | Materiais de aula como slides e documentos |
| `supplementary-materials` | Materiais complementares | Recursos adicionais para cursos |

## Como Utilizar

Para garantir consistência no acesso aos buckets, utilize sempre as constantes definidas em `src/config/storage-buckets.ts` e as funções utilitárias em `src/utils/storage-utils.ts`.

### Exemplo de Uso

```typescript
import { STORAGE_BUCKETS } from '../config/storage-buckets';
import { uploadFile, getPublicUrl } from '../utils/storage-utils';

// Upload de um arquivo
const handleFileUpload = async (file: File) => {
  const path = `user-${userId}/${file.name}`;
  const { data, error } = await uploadFile(STORAGE_BUCKETS.AVATARS, path, file);
  
  if (error) {
    console.error('Erro ao fazer upload:', error);
    return;
  }
  
  // Obter URL pública do arquivo
  const publicUrl = getPublicUrl(STORAGE_BUCKETS.AVATARS, path);
  return publicUrl;
};
```

## Observações Importantes

1. O bucket `Avatars` foi criado com 'A' maiúsculo, diferente da convenção dos outros buckets. Sempre utilize a constante `STORAGE_BUCKETS.AVATARS` para referenciá-lo.

2. Ao adicionar novos buckets, atualize o arquivo de configuração `src/config/storage-buckets.ts`.

3. Para verificar o acesso aos buckets, utilize o script `scripts/database/test-storage-buckets.js`.
