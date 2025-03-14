-- Table for tracking payment status with overdue days
CREATE TABLE IF NOT EXISTS "public"."payment_status" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "student_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "payment_id" UUID,
  "due_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "status" TEXT NOT NULL CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
  "days_overdue" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY ("id")
);

-- Table for tracking student access status
CREATE TABLE IF NOT EXISTS "public"."student_access" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "student_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "has_full_access" BOOLEAN NOT NULL DEFAULT true,
  "restricted_since" TIMESTAMP WITH TIME ZONE,
  "last_payment_date" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY ("id")
);

-- Table for tracking access restriction history
CREATE TABLE IF NOT EXISTS "public"."access_restriction_history" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "student_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "restriction_type" TEXT NOT NULL CHECK (restriction_type IN ('full', 'partial', 'none')),
  "reason" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY ("id")
);

-- Create RLS policies
ALTER TABLE "public"."payment_status" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."student_access" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."access_restriction_history" ENABLE ROW LEVEL SECURITY;

-- Policies for payment_status
CREATE POLICY "Admins can do anything" ON "public"."payment_status"
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Students can view their own payment status" ON "public"."payment_status"
  FOR SELECT USING (auth.uid() = student_id);

-- Policies for student_access
CREATE POLICY "Admins can do anything" ON "public"."student_access"
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Students can view their own access status" ON "public"."student_access"
  FOR SELECT USING (auth.uid() = student_id);

-- Policies for access_restriction_history
CREATE POLICY "Admins can do anything" ON "public"."access_restriction_history"
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Students can view their own restriction history" ON "public"."access_restriction_history"
  FOR SELECT USING (auth.uid() = student_id);
