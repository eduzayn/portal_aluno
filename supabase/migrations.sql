-- Criação das tabelas para o Portal do Aluno - Edunéxia

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Estudantes
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(255),
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cursos
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    instructor VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    total_modules INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Módulos
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    order_index INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Aulas
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    type VARCHAR(50) NOT NULL,
    content_url VARCHAR(255),
    order_index INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Matrículas
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- Tabela de Progresso das Aulas
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- Tabela de Certificados
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    certificate_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Registros Financeiros
CREATE TABLE IF NOT EXISTS financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending',
    receipt_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados de exemplo para testes

-- Inserir estudante de exemplo
INSERT INTO students (id, name, email, avatar, enrollment_date)
VALUES 
    ('student-1', 'João Silva', 'joao.silva@example.com', 'https://randomuser.me/api/portraits/men/1.jpg', '2023-01-15T00:00:00Z');

-- Inserir cursos de exemplo
INSERT INTO courses (id, title, description, image_url, instructor, start_date, end_date, total_modules, total_lessons)
VALUES 
    ('course1', 'Desenvolvimento Web', 'Aprenda HTML, CSS e JavaScript do zero ao avançado', 'https://images.unsplash.com/photo-1547658719-da2b51169166', 'Carlos Oliveira', '2023-02-01T00:00:00Z', '2023-07-30T00:00:00Z', 3, 8),
    ('course2', 'Banco de Dados', 'Fundamentos de SQL e modelagem de dados', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d', 'Ana Souza', '2023-03-15T00:00:00Z', '2023-08-30T00:00:00Z', 2, 6),
    ('course3', 'Programação Orientada a Objetos', 'Conceitos e práticas de POO com Java', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', 'Roberto Santos', '2023-05-01T00:00:00Z', '2023-10-30T00:00:00Z', 4, 12),
    ('course4', 'Introdução à Inteligência Artificial', 'Fundamentos e aplicações de IA', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485', 'Mariana Costa', '2023-09-01T00:00:00Z', '2024-02-28T00:00:00Z', 5, 15);

-- Inserir matrículas de exemplo
INSERT INTO enrollments (student_id, course_id, enrollment_date, status)
VALUES 
    ('student-1', 'course1', '2023-02-01T00:00:00Z', 'active'),
    ('student-1', 'course2', '2023-03-15T00:00:00Z', 'active'),
    ('student-1', 'course3', '2023-05-01T00:00:00Z', 'active'),
    ('student-1', 'course4', '2023-09-01T00:00:00Z', 'active');

-- Inserir módulos para o curso de Desenvolvimento Web
INSERT INTO modules (id, course_id, title, description, duration, order_index, status)
VALUES 
    ('module1', 'course1', 'Fundamentos de HTML', 'Estrutura básica e tags HTML', '2 semanas', 1, 'completed'),
    ('module2', 'course1', 'CSS Básico', 'Estilização de páginas web', '3 semanas', 2, 'in_progress'),
    ('module3', 'course1', 'JavaScript Básico', 'Fundamentos de programação com JavaScript', '4 semanas', 3, 'locked');

-- Inserir aulas para o módulo de Fundamentos de HTML
INSERT INTO lessons (id, module_id, course_id, title, description, duration, type, content_url, order_index, status)
VALUES 
    ('lesson1', 'module1', 'course1', 'Introdução ao HTML', 'Conceitos básicos de HTML', '45 min', 'video', 'https://example.com/videos/html-intro', 1, 'completed'),
    ('lesson2', 'module1', 'course1', 'Tags e Atributos', 'Principais tags e seus atributos', '60 min', 'reading', 'https://example.com/readings/html-tags', 2, 'completed'),
    ('lesson3', 'module1', 'course1', 'Exercício Prático', 'Criando sua primeira página', '90 min', 'assignment', 'https://example.com/assignments/html-exercise', 3, 'completed');

-- Inserir aulas para o módulo de CSS Básico
INSERT INTO lessons (id, module_id, course_id, title, description, duration, type, content_url, order_index, status)
VALUES 
    ('lesson4', 'module2', 'course1', 'Introdução ao CSS', 'Sintaxe e seletores', '50 min', 'video', 'https://example.com/videos/css-intro', 1, 'completed'),
    ('lesson5', 'module2', 'course1', 'Box Model', 'Entendendo o modelo de caixa', '45 min', 'video', 'https://example.com/videos/css-box-model', 2, 'in_progress'),
    ('lesson6', 'module2', 'course1', 'Layouts com Flexbox', 'Criando layouts flexíveis', '60 min', 'video', 'https://example.com/videos/css-flexbox', 3, 'locked');

-- Inserir aulas para o módulo de JavaScript Básico
INSERT INTO lessons (id, module_id, course_id, title, description, duration, type, content_url, order_index, status)
VALUES 
    ('lesson7', 'module3', 'course1', 'Variáveis e Tipos', 'Tipos de dados e declaração de variáveis', '55 min', 'video', 'https://example.com/videos/js-variables', 1, 'locked'),
    ('lesson8', 'module3', 'course1', 'Estruturas de Controle', 'Condicionais e loops', '65 min', 'video', 'https://example.com/videos/js-control-structures', 2, 'locked');

-- Inserir progresso das aulas para o estudante
INSERT INTO lesson_progress (student_id, course_id, module_id, lesson_id, progress, completed, last_accessed)
VALUES 
    ('student-1', 'course1', 'module1', 'lesson1', 100, TRUE, '2023-02-10T14:30:00Z'),
    ('student-1', 'course1', 'module1', 'lesson2', 100, TRUE, '2023-02-15T16:45:00Z'),
    ('student-1', 'course1', 'module1', 'lesson3', 100, TRUE, '2023-02-20T10:15:00Z'),
    ('student-1', 'course1', 'module2', 'lesson4', 100, TRUE, '2023-02-25T11:20:00Z'),
    ('student-1', 'course1', 'module2', 'lesson5', 50, FALSE, '2023-03-01T09:30:00Z');

-- Inserir certificados de exemplo
INSERT INTO certificates (id, student_id, course_id, title, issue_date, certificate_url)
VALUES 
    ('cert1', 'student-1', 'course1', 'Certificado de Conclusão - Desenvolvimento Web', '2023-06-30T00:00:00Z', 'https://example.com/certificates/cert1.pdf'),
    ('cert2', 'student-1', 'course2', 'Certificado de Participação - Banco de Dados', '2023-08-15T00:00:00Z', 'https://example.com/certificates/cert2.pdf');

-- Inserir registros financeiros de exemplo
INSERT INTO financial_records (student_id, description, amount, due_date, payment_date, status, receipt_url)
VALUES 
    ('student-1', 'Mensalidade - Janeiro 2023', 299.90, '2023-01-10T00:00:00Z', '2023-01-08T00:00:00Z', 'paid', 'https://example.com/receipts/jan2023.pdf'),
    ('student-1', 'Mensalidade - Fevereiro 2023', 299.90, '2023-02-10T00:00:00Z', '2023-02-09T00:00:00Z', 'paid', 'https://example.com/receipts/feb2023.pdf'),
    ('student-1', 'Mensalidade - Março 2023', 299.90, '2023-03-10T00:00:00Z', NULL, 'pending', NULL),
    ('student-1', 'Taxa de Certificado - Desenvolvimento Web', 49.90, '2023-07-05T00:00:00Z', NULL, 'future', NULL);

-- Inserir notificações de exemplo
INSERT INTO notifications (student_id, title, message, read, created_at)
VALUES 
    ('student-1', 'Novo curso disponível', 'O curso de Inteligência Artificial já está disponível para matrícula!', FALSE, NOW() - INTERVAL '1 day'),
    ('student-1', 'Lembrete de atividade', 'Não se esqueça de entregar o exercício de CSS até amanhã.', FALSE, NOW() - INTERVAL '2 days'),
    ('student-1', 'Mensagem do instrutor', 'O professor Carlos enviou um feedback sobre seu último projeto.', FALSE, NOW() - INTERVAL '3 days');

-- Criar usuário de teste no Auth
-- NOTA: Esta parte deve ser executada manualmente no Supabase Dashboard ou via API
-- pois o SQL Editor não tem acesso direto às funções de autenticação

-- Criar políticas de segurança RLS (Row Level Security)

-- Habilitar RLS em todas as tabelas
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Política para estudantes (apenas ver próprio perfil)
CREATE POLICY "Estudantes podem ver apenas seu próprio perfil" 
ON students FOR SELECT 
USING (auth.uid()::text = id::text);

-- Política para cursos (estudantes podem ver cursos em que estão matriculados)
CREATE POLICY "Estudantes podem ver cursos matriculados" 
ON courses FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollments 
    WHERE enrollments.course_id = courses.id 
    AND enrollments.student_id::text = auth.uid()::text
  )
);

-- Política para módulos (estudantes podem ver módulos de cursos matriculados)
CREATE POLICY "Estudantes podem ver módulos de cursos matriculados" 
ON modules FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollments 
    WHERE enrollments.course_id = modules.course_id 
    AND enrollments.student_id::text = auth.uid()::text
  )
);

-- Política para aulas (estudantes podem ver aulas de cursos matriculados)
CREATE POLICY "Estudantes podem ver aulas de cursos matriculados" 
ON lessons FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollments 
    WHERE enrollments.course_id = lessons.course_id 
    AND enrollments.student_id::text = auth.uid()::text
  )
);

-- Política para matrículas (estudantes podem ver apenas suas próprias matrículas)
CREATE POLICY "Estudantes podem ver apenas suas próprias matrículas" 
ON enrollments FOR SELECT 
USING (student_id::text = auth.uid()::text);

-- Política para progresso das aulas (estudantes podem ver e atualizar apenas seu próprio progresso)
CREATE POLICY "Estudantes podem ver seu próprio progresso" 
ON lesson_progress FOR SELECT 
USING (student_id::text = auth.uid()::text);

CREATE POLICY "Estudantes podem atualizar seu próprio progresso" 
ON lesson_progress FOR UPDATE
USING (student_id::text = auth.uid()::text);

-- Política para certificados (estudantes podem ver apenas seus próprios certificados)
CREATE POLICY "Estudantes podem ver apenas seus próprios certificados" 
ON certificates FOR SELECT 
USING (student_id::text = auth.uid()::text);

-- Política para registros financeiros (estudantes podem ver apenas seus próprios registros)
CREATE POLICY "Estudantes podem ver apenas seus próprios registros financeiros" 
ON financial_records FOR SELECT 
USING (student_id::text = auth.uid()::text);

-- Política para notificações (estudantes podem ver e atualizar apenas suas próprias notificações)
CREATE POLICY "Estudantes podem ver suas próprias notificações" 
ON notifications FOR SELECT 
USING (student_id::text = auth.uid()::text);

CREATE POLICY "Estudantes podem marcar suas notificações como lidas" 
ON notifications FOR UPDATE
USING (student_id::text = auth.uid()::text);

-- Criar funções para calcular progresso do curso

CREATE OR REPLACE FUNCTION calculate_course_progress(p_student_id UUID, p_course_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress INTEGER;
BEGIN
    -- Contar total de aulas no curso
    SELECT COUNT(*) INTO total_lessons
    FROM lessons
    WHERE course_id = p_course_id;
    
    -- Contar aulas completadas pelo estudante
    SELECT COUNT(*) INTO completed_lessons
    FROM lesson_progress
    WHERE student_id = p_student_id
    AND course_id = p_course_id
    AND completed = TRUE;
    
    -- Calcular progresso
    IF total_lessons = 0 THEN
        progress := 0;
    ELSE
        progress := (completed_lessons * 100) / total_lessons;
    END IF;
    
    RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o status do módulo quando todas as aulas forem concluídas

CREATE OR REPLACE FUNCTION update_module_status()
RETURNS TRIGGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
BEGIN
    -- Contar total de aulas no módulo
    SELECT COUNT(*) INTO total_lessons
    FROM lessons
    WHERE module_id = NEW.module_id;
    
    -- Contar aulas completadas pelo estudante no módulo
    SELECT COUNT(*) INTO completed_lessons
    FROM lesson_progress
    WHERE student_id = NEW.student_id
    AND module_id = NEW.module_id
    AND completed = TRUE;
    
    -- Se todas as aulas foram concluídas, atualizar o status do módulo para 'completed'
    IF total_lessons > 0 AND total_lessons = completed_lessons THEN
        UPDATE modules
        SET status = 'completed'
        WHERE id = NEW.module_id;
        
        -- Desbloquear o próximo módulo se existir
        UPDATE modules
        SET status = 'available'
        WHERE course_id = NEW.course_id
        AND order_index = (
            SELECT order_index + 1
            FROM modules
            WHERE id = NEW.module_id
        )
        AND status = 'locked';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_lesson_progress_update
AFTER UPDATE OF completed ON lesson_progress
FOR EACH ROW
WHEN (OLD.completed = FALSE AND NEW.completed = TRUE)
EXECUTE FUNCTION update_module_status();

-- Criar função para emitir certificado automaticamente quando o curso for concluído

CREATE OR REPLACE FUNCTION issue_certificate()
RETURNS TRIGGER AS $$
DECLARE
    course_progress INTEGER;
    course_title VARCHAR(255);
    certificate_exists BOOLEAN;
BEGIN
    -- Calcular progresso do curso
    course_progress := calculate_course_progress(NEW.student_id, NEW.course_id);
    
    -- Verificar se o progresso é 100%
    IF course_progress = 100 THEN
        -- Verificar se já existe um certificado para este curso e estudante
        SELECT EXISTS (
            SELECT 1 FROM certificates
            WHERE student_id = NEW.student_id
            AND course_id = NEW.course_id
        ) INTO certificate_exists;
        
        -- Se não existir certificado, criar um
        IF NOT certificate_exists THEN
            -- Obter o título do curso
            SELECT title INTO course_title
            FROM courses
            WHERE id = NEW.course_id;
            
            -- Inserir certificado
            INSERT INTO certificates (
                student_id, 
                course_id, 
                title, 
                issue_date, 
                certificate_url
            )
            VALUES (
                NEW.student_id,
                NEW.course_id,
                'Certificado de Conclusão - ' || course_title,
                NOW(),
                'https://example.com/certificates/' || NEW.student_id || '_' || NEW.course_id || '.pdf'
            );
            
            -- Criar notificação para o estudante
            INSERT INTO notifications (
                student_id,
                title,
                message,
                read
            )
            VALUES (
                NEW.student_id,
                'Certificado Emitido',
                'Parabéns! Seu certificado para o curso ' || course_title || ' foi emitido.',
                FALSE
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_lesson_progress_update_for_certificate
AFTER UPDATE OF completed ON lesson_progress
FOR EACH ROW
WHEN (OLD.completed = FALSE AND NEW.completed = TRUE)
EXECUTE FUNCTION issue_certificate();
