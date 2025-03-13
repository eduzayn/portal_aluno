# Portal do Aluno - Vercel Deployment Guide

## Prerequisites
- GitHub repository access
- Vercel account
- Supabase project credentials

## Environment Variables
The following environment variables must be configured in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://uasnyifizdjxogowijip.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODYzMjIsImV4cCI6MjA1NzE2MjMyMn0.WGkiWL6VEazfIBHHz8LguEr8pRVy5XlbZT0iQ2rdfHU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs
SUPABASE_JWT_SECRET=mxGuGt+ZgDYlM2QDPYcrcnm+kQfOkjkqpSRHQf6HXwOATKSu/lE0hqQjRmEBdUaOt0NExUE0L4kDO9SFCUL8rw==
NEXTAUTH_URL=https://portal-aluno.vercel.app
NEXTAUTH_SECRET=portal-aluno-nextauth-secret
```

## Deployment Steps

### 1. Connect GitHub Repository
1. Log in to your Vercel account
2. Click "Add New" → "Project"
3. Select the GitHub repository "eduzayn/portal_aluno"
4. Click "Import"

### 2. Configure Project
1. Select the branch to deploy (use `devin/1711166700-resolve-conflicts-pr8-11`)
2. Framework preset: Next.js
3. Root directory: ./
4. Build command: `npm run build`
5. Output directory: .next

### 3. Environment Variables
1. Click "Environment Variables" section
2. Add all the environment variables listed above
3. Make sure to mark the sensitive variables as "Production" only

### 4. Deploy
1. Click "Deploy"
2. Wait for the build and deployment to complete

### 5. Verify Deployment
1. Once deployed, Vercel will provide a URL to access your application
2. Use the `DEPLOYMENT_VERIFICATION.md` checklist to verify all functionality

## Troubleshooting
If you encounter build errors:
1. Check the build logs in Vercel
2. Verify that all environment variables are correctly set
3. Ensure that the project dependencies are properly installed

## Storage Configuration
The application uses Supabase Storage for file uploads. Make sure the following buckets exist in your Supabase project:
- `avatars`: For user profile pictures
- `documents`: For academic documents
- `course-materials`: For course-related files

## Post-Deployment Tasks
1. Run the storage policy script to set up proper access controls:
   ```
   node scripts/database/create-storage-policies.js
   ```
2. Verify that file uploads work correctly in the production environment
