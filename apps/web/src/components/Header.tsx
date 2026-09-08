import { Bot, Power, ShieldAlert } from 'lucide-react';


interface HeaderProps {
  autopilotActive: boolean;
  onToggleAutopilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({ autopilotActive, onToggleAutopilot }) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#111118]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] flex items-center justify-center shadow-lg shadow-[#FE2C55]/20">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">
              TikTok Shop AI Autopilot
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FE2C55]/10 text-[#FE2C55] border border-[#FE2C55]/20 uppercase">
              PRO v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400">Motor Autônomo de Mineração, Vídeos 9:16 e Live Loops 24/7</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181824] border border-slate-800 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${autopilotActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-300 font-medium">
            Autopilot: <strong className={autopilotActive ? 'text-emerald-400' : 'text-amber-400'}>{autopilotActive ? 'RODANDO 24/7' : 'PAUSADO'}</strong>
          </span>
        </div>

        {/* Emergency Stop / Toggle Button */}
        <button
          onClick={onToggleAutopilot}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
            autopilotActive
              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
          }`}
        >
          {autopilotActive ? (
            <>
              <ShieldAlert className="h-4 w-4" /> Trava de Emergência
            </>
          ) : (
            <>
              <Power className="h-4 w-4" /> Iniciar Autopilot
            </>
          )}
        </button>
      </div>
    </header>
  );
};
