# Portal do Aluno - Vercel Deployment Instructions

## Prerequisites
- GitHub repository: [eduzayn/portal_aluno](https://github.com/eduzayn/portal_aluno)
- Vercel account with access to deploy

## Deployment Steps

### 1. Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select the GitHub repository "eduzayn/portal_aluno"
4. Configure project settings

### 2. Configure Environment Variables
Add the following environment variables in the Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://uasnyifizdjxogowijip.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODYzMjIsImV4cCI6MjA1NzE2MjMyMn0.WGkiWL6VEazfIBHHz8LguEr8pRVy5XlbZT0iQ2rdfHU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs
SUPABASE_JWT_SECRET=mxGuGt+ZgDYlM2QDPYcrcnm+kQfOkjkqpSRHQf6HXwOATKSu/lE0hqQjRmEBdUaOt0NExUE0L4kDO9SFCUL8rw==
NEXTAUTH_URL=https://portal-aluno.vercel.app
NEXTAUTH_SECRET=portal-aluno-nextauth-secret
```

### 3. Deploy
1. Click "Deploy" in the Vercel dashboard
2. Vercel will build and deploy the project automatically

### 4. Verify Deployment
1. Once deployment is complete, visit the provided URL
2. Test the following functionality:
   - Login and authentication
   - Student profile and avatar upload
   - Course listing and details
   - Credential generation and validation
   - Document access and download

## Troubleshooting

If you encounter any issues during deployment:

1. Check build logs in Vercel dashboard for errors
2. Verify all environment variables are correctly set
3. Ensure all dependencies are properly installed
4. Check that Supabase connection is working correctly

## Notes on Resolved Issues

- Fixed client component issues by adding "use client" directives
- Resolved type errors in AcademicDocument interface
- Fixed NextAuth route configuration
- Temporarily simplified locale handling to ensure build success
- Successfully built project locally with `npm run build`
