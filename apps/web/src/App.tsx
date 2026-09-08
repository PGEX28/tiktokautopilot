import { useState } from 'react';
import { Header } from './components/Header';
import { MetricsGrid, DashboardMetrics } from './components/MetricsGrid';
import { ProductCatalogTable, ProductItem } from './components/ProductCatalogTable';
import { VideoVariationsList, VideoVariationCardItem } from './components/VideoVariationsList';
import { Sparkles } from 'lucide-react';


export function App() {
  const [autopilotActive, setAutopilotActive] = useState<boolean>(true);

  // State de Métricas
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalGmvUsd: 14820.50,
    totalCommissionsUsd: 2223.00,
    totalVideosGenerated: 27,
    averageCtrPercent: 3.8,
    averageCvrPercent: 4.2,
    activeLiveLoops: 3,
  });

  // State de Produtos Minerados
  const [products, setProducts] = useState<ProductItem[]>([
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

  // State de Criativos 9:16 (Variações A/B/C)
  const [variations, setVariations] = useState<VideoVariationCardItem[]>([
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

  const [generatingProductId, setGeneratingProductId] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<number>(0);

  const handleGenerateVideos = (productId: string) => {
    setGeneratingProductId(productId);
    setPipelineStep(1);

    const steps = [
      { step: 1, delay: 1200 }, // Roteirização A/B/C com IA
      { step: 2, delay: 2600 }, // Síntese de Voz Neural ElevenLabs
      { step: 3, delay: 4200 }, // Renderização FFmpeg 9:16 + Ganchos
      { step: 4, delay: 5800 }, // Master Loop RTMP & Agendamento
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setPipelineStep(step);
      }, delay);
    });

    setTimeout(() => {
      const targetProduct = products.find((p) => p.id === productId);
      const prodName = targetProduct ? targetProduct.title : 'Produto Selecionado';

      // Atualizar status do produto para 'PUBLISHED'
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: 'PUBLISHED' } : p))
      );

      // Injetar os 3 novos criativos verticais gerados no estado da lista
      const newVariations: VideoVariationCardItem[] = [
        {
          id: `var_${Date.now()}_a`,
          variationLabel: 'Variação A (Dor/Solução)',
          productName: prodName,
          durationSeconds: 30,
          hookText: `Você ainda perde tempo com isso? Veja como o ${prodName.split(' ')[0]} resolve em 3 segundos!`,
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
          ctrPercent: 4.8,
          cvrPercent: 5.2,
          status: 'STREAMING_LIVE',
        },
        {
          id: `var_${Date.now()}_b`,
          variationLabel: 'Variação B (Demonstração Viral)',
          productName: prodName,
          durationSeconds: 30,
          hookText: `O segredo que os criadores gringos usam com esse ${prodName.split(' ')[0]}...`,
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
          ctrPercent: 4.3,
          cvrPercent: 4.6,
          status: 'PUBLISHED',
        },
        {
          id: `var_${Date.now()}_c`,
          variationLabel: 'Variação C (Oferta/Escassez)',
          productName: prodName,
          durationSeconds: 30,
          hookText: `Restam menos de 30 unidades com frete grátis na Sacola Amarela aqui embaixo!`,
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
          ctrPercent: 3.9,
          cvrPercent: 4.1,
          status: 'READY',
        },
      ];

      setVariations(newVariations);

      // Incrementar métricas em tempo real
      setMetrics((prev) => ({
        ...prev,
        totalVideosGenerated: prev.totalVideosGenerated + 3,
        activeLiveLoops: prev.activeLiveLoops + 1,
        totalCommissionsUsd: +(prev.totalCommissionsUsd + 145.5).toFixed(2),
        totalGmvUsd: +(prev.totalGmvUsd + 970.0).toFixed(2),
      }));

      setGeneratingProductId(null);
      setPipelineStep(0);
    }, 7200);
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

        {/* Modal Interativo de Pipeline Autônomo em Tempo Real */}
        {generatingProductId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#12121c] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] flex items-center justify-center animate-pulse">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pipeline de IA em Execução</h3>
                  <p className="text-xs text-slate-400">Processando produto: <span className="text-[#25F4EE] font-mono">{generatingProductId}</span></p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${pipelineStep >= 1 ? 'bg-slate-800/80 border-[#25F4EE]/40 text-slate-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${pipelineStep === 1 ? 'bg-[#25F4EE] animate-ping' : pipelineStep > 1 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  <span>1. Mineração de Ganchos & Roteirização A/B/C (GPT-4 / Claude)</span>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${pipelineStep >= 2 ? 'bg-slate-800/80 border-[#FE2C55]/40 text-slate-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${pipelineStep === 2 ? 'bg-[#FE2C55] animate-ping' : pipelineStep > 2 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  <span>2. Síntese de Áudio & Locução Neural (ElevenLabs)</span>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${pipelineStep >= 3 ? 'bg-slate-800/80 border-[#25F4EE]/40 text-slate-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${pipelineStep === 3 ? 'bg-[#25F4EE] animate-ping' : pipelineStep > 3 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  <span>3. Renderização FFmpeg 9:16 + Legendas Dinâmicas</span>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${pipelineStep >= 4 ? 'bg-slate-800/80 border-emerald-500/40 text-slate-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${pipelineStep === 4 ? 'bg-emerald-400 animate-ping' : 'bg-slate-700'}`} />
                  <span>4. Compilação do Master Loop RTMP & Agendamento TikTok</span>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80">
                <span>
                  {pipelineStep >= 4 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      ✅ 3 Criativos Prontos & Transmitindo!
                    </span>
                  ) : (
                    '⚡ Processando com aceleração GPU...'
                  )}
                </span>
                {pipelineStep >= 4 ? (
                  <button
                    onClick={() => setGeneratingProductId(null)}
                    className="px-3 py-1 bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-slate-950 font-extrabold rounded-lg shadow-md hover:scale-105 transition-all text-xs"
                  >
                    Ver Criativos ↓
                  </button>
                ) : (
                  <span className="font-mono text-[#FE2C55]">Passo {pipelineStep}/4</span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

