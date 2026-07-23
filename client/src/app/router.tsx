import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layout';
import { LandingPage } from '@/pages/landing/LandingPage';
import { WorkspacePage } from '@/pages/workspace/WorkspacePage';
import { PDFAnnotationPage } from '@/pages/pdf/PDFAnnotationPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace/:id" element={<WorkspacePage />} />
          <Route path="/pdf/:id" element={<PDFAnnotationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
