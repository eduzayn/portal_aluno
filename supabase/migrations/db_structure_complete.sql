-- Adição de estruturas faltantes para o Portal do Aluno - Edunéxia

-- Tabela de Rotas de Aprendizagem
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    duration VARCHAR(50),
    level VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cursos em Rotas de Aprendizagem
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

-- Tabela de Matrículas em Rotas de Aprendizagem
CREATE TABLE IF NOT EXISTS learning_path_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, learning_path_id)
);

-- Tabela de Materiais Complementares
CREATE TABLE IF NOT EXISTS supplementary_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT supplementary_materials_lesson_or_module_check CHECK (
        (lesson_id IS NOT NULL AND module_id IS NULL) OR
        (lesson_id IS NULL AND module_id IS NOT NULL)
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
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplementary_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Rotas de Aprendizagem
CREATE POLICY "Estudantes podem ver rotas de aprendizagem disponíveis" 
ON learning_paths FOR SELECT 
USING (status = 'active');

-- Políticas RLS para Cursos em Rotas de Aprendizagem
CREATE POLICY "Estudantes podem ver cursos em rotas de aprendizagem" 
ON learning_path_courses FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM learning_paths 
    WHERE learning_paths.id = learning_path_courses.learning_path_id 
    AND learning_paths.status = 'active'
  )
);

-- Políticas RLS para Matrículas em Rotas de Aprendizagem
CREATE POLICY "Estudantes podem ver suas próprias matrículas em rotas" 
ON learning_path_enrollments FOR SELECT 
USING (student_id::text = auth.uid()::text);

CREATE POLICY "Estudantes podem atualizar suas próprias matrículas em rotas" 
ON learning_path_enrollments FOR UPDATE
USING (student_id::text = auth.uid()::text);

-- Políticas RLS para Materiais Complementares
CREATE POLICY "Estudantes podem ver materiais de cursos matriculados" 
ON supplementary_materials FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollments 
    WHERE enrollments.course_id = supplementary_materials.course_id 
    AND enrollments.student_id::text = auth.uid()::text
  )
);

-- Políticas RLS para Avaliações de Cursos
CREATE POLICY "Estudantes podem ver todas as avaliações" 
ON course_ratings FOR SELECT 
USING (true);

CREATE POLICY "Estudantes podem criar/atualizar suas próprias avaliações" 
ON course_ratings FOR ALL
USING (student_id::text = auth.uid()::text);

-- Políticas RLS para Configurações do Portal
CREATE POLICY "Todos podem ver configurações públicas" 
ON portal_settings FOR SELECT 
USING (setting_key LIKE 'public.%');

CREATE POLICY "Apenas administradores podem gerenciar configurações" 
ON portal_settings FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Função para calcular progresso em uma rota de aprendizagem
CREATE OR REPLACE FUNCTION calculate_learning_path_progress(p_student_id UUID, p_learning_path_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_courses INTEGER;
    completed_courses INTEGER;
    progress INTEGER;
BEGIN
    -- Contar total de cursos na rota
    SELECT COUNT(*) INTO total_courses
    FROM learning_path_courses
    WHERE learning_path_id = p_learning_path_id;
    
    -- Contar cursos completados pelo estudante
    SELECT COUNT(*) INTO completed_courses
    FROM learning_path_courses lpc
    JOIN enrollments e ON e.course_id = lpc.course_id AND e.student_id = p_student_id
    WHERE lpc.learning_path_id = p_learning_path_id
    AND e.status = 'completed';
    
    -- Calcular progresso
    IF total_courses = 0 THEN
        progress := 0;
    ELSE
        progress := (completed_courses * 100) / total_courses;
    END IF;
    
    RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o progresso da rota de aprendizagem quando o status de um curso é atualizado
CREATE OR REPLACE FUNCTION update_learning_path_progress()
RETURNS TRIGGER AS $$
DECLARE
    learning_path_ids UUID[];
    learning_path_id UUID;
    new_progress INTEGER;
BEGIN
    -- Encontrar todas as rotas de aprendizagem que contêm este curso
    SELECT ARRAY_AGG(DISTINCT learning_path_id) INTO learning_path_ids
    FROM learning_path_courses
    WHERE course_id = NEW.course_id;
    
    -- Para cada rota de aprendizagem, atualizar o progresso
    IF learning_path_ids IS NOT NULL THEN
        FOREACH learning_path_id IN ARRAY learning_path_ids
        LOOP
            -- Verificar se o estudante está matriculado nesta rota
            IF EXISTS (
                SELECT 1 FROM learning_path_enrollments
                WHERE student_id = NEW.student_id
                AND learning_path_id = learning_path_id
            ) THEN
                -- Calcular novo progresso
                new_progress := calculate_learning_path_progress(NEW.student_id, learning_path_id);
                
                -- Atualizar progresso na matrícula da rota
                UPDATE learning_path_enrollments
                SET progress = new_progress,
                    status = CASE
                        WHEN new_progress = 100 THEN 'completed'
                        WHEN new_progress > 0 THEN 'in_progress'
                        ELSE 'active'
                    END
                WHERE student_id = NEW.student_id
                AND learning_path_id = learning_path_id;
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_enrollment_update_for_learning_path
AFTER UPDATE OF status, progress ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_learning_path_progress();

-- Inserir configurações padrão do portal
INSERT INTO portal_settings (setting_key, setting_value, setting_type, description)
VALUES 
    ('public.portal_name', 'Portal do Aluno - Edunéxia', 'string', 'Nome do portal exibido no cabeçalho'),
    ('public.portal_logo', 'https://example.com/logo.png', 'string', 'URL do logo do portal'),
    ('public.primary_color', '#3B82F6', 'string', 'Cor primária do tema do portal'),
    ('public.secondary_color', '#10B981', 'string', 'Cor secundária do tema do portal'),
    ('public.footer_text', '© 2023 Edunéxia. Todos os direitos reservados.', 'string', 'Texto exibido no rodapé'),
    ('public.contact_email', 'suporte@edunexia.com', 'string', 'Email de contato para suporte'),
    ('public.enable_certificates', 'true', 'boolean', 'Habilitar emissão de certificados'),
    ('public.enable_ratings', 'true', 'boolean', 'Habilitar avaliações de cursos'),
    ('public.enable_financial', 'true', 'boolean', 'Habilitar módulo financeiro'),
    ('public.enable_learning_paths', 'true', 'boolean', 'Habilitar rotas de aprendizagem');

-- Comentários para documentação
COMMENT ON TABLE learning_paths IS 'Rotas de aprendizagem estruturadas';
COMMENT ON TABLE learning_path_courses IS 'Associação entre rotas de aprendizagem e cursos';
COMMENT ON TABLE learning_path_enrollments IS 'Matrículas de estudantes em rotas de aprendizagem';
COMMENT ON TABLE supplementary_materials IS 'Materiais complementares para aulas e módulos';
COMMENT ON TABLE course_ratings IS 'Avaliações de cursos pelos estudantes';
COMMENT ON TABLE portal_settings IS 'Configurações globais do portal';

COMMENT ON FUNCTION calculate_learning_path_progress IS 'Calcula o progresso de um estudante em uma rota de aprendizagem';
COMMENT ON FUNCTION update_learning_path_progress IS 'Atualiza o progresso em rotas de aprendizagem quando o status de um curso é atualizado';
