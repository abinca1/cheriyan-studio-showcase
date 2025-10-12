import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
import { HomePage } from "@/features/home";
import { GalleryPage } from "@/features/gallery";
import { AboutPage } from "@/features/about";
import { ContactPage } from "@/features/contact";
import { LoginPage, Dashboard } from "@/features/admin";
import { NotFound } from "@/shared/components";

const AppRouter = () => (
  <AuthProvider>
    <BrowserRouter>
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

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRouter;
