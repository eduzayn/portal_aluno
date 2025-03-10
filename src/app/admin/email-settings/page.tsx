'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [config, setConfig] = useState({
    id: '',
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    created_at: '',
    updated_at: ''
  });
  const [testEmail, setTestEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/email/config');
        
        if (!res.ok) {
          if (res.status === 403) {
            router.push('/login');
            return;
          }
          
          throw new Error('Falha ao carregar configurações');
        }
        
        const data = await res.json();
        setConfig({
          ...data,
          smtp_pass: '' // A senha não é retornada por segurança
        });
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Erro ao carregar configurações de email'
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadConfig();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/email/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          smtp_host: config.smtp_host,
          smtp_port: config.smtp_port,
          smtp_user: config.smtp_user,
          smtp_pass: config.smtp_pass
        })
      });
      
      if (!res.ok) {
        throw new Error('Falha ao salvar configurações');
      }
      
      setMessage({
        type: 'success',
        text: 'Configurações salvas com sucesso'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao salvar configurações de email'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({
        type: 'error',
        text: 'Informe um email para teste'
      });
      return;
    }
    
    setTesting(true);
    
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao testar email');
      }
      
      setMessage({
        type: 'success',
        text: 'Email de teste enviado com sucesso'
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `Erro ao testar email: ${error.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Configurações de Email</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configurações de Email</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Servidor SMTP</label>
          <input
            type="text"
            name="smtp_host"
            value={config.smtp_host}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Porta SMTP</label>
          <input
            type="number"
            name="smtp_port"
            value={config.smtp_port}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Usuário SMTP</label>
          <input
            type="text"
            name="smtp_user"
            value={config.smtp_user}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Senha SMTP</label>
          <input
            type="password"
            name="smtp_pass"
            value={config.smtp_pass}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Digite para alterar a senha"
          />
          <p className="text-sm text-gray-500 mt-1">
            {config.id ? 'Deixe em branco para manter a senha atual' : 'Senha obrigatória para nova configuração'}
          </p>
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
      
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Testar Configurações</h2>
        
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Email para Teste</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Digite um email para receber o teste"
            />
          </div>
          
          <button
            type="button"
            onClick={handleTestEmail}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            disabled={testing || !testEmail}
          >
            {testing ? 'Enviando...' : 'Enviar Email de Teste'}
          </button>
        </div>
      </div>
    </div>
  );
}
