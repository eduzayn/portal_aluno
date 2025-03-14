# Payment Access Control System

This document describes the payment access control system implemented in the Portal do Aluno, which provides a 30-day grace period for overdue payments.

## Overview

The payment access control system restricts access to educational content when a student has payments overdue by more than 30 days. During this grace period, students maintain full access to all features. After the grace period expires, students can still access financial and document areas but are restricted from educational content until payments are regularized.

## Database Structure

The system uses three main tables:

### 1. payment_status

Tracks individual payment status and overdue days:

```sql
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
```

### 2. student_access

Tracks overall student access status:

```sql
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
```

### 3. access_restriction_history

Logs access restriction events:

```sql
CREATE TABLE IF NOT EXISTS "public"."access_restriction_history" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "student_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "restriction_type" TEXT NOT NULL CHECK (restriction_type IN ('full', 'partial', 'none')),
  "reason" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY ("id")
);
```

## Integration with Enrollment Module

The system integrates with the enrollment module through a webhook endpoint that receives payment events:

- `payment.created`: Records new payments
- `payment.approved`: Updates payment status to paid
- `payment.overdue`: Updates payment status to overdue and calculates days overdue

The webhook endpoint is located at `/api/webhooks/enrollment` and requires a webhook secret for authentication.

## Cron Job

A cron job at `/api/cron/update-payment-status` updates the days_overdue for all overdue payments and updates student access status when payments cross the 30-day threshold. The cron job requires an API key for authentication.

## Access Control Flow

1. The middleware checks if the requested path is for educational content
2. If so, it checks the student's access status in the student_access table
3. If the student has full access, the request proceeds normally
4. If the student has restricted access, they are redirected to the restricted access page

## Restricted Access Page

The restricted access page informs students that their access is restricted due to overdue payments and provides links to the financial and document areas.

## Testing

Two test scripts are provided to test the integration:

- `scripts/test-webhook.js`: Tests the webhook endpoint with sample payment events
- `scripts/test-cron.js`: Tests the cron job endpoint

## Implementation Details

### Payment Access Service

The payment access service (`src/services/payment-access-service.ts`) provides methods for:

- Checking if a student has access to specific content
- Getting the current access level for a student
- Updating student access based on payment status

### Access Levels

The system defines three access levels:

- `FULL`: Access to all features
- `FINANCIAL_DOCUMENTS`: Access to financial and document areas only
- `NONE`: No access (not currently used)

### Authentication Context

The authentication context (`src/contexts/AuthContext.tsx`) includes the student's access level and provides a method for checking content access.

## Configuration

The system uses the following environment variables:

- `ENROLLMENT_WEBHOOK_SECRET`: Secret for authenticating webhook requests
- `CRON_API_KEY`: API key for authenticating cron job requests
