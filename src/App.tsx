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
import type { NtflyUser } from '@/types/global.d';

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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

// RequireAdmin wrapper
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  
  if (!user || user.role !== 'admin') {
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="/admin/*" element={
              <RequireAuth>
                <RequireAdmin>
                  <Dashboard />
                </RequireAdmin>
              </RequireAuth>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
