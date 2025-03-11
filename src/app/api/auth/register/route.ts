import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role = 'student' } = await req.json();

    // Registrar usuário
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (data.user) {
      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email,
            name,
            role,
          },
        ]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        return NextResponse.json(
          { 
            success: true, 
            warning: 'Conta criada, mas houve um erro ao configurar o perfil',
            user: data.user,
            session: data.session
          },
          { status: 201 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
