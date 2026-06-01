import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './components/AuthProvider';
import { ThemeProvider } from './components/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Lazy loaded for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const HomeDefault = lazy(() => import('./pages/home/HomeDefault'));
const HomeModern = lazy(() => import('./pages/home/HomeModern'));
const HomeClassic = lazy(() => import('./pages/home/HomeClassic'));
const HomeMinimal = lazy(() => import('./pages/home/HomeMinimal'));
const HomeMagazine = lazy(() => import('./pages/home/HomeMagazine'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AcademicsPage = lazy(() => import('./pages/AcademicsPage'));
const BoardingPage = lazy(() => import('./pages/BoardingPage'));
const AdmissionsPage = lazy(() => import('./pages/AdmissionsPage'));
const StudentLifePage = lazy(() => import('./pages/StudentLifePage'));
const NewsEventsPage = lazy(() => import('./pages/NewsEventsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const StaffDirectoryPage = lazy(() => import('./pages/StaffDirectoryPage'));
const TuitionFeesPage = lazy(() => import('./pages/TuitionFeesPage'));
const ScholarshipsPage = lazy(() => import('./pages/ScholarshipsPage'));
const PoliciesPage = lazy(() => import('./pages/PoliciesPage'));
const BoardOfDirectorsPage = lazy(() => import('./pages/BoardOfDirectorsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CMSWorkspace = lazy(() => import('./pages/CMSWorkspace'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const PortalPage = lazy(() => import('./pages/PortalPage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));
const AILessonGeneratorPage = lazy(() => import('./pages/AILessonGeneratorPage'));

import { ErrorBoundary } from './components/ErrorBoundary';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-light/30">
    <div className="w-12 h-12 border-2 border-wine border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="home-default" element={<HomeDefault />} />
                <Route path="home-modern" element={<HomeModern />} />
                <Route path="home-classic" element={<HomeClassic />} />
                <Route path="home-minimal" element={<HomeMinimal />} />
                <Route path="home-magazine" element={<HomeMagazine />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="board-of-directors" element={<BoardOfDirectorsPage />} />
                <Route path="academics" element={<AcademicsPage />} />
                <Route path="boarding" element={<BoardingPage />} />
                <Route path="admissions" element={<AdmissionsPage />} />
                <Route path="student-life" element={<StudentLifePage />} />
                <Route path="news" element={<NewsEventsPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="staff-directory" element={<StaffDirectoryPage />} />
                <Route path="tuition-fees" element={<TuitionFeesPage />} />
                <Route path="scholarships" element={<ScholarshipsPage />} />
                <Route path="policies" element={<PoliciesPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="portal" element={<PortalPage />} />
                <Route path="admin-login" element={<AdminLoginPage />} />
                <Route 
                  path="ai-lesson-generator" 
                  element={<AILessonGeneratorPage />} 
                />
                <Route 
                  path="admin" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/cms" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <CMSWorkspace />
                    </ProtectedRoute>
                  } 
                />
                <Route path="documentation" element={<DocumentationPage />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
      </ErrorBoundary>
    </Router>
  );
}
