import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './components/AuthProvider';
import { ThemeProvider } from './components/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assume that the error is because of a new deploy and the user has a stale index.html
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }
      // The page has already been reloaded, assuming a different error
      throw error;
    }
  });

// Pages - Lazy loaded for performance
const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const HomeDefault = lazyWithRetry(() => import('./pages/home/HomeDefault'));
const HomeModern = lazyWithRetry(() => import('./pages/home/HomeModern'));
const HomeClassic = lazyWithRetry(() => import('./pages/home/HomeClassic'));
const HomeMinimal = lazyWithRetry(() => import('./pages/home/HomeMinimal'));
const HomeMagazine = lazyWithRetry(() => import('./pages/home/HomeMagazine'));
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const AcademicsPage = lazyWithRetry(() => import('./pages/AcademicsPage'));
const BoardingPage = lazyWithRetry(() => import('./pages/BoardingPage'));
const AdmissionsPage = lazyWithRetry(() => import('./pages/AdmissionsPage'));
const StudentLifePage = lazyWithRetry(() => import('./pages/StudentLifePage'));
const NewsEventsPage = lazyWithRetry(() => import('./pages/NewsEventsPage'));
const GalleryPage = lazyWithRetry(() => import('./pages/GalleryPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const StaffDirectoryPage = lazyWithRetry(() => import('./pages/StaffDirectoryPage'));
const TuitionFeesPage = lazyWithRetry(() => import('./pages/TuitionFeesPage'));
const ScholarshipsPage = lazyWithRetry(() => import('./pages/ScholarshipsPage'));
const PoliciesPage = lazyWithRetry(() => import('./pages/PoliciesPage'));
const BoardOfDirectorsPage = lazyWithRetry(() => import('./pages/BoardOfDirectorsPage'));
const AdminDashboard = lazyWithRetry(() => import('./pages/AdminDashboard'));
const CMSWorkspace = lazyWithRetry(() => import('./pages/CMSWorkspace'));
const AdminLoginPage = lazyWithRetry(() => import('./pages/AdminLoginPage'));
const PortalPage = lazyWithRetry(() => import('./pages/PortalPage'));
const DocumentationPage = lazyWithRetry(() => import('./pages/DocumentationPage'));
const AILessonGeneratorPage = lazyWithRetry(() => import('./pages/AILessonGeneratorPage'));

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
