import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await resetPassword(email);
    
    setLoading(false);
    
    if (result.success) {
      setMessage('Enviamos um email com instruções para redefinir sua senha.');
    } else {
      setError(result.error || 'Falha ao enviar email de recuperação');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Recuperar Senha</h1>
        <p className="mt-2 text-gray-600">Enviaremos um link para redefinir sua senha</p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {message && (
        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm gradient-blue-pink hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Lembrou sua senha?{' '}
          <Link href="/login" className="text-primary hover:text-primary-dark">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
