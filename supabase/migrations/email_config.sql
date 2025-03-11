-- Criar tabela para configurações de email
CREATE TABLE IF NOT EXISTS email_configurations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    smtp_host VARCHAR NOT NULL,
    smtp_port INTEGER NOT NULL,
    smtp_user VARCHAR NOT NULL,
    smtp_pass VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações de email
INSERT INTO email_configurations (smtp_host, smtp_port, smtp_user, smtp_pass)
VALUES (
    'brasil.svrdedicado.org',
    587,
    'contato@eduzayn.com.br',
    '123@mudar'
);

-- Adicionar política RLS para proteger os dados
ALTER TABLE email_configurations ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir apenas usuários autenticados visualizarem as configurações
CREATE POLICY "Allow select for authenticated users only" 
    ON email_configurations FOR SELECT 
    TO authenticated
    USING (true);

-- Criar política para permitir apenas administradores modificarem as configurações
CREATE POLICY "Allow insert/update/delete for administrators only" 
    ON email_configurations FOR ALL 
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Criar função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar o timestamp automaticamente
CREATE TRIGGER update_email_configurations_updated_at
    BEFORE UPDATE ON email_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar função para obter as configurações de email
CREATE OR REPLACE FUNCTION get_email_configuration()
RETURNS SETOF email_configurations
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT * FROM email_configurations ORDER BY created_at DESC LIMIT 1;
$$;

-- Comentários para documentação
COMMENT ON TABLE email_configurations IS 'Armazena as configurações SMTP para envio de emails';
COMMENT ON COLUMN email_configurations.smtp_host IS 'Endereço do servidor SMTP';
COMMENT ON COLUMN email_configurations.smtp_port IS 'Porta do servidor SMTP';
COMMENT ON COLUMN email_configurations.smtp_user IS 'Usuário para autenticação SMTP';
COMMENT ON COLUMN email_configurations.smtp_pass IS 'Senha para autenticação SMTP';
