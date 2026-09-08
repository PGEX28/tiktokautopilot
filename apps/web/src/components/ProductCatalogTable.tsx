import React from 'react';
import { Sparkles, Play, CheckCircle2, ChevronRight } from 'lucide-react';

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  priceUsd: number;
  commissionRate: number;
  score: number;
  tier: 'EXCELENTE' | 'FORTE' | 'TESTAR' | 'FRACO';
  salesVolume: number;
  status: 'MINED' | 'QUEUED' | 'GENERATED' | 'PUBLISHED';
}

interface ProductCatalogTableProps {
  products: ProductItem[];
  onGenerateVideos: (productId: string) => void;
}

export const ProductCatalogTable: React.FC<ProductCatalogTableProps> = ({ products, onGenerateVideos }) => {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'EXCELENTE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'FORTE':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'TESTAR':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="rounded-xl bg-[#14141c] border border-slate-800/80 overflow-hidden shadow-lg">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FE2C55]" /> Produtos Minerados & Ranqueados
          </h2>
          <p className="text-xs text-slate-400">Produtos aprovados pelo Product Hunter e Product Score com margem validada</p>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Total: <strong className="text-white">{products.length} produtos</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#181824] text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-3.5">Produto</th>
              <th className="px-4 py-3.5">Categoria</th>
              <th className="px-4 py-3.5">Preço</th>
              <th className="px-4 py-3.5">Comissão</th>
              <th className="px-4 py-3.5">Volume 30d</th>
              <th className="px-4 py-3.5">AI Score</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FE2C55]" />
                    {p.title}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-400">{p.category}</td>
                <td className="px-4 py-4 font-medium text-white">${p.priceUsd.toFixed(2)}</td>
                <td className="px-4 py-4 text-emerald-400 font-bold">{(p.commissionRate * 100).toFixed(0)}% (${(p.priceUsd * p.commissionRate).toFixed(2)})</td>
                <td className="px-4 py-4 text-slate-300">{p.salesVolume.toLocaleString()} un</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{p.score}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTierBadge(p.tier)}`}>
                      {p.tier}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <CheckCircle2 className="h-3 w-3" /> {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onGenerateVideos(p.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#FE2C55] to-[#FE2C55]/80 text-white hover:opacity-90 shadow-md shadow-[#FE2C55]/20 transition-all"
                  >
                    <Play className="h-3 w-3 fill-white" /> Gerar 3 Vídeos <ChevronRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
