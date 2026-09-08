import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Eye, Video, Percent } from 'lucide-react';

export interface DashboardMetrics {
  totalGmvUsd: number;
  totalCommissionsUsd: number;
  totalVideosGenerated: number;
  averageCtrPercent: number;
  averageCvrPercent: number;
  activeLiveLoops: number;
}

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'GMV Total Gerado',
      value: `$${metrics.totalGmvUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: '+28.4% nas últimas 24h',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/10 to-transparent',
    },
    {
      title: 'Comissões Líquidas',
      value: `$${metrics.totalCommissionsUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: 'Margem média de 15%',
      icon: ShoppingBag,
      color: 'text-[#25F4EE]',
      bgGradient: 'from-[#25F4EE]/10 to-transparent',
    },
    {
      title: 'CTR Médio (Sacola)',
      value: `${metrics.averageCtrPercent}%`,
      subtitle: 'Taxa de clique no anúncio',
      icon: Percent,
      color: 'text-[#FE2C55]',
      bgGradient: 'from-[#FE2C55]/10 to-transparent',
    },
    {
      title: 'CVR Médio (Conversão)',
      value: `${metrics.averageCvrPercent}%`,
      subtitle: 'Vendas por clique',
      icon: TrendingUp,
      color: 'text-amber-400',
      bgGradient: 'from-amber-500/10 to-transparent',
    },
    {
      title: 'Vídeos Produzidos',
      value: `${metrics.totalVideosGenerated}`,
      subtitle: '3 variações A/B/C por produto',
      icon: Eye,
      color: 'text-indigo-400',
      bgGradient: 'from-indigo-500/10 to-transparent',
    },
    {
      title: 'Live Streams 24/7',
      value: `${metrics.activeLiveLoops} Ativas`,
      subtitle: 'Transmissão contínua em loop',
      icon: Video,
      color: 'text-fuchsia-400',
      bgGradient: 'from-fuchsia-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-xl bg-[#14141c] border border-slate-800/80 p-4 space-y-2 bg-gradient-to-b ${c.bgGradient}`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{c.title}</span>
              <Icon className={`h-4 w-4 ${c.color}`} />
            </div>
            <div className="text-xl font-extrabold text-white tracking-tight">{c.value}</div>
            <p className="text-[11px] text-slate-400">{c.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};
