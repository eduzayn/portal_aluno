-- Tabela para armazenar credenciais de estudantes
CREATE TABLE IF NOT EXISTS student_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT,
  qr_code_data TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar documentos acadêmicos
CREATE TABLE IF NOT EXISTS academic_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('grade_history', 'enrollment_declaration', 'course_completion')),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança para credenciais de estudantes
ALTER TABLE student_credentials ENABLE ROW LEVEL SECURITY;

-- Política para permitir que estudantes vejam apenas suas próprias credenciais
CREATE POLICY student_credentials_select_policy ON student_credentials
  FOR SELECT USING (auth.uid() = student_id);

-- Política para permitir que administradores vejam todas as credenciais
CREATE POLICY admin_credentials_select_policy ON student_credentials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Política para permitir que o sistema de validação acesse credenciais via QR code
CREATE POLICY validation_credentials_select_policy ON student_credentials
  FOR SELECT USING (true);

-- Políticas de segurança para documentos acadêmicos
ALTER TABLE academic_documents ENABLE ROW LEVEL SECURITY;

-- Política para permitir que estudantes vejam apenas seus próprios documentos
CREATE POLICY student_documents_select_policy ON academic_documents
  FOR SELECT USING (auth.uid() = student_id);

-- Política para permitir que administradores vejam todos os documentos
CREATE POLICY admin_documents_select_policy ON academic_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Função para verificar elegibilidade para credencial
CREATE OR REPLACE FUNCTION check_credential_eligibility(student_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_complete BOOLEAN;
  has_payments BOOLEAN;
BEGIN
  -- Verificar se o perfil está completo
  SELECT (full_name IS NOT NULL AND email IS NOT NULL AND phone IS NOT NULL AND address IS NOT NULL)
  INTO profile_complete
  FROM profiles
  WHERE id = student_id;
  
  -- Verificar se há pagamentos confirmados
  SELECT EXISTS (
    SELECT 1 FROM payments
    WHERE student_id = $1 AND status = 'paid'
    LIMIT 1
  ) INTO has_payments;
  
  RETURN profile_complete AND has_payments;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar o status de credenciais expiradas
CREATE OR REPLACE FUNCTION update_expired_credentials()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE student_credentials
  SET status = 'expired'
  WHERE expiry_date < NOW() AND status = 'active';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_expired_credentials
  AFTER INSERT OR UPDATE ON student_credentials
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_expired_credentials();
