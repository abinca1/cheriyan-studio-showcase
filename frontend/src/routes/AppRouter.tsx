import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context";
import { ProtectedRoute, NotFound, ScrollToTop } from "@/components/common";
import {
  HomePage,
  GalleryPage,
  AboutPage,
  ContactPage,
  LoginPage,
  Dashboard,
} from "@/pages";

const AppRouter = () => (
  <AuthProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRouter;
