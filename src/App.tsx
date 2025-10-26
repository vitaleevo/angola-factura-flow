import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { ModuleGuard } from "@/components/Auth/ModuleGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NewDocument from "./pages/NewDocument";
import Documents from "./pages/Documents";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Payments from "./pages/Payments";
import AGTSync from "./pages/AGTSync";
import Settings from "./pages/Settings";
import ErrorCenter from "./pages/ErrorCenter";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { setupOnlineListener } from "./lib/sync";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
    
    // Setup online/offline listeners
    setupOnlineListener();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <OrganizationProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/novo-documento" element={<ProtectedRoute><ModuleGuard moduleKey="documents"><NewDocument /></ModuleGuard></ProtectedRoute>} />
                <Route path="/documentos" element={<ProtectedRoute><ModuleGuard moduleKey="documents"><Documents /></ModuleGuard></ProtectedRoute>} />
                <Route path="/clientes" element={<ProtectedRoute><ModuleGuard moduleKey="crm"><Clients /></ModuleGuard></ProtectedRoute>} />
                <Route path="/produtos" element={<ProtectedRoute><ModuleGuard moduleKey="products"><Products /></ModuleGuard></ProtectedRoute>} />
                <Route path="/pagamentos" element={<ProtectedRoute><ModuleGuard moduleKey="payments"><Payments /></ModuleGuard></ProtectedRoute>} />
                <Route path="/agt" element={<ProtectedRoute><ModuleGuard moduleKey="agt_sync"><AGTSync /></ModuleGuard></ProtectedRoute>} />
                <Route path="/centro-erros" element={<ProtectedRoute><ModuleGuard moduleKey="error_center"><ErrorCenter /></ModuleGuard></ProtectedRoute>} />
                <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OrganizationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
