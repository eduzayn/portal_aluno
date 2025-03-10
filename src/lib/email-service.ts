import nodemailer from 'nodemailer';
import { getEmailTransportConfig } from './email-config';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Envia um email usando as configurações SMTP do Supabase
 * @param options Opções do email a ser enviado
 * @returns Resultado do envio do email
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: any }> {
  try {
    const transportConfig = await getEmailTransportConfig();
    
    if (!transportConfig) {
      console.error('Configurações de email não encontradas');
      return { success: false, error: 'Configurações de email não encontradas' };
    }
    
    const transporter = nodemailer.createTransport(transportConfig);
    
    const { to, subject, text, html, attachments } = options;
    
    const mailOptions = {
      from: `"Portal do Aluno" <${transportConfig.auth.user}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text,
      html,
      attachments
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email enviado:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error };
  }
}

/**
 * Envia um email de notificação para o aluno
 * @param studentEmail Email do aluno
 * @param subject Assunto da notificação
 * @param message Mensagem da notificação
 * @returns Resultado do envio do email
 */
export async function sendNotification(
  studentEmail: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: any }> {
  return sendEmail({
    to: studentEmail,
    subject: `Notificação: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">Portal do Aluno - Edunéxia</h2>
        <div style="padding: 20px; border-radius: 5px; background-color: #f7fafc; border: 1px solid #e2e8f0;">
          <h3 style="color: #2d3748;">${subject}</h3>
          <div style="color: #4a5568; line-height: 1.6;">
            ${message}
          </div>
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #718096; text-align: center;">
          <p>Este é um email automático, por favor não responda.</p>
          <p>&copy; ${new Date().getFullYear()} Edunéxia - Todos os direitos reservados</p>
        </div>
      </div>
    `
  });
}

/**
 * Verifica se as configurações de email estão funcionando
 * @returns Resultado do teste de configuração
 */
export async function testEmailConfiguration(): Promise<{ success: boolean; error?: any }> {
  try {
    const transportConfig = await getEmailTransportConfig();
    
    if (!transportConfig) {
      return { success: false, error: 'Configurações de email não encontradas' };
    }
    
    const transporter = nodemailer.createTransport(transportConfig);
    
    // Verifica a conexão com o servidor SMTP
    await transporter.verify();
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao verificar configuração de email:', error);
    return { success: false, error };
  }
}
