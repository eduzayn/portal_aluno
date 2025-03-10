-- Script para criar e popular a tabela de configurações do portal

-- Criar a tabela de configurações do portal
CREATE TABLE IF NOT EXISTS portal_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão do portal
INSERT INTO portal_settings (setting_key, setting_value, description)
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
ON CONFLICT (setting_key) DO UPDATE
SET 
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = NOW();
