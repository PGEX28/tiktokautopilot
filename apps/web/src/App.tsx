import { useState } from 'react';
import { Header } from './components/Header';
import { MetricsGrid, DashboardMetrics } from './components/MetricsGrid';
import { ProductCatalogTable, ProductItem } from './components/ProductCatalogTable';
import { VideoVariationsList, VideoVariationCardItem } from './components/VideoVariationsList';
import { Sparkles } from 'lucide-react';


export function App() {
  const [autopilotActive, setAutopilotActive] = useState<boolean>(true);

  // Mock State de Métricas
  const [metrics] = useState<DashboardMetrics>({
    totalGmvUsd: 14820.50,
    totalCommissionsUsd: 2223.00,
    totalVideosGenerated: 27,
    averageCtrPercent: 3.8,
    averageCvrPercent: 4.2,
    activeLiveLoops: 3,
  });

  // Mock State de Produtos Minerados
  const [products] = useState<ProductItem[]>([
    {
      id: 'prod_9921_kitchen',
      title: 'Mini Seladora Térmica Portátil USB',
      category: 'Cozinha & Casa',
      priceUsd: 14.99,
      commissionRate: 0.15,
      score: 92,
      tier: 'EXCELENTE',
      salesVolume: 4200,
      status: 'PUBLISHED',
    },
    {
      id: 'prod_9922_beauty',
      title: 'Massageador Facial Ultrassônico LED',
      category: 'Beleza & Cuidados',
      priceUsd: 29.90,
      commissionRate: 0.20,
      score: 88,
      tier: 'FORTE',
      salesVolume: 2900,
      status: 'GENERATED',
    },
    {
      id: 'prod_9923_tech',
      title: 'Limpador de Teclado e Fones 7 em 1',
      category: 'Eletrônicos',
      priceUsd: 9.99,
      commissionRate: 0.12,
      score: 81,
      tier: 'TESTAR',
      salesVolume: 6100,
      status: 'QUEUED',
    },
  ]);

  // Mock State de Criativos 9:16 (Variações A/B/C)
  const [variations] = useState<VideoVariationCardItem[]>([
    {
      id: 'var_01',
      variationLabel: 'Variação A (Dor/Solução)',
      productName: 'Mini Seladora Térmica Portátil',
      durationSeconds: 30,
      hookText: 'Pare de comer biscoito murcho agora mesmo!',
      videoUrl: 'https://cdn.tiktokautopilot.io/renders/master_var_a.mp4',
      ctrPercent: 4.2,
      cvrPercent: 4.5,
      status: 'STREAMING_LIVE',
    },
    {
      id: 'var_02',
      variationLabel: 'Variação B (Demonstração Viral)',
      productName: 'Mini Seladora Térmica Portátil',
      durationSeconds: 30,
      hookText: 'Esse barulhinho de vedação é muito satisfatório...',
      videoUrl: 'https://cdn.tiktokautopilot.io/renders/master_var_b.mp4',
      ctrPercent: 3.9,
      cvrPercent: 4.1,
      status: 'PUBLISHED',
    },
    {
      id: 'var_03',
      variationLabel: 'Variação C (Oferta/Escassez)',
      productName: 'Mini Seladora Térmica Portátil',
      durationSeconds: 30,
      hookText: 'Últimas 50 unidades com frete grátis na Sacola Amarela!',
      videoUrl: 'https://cdn.tiktokautopilot.io/renders/master_var_c.mp4',
      ctrPercent: 3.5,
      cvrPercent: 3.8,
      status: 'READY',
    },
  ]);

  const handleToggleAutopilot = () => {
    setAutopilotActive((prev) => !prev);
  };

  const handleGenerateVideos = (productId: string) => {
    alert(`⚡ Disparado pipeline autônomo de geração para o produto: ${productId}`);
  };

  return (
    <div className="min-h-screen bg-[#0c0c12] text-slate-100 flex flex-col font-sans selection:bg-[#FE2C55]/30">
      {/* Header com Trava de Emergência */}
      <Header
        autopilotActive={autopilotActive}
        onToggleAutopilot={handleToggleAutopilot}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Banner de Status */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161626] via-[#12121c] to-[#20152c] border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FE2C55]/10 border border-[#FE2C55]/30 text-[#FE2C55] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Pipeline Autônomo Ativo
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Painel de Controle do TikTok Shop Autopilot
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Sistema autônomo operando com mineração contínua de produtos, geração de 3 criativos 9:16 com locução neural e transmissão 24/7 em Live Streams.
            </p>
          </div>
        </div>

        {/* Grade de KPIs e Métricas */}
        <MetricsGrid metrics={metrics} />

        {/* Tabela de Produtos Minerados & Ranqueados */}
        <ProductCatalogTable
          products={products}
          onGenerateVideos={handleGenerateVideos}
        />

        {/* Lista de Criativos Verticais 9:16 (Variações A/B/C) */}
        <VideoVariationsList variations={variations} />
      </main>
    </div>
  );
}

export default App;
