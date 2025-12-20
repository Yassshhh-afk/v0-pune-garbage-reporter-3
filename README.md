# Pune Garbage Reporter

A full-stack civic engagement web application that empowers citizens to report garbage and sanitation issues in Pune, India. Built with modern web technologies, this platform enables real-time tracking, community collaboration, and direct communication with municipal ward offices.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://pune-garbage-reporter.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-black?style=for-the-badge&logo=supabase)](https://supabase.com)

## Live Demo

**[https://pune-garbage-reporter.vercel.app](https://pune-garbage-reporter.vercel.app)**

## Features

### Core Functionality
- **Instant Garbage Reporting** - Pin exact locations on Google Maps, upload photos, and submit detailed reports
- **Automatic Ward Detection** - System automatically identifies the nearest ward office and routes reports to the correct authority
- **Live Map Tracking** - Interactive map displays all reported issues with real-time status updates
- **Intelligent Search** - Search for specific locations and instantly view report details

### Community Engagement
- **User Reviews & Ratings** - Community members can rate cleanup efforts (1-5 stars) and leave feedback
- **Google Maps-Style Ratings** - Visual star ratings with average scores and total review counts
- **User Profiles** - Create accounts with unique usernames displayed on all reviews and comments
- **Social Sharing** - Share reports directly to WhatsApp, Twitter, or copy links with rich preview metadata

### Real-Time Features
- **WebSocket Sync** - Live updates across all users when reports, comments, or status changes occur
- **Status Management** - Ward officials update cleanup progress (Pending → In Progress → Resolved)
- **Comment System** - Real-time discussions on reports with username attribution

### Admin Dashboard
- **Role-Based Access** - Secure admin panel for municipal officials
- **Report Management** - View, update, and track all reported issues
- **Ward Information** - Access contact details and performance metrics
- **Analytics** - Monitor cleanup statistics and community engagement

### Performance & Optimization
- **Image Compression** - Automatic client-side photo compression reducing storage by 70%
- **Server-Side Rendering** - Fast initial page loads with Next.js App Router
- **Responsive Design** - Mobile-first UI that works seamlessly across all devices
- **Modern Preloaders** - Smooth loading experiences with optimized UX

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and Server Components
- **React 19.2** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with modern design tokens
- **shadcn/ui** - High-quality, accessible UI components

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Server Actions** - Type-safe server functions
- **Node.js** - Runtime environment

### Database & Real-time
- **Supabase PostgreSQL** - Primary database with Row Level Security (RLS)
- **Supabase Realtime** - WebSocket subscriptions for live updates
- **Supabase Auth** - Secure authentication with session management

### External APIs
- **Google Maps JavaScript API** - Interactive map rendering
- **Google Geocoding API** - Address and coordinate conversion
- **Google Places API** - Location search and autocomplete

### Additional Tools
- **SWR** - Data fetching and client-side caching
- **React Hook Form** - Form validation and management
- **Zod** - Schema validation
- **Lucide React** - Icon library

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Supabase account
- Google Cloud Platform account with Maps API enabled

### 1. Clone the Repository
```bash
git clone https://github.com/Yassshhh-afk/pune-garbage-reporter.git
cd pune-garbage-reporter
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Supabase Database
SUPABASE_POSTGRES_URL=your_postgres_connection_string
SUPABASE_POSTGRES_PRISMA_URL=your_prisma_connection_string
SUPABASE_POSTGRES_URL_NON_POOLING=your_non_pooling_connection_string
SUPABASE_POSTGRES_USER=your_database_user
SUPABASE_POSTGRES_PASSWORD=your_database_password
SUPABASE_POSTGRES_DATABASE=your_database_name
SUPABASE_POSTGRES_HOST=your_database_host
SUPABASE_JWT_SECRET=your_jwt_secret

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Deployment URL
NEXT_PUBLIC_DEPLOYED_URL=https://pune-garbage-reporter.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 4. Set Up Database
Run the SQL scripts in order from the `scripts/` folder in your Supabase SQL editor:

```bash
scripts/001_create_garbage_reports_table.sql
scripts/002_seed_sample_data.sql
scripts/003_update_rls_for_admins.sql
scripts/009_add_user_profiles.sql
scripts/010_add_username_to_comments.sql
```

### 5. Configure Supabase Realtime
Enable Realtime for the following tables in your Supabase dashboard:
- `garbage_reports`
- `comments`
- `status_updates`

### 6. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables from `.env.local`
4. Deploy

The easiest way to deploy is using the Vercel Platform:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Yassshhh-afk/v0-pune-garbage-reporter-3)

## Usage

### For Citizens

1. **Report Garbage**
   - Navigate to `/report`
   - Pin location on the map or search for an address
   - Upload a photo of the issue
   - Add description and submit

2. **Track Reports**
   - View all reports on `/map`
   - Search for specific locations
   - Click on markers to see details
   - Add ratings and comments

3. **Sign Up**
   - Create an account with username, email, and password
   - Sign in to leave reviews and track your reports

### For Municipal Officials

1. **Admin Access**
   - Sign in at `/admin` with authorized credentials
   - View dashboard with all reports

2. **Manage Reports**
   - Update status (Pending → In Progress → Resolved)
   - Add status update descriptions
   - View community feedback and ratings

## 🗂️ Project Structure

```
├── app/                      # Next.js App Router
│   ├── actions/             # Server actions
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   ├── auth/                # Authentication pages
│   ├── map/                 # Map page with dynamic routes
│   ├── report/              # Report submission page
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── auth-modal.tsx       # Authentication modal
│   ├── comment-section.tsx  # Comments and reviews
│   ├── garbage-map.tsx      # Main map component
│   └── report-form.tsx      # Report submission form
├── lib/                     # Utilities and helpers
│   ├── supabase/            # Supabase client and queries
│   └── utils/               # Helper functions
├── scripts/                 # Database migration scripts
└── public/                  # Static assets
```

## Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Server-Side Authentication** - Secure session management
- **Protected Routes** - Middleware-based route protection
- **Input Validation** - Zod schema validation
- **XSS Protection** - Sanitized user inputs
- **CORS Configuration** - Controlled API access

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Developer

**Yash Kondane**
- Email: kondanayash@gmail.com
- GitHub: [@Yashkondane](https://github.com/yashkondane)
- Project Link: [https://pune-garbage-reporter.vercel.app](https://pune-garbage-reporter.vercel.app)

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Hosted on [Vercel](https://vercel.com)
- Database and auth by [Supabase](https://supabase.com)

## 📊 Project Status

This project is actively maintained and deployed at [https://pune-garbage-reporter.vercel.app](https://pune-garbage-reporter.vercel.app).

---

Made with ❤️ for the citizens of Pune, India
