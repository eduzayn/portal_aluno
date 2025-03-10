'use client'

import React, { useEffect, useState } from 'react'
import { Award, Download, Calendar, ExternalLink } from 'lucide-react'
import { getStudentProfile } from '../../../components/student/mock-data'
import { Certificate } from '../../../components/student/types'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const studentData = await getStudentProfile()
        setCertificates(studentData.certificates)
      } catch (error) {
        console.error('Error loading certificates:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meus Certificados</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map(certificate => (
          <div key={certificate.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{certificate.title}</h3>
                  <p className="text-gray-600">{certificate.courseName}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Emitido em: {new Date(certificate.issueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-between">
              <a 
                href={certificate.downloadUrl} 
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </a>
              <a 
                href={`/student/certificates/${certificate.id}`} 
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visualizar</span>
              </a>
            </div>
          </div>
        ))}
        
        {certificates.length === 0 && (
          <div className="col-span-2 rounded-lg border border-dashed p-8 text-center">
            <p className="text-gray-600">Você ainda não possui certificados.</p>
            <p className="text-sm text-gray-500 mt-2">Complete seus cursos para obter certificados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
