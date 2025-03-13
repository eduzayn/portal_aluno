import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

/**
 * @swagger
 * /api/credentials/validate:
 *   get:
 *     summary: Validate a student credential using QR code
 *     tags: [Credentials]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: QR code data to validate
 *     responses:
 *       200:
 *         description: Credential validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 student:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     issueDate:
 *                       type: string
 *                       format: date-time
 *                     expiryDate:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid or missing QR code
 *       401:
 *         description: Expired or revoked credential
 *       404:
 *         description: Credential not found
 *       500:
 *         description: Server error
 */
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
        { 
          valid: false,
          status: data.status,
          message: 'Esta credencial não está mais ativa'
        },
        { status: 200 }
      );
    }
    
    // Check expiry date
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
    
    // Return validation success with student info
    return NextResponse.json({
      valid: true,
      student: {
        name: data.students?.name || 'Estudante',
        email: data.students?.email || 'email@exemplo.com',
        id: data.student_id,
        issueDate: data.issue_date,
        expiryDate: data.expiry_date
      }
    });
  } catch (error) {
    console.error('Erro ao validar credencial:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}
