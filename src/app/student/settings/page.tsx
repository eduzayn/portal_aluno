'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Bell, 
  Sun, 
  Moon, 
  Lock, 
  Settings, 
  Globe, 
  Server, 
  Database, 
  HardDrive,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Users,
  Sliders
} from 'lucide-react';

interface SettingsOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('system');
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [notificationSettings, setNotificationSettings] = useState<SettingsOption[]>([
    {
      id: 'email_notifications',
      title: 'Notificações por e-mail',
      description: 'Receba notificações importantes por e-mail',
      enabled: true,
    },
    {
      id: 'course_updates',
      title: 'Atualizações de cursos',
      description: 'Seja notificado quando houver novos conteúdos nos seus cursos',
      enabled: true,
    },
    {
      id: 'grade_notifications',
      title: 'Notas e avaliações',
      description: 'Receba alertas quando suas notas forem publicadas',
      enabled: true,
    },
    {
      id: 'system_announcements',
      title: 'Anúncios do sistema',
      description: 'Receba informações sobre manutenções e atualizações da plataforma',
      enabled: false,
    },
  ]);

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'pt-BR',
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [systemSettingsSuccess, setSystemSettingsSuccess] = useState<string | null>(null);

  // Admin-specific state
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    allowRegistration: true,
    maxUploadSize: 10,
    sessionTimeout: 30,
  });

  // System monitoring data
  const [systemMonitoring, setSystemMonitoring] = useState({
    cpuUsage: 23,
    memoryUsage: 67,
    storageUsage: 42,
  });

  const toggleNotificationSetting = (id: string) => {
    setNotificationSettings(
      notificationSettings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleThemeChange = (theme: string) => {
    setAppearanceSettings({ ...appearanceSettings, theme });
  };

  const handleLanguageChange = (language: string) => {
    setAppearanceSettings({ ...appearanceSettings, language });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Validate password
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('A nova senha deve ter pelo menos 8 caracteres');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    // Simulate password change success
    setPasswordSuccess('Senha alterada com sucesso!');
    
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleSystemSettingChange = (setting: string, value: any) => {
    setSystemSettings({
      ...systemSettings,
      [setting]: value,
    });
  };

  const handleSaveSystemSettings = () => {
    // In a real implementation, this would make an API call to save the settings
    console.log('Saving system settings:', systemSettings);
    
    // Show success message
    setSystemSettingsSuccess('Configurações do sistema salvas com sucesso!');
    
    // Clear success message after 3 seconds
    setTimeout(() => setSystemSettingsSuccess(null), 3000);
  };

  // If user is not admin, show access denied message
  if (user && user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Acesso Restrito</h3>
              <p className="text-sm text-red-700">Esta página é restrita a administradores do sistema.</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <button
            onClick={() => router.push('/student/user-settings')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ir para Configurações do Usuário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-600">Gerencie as configurações gerais do portal e integrações</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'system'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('system')}
          >
            <Server className="inline-block w-4 h-4 mr-2" />
            Sistema
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="inline-block w-4 h-4 mr-2" />
            Notificações
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'appearance'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('appearance')}
          >
            <Sun className="inline-block w-4 h-4 mr-2" />
            Aparência
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'security'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <Lock className="inline-block w-4 h-4 mr-2" />
            Segurança
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'system' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações do Sistema</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Modo de Operação</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Modo de Manutenção</p>
                        <p className="text-xs text-gray-500">Ativa o modo de manutenção para todos os usuários</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={systemSettings.maintenanceMode}
                          onChange={(e) => handleSystemSettingChange('maintenanceMode', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Modo de Depuração</p>
                        <p className="text-xs text-gray-500">Ativa logs detalhados e informações de depuração</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={systemSettings.debugMode}
                          onChange={(e) => handleSystemSettingChange('debugMode', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Configurações de Usuários</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Permitir Registros</p>
                        <p className="text-xs text-gray-500">Permite que novos usuários se registrem na plataforma</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={systemSettings.allowRegistration}
                          onChange={(e) => handleSystemSettingChange('allowRegistration', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tempo Limite da Sessão (minutos)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="5"
                          max="120"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={systemSettings.sessionTimeout}
                          onChange={(e) => handleSystemSettingChange('sessionTimeout', parseInt(e.target.value) || 30)}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Tempo em minutos antes que a sessão do usuário expire</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Configurações de Arquivos</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tamanho Máximo de Upload (MB)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={systemSettings.maxUploadSize}
                          onChange={(e) => handleSystemSettingChange('maxUploadSize', parseInt(e.target.value) || 10)}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Tamanho máximo de arquivos que podem ser enviados (em MB)</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Monitoramento do Sistema</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700">Uso de CPU</p>
                          <p className="text-sm font-medium text-gray-700">23%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700">Uso de Memória</p>
                          <p className="text-sm font-medium text-gray-700">67%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700">Uso de Armazenamento</p>
                          <p className="text-sm font-medium text-gray-700">42%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleSaveSystemSettings}
                  >
                    Salvar Configurações
                  </button>
                </div>
                
                {systemSettingsSuccess && (
                  <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    {systemSettingsSuccess}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Preferências de notificação</h2>
              <div className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{setting.title}</h3>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.enabled}
                        onChange={() => toggleNotificationSetting(setting.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Aparência e idioma</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tema</h3>
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-md flex items-center ${
                      appearanceSettings.theme === 'light'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Claro
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md flex items-center ${
                      appearanceSettings.theme === 'dark'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Escuro
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md flex items-center ${
                      appearanceSettings.theme === 'system'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Sistema
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Idioma</h3>
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-md flex items-center ${
                      appearanceSettings.language === 'pt-BR'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                    onClick={() => handleLanguageChange('pt-BR')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Português (BR)
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md flex items-center ${
                      appearanceSettings.language === 'en'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    English
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Segurança da conta</h2>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha atual
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPassword.current ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Nova senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      A senha deve ter pelo menos 8 caracteres
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar nova senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {passwordError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                      {passwordSuccess}
                    </div>
                  )}
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Alterar senha
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
