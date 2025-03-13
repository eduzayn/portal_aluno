-- Create student_credentials table
CREATE TABLE IF NOT EXISTS public.student_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT,
  qr_code_data TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create academic_documents table
CREATE TABLE IF NOT EXISTS public.academic_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('grade_history', 'enrollment_declaration', 'course_completion')),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for student_credentials
ALTER TABLE public.student_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own credentials"
  ON public.student_credentials
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own credentials"
  ON public.student_credentials
  FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own credentials"
  ON public.student_credentials
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Add RLS policies for academic_documents
ALTER TABLE public.academic_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own documents"
  ON public.academic_documents
  FOR SELECT
  USING (auth.uid() = student_id);

-- Create function to check if a student is eligible for a credential
CREATE OR REPLACE FUNCTION public.check_credential_eligibility(student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_complete BOOLEAN;
  has_payments BOOLEAN;
BEGIN
  -- Check if profile is complete
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = student_id
    AND full_name IS NOT NULL
    AND email IS NOT NULL
    AND phone IS NOT NULL
    AND address IS NOT NULL
    AND document_number IS NOT NULL
  ) INTO profile_complete;
  
  -- Check if student has at least one confirmed payment
  SELECT EXISTS (
    SELECT 1 FROM public.payments
    WHERE student_id = $1
    AND status = 'confirmed'
    LIMIT 1
  ) INTO has_payments;
  
  RETURN profile_complete AND has_payments;
END;
$$;

-- Create function to validate a credential by QR code
CREATE OR REPLACE FUNCTION public.validate_credential_by_qrcode(qr_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  credential_record RECORD;
  student_record RECORD;
  result JSONB;
BEGIN
  -- Find credential with the QR code
  SELECT * FROM public.student_credentials
  WHERE qr_code_data = qr_code
  INTO credential_record;
  
  -- If no credential found
  IF credential_record IS NULL THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Credencial não encontrada'
    );
  END IF;
  
  -- If credential is not active
  IF credential_record.status != 'active' THEN
    RETURN jsonb_build_object(
      'valid', false,
      'status', credential_record.status,
      'message', 'Esta credencial não está mais ativa'
    );
  END IF;
  
  -- If credential is expired
  IF credential_record.expiry_date IS NOT NULL AND credential_record.expiry_date < now() THEN
    RETURN jsonb_build_object(
      'valid', false,
      'status', 'expired',
      'message', 'Esta credencial está expirada'
    );
  END IF;
  
  -- Get student information
  SELECT * FROM auth.users
  WHERE id = credential_record.student_id
  INTO student_record;
  
  -- Return valid credential with student info
  RETURN jsonb_build_object(
    'valid', true,
    'student', jsonb_build_object(
      'id', student_record.id,
      'name', student_record.raw_user_meta_data->>'name',
      'email', student_record.email
    ),
    'issueDate', credential_record.issue_date,
    'expiryDate', credential_record.expiry_date
  );
END;
$$;
