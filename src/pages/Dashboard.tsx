import { useEffect, useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { RecentDocuments } from "@/components/Dashboard/RecentDocuments";
import { AGTSyncStatus } from "@/components/Dashboard/AGTSyncStatus";
import { NewDocumentButton } from "@/components/Documents/NewDocumentButton";
import { FileText, Users, Package, TrendingUp } from "lucide-react";
import { useOrganization } from "@/contexts/OrganizationContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { currentOrganization } = useOrganization();
  const [stats, setStats] = useState({
    documentsCount: 0,
    totalRevenue: 0,
    clientsCount: 0,
    productsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentOrganization) {
      loadStats();
    }
  }, [currentOrganization]);

  const loadStats = async () => {
    if (!currentOrganization) return;

    setLoading(true);

    const [invoicesRes, clientsRes, productsRes] = await Promise.all([
      supabase
        .from("invoices")
        .select("total_amount", { count: 'exact' })
        .eq("organization_id", currentOrganization.id),
      supabase
        .from("clients")
        .select("*", { count: 'exact', head: true })
        .eq("organization_id", currentOrganization.id),
      supabase
        .from("products")
        .select("*", { count: 'exact', head: true })
        .eq("organization_id", currentOrganization.id),
    ]);

    const totalRevenue = invoicesRes.data?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0;

    setStats({
      documentsCount: invoicesRes.count || 0,
      totalRevenue,
      clientsCount: clientsRes.count || 0,
      productsCount: productsRes.count || 0,
    });

    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Visão geral do sistema de faturação</p>
          </div>
          <NewDocumentButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Carregando estatísticas...</p>
              </div>
            </div>
          ) : (
            <>
              <StatsCard
                title="Documentos Emitidos"
                value={stats.documentsCount}
                icon={FileText}
                variant="default"
              />
              <StatsCard
                title="Receita Total"
                value={formatPrice(stats.totalRevenue)}
                icon={TrendingUp}
                variant="success"
              />
              <StatsCard
                title="Clientes Ativos"
                value={stats.clientsCount}
                icon={Users}
                variant="default"
              />
              <StatsCard
                title="Produtos"
                value={stats.productsCount}
                icon={Package}
                variant="default"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentDocuments />
          </div>
          <div>
            <AGTSyncStatus />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
