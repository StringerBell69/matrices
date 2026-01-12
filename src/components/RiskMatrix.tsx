'use client';

import { Risk, PROBABILITY_LABELS, IMPACT_LABELS, getRiskColor, ProbabilityLevel, ImpactLevel } from '@/types';
import { cn } from '@/lib/utils';

interface RiskMatrixProps {
  risks: Risk[];
  onCellClick: (probability: ProbabilityLevel, impact: ImpactLevel) => void;
  onRiskClick: (risk: Risk) => void;
  matrixRef: React.RefObject<HTMLDivElement | null>;
}

export function RiskMatrix({ risks, onCellClick, onRiskClick, matrixRef }: RiskMatrixProps) {
  const probabilities: ProbabilityLevel[] = [5, 4, 3, 2, 1];
  const impacts: ImpactLevel[] = [1, 2, 3, 4, 5];

  const getRisksInCell = (probability: ProbabilityLevel, impact: ImpactLevel) => {
    return risks.filter(r => r.probability === probability && r.impact === impact);
  };

  return (
    <div ref={matrixRef} className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex">
        {/* Y-axis label */}
        <div className="flex flex-col items-center justify-center mr-3">
          <div className="text-sm font-semibold text-slate-600 transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
            Vraisemblance / Probabilité
          </div>
        </div>

        <div className="flex flex-col">
          {/* Grid */}
          <div className="flex">
            {/* Probability labels */}
            <div className="flex flex-col">
              {probabilities.map((prob) => (
                <div
                  key={prob}
                  className="h-20 w-24 flex items-center justify-center bg-slate-200/50 border border-slate-300 text-center"
                >
                  <div>
                    <div className="text-2xl font-bold text-slate-700">{prob}</div>
                    <div className="text-xs text-slate-500">{PROBABILITY_LABELS[prob]}</div>
                  </div>
                </div>
              ))}
              {/* Corner cell */}
              <div className="h-20 w-24 flex items-center justify-center bg-slate-100 border border-slate-300 text-xs text-slate-500 text-center p-1">
                <div>
                  <div>Vraisemblance</div>
                  <div>Probabilité</div>
                  <div className="border-t border-slate-400 mt-1 pt-1">Impact</div>
                  <div>Gravité</div>
                </div>
              </div>
            </div>

            {/* Matrix cells */}
            <div className="flex flex-col">
              <div className="flex flex-col">
                {probabilities.map((prob) => (
                  <div key={prob} className="flex">
                    {impacts.map((impact) => {
                      const score = prob * impact;
                      const cellRisks = getRisksInCell(prob, impact);
                      return (
                        <button
                          key={`${prob}-${impact}`}
                          onClick={() => onCellClick(prob, impact)}
                          className={cn(
                            'h-20 w-20 flex flex-col items-center justify-center border border-white/30 transition-all hover:scale-105 hover:z-10 hover:shadow-lg relative cursor-pointer',
                            getRiskColor(score)
                          )}
                        >
                          <span className="text-2xl font-bold text-white drop-shadow-md">{score}</span>
                          {cellRisks.length > 0 && (
                            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1">
                              {cellRisks.map((risk) => (
                                <div
                                  key={risk.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRiskClick(risk);
                                  }}
                                  className="px-2 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-700 shadow-md cursor-pointer hover:scale-110 transition-transform"
                                  title={risk.name}
                                >
                                  R{risk.riskNumber}
                                </div>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Impact labels */}
              <div className="flex">
                {impacts.map((impact) => (
                  <div
                    key={impact}
                    className="h-20 w-20 flex items-center justify-center bg-slate-200/50 border border-slate-300 text-center"
                  >
                    <div>
                      <div className="text-2xl font-bold text-slate-700">{impact}</div>
                      <div className="text-xs text-slate-500">{IMPACT_LABELS[impact]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-axis label */}
          <div className="text-center mt-3 ml-24">
            <span className="text-sm font-semibold text-slate-600">Impact / Gravité</span>
          </div>
        </div>
      </div>
    </div>
  );
}
