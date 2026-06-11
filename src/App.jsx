import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import CalculatorsListPage from './pages/CalculatorsListPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogList from './pages/admin/AdminBlogList';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';
import AdminLogin from './pages/admin/AdminLogin';
import { AdminProvider } from './lib/AdminContext';
import { StatsProvider } from './lib/StatsContext';
import { ThemeProvider } from './lib/ThemeContext';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
      <AdminProvider>
        <StatsProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </StatsProvider>
      </AdminProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
