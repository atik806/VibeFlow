# Supabase Migration Guide

## Issue
Requests submitted by users are not visible in their dashboard because the `project_requests` table is missing the `user_id` column and proper RLS policies.

## Solution

### Option 1: Quick Fix (Recommended for existing databases)

If you already have the `project_requests` table with data, run the migration script:

1. Go to your Supabase dashboard
2. Open **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase-migration-add-user-id.sql`
5. Click **Run**

This will:
- Add the `user_id` column to the table
- Update RLS policies to allow users to see only their own requests
- Keep all existing data intact

### Option 2: Full Schema Reset (For fresh databases)

If you're starting fresh or want to reset everything:

1. Go to your Supabase dashboard
2. Open **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run**

This will create all tables with proper structure and RLS policies.

## What Changed

### Before
- `project_requests` table had no `user_id` column
- RLS policy allowed all authenticated users to read all requests
- Users couldn't see their own requests in the dashboard

### After
- `project_requests` table now has `user_id` column linked to `auth.users`
- RLS policies updated to:
  - Allow users to read only their own requests
  - Allow anonymous submissions (where `user_id IS NULL`)
  - Allow users to update their own requests

## Testing

After running the migration:

1. Go to http://localhost:5173/dashboard
2. Submit a new request
3. The request should appear in "Recent Requests" section
4. Refresh the page - request should still be visible

## Troubleshooting

### Error: "relation 'requests' already exists"
- This means the table already exists
- Use the migration script instead of the full schema

### Error: "column 'user_id' already exists"
- The migration has already been applied
- No action needed

### Requests still not showing
- Check browser console (F12) for errors
- Verify your Supabase credentials in `.env`
- Make sure you're logged in with the correct user account
