# Kingsfold International Academy - Web Portal

A high-performance, responsive web application for Kingsfold International Academy, built with React, TypeScript, and Tailwind CSS. The application features a custom Express backend for handling student registrations via secure email notifications.

## 🏛️ Project Overview
This portal serves as the primary digital touchpoint for prospective students, parents, and faculty. It emphasizes academic excellence, holistic development, and efficient administrative processes.

## 🚀 Tech Stack
- **Frontend:** React 18, Vite, Framer Motion (animations), Lucide React (icons), Tailwind CSS (styling).
- **Backend:** Node.js, Express (API routing), Nodemailer (email automation).
- **Build System:** TypeScript (strict mode), Esbuild (server bundling).

## 📁 Directory Structure
- `/src` - React frontend source code.
  - `/components` - Reusable UI components (Navbar, Footer, SEO, etc.).
  - `/pages` - Individual page views (Home, About, Admissions, etc.).
  - `/lib` - Utility functions and shared logic.
- `/public` - Static assets (logos, favicon).
- `server.ts` - Express entry point and API route handlers.
- `metadata.json` - Application metadata and permissions.

## 🛠️ Key Features
- **Dynamic Hero Section:** Smooth transitions and high-resolution imagery showcasing campus life.
- **Modern Admission Portal:** A multi-step registration flow with real-time validation and backend email synchronization.
- **AI Lesson Planner:** An intelligent tool for faculty to generate curriculum-aligned lesson plans and session notes using the Gemini 1.5 Flash model.
- **Faculty Directory:** Searchable and filterable directory of academic staff with polished UI cards.
- **SEO Optimization:** Custom SEO component for metadata management across all pages.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewports.

## 📧 Email Configuration (SMTP)
The student registration system requires SMTP environment variables to function. Ensure these are set in your deployment environment:

```env
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM_EMAIL=admission-system@example.com
```

Registration data is automatically directed to: `taican4real@gmail.com`.

## 📜 Development & Deployment
### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

The build process bundles the frontend static files and compiles the backend into `dist/server.cjs` for standalone execution.
