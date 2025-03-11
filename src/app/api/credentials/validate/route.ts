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
    // For mock data environment, use a simulated validation
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      // Simulate validation for testing
      if (qrCodeData === 'invalid') {
        return NextResponse.json(
          { valid: false, message: 'Credencial não encontrada' },
          { status: 404 }
        );
      }
      
      if (qrCodeData === 'expired') {
        return NextResponse.json(
          { valid: false, message: 'Credencial expirada', status: 'expired' },
          { status: 401 }
        );
      }
      
      if (qrCodeData === 'revoked') {
        return NextResponse.json(
          { valid: false, message: 'Credencial revogada', status: 'revoked' },
          { status: 401 }
        );
      }
      
      // Valid mock credential
      return NextResponse.json({
        valid: true,
        student: {
          name: 'João Silva',
          email: 'joao.silva@example.com',
          issueDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
    }
    
    // Real implementation with Supabase
    const { data, error } = await supabase
      .from('student_credentials')
      .select('*, students:student_id(name, email)')
      .eq('qr_code_data', qrCodeData)
      .single();
    
    if (error || !data) {
      return NextResponse.json(
        { valid: false, message: 'Credencial não encontrada' },
        { status: 404 }
      );
    }
    
    // Check if credential is expired or revoked
    if (data.status !== 'active') {
      return NextResponse.json(
        { valid: false, message: 'Credencial inválida ou expirada', status: data.status },
        { status: 401 }
      );
    }
    
    // Check expiry date
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      return NextResponse.json(
        { valid: false, message: 'Credencial expirada', status: 'expired' },
        { status: 401 }
      );
    }
    
    // Return validation success with student info
    return NextResponse.json({
      valid: true,
      student: {
        name: data.students.name,
        email: data.students.email,
        issueDate: data.issue_date,
        expiryDate: data.expiry_date
      }
    });
  } catch (error) {
    console.error('Error validating credential:', error);
    return NextResponse.json(
      { valid: false, message: 'Erro ao validar credencial' },
      { status: 500 }
    );
  }
}
