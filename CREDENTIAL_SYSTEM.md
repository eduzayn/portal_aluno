# Sistema de Credenciais do Estudante e Gestão de Documentos Acadêmicos

## Visão Geral

O sistema de credenciais do estudante e gestão de documentos acadêmicos permite que os alunos:

1. Gerem credenciais digitais com foto e QR code para validação
2. Acessem, baixem e imprimam documentos acadêmicos
3. Compartilhem links de validação de credenciais com terceiros

## Componentes Principais

### 1. Credencial do Estudante

- **Página de Credencial**: `/src/app/student/credential/page.tsx`
- **Captura de Foto**: Integração com webcam para foto da credencial
- **Geração de QR Code**: Código único para validação externa
- **Impressão/Download**: Opções para salvar em PDF ou imprimir

### 2. Documentos Acadêmicos

- **Página de Documentos**: `/src/app/student/documents/page.tsx`
- **Categorias de Documentos**:
  - Declaração de Matrícula
  - Histórico de Notas
  - Declaração de Conclusão de Curso
- **Funcionalidades**: Download e impressão de documentos

### 3. API de Validação

- **Endpoint de Validação**: `/src/app/api/credentials/validate/route.ts`
- **Página de Validação**: `/src/app/api/credentials/validate/qrcode/page.tsx`
- **Cenários de Validação**:
  - Credencial válida
  - Credencial inválida
  - Credencial expirada
  - Credencial revogada

### 4. Banco de Dados

- **Tabelas**:
  - `student_credentials`: Armazena dados das credenciais
  - `academic_documents`: Armazena documentos acadêmicos
- **Segurança**: Políticas de Row Level Security (RLS)
- **Migração**: `/supabase/migrations/student_credentials.sql`

## Como Testar

1. Inicie o servidor de desenvolvimento:
   ```
   NEXT_PUBLIC_USE_MOCK_DATA=true npm run dev
   ```

2. Acesse as páginas:
   - Credencial: http://localhost:3000/student/credential
   - Documentos: http://localhost:3000/student/documents
   - Validação: http://localhost:3000/api/credentials/validate/qrcode

3. Teste a API de validação:
   ```
   npm run test:credentials
   ```

## Próximos Passos

- Implementar testes automatizados
- Integrar com serviços de e-mail para notificações
- Adicionar funcionalidades de compartilhamento
