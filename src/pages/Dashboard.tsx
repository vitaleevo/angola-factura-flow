import { MainLayout } from "@/components/Layout/MainLayout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { RecentDocuments } from "@/components/Dashboard/RecentDocuments";
import { AGTSyncStatus } from "@/components/Dashboard/AGTSyncStatus";
import { NewDocumentButton } from "@/components/Documents/NewDocumentButton";
import { FileText, Users, Package, TrendingUp } from "lucide-react";

const Dashboard = () => {
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
          <StatsCard
            title="Documentos Emitidos"
            value="156"
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            variant="default"
          />
          <StatsCard
            title="Receita Total"
            value="2.8M Kz"
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
            variant="success"
          />
          <StatsCard
            title="Clientes Ativos"
            value="89"
            icon={Users}
            variant="default"
          />
          <StatsCard
            title="Produtos"
            value="245"
            icon={Package}
            variant="default"
          />
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
