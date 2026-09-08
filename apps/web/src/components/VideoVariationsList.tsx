import { Play, Sparkles, ShoppingCart, CheckCircle } from 'lucide-react';


export interface VideoVariationCardItem {
  id: string;
  variationLabel: 'Variação A (Dor/Solução)' | 'Variação B (Demonstração Viral)' | 'Variação C (Oferta/Escassez)';
  productName: string;
  durationSeconds: number;
  hookText: string;
  videoUrl: string;
  ctrPercent: number;
  cvrPercent: number;
  status: 'READY' | 'PUBLISHED' | 'STREAMING_LIVE';
}

interface VideoVariationsListProps {
  variations: VideoVariationCardItem[];
}

export const VideoVariationsList: React.FC<VideoVariationsListProps> = ({ variations }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#25F4EE]" /> Criativos Verticais 9:16 (A/B/C)
          </h2>
          <p className="text-xs text-slate-400">Vídeos publicitários masterizados pelo FFmpeg prontos para TikTok Shop</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {variations.map((v) => (
          <div
            key={v.id}
            className="rounded-xl bg-[#14141c] border border-slate-800/80 overflow-hidden flex flex-col justify-between shadow-lg"
          >
            {/* Visual 9:16 Mock Preview */}
            <div className="relative aspect-[9/16] bg-gradient-to-b from-slate-900 via-slate-800 to-black p-4 flex flex-col justify-between border-b border-slate-800">
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-[#121218]/90 text-white border border-slate-700 backdrop-blur-md">
                  {v.variationLabel.split(' ')[0]} {v.variationLabel.split(' ')[1]}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> {v.status}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="flex flex-col items-center justify-center gap-2 text-center z-10">
                <div className="h-12 w-12 rounded-full bg-[#FE2C55]/90 text-white flex items-center justify-center shadow-xl shadow-[#FE2C55]/40 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>
                <p className="text-xs font-semibold text-slate-300 max-w-[200px] line-clamp-2">
                  "{v.hookText}"
                </p>
              </div>

              {/* Bottom Yellow Bag Overlay */}
              <div className="z-10 bg-amber-400 text-slate-950 px-3 py-2 rounded-lg flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 fill-slate-950" />
                  <span className="text-[11px] font-black uppercase tracking-tight">TikTok Shop</span>
                </div>
                <span className="text-[10px] font-extrabold bg-slate-950 text-amber-400 px-2 py-0.5 rounded">Comprar</span>
              </div>
            </div>

            {/* Video Details & Metrics */}
            <div className="p-4 space-y-3 bg-[#111118]">
              <div>
                <h3 className="text-xs font-bold text-white">{v.productName}</h3>
                <p className="text-[11px] text-slate-400">{v.variationLabel}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500">CTR Esperado:</span>
                  <p className="font-bold text-[#FE2C55]">{v.ctrPercent}%</p>
                </div>
                <div>
                  <span className="text-slate-500">CVR Esperado:</span>
                  <p className="font-bold text-emerald-400">{v.cvrPercent}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
