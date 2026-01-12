'use client';

import { Risk, PROBABILITY_LABELS, IMPACT_LABELS, getRiskColor } from '@/types';
import { cn } from '@/lib/utils';

interface RiskListProps {
  risks: Risk[];
  onRiskClick: (risk: Risk) => void;
  darkMode?: boolean;
}

export function RiskList({ risks, onRiskClick, darkMode = false }: RiskListProps) {
  const sortedRisks = [...risks].sort((a, b) => (b.probability * b.impact) - (a.probability * a.impact));

  return (
    <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white shadow-lg'}`}>
      <div className={`px-5 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Liste des risques</h3>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            {risks.length}
          </span>
        </div>
      </div>
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {risks.length === 0 ? (
          <div className="text-center py-8">
            <div className={darkMode ? 'text-slate-600' : 'text-slate-400'}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Aucun risque ajouté</p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>Cliquez sur une cellule de la matrice</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedRisks.map((risk) => {
              const score = risk.probability * risk.impact;
              return (
                <button
                  key={risk.id}
                  onClick={() => onRiskClick(risk)}
                  className={`w-full p-3 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                    darkMode 
                      ? 'bg-slate-700/50 hover:bg-slate-700' 
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className={`font-medium truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      R{risk.riskNumber} - {risk.name}
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      P: {PROBABILITY_LABELS[risk.probability]} • I: {IMPACT_LABELS[risk.impact]}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0',
                      getRiskColor(score)
                    )}
                  >
                    {score}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
