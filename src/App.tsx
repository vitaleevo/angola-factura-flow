import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewDocument from "./pages/NewDocument";
import Documents from "./pages/Documents";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Payments from "./pages/Payments";
import AGTSync from "./pages/AGTSync";
import Settings from "./pages/Settings";
import ErrorCenter from "./pages/ErrorCenter";
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/novo-documento" element={<NewDocument />} />
            <Route path="/documentos" element={<Documents />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/pagamentos" element={<Payments />} />
            <Route path="/agt" element={<AGTSync />} />
            <Route path="/centro-erros" element={<ErrorCenter />} />
            <Route path="/configuracoes" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
