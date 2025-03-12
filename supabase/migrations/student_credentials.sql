-- Tabela para armazenar credenciais de estudantes
CREATE TABLE IF NOT EXISTS student_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT,
  qr_code_data TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por QR code
CREATE INDEX IF NOT EXISTS idx_student_credentials_qr_code ON student_credentials(qr_code_data);

-- Índice para busca por estudante
CREATE INDEX IF NOT EXISTS idx_student_credentials_student_id ON student_credentials(student_id);

-- Tabela para armazenar documentos acadêmicos
CREATE TABLE IF NOT EXISTS academic_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('enrollment_declaration', 'grade_history', 'course_completion')),
  title TEXT NOT NULL,
  file_url TEXT,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por estudante
CREATE INDEX IF NOT EXISTS idx_academic_documents_student_id ON academic_documents(student_id);

-- Índice para busca por tipo de documento
CREATE INDEX IF NOT EXISTS idx_academic_documents_document_type ON academic_documents(document_type);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp de updated_at em student_credentials
CREATE TRIGGER update_student_credentials_updated_at
BEFORE UPDATE ON student_credentials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar o timestamp de updated_at em academic_documents
CREATE TRIGGER update_academic_documents_updated_at
BEFORE UPDATE ON academic_documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS para student_credentials
ALTER TABLE student_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own credentials"
  ON student_credentials FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own credentials"
  ON student_credentials FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all credentials"
  ON student_credentials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert credentials"
  ON student_credentials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update credentials"
  ON student_credentials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Políticas de segurança RLS para academic_documents
ALTER TABLE academic_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own documents"
  ON academic_documents FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all documents"
  ON academic_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert documents"
  ON academic_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update documents"
  ON academic_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
