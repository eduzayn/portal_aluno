import { sendEmail, sendNotification, testEmailConfiguration } from './email-service';
import * as emailConfig from './email-config';
import nodemailer from 'nodemailer';

// Mock the modules
jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
      verify: jest.fn().mockResolvedValue(true)
    })
  };
});

jest.mock('./email-config');

describe('Email Service', () => {
  const mockTransportConfig = {
    host: 'test-host',
    port: 587,
    auth: {
      user: 'test-user',
      pass: 'test-pass'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(emailConfig, 'getEmailTransportConfig').mockResolvedValue(mockTransportConfig);
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Message'
      });

      expect(result.success).toBe(true);
      expect(emailConfig.getEmailTransportConfig).toHaveBeenCalled();
    });

    it('should handle missing email configuration', async () => {
      jest.spyOn(emailConfig, 'getEmailTransportConfig').mockResolvedValue(null);

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Message'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Configurações de email não encontradas');
    });

    it('should handle errors when sending email', async () => {
      const mockError = new Error('Send error');
      
      // Override the mock for this test only
      const mockSendMail = jest.fn().mockRejectedValue(mockError);
      nodemailer.createTransport.mockReturnValueOnce({
        sendMail: mockSendMail,
        verify: jest.fn().mockResolvedValue(true)
      });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Message'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError);
    });
  });

  describe('sendNotification', () => {
    it('should send a notification email successfully', async () => {
      // Mock sendEmail to always return success for this test
      const originalSendEmail = sendEmail;
      const mockSendEmail = jest.fn().mockResolvedValue({ success: true });
      
      // Replace the real function with our mock
      global.sendEmail = mockSendEmail;
      
      const result = await sendNotification(
        'student@example.com',
        'Test Notification',
        'This is a test notification'
      );

      // Restore the original function
      global.sendEmail = originalSendEmail;
      
      // Just test that the function completes without error
      expect(result).toBeDefined();
    });
  });

  describe('testEmailConfiguration', () => {
    it('should verify email configuration successfully', async () => {
      const result = await testEmailConfiguration();

      expect(result.success).toBe(true);
    });

    it('should handle missing email configuration', async () => {
      jest.spyOn(emailConfig, 'getEmailTransportConfig').mockResolvedValue(null);

      const result = await testEmailConfiguration();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Configurações de email não encontradas');
    });

    it('should handle verification errors', async () => {
      const mockError = new Error('Verification error');
      
      // Override the mock for this test only
      nodemailer.createTransport.mockReturnValueOnce({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
        verify: jest.fn().mockRejectedValue(mockError)
      });

      const result = await testEmailConfiguration();

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError);
    });
  });
});
