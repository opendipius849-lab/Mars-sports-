import React from 'react';

interface StandingTeam {
  pos: number;
  name: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gd: number;
  pts: number;
}

const PREMIER_LEAGUE_TABLE: StandingTeam[] = [
  { pos: 1, name: 'Manchester City', p: 8, w: 6, d: 2, l: 0, gd: 11, pts: 20 },
  { pos: 2, name: 'Arsenal', p: 8, w: 5, d: 3, l: 0, gd: 9, pts: 18 },
  { pos: 3, name: 'Liverpool', p: 8, w: 5, d: 2, l: 1, gd: 8, pts: 17 },
  { pos: 4, name: 'Aston Villa', p: 8, w: 5, d: 1, l: 2, gd: 4, pts: 16 },
  { pos: 5, name: 'Chelsea', p: 8, w: 4, d: 2, l: 2, gd: 7, pts: 14 },
  { pos: 6, name: 'Tottenham', p: 8, w: 4, d: 1, l: 3, gd: 4, pts: 13 },
  { pos: 7, name: 'Newcastle', p: 8, w: 3, d: 3, l: 2, gd: 1, pts: 12 },
  { pos: 8, name: 'Brighton', p: 8, w: 3, d: 3, l: 2, gd: 0, pts: 12 },
];

export const StandingsTable: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> Premier League Table
        </span>
        <span className="text-[10px] text-slate-500 font-semibold">2026/27</span>
      </div>

      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800/80 bg-slate-950/40">
              <th className="py-2 px-3 w-8">#</th>
              <th className="py-2 px-2">Team</th>
              <th className="py-2 px-2 text-center">P</th>
              <th className="py-2 px-2 text-center">W</th>
              <th className="py-2 px-2 text-center">D</th>
              <th className="py-2 px-2 text-center">L</th>
              <th className="py-2 px-2 text-center">GD</th>
              <th className="py-2 px-3 text-right font-black text-slate-300">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {PREMIER_LEAGUE_TABLE.map((t) => (
              <tr key={t.pos} className="hover:bg-slate-800/50 transition-colors">
                <td className="py-2 px-3 font-mono text-slate-400">
                  <span
                    className={`inline-block w-4 text-center ${
                      t.pos <= 4 ? 'text-blue-400 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {t.pos}
                  </span>
                </td>
                <td className="py-2 px-2 font-bold text-slate-200">{t.name}</td>
                <td className="py-2 px-2 text-center font-mono text-slate-400">{t.p}</td>
                <td className="py-2 px-2 text-center font-mono text-slate-400">{t.w}</td>
                <td className="py-2 px-2 text-center font-mono text-slate-400">{t.d}</td>
                <td className="py-2 px-2 text-center font-mono text-slate-400">{t.l}</td>
                <td className="py-2 px-2 text-center font-mono text-slate-400">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                <td className="py-2 px-3 text-right font-mono font-black text-white">{t.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
