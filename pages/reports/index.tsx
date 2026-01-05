import { useState } from 'react';
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { ReportsStatsGrid } from '@/components/organisms/ReportsStatsGrid';
import { ReportsChartSection } from '@/components/organisms/ReportsChartSection';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { type ReportsStats } from '@/types';

import { NextPageAuth } from '@/pages/_app';

/**
 * Página de reportes.
 *
 * Consulta estadísticas agregadas y permite exportar movimientos en CSV.
 * Requiere permiso `REPORTS_READ`.
 */
const ReportsPage = () => {
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await fetch('/api/reports/stats');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<ReportsStats>;
    },
  });

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
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className='mr-2 h-4 w-4' />
            {isExporting ? 'Exportando...' : 'Exportar CSV'}
          </Button>
        }
      />

      {data ? (
        <>
          <ReportsStatsGrid data={data} isLoading={isLoading} />
          <ReportsChartSection data={data} isLoading={isLoading} />
        </>
      ) : null}
    </AppShell>
  );
};

(ReportsPage as NextPageAuth).requiredPermissions = [PERMISSIONS.REPORTS_READ];

export default ReportsPage;
