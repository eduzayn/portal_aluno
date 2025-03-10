import { NextResponse } from 'next/server';
import { getEmailConfig, updateEmailConfig } from '@/lib/email-config';
import { testEmailConfiguration } from '@/lib/email-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/email/config - Obter configurações de email
export async function GET() {
  try {
    // Verificar autenticação e permissões
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }
    
    const config = await getEmailConfig();
    
    if (!config) {
      return NextResponse.json(
        { error: 'Configurações de email não encontradas' },
        { status: 404 }
      );
    }
    
    // Não retornar a senha por segurança
    const { smtp_pass, ...safeConfig } = config;
    
    return NextResponse.json(safeConfig);
  } catch (error) {
    console.error('Erro ao obter configurações de email:', error);
    return NextResponse.json(
      { error: 'Erro ao obter configurações de email' },
      { status: 500 }
    );
  }
}

// POST /api/email/config - Atualizar configurações de email
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
    
    const body = await request.json();
    
    const { smtp_host, smtp_port, smtp_user, smtp_pass } = body;
    
    if (!smtp_host || !smtp_port || !smtp_user || !smtp_pass) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }
    
    const success = await updateEmailConfig({
      smtp_host,
      smtp_port: Number(smtp_port),
      smtp_user,
      smtp_pass
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erro ao atualizar configurações de email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar configurações de email:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações de email' },
      { status: 500 }
    );
  }
}
