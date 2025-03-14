export interface PaymentStatus {
  id: string;
  student_id: string;
  payment_id?: string;
  due_date: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  days_overdue: number;
  created_at: string;
  updated_at: string;
}

export interface StudentAccess {
  id: string;
  student_id: string;
  has_full_access: boolean;
  restricted_since?: string;
  last_payment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AccessRestrictionHistory {
  id: string;
  student_id: string;
  restriction_type: 'full' | 'partial' | 'none';
  reason: string;
  created_at: string;
}

export enum AccessLevel {
  FULL = 'full',
  FINANCIAL_DOCUMENTS = 'financial_documents',
  NONE = 'none'
}
