import { NextResponse } from 'next/server';
import { testEmailConfiguration, sendEmail } from '@/lib/email-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// POST /api/email/test - Testar configurações de email
export async function POST(request: Request) {
  try {
    // Verificar autenticação e permissões
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }
    
    // Primeiro verifica a configuração
    const configTest = await testEmailConfiguration();
    
    if (!configTest.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Falha na configuração do servidor SMTP',
          details: configTest.error
        },
        { status: 400 }
      );
    }
    
    // Obtém o email de destino do corpo da requisição
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email de destino é obrigatório' },
        { status: 400 }
      );
    }
    
    // Envia um email de teste
    const result = await sendEmail({
      to: email,
      subject: 'Teste de Configuração de Email - Portal do Aluno',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568;">Portal do Aluno - Edunéxia</h2>
          <div style="padding: 20px; border-radius: 5px; background-color: #f7fafc; border: 1px solid #e2e8f0;">
            <h3 style="color: #2d3748;">Teste de Configuração de Email</h3>
            <p style="color: #4a5568;">Este é um email de teste para verificar se as configurações de SMTP estão funcionando corretamente.</p>
            <p style="color: #4a5568;">Se você recebeu este email, a configuração está funcionando!</p>
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #718096; text-align: center;">
            <p>Este é um email automático, por favor não responda.</p>
            <p>&copy; ${new Date().getFullYear()} Edunéxia - Todos os direitos reservados</p>
          </div>
        </div>
      `
    });
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Falha ao enviar email de teste',
          details: result.error
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Email de teste enviado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao testar configurações de email:', error);
    return NextResponse.json(
      { error: 'Erro ao testar configurações de email' },
      { status: 500 }
    );
  }
}
