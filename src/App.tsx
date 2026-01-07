/**
 * الملف الرئيسي لتطبيق Ntfly
 * يدير التوجيه والمصادقة والسياق العام
 */

import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { safeInitializeFirebase } from '@/firebase';
import { onAuthStateChanged, getCurrentUser } from '@/firebase/firebase.auth';
import { LoadingPlaceholder } from '@/components/LoadingPlaceholder';
import { SiteFooter } from '@/components/SiteFooter';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { NtflyUser } from '@/types/global.d';

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import AdminPanel from "./pages/AdminPanel";
import PreviewPage from "./pages/PreviewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// البريد الإلكتروني الثابت للأدمن
const ADMIN_EMAIL = 'lrsoufyane2007@gmail.com';

// RequireAuth wrapper
function RequireAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NtflyUser | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return <LoadingPlaceholder message="جارٍ التحقق من الجلسة..." fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// RequireAdmin wrapper - يتحقق من البريد الثابت
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NtflyUser | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return <LoadingPlaceholder message="جارٍ التحقق من الصلاحيات..." fullScreen />;
  }

  // التحقق من البريد الإلكتروني الثابت للأدمن
  if (!user || (user.email !== ADMIN_EMAIL && user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Set RTL direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    // تطبيق الثيم المحفوظ
    const savedTheme = localStorage.getItem('ntfly_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    // Initialize Firebase/Mock
    safeInitializeFirebase().then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return <LoadingPlaceholder message="جارٍ تهيئة التطبيق..." fullScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            {/* زر تبديل الثيم */}
            <div className="fixed top-4 left-4 z-50">
              <ThemeToggle />
            </div>
            
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } />
                <Route path="/create" element={
                  <RequireAuth>
                    <CreateProject />
                  </RequireAuth>
                } />
                <Route path="/preview/:projectId" element={
                  <RequireAuth>
                    <PreviewPage />
                  </RequireAuth>
                } />
                <Route path="/admin" element={
                  <RequireAuth>
                    <RequireAdmin>
                      <AdminPanel />
                    </RequireAdmin>
                  </RequireAuth>
                } />
                <Route path="/admin/*" element={
                  <RequireAuth>
                    <RequireAdmin>
                      <AdminPanel />
                    </RequireAdmin>
                  </RequireAuth>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            
            <SiteFooter />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
