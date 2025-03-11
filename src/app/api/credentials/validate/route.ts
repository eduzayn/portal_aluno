import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  const qrCodeData = request.nextUrl.searchParams.get('code');
  
  if (!qrCodeData) {
    return NextResponse.json(
      { error: 'Código QR inválido ou ausente' },
      { status: 400 }
    );
  }
  
  try {
    // Buscar credencial com o QR code fornecido
    const { data, error } = await supabase
      .from('student_credentials')
      .select('*')
      .eq('qr_code_data', qrCodeData)
      .single();
    
    if (error || !data) {
      return NextResponse.json(
        { error: 'Credencial não encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar se a credencial está ativa
    if (data.status !== 'active') {
      return NextResponse.json(
        { 
          valid: false,
          status: data.status,
          message: 'Esta credencial não está mais ativa'
        },
        { status: 200 }
      );
    }
    
    // Verificar se a credencial está expirada
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      return NextResponse.json(
        { 
          valid: false,
          status: 'expired',
          message: 'Esta credencial está expirada'
        },
        { status: 200 }
      );
    }
    
    // Credencial válida
    return NextResponse.json({
      valid: true,
      student: {
        id: data.student_id,
        name: 'Estudante',
        email: 'email@exemplo.com'
      },
      issueDate: data.issue_date,
      expiryDate: data.expiry_date
    });
    
  } catch (error) {
    console.error('Erro ao validar credencial:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}
