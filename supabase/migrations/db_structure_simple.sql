-- Script para adicionar componentes faltantes na estrutura do banco de dados do Portal do Aluno

-- Tabela de Rotas de Aprendizagem
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de associação entre Rotas de Aprendizagem e Cursos
CREATE TABLE IF NOT EXISTS learning_path_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(learning_path_id, course_id)
);

-- Tabela de matrículas em Rotas de Aprendizagem
CREATE TABLE IF NOT EXISTS learning_path_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  progress FLOAT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, learning_path_id)
);

-- Tabela de Materiais Complementares
CREATE TABLE IF NOT EXISTS supplementary_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(255),
  file_type VARCHAR(50),
  file_size INTEGER,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (course_id IS NOT NULL AND module_id IS NULL AND lesson_id IS NULL) OR
    (course_id IS NOT NULL AND module_id IS NOT NULL AND lesson_id IS NULL) OR
    (course_id IS NOT NULL AND module_id IS NOT NULL AND lesson_id IS NOT NULL)
  )
);

-- Tabela de Avaliações de Cursos
CREATE TABLE IF NOT EXISTS course_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Tabela de Configurações do Portal
CREATE TABLE IF NOT EXISTS portal_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão do portal
INSERT INTO portal_settings (key, value, description)
VALUES
  ('site_name', 'Portal do Aluno - Edunéxia', 'Nome do site'),
  ('site_description', 'Portal do Aluno da Edunéxia - Ambiente digital completo para gerenciamento acadêmico', 'Descrição do site'),
  ('primary_color', '#4F46E5', 'Cor primária do tema'),
  ('secondary_color', '#10B981', 'Cor secundária do tema'),
  ('logo_url', '/images/logo.png', 'URL do logotipo'),
  ('favicon_url', '/favicon.ico', 'URL do favicon'),
  ('max_file_upload_size', '10485760', 'Tamanho máximo de upload de arquivos em bytes (10MB)'),
  ('allowed_file_types', 'pdf,doc,docx,ppt,pptx,xls,xlsx,jpg,jpeg,png,gif,mp4,mp3,zip', 'Tipos de arquivos permitidos para upload'),
  ('enable_notifications', 'true', 'Habilitar notificações'),
  ('enable_chat', 'true', 'Habilitar chat'),
  ('enable_forum', 'true', 'Habilitar fórum'),
  ('enable_calendar', 'true', 'Habilitar calendário'),
  ('enable_certificates', 'true', 'Habilitar certificados'),
  ('enable_financial', 'true', 'Habilitar módulo financeiro'),
  ('enable_learning_paths', 'true', 'Habilitar rotas de aprendizagem'),
  ('enable_course_ratings', 'true', 'Habilitar avaliações de cursos')
ON CONFLICT (key) DO UPDATE
SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();
