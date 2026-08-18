# Internal Audit Management System - Phase 1

A professional corporate **Internal Audit Management System** built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase**. This is Phase 1 implementation with full authentication, audit management, finding tracking, and KPI dashboards.

## Features

### Phase 1 Complete Implementation

✅ **Authentication**
- Email/password login with Supabase Auth
- Logout functionality
- Protected routes for authenticated users only
- Session management

✅ **Audit Management**
- Create, read, update, delete (CRUD) audits
- Search by Audit No, Title, Company, Department
- Filter by status (Planned, Ongoing, Completed, On Hold)
- Support for 9 audit types (Process, Payroll, Inventory, Voucher, Procurement, Cash, Bank, Compliance, Special Investigation)
- Track audit periods, objectives, scope, and risk levels

✅ **Finding Management**
- Create, read, update, delete (CRUD) findings within audits
- Search and filter findings by risk and status
- Automatic overdue calculation (findings with past target dates and not closed)
- Financial impact tracking in BDT currency
- Risk ratings (High, Medium, Low) with color-coded badges
- Finding statuses (Open, Management Response Pending, In Progress, Closed)

✅ **Dashboard**
- 8 KPI cards with dynamic calculations:
  - Total Audits
  - Ongoing Audits
  - Completed Audits
  - Total Findings
  - Open Findings
  - High Risk Findings
  - Total Financial Impact (BDT)
  - Overdue Findings
- Recent audits list
- Recent findings list
- All calculations performed dynamically from Supabase (no hardcoded data)

✅ **Global Findings Page**
- View all findings across all audits
- Search by Finding No, Finding Title, or Audit No
- Filter by risk rating and status
- Click to navigate to audit detail page
- Display financial impact, responsible person, and target dates

✅ **Settings Page**
- View logged-in email (read-only)
- Update full name
- Display user role

✅ **Professional UI**
- Corporate design with sidebar navigation
- Top navigation bar with user info and logout
- Responsive design (desktop-first, mobile-friendly)
- Badges for status and risk levels with color coding:
  - High Risk = Red
  - Medium Risk = Orange
  - Low Risk = Green
  - Completed = Green
  - Ongoing = Blue
  - Planned = Yellow
  - On Hold = Red
- Loading states and error handling
- Toast notifications for success/error messages

✅ **Database**
- PostgreSQL with Supabase
- 3 tables: `profiles`, `audits`, `findings`
- Foreign key relationships with cascade delete
- Row-Level Security (RLS) enabled on all tables
- Automatic profile creation on user signup via trigger
- Indexes for performance optimization

---

## Prerequisites

- **Node.js** 16+ and **npm**
- **Supabase** account (free tier available at https://supabase.com)
- **GitHub** account for version control
- **Cloudflare Pages** account for deployment (optional)

---

## Setup Instructions

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign up/login
2. Create a new project:
   - Project name: `internal-audit-system`
   - Database password: (generate a strong one)
   - Region: (choose closest to you)
3. Wait for the project to initialize (2-3 minutes)

### 2. Run Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run**
6. ✅ All tables, indexes, and RLS policies are now created

### 3. Create an Auth User (Demo)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Invite** or **Create new user**
3. Enter:
   - Email: `demo@example.com` (or any email)
   - Password: `Password123!` (create a secure password)
4. Click **Send invite** or **Create user**
5. Copy the user's **UUID** (from the users list)

### 4. Load Demo Data (Optional)

1. Get your user's UUID from Supabase Auth → Users
2. In Supabase SQL Editor, open `supabase/seed.sql`
3. Replace `YOUR_USER_UUID_HERE` with the actual UUID
4. Run the SQL
5. ✅ Demo audit and finding are now loaded

### 5. Get Supabase Credentials

1. In Supabase, go to **Settings** → **API**
2. Copy:
   - **Project URL** (this is `VITE_SUPABASE_URL`)
   - **anon public** key (this is `VITE_SUPABASE_ANON_KEY`)
3. ⚠️ **Never use the `service_role` key in frontend code**

### 6. Configure Environment Variables

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Internal-audit-management.git
   cd Internal-audit-management
   ```

2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Important:** `.env.local` is in `.gitignore` and will NOT be committed

### 7. Install Dependencies

```bash
npm install
```

### 8. Run Locally

```bash
npm run dev
```

The application will open at `http://localhost:5173`

**Login with:**
- Email: `demo@example.com` (or your created user)
- Password: (the password you set)

---

## Project Structure

```
Internal-audit-management/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Main layout with sidebar & navbar
│   │   ├── Badge.tsx           # Status/risk badges
│   │   ├── Modal.tsx           # Reusable modal dialog
│   │   ├── ProtectedRoute.tsx  # Protected route wrapper
│   │   └── Toast.tsx           # Toast notifications
│   │
│   ├── pages/
│   │   ├── Login.tsx           # Login page
│   │   ├── Dashboard.tsx       # Dashboard with KPIs
│   │   ├── Audits.tsx          # Audits list with CRUD
│   │   ├── AuditDetail.tsx     # Audit detail with findings
│   │   ├── Findings.tsx        # Global findings page
│   │   └── Settings.tsx        # User settings
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── auth.ts             # Auth hook
│   │   ├── queries.ts          # Database queries
│   │   └── types.ts            # TypeScript types
│   │
│   ├── App.tsx                 # Router setup
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind CSS imports
│
├── supabase/
│   ├── schema.sql              # Database schema & RLS
│   └── seed.sql                # Demo data
│
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
├── .env.example                # Environment template
├── .gitignore                  # Git ignore
└── README.md                   # This file
```

---

## Build for Production

```bash
npm run build
```

Output is in `dist/` directory. Ready to deploy to:
- Cloudflare Pages
- Vercel
- Netlify
- Any static hosting

---

## Deployment to Cloudflare Pages

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: Phase 1 complete"
git push origin main
```

### 2. Connect to Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Click **Create a project** → **Connect to Git**
3. Select your GitHub repository
4. Configure build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
6. Click **Deploy**

### 3. Custom Domain (Optional)

1. In Cloudflare Pages project settings
2. Go to **Custom domains**
3. Add your custom domain
4. Follow DNS setup instructions

---

## Type Checking

```bash
npm run type-check
```

---

## CRUD Operations - Verified Working

### ✅ Audits
- **Create Audit:** Click "Add Audit" → Fill form → Save
- **Read Audit:** View audit list or click eye icon → See full details with findings
- **Update Audit:** Click edit icon → Modify fields → Save
- **Delete Audit:** Click trash icon → Confirm → Audit and all findings deleted

### ✅ Findings
- **Create Finding:** Inside audit detail → Click "Add Finding" → Fill form → Save
- **Read Finding:** View in audit or on global Findings page
- **Update Finding:** Click edit icon → Modify fields → Save
- **Delete Finding:** Click trash icon → Confirm → Finding deleted

### ✅ Search & Filter
- **Audit Search:** Search by Audit No, Title, Company, Department
- **Finding Search:** Search by Finding No or Title
- **Filters:** Status, Risk Level

### ✅ Dashboard
- All KPIs calculated dynamically from Supabase
- Overdue findings auto-calculated (status != "Closed" AND target_date < today)
- Financial impact summed from all findings

### ✅ Authentication
- **Login:** Email + Password via Supabase Auth
- **Logout:** Click logout button → Redirected to login
- **Protected Routes:** Unauthenticated users cannot access pages

---

## Key Technologies

| Tool | Purpose |
|------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 3** | Styling |
| **Supabase** | Backend & database |
| **React Router 6** | Client-side routing |
| **Lucide React** | Icons |

---

## Database Schema Overview

### profiles
```sql
id (UUID, PK, refs auth.users)
full_name (TEXT)
email (TEXT)
role (TEXT, default: 'staff')
created_at (TIMESTAMPTZ)
```

### audits
```sql
id (UUID, PK)
audit_no (TEXT, UNIQUE)
title (TEXT, NOT NULL)
company, department, audit_type, auditor (TEXT)
start_date, end_date (DATE)
audit_period, objective, scope (TEXT)
risk_level, status (TEXT)
created_by (UUID, FK → auth.users)
created_at, updated_at (TIMESTAMPTZ)
```

### findings
```sql
id (UUID, PK)
audit_id (UUID, FK → audits, CASCADE DELETE)
finding_no, title (TEXT, NOT NULL)
criteria, condition_text, root_cause, risk_impact (TEXT)
financial_impact (NUMERIC)
risk_rating, recommendation, management_response (TEXT)
responsible_person (TEXT)
target_date (DATE)
status (TEXT)
created_at, updated_at (TIMESTAMPTZ)
```

---

## Row-Level Security (RLS)

All tables have RLS enabled. Policies enforce:
- **Profiles:** Users can only see/edit their own profile
- **Audits:** Authenticated users can see all audits; only audit creator can insert
- **Findings:** Authenticated users can perform full CRUD

---

## Automatic Profile Creation

When a new user is created in `auth.users`, a PostgreSQL trigger automatically creates a corresponding `profiles` row with:
- `role` = 'staff' (default)
- `full_name` = '' (empty, can be updated in Settings)
- `email` = user's email

---

## Financial Impact

- Stored as PostgreSQL `NUMERIC(15, 2)` (precise decimal)
- Displayed as **BDT** currency format with thousands separator
- Example: `BDT 242,500.50`
- Only numeric input allowed (no letters)

---

## Overdue Findings Calculation

Automatically calculated on the frontend. A finding is **OVERDUE** if:
```
status !== "Closed" AND target_date < today
```

Shows **OVERDUE** badge in red on:
- Audit Detail → Findings table
- Global Findings page

No separate database column needed.

---

## Error Handling & User Feedback

- All Supabase operations wrapped in try-catch
- User-friendly error messages in toast notifications
- Loading spinners during data fetch
- Validation on forms before submission
- Confirmation dialogs for destructive actions

---

## Phase 2 Features NOT Implemented

❌ Evidence upload (no file storage)
❌ Working Papers (no document management)
❌ Audit Checklist
❌ Follow-up tracking
❌ PDF/Word/Excel reports
❌ Excel import
❌ AI Assistant
❌ Email notifications
❌ Advanced role-based permissions
❌ Vendor management
❌ Inventory management
❌ Payroll automation
❌ Voucher automation

---

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not empty
- Restart dev server with `npm run dev`

### "Unauthorized" errors in console
- Ensure RLS policies in `schema.sql` were executed
- Check user authentication status
- Verify user has necessary permissions

### "Cannot find findings" on Audit Detail
- Ensure findings exist in Supabase `findings` table
- Check `audit_id` matches the audit being viewed
- Verify RLS policies allow SELECT on findings

### Login not working
- Verify user email/password in Supabase Auth users
- Check internet connection to Supabase
- Clear browser cookies and try again

### Build errors
```bash
npm run type-check  # Check TypeScript errors
npm install         # Reinstall dependencies
npm run build       # Try building again
```

---

## Contributing

1. Create a feature branch: `git checkout -b feature/audit-pdf`
2. Commit changes: `git commit -m "Add PDF export"`
3. Push: `git push origin feature/audit-pdf`
4. Open Pull Request

---

## License

MIT License - Feel free to use for your organization

---

## Support

For issues, questions, or feature requests, please:
1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Vite documentation: https://vitejs.dev
4. Review React Router documentation: https://reactrouter.com

---

## Production Checklist

Before deploying to production:

- [ ] Create separate Supabase project for production
- [ ] Run `schema.sql` on production database
- [ ] Create production auth users
- [ ] Update `.env` with production Supabase credentials
- [ ] Test all CRUD operations
- [ ] Set RLS policies (verify in schema.sql)
- [ ] Enable HTTPS only
- [ ] Configure CORS in Supabase (if needed)
- [ ] Set up database backups
- [ ] Review and test error handling
- [ ] Performance test dashboard with real data
- [ ] Set up monitoring/logging

---

## Next Steps (Phase 2)

Planned features for Phase 2:
- Evidence/document upload
- PDF audit reports
- Excel data export
- Working papers management
- Email notifications
- Advanced role-based access control
- Audit checklist templates
- Follow-up management
- AI-powered audit insights

---

**Created:** August 2026  
**Version:** 1.0.0 (Phase 1 Complete)  
**Status:** ✅ Production Ready
