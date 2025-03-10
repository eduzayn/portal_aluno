'use client'

import React from 'react'
import { CreditCard, Receipt, Calendar, FileText, AlertCircle } from 'lucide-react'

export default function FinancialPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Financeiro</h1>
      
      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Mensalidade</h2>
          </div>
          <p className="text-3xl font-bold">R$ 299,90</p>
          <p className="text-sm text-gray-600">Próximo vencimento: 15/03/2025</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Pagamentos</h2>
          </div>
          <p className="text-3xl font-bold">3/12</p>
          <p className="text-sm text-gray-600">Parcelas pagas</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Situação</h2>
          </div>
          <p className="text-xl font-medium text-green-600">Regular</p>
          <p className="text-sm text-gray-600">Todos os pagamentos em dia</p>
        </div>
      </div>
      
      {/* Histórico de pagamentos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Histórico de Pagamentos</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Descrição</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Data</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Valor</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm">Mensalidade - Março/2025</td>
                  <td className="px-6 py-4 text-sm">05/03/2025</td>
                  <td className="px-6 py-4 text-sm">R$ 299,90</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-primary hover:underline flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm">Mensalidade - Fevereiro/2025</td>
                  <td className="px-6 py-4 text-sm">10/02/2025</td>
                  <td className="px-6 py-4 text-sm">R$ 299,90</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-primary hover:underline flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm">Mensalidade - Janeiro/2025</td>
                  <td className="px-6 py-4 text-sm">15/01/2025</td>
                  <td className="px-6 py-4 text-sm">R$ 299,90</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-primary hover:underline flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Próximos pagamentos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Próximos Pagamentos</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Descrição</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Vencimento</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Valor</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm">Mensalidade - Abril/2025</td>
                  <td className="px-6 py-4 text-sm">15/04/2025</td>
                  <td className="px-6 py-4 text-sm">R$ 299,90</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="btn-primary text-xs py-1 px-3">
                      Pagar agora
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm">Mensalidade - Maio/2025</td>
                  <td className="px-6 py-4 text-sm">15/05/2025</td>
                  <td className="px-6 py-4 text-sm">R$ 299,90</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Futuro</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="btn-outline text-xs py-1 px-3" disabled>
                      Aguardando
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
