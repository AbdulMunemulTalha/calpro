import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';

// Lazy load all non-critical pages — reduces initial bundle by ~60%
const CalculatorPage     = lazy(() => import('./pages/CalculatorPage'));
const CalculatorsListPage = lazy(() => import('./pages/CalculatorsListPage'));
const BlogPage           = lazy(() => import('./pages/BlogPage'));
const BlogPostPage       = lazy(() => import('./pages/BlogPostPage'));
const PricingPage        = lazy(() => import('./pages/PricingPage'));
const AboutPage   = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage   = lazy(() => import('./pages/TermsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogList from './pages/admin/AdminBlogList';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';
import AdminLogin from './pages/admin/AdminLogin';
import { AdminProvider } from './lib/AdminContext';
import { StatsProvider } from './lib/StatsContext';
import { ThemeProvider } from './lib/ThemeContext';
import CookieConsent from './components/ui/CookieConsent';
import { initGA4 } from './lib/analytics';

export default function App() {
  // Initialize GA4 on app load
  React.useEffect(() => { initGA4(); }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
      <AdminProvider>
        <StatsProvider>
          <BrowserRouter>
            <CookieConsent />
            <Suspense fallback={
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Loading...</p>
                </div>
              </div>
            }>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="calculators" element={<CalculatorsListPage />} />
                <Route path="calculators/:slug" element={<CalculatorPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:slug" element={<BlogPostPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="blog" element={<AdminBlogList />} />
                <Route path="blog/new" element={<AdminBlogEditor />} />
                <Route path="blog/edit/:id" element={<AdminBlogEditor />} />
              </Route>
            </Routes>
            </Suspense>
          </BrowserRouter>
        </StatsProvider>
      </AdminProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
