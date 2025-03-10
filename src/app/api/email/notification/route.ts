import { NextResponse } from 'next/server';
import { sendNotification } from '@/lib/email-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// POST /api/email/notification - Enviar notificação por email
export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { email, subject, message } = body;
    
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Email, assunto e mensagem são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se o usuário tem permissão para enviar para este email
    // Apenas administradores podem enviar para qualquer email
    // Usuários comuns só podem enviar para seu próprio email
    if ((session.user as any).role !== 'admin' && 
        (session.user as any).email !== email) {
      return NextResponse.json(
        { error: 'Não autorizado a enviar email para este destinatário' },
        { status: 403 }
      );
    }
    
    const result = await sendNotification(email, subject, message);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Falha ao enviar notificação',
          details: result.error
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Notificação enviada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar notificação' },
      { status: 500 }
    );
  }
}
