import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { ReportsStatsGrid } from '@/components/organisms/ReportsStatsGrid';
import { ReportsChartSection } from '@/components/organisms/ReportsChartSection';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/lib/rbac/permissions';

type ChartDataPoint = {
  date: string;
  incomes: number;
  expenses: number;
};

type ReportsStats = {
  summary: {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
  };
  chartData: ChartDataPoint[];
};

const ReportsPage = () => {
  const [data, setData] = useState<ReportsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/reports/stats');
        if (!res.ok) throw new Error('Error al cargar los reportes');
        const json = await res.json();
        setData(json);
      } catch {
        // Error handled by state
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/reports/export');
      if (!res.ok) throw new Error('Error al exportar');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert('Error al exportar el reporte');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AppShell pageTitle='Reportes' contentClassName='space-y-8'>
      <PageHeader
        title='Reportes'
        subtitle='Visualiza el rendimiento financiero y exporta datos.'
        actions={
          <Button onClick={handleExport} disabled={isExporting || isLoading}>
            <Download className='mr-2 h-4 w-4' />
            {isExporting ? 'Exportando...' : 'Exportar CSV'}
          </Button>
        }
      />

      <ReportsStatsGrid data={data} isLoading={isLoading} />

      <ReportsChartSection data={data} isLoading={isLoading} />
    </AppShell>
  );
};

(
  ReportsPage as typeof ReportsPage & { requiredPermissions?: string[] }
).requiredPermissions = [PERMISSIONS.REPORTS_READ];

export default ReportsPage;
