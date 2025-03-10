# Componentes Faltantes na Estrutura do Banco de Dados

## Tabelas Faltantes

### 1. Rotas de Aprendizagem

A estrutura atual não possui tabelas para gerenciar rotas de aprendizagem, que são sequências estruturadas de cursos que formam uma jornada de aprendizado completa.

**Tabelas necessárias:**

- `learning_paths` - Definição das rotas de aprendizagem
- `learning_path_courses` - Associação entre rotas e cursos, com ordem definida
- `learning_path_enrollments` - Matrículas dos estudantes em rotas de aprendizagem

### 2. Materiais Complementares

Não há uma estrutura para gerenciar materiais complementares que podem ser associados a aulas ou módulos.

**Tabela necessária:**

- `supplementary_materials` - Arquivos adicionais para aulas e módulos

### 3. Avaliações de Cursos

Não existe uma tabela para armazenar avaliações e feedback dos estudantes sobre os cursos.

**Tabela necessária:**

- `course_ratings` - Avaliações de cursos pelos estudantes

### 4. Configurações do Portal

Não há uma tabela para armazenar configurações globais do portal.

**Tabela necessária:**

- `portal_settings` - Configurações personalizáveis do portal

## Funções Faltantes

### 1. Gerenciamento de Rotas de Aprendizagem

- `calculate_learning_path_progress` - Calcula o progresso em uma rota de aprendizagem
- `update_learning_path_progress` - Atualiza o progresso em rotas quando cursos são concluídos

## Storage Buckets Faltantes

A estrutura atual não define buckets de armazenamento para os diferentes tipos de arquivos utilizados no portal.

**Buckets necessários:**

1. `profile-images` - Imagens de perfil dos estudantes
2. `course-thumbnails` - Thumbnails dos cursos
3. `lesson-content` - Conteúdo das aulas (vídeos, PDFs, etc.)
4. `supplementary-materials` - Materiais complementares
5. `certificates` - Certificados gerados

## Impacto da Ausência

A ausência desses componentes limita as funcionalidades do Portal do Aluno:

1. **Sem Rotas de Aprendizagem:** Impossibilidade de criar jornadas estruturadas de aprendizado
2. **Sem Materiais Complementares:** Limitação no fornecimento de recursos adicionais
3. **Sem Avaliações:** Falta de feedback dos estudantes sobre os cursos
4. **Sem Configurações Personalizáveis:** Dificuldade em adaptar o portal às necessidades específicas
5. **Sem Buckets de Armazenamento:** Problemas no gerenciamento de arquivos

## Solução Proposta

1. Executar o script `supabase/migrations/db_structure_complete.sql` para criar as tabelas e funções faltantes
2. Executar o script `scripts/create-supabase-buckets.js` para criar os buckets de armazenamento necessários
3. Implementar funções de utilidade no código para interagir com as novas estruturas
