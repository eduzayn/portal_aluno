-- Script para adicionar componentes faltantes na estrutura do banco de dados do Portal do Aluno
-- Este script cria tabelas, funções, triggers e políticas de segurança para o Portal do Aluno

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

-- Função para calcular o progresso em uma rota de aprendizagem
CREATE OR REPLACE FUNCTION calculate_learning_path_progress(
  p_student_id UUID,
  p_learning_path_id UUID
)
RETURNS FLOAT
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_total_courses INTEGER;
  v_completed_courses INTEGER;
  v_progress FLOAT;
BEGIN
  -- Contar o número total de cursos na rota de aprendizagem
  SELECT COUNT(*)
  INTO v_total_courses
  FROM learning_path_courses
  WHERE learning_path_id = p_learning_path_id;
  
  -- Se não houver cursos, retornar 0
  IF v_total_courses = 0 THEN
    RETURN 0;
  END IF;
  
  -- Contar o número de cursos concluídos pelo aluno
  SELECT COUNT(*)
  INTO v_completed_courses
  FROM learning_path_courses lpc
  JOIN enrollments e ON e.course_id = lpc.course_id AND e.student_id = p_student_id
  WHERE lpc.learning_path_id = p_learning_path_id AND e.status = 'completed';
  
  -- Calcular o progresso
  v_progress := (v_completed_courses::FLOAT / v_total_courses::FLOAT) * 100;
  
  RETURN v_progress;
END;
$function$;

-- Função para atualizar o progresso em rotas de aprendizagem
CREATE OR REPLACE FUNCTION update_learning_path_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_learning_path_id UUID;
  v_progress FLOAT;
BEGIN
  -- Para cada rota de aprendizagem que contém o curso atualizado
  FOR v_learning_path_id IN
    SELECT lpc.learning_path_id
    FROM learning_path_courses lpc
    WHERE lpc.course_id = NEW.course_id
  LOOP
    -- Calcular o progresso na rota de aprendizagem
    v_progress := calculate_learning_path_progress(NEW.student_id, v_learning_path_id);
    
    -- Atualizar o progresso na matrícula da rota de aprendizagem
    UPDATE learning_path_enrollments
    SET 
      progress = v_progress,
      status = CASE
        WHEN v_progress >= 100 THEN 'completed'
        ELSE 'in_progress'
      END,
      completion_date = CASE
        WHEN v_progress >= 100 THEN NOW()
        ELSE NULL
      END,
      updated_at = NOW()
    WHERE 
      student_id = NEW.student_id AND 
      learning_path_id = v_learning_path_id;
    
    -- Se não existir matrícula na rota de aprendizagem, criar uma
    IF NOT FOUND THEN
      INSERT INTO learning_path_enrollments (
        student_id,
        learning_path_id,
        progress,
        status
      ) VALUES (
        NEW.student_id,
        v_learning_path_id,
        v_progress,
        CASE
          WHEN v_progress >= 100 THEN 'completed'
          ELSE 'in_progress'
        END
      );
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$function$;

-- Função para obter o valor de uma configuração do portal
CREATE OR REPLACE FUNCTION get_portal_setting(
  p_key VARCHAR(255),
  p_default TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_value TEXT;
BEGIN
  SELECT value
  INTO v_value
  FROM portal_settings
  WHERE key = p_key;
  
  IF v_value IS NULL THEN
    RETURN p_default;
  ELSE
    RETURN v_value;
  END IF;
END;
$function$;

-- Função para atualizar o valor de uma configuração do portal
CREATE OR REPLACE FUNCTION update_portal_setting(
  p_key VARCHAR(255),
  p_value TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Tentar atualizar a configuração existente
  UPDATE portal_settings
  SET 
    value = p_value,
    updated_at = NOW(),
    description = COALESCE(p_description, description)
  WHERE key = p_key;
  
  -- Se não existir, criar uma nova configuração
  IF NOT FOUND THEN
    INSERT INTO portal_settings (key, value, description)
    VALUES (p_key, p_value, p_description);
  END IF;
  
  RETURN TRUE;
END;
$function$;

-- Trigger para atualizar o progresso em rotas de aprendizagem quando o progresso em cursos é atualizado
CREATE OR REPLACE TRIGGER after_enrollment_update_for_learning_path
AFTER UPDATE OF status, progress ON enrollments
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.progress IS DISTINCT FROM NEW.progress)
EXECUTE FUNCTION update_learning_path_progress();

-- Triggers para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $function$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

-- Trigger para atualizar o campo updated_at na tabela learning_paths
CREATE TRIGGER update_learning_paths_updated_at
BEFORE UPDATE ON learning_paths
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o campo updated_at na tabela learning_path_courses
CREATE TRIGGER update_learning_path_courses_updated_at
BEFORE UPDATE ON learning_path_courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o campo updated_at na tabela learning_path_enrollments
CREATE TRIGGER update_learning_path_enrollments_updated_at
BEFORE UPDATE ON learning_path_enrollments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o campo updated_at na tabela supplementary_materials
CREATE TRIGGER update_supplementary_materials_updated_at
BEFORE UPDATE ON supplementary_materials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o campo updated_at na tabela course_ratings
CREATE TRIGGER update_course_ratings_updated_at
BEFORE UPDATE ON course_ratings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o campo updated_at na tabela portal_settings
CREATE TRIGGER update_portal_settings_updated_at
BEFORE UPDATE ON portal_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS) para as novas tabelas
-- Habilitar RLS para todas as tabelas
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplementary_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para learning_paths
CREATE POLICY learning_paths_select_policy ON learning_paths
FOR SELECT USING (TRUE);  -- Todos podem visualizar rotas de aprendizagem

CREATE POLICY learning_paths_insert_policy ON learning_paths
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'instructor'));

CREATE POLICY learning_paths_update_policy ON learning_paths
FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'instructor'));

CREATE POLICY learning_paths_delete_policy ON learning_paths
FOR DELETE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Políticas para learning_path_courses
CREATE POLICY learning_path_courses_select_policy ON learning_path_courses
FOR SELECT USING (TRUE);  -- Todos podem visualizar cursos em rotas de aprendizagem

CREATE POLICY learning_path_courses_insert_policy ON learning_path_courses
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'instructor'));

CREATE POLICY learning_path_courses_update_policy ON learning_path_courses
FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'instructor'));

CREATE POLICY learning_path_courses_delete_policy ON learning_path_courses
FOR DELETE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'instructor'));

-- Políticas para learning_path_enrollments
CREATE POLICY learning_path_enrollments_select_policy ON learning_path_enrollments
FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    auth.jwt() ->> 'role' IN ('admin', 'instructor') OR
    student_id::TEXT = auth.uid()
  )
);

CREATE POLICY learning_path_enrollments_insert_policy ON learning_path_enrollments
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND (
    auth.jwt() ->> 'role' IN ('admin', 'instructor') OR
    student_id::TEXT = auth.uid()
  )
);

CREATE POLICY learning_path_enrollments_update_policy ON learning_path_enrollments
FOR UPDATE USING (
  auth.role() = 'authenticated' AND (
    auth.jwt() ->> 'role' IN ('admin', 'instructor') OR
    student_id::TEXT = auth.uid()
  )
);

CREATE POLICY learning_path_enrollments_delete_policy ON learning_path_enrollments
FOR DELETE USING (
  auth.role() = 'authenticated' AND (
    auth.jwt() ->> 'role' = 'admin' OR
    student_id::TEXT = auth.uid()
  )
);

-- Políticas para supplementary_materials
CREATE POLICY supplementary_materials_select_policy ON supplementary_materials
FOR SELECT USING (TRUE);  -- Todos podem visualizar materiais complementares

CREATE POLICY supplementary_materials_insert_policy ON supplementary_materials
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'instructor'));

CREATE POLICY supplementary_materials_update_policy ON supplementary_materials
FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'instructor'));

CREATE POLICY supplementary_materials_delete_policy ON supplementary_materials
FOR DELETE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' IN ('admin', 'instructor'));

-- Políticas para course_ratings
CREATE POLICY course_ratings_select_policy ON course_ratings
FOR SELECT USING (TRUE);  -- Todos podem visualizar avaliações de cursos

CREATE POLICY course_ratings_insert_policy ON course_ratings
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND (
    student_id::TEXT = auth.uid()
  )
);

CREATE POLICY course_ratings_update_policy ON course_ratings
FOR UPDATE USING (
  auth.role() = 'authenticated' AND (
    student_id::TEXT = auth.uid() OR
    auth.jwt() ->> 'role' = 'admin'
  )
);

CREATE POLICY course_ratings_delete_policy ON course_ratings
FOR DELETE USING (
  auth.role() = 'authenticated' AND (
    student_id::TEXT = auth.uid() OR
    auth.jwt() ->> 'role' = 'admin'
  )
);

-- Políticas para portal_settings
CREATE POLICY portal_settings_select_policy ON portal_settings
FOR SELECT USING (TRUE);  -- Todos podem visualizar configurações do portal

CREATE POLICY portal_settings_insert_policy ON portal_settings
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY portal_settings_update_policy ON portal_settings
FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY portal_settings_delete_policy ON portal_settings
FOR DELETE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

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
  ('enable_course_ratings', 'true', 'Habilitar avaliações de cursos'),
  ('default_language', 'pt-BR', 'Idioma padrão'),
  ('timezone', 'America/Sao_Paulo', 'Fuso horário'),
  ('terms_url', '/terms', 'URL dos termos de uso'),
  ('privacy_url', '/privacy', 'URL da política de privacidade'),
  ('support_email', 'suporte@edunexia.com', 'Email de suporte'),
  ('contact_phone', '+55 11 1234-5678', 'Telefone de contato'),
  ('social_facebook', 'https://facebook.com/edunexia', 'URL do Facebook'),
  ('social_instagram', 'https://instagram.com/edunexia', 'URL do Instagram'),
  ('social_youtube', 'https://youtube.com/edunexia', 'URL do YouTube'),
  ('social_linkedin', 'https://linkedin.com/company/edunexia', 'URL do LinkedIn')
ON CONFLICT (key) DO UPDATE
SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();
