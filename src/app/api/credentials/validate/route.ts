import { NextRequest, NextResponse } from 'next/server';
import { getStudentCredential } from '@/components/student/mock-data';

export async function GET(request: NextRequest) {
  // Get QR code from query parameters
  const qrCode = request.nextUrl.searchParams.get('qrcode');
  
  if (!qrCode) {
    return NextResponse.json({ error: 'QR code is required' }, { status: 400 });
  }
  
  try {
    // Find credential by QR code
    const credential = await getStudentCredential(qrCode);
    
    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }
    
    // Check if credential is expired
    const expiryDate = new Date(credential.expiryDate);
    const now = new Date();
    
    if (expiryDate < now) {
      return NextResponse.json({ error: 'Credential has expired' }, { status: 401 });
    }
    
    // Check if credential is revoked
    if (credential.status !== 'active') {
      return NextResponse.json({ error: 'Credential has been revoked' }, { status: 401 });
    }
    
    // Return valid credential
    return NextResponse.json({
      valid: true,
      credential
    });
  } catch (error) {
    console.error('Error validating credential:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
