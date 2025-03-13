// Mock ServerErrorHandler component for TypeScript compilation
import React from 'react';

interface ServerErrorHandlerProps {
  error: Error;
  reset: () => void;
  module?: string;
}

const ServerErrorHandler: React.FC<ServerErrorHandlerProps> = ({ error, reset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Erro no Servidor</h1>
        <p className="mb-4 text-gray-700">
          Ocorreu um erro ao processar sua solicitação. Nossa equipe foi notificada.
        </p>
        <div className="p-3 mb-4 overflow-auto text-sm bg-gray-100 rounded">
          <code>{error.message}</code>
        </div>
        <button
          onClick={reset}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default ServerErrorHandler;
