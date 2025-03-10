# Revisão da Estrutura do Banco de Dados - Portal do Aluno

## Visão Geral

Este documento apresenta uma revisão completa da estrutura do banco de dados necessária para o funcionamento integral do Portal do Aluno. A análise identifica as tabelas, relacionamentos, funções, triggers e políticas de segurança necessárias para suportar todas as funcionalidades do sistema.

## Estrutura Atual

### Tabelas Existentes

1. **students** - Armazena informações dos estudantes
   - Dados de perfil, contato e status
   - Relacionada com a tabela de usuários do Supabase Auth

2. **courses** - Catálogo de cursos disponíveis
   - Informações sobre título, descrição, duração, nível e preço
   - Base para o sistema de aprendizagem

3. **modules** - Módulos que compõem os cursos
   - Organizados por ordem dentro de cada curso
   - Permitem estruturar o conteúdo de forma hierárquica

4. **lessons** - Aulas individuais dentro dos módulos
   - Diferentes tipos de conteúdo (vídeo, texto, quiz)
   - Rastreamento de duração e ordem

5. **enrollments** - Matrículas dos estudantes em cursos
   - Controle de datas de matrícula e expiração
   - Rastreamento de progresso geral

6. **lesson_progress** - Progresso detalhado por aula
   - Rastreamento do status de cada aula para cada estudante
   - Registro de datas de conclusão e último acesso

7. **certificates** - Certificados emitidos aos estudantes
   - Gerados após conclusão de cursos
   - Incluem códigos de verificação únicos

8. **financial_records** - Registros financeiros
   - Controle de pagamentos e mensalidades
   - Status de pagamento e recibos

9. **notifications** - Sistema de notificações
   - Mensagens para os estudantes
   - Controle de leitura e tipos de notificação

10. **email_configurations** - Configurações de email
    - Parâmetros SMTP para envio de emails
    - Configurações de remetente padrão

### Funções Existentes

1. **calculate_course_progress** - Calcula o progresso do estudante em um curso
2. **update_module_status** - Atualiza o status do módulo quando todas as aulas são concluídas
3. **issue_certificate** - Emite certificado automaticamente quando o curso é concluído
4. **update_updated_at_column** - Atualiza o timestamp de atualização

### Triggers Existentes

1. **after_lesson_progress_update** - Atualiza status do módulo após conclusão de aula
2. **after_lesson_progress_update_for_certificate** - Emite certificado após conclusão de curso
3. **update_email_configurations_updated_at** - Atualiza timestamp de configurações de email

### Políticas de Segurança (RLS)

- Políticas para todas as tabelas principais (students, courses, modules, etc.)
- Controle de acesso baseado em autenticação e propriedade dos dados

## Componentes Faltantes

### Tabelas Faltantes

1. **learning_paths** - Rotas de aprendizagem estruturadas
   - Sequências recomendadas de cursos
   - Permitem criar jornadas de aprendizado completas

2. **learning_path_courses** - Associação entre rotas e cursos
   - Define a ordem dos cursos em cada rota
   - Permite estruturar jornadas de aprendizado

3. **learning_path_enrollments** - Matrículas em rotas de aprendizagem
   - Similar às matrículas em cursos individuais
   - Rastreamento de progresso na rota completa

4. **supplementary_materials** - Materiais complementares
   - Arquivos adicionais para as aulas
   - Documentos, planilhas, apresentações, etc.

5. **course_ratings** - Avaliações de cursos
   - Feedback dos estudantes
   - Notas de 1 a 5 e comentários

6. **portal_settings** - Configurações do portal
   - Parâmetros globais do sistema
   - Personalização da interface e funcionalidades

### Funções Faltantes

1. **calculate_learning_path_progress** - Calcula o progresso em uma rota de aprendizagem
2. **update_learning_path_progress** - Atualiza o progresso em uma rota de aprendizagem quando o progresso de um curso é atualizado

### Storage Buckets Faltantes

1. **profile-images** - Imagens de perfil dos estudantes
2. **course-thumbnails** - Thumbnails dos cursos
3. **lesson-content** - Conteúdo das aulas
4. **supplementary-materials** - Materiais complementares
5. **certificates** - Certificados gerados

## Recomendações

### 1. Implementação de Tabelas Faltantes

Executar o script `supabase/migrations/db_structure_complete.sql` para criar as tabelas, funções e políticas faltantes.

### 2. Criação de Buckets de Armazenamento

Executar o script `scripts/create-supabase-buckets.js` para criar os buckets de armazenamento necessários.

### 3. Verificação da Estrutura

Após a implementação, executar o script `scripts/check-supabase-structure.js` para verificar se todas as estruturas necessárias foram criadas corretamente.

### 4. Implementação de Funções de Utilidade

Desenvolver funções de utilidade no código para interagir com as novas tabelas e buckets de armazenamento.

### 5. Desenvolvimento de Componentes de UI

Criar componentes de interface para visualizar e manipular os dados das novas tabelas.

## Conclusão

A implementação das estruturas faltantes permitirá o funcionamento integral do Portal do Aluno, com suporte a todas as funcionalidades planejadas, incluindo rotas de aprendizagem, avaliações de cursos, materiais complementares e configurações personalizadas.
