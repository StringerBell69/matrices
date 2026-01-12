'use client';

import { useState, useRef, useEffect } from 'react';
import { Risk, ProbabilityLevel, ImpactLevel } from '@/types';
import { RiskMatrix } from '@/components/RiskMatrix';
import { RiskDialog } from '@/components/RiskDialog';
import { RiskList } from '@/components/RiskList';
import { ExportButtons } from '@/components/ExportButtons';

export default function Home() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [nextRiskNumber, setNextRiskNumber] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRisk, setEditRisk] = useState<Risk | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ probability: ProbabilityLevel; impact: ImpactLevel } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const handleCellClick = (probability: ProbabilityLevel, impact: ImpactLevel) => {
    setSelectedCell({ probability, impact });
    setEditRisk(null);
    setDialogOpen(true);
  };

  const handleRiskClick = (risk: Risk) => {
    setEditRisk(risk);
    setSelectedCell(null);
    setDialogOpen(true);
  };

  const handleSaveRisk = (riskData: Omit<Risk, 'id' | 'riskNumber'> & { id?: string; riskNumber?: number }) => {
    if (riskData.id) {
      setRisks(risks.map(r => r.id === riskData.id ? { ...riskData, id: riskData.id, riskNumber: r.riskNumber } as Risk : r));
    } else {
      const newRisk: Risk = {
        ...riskData,
        id: crypto.randomUUID(),
        riskNumber: nextRiskNumber,
      } as Risk;
      setRisks([...risks, newRisk]);
      setNextRiskNumber(nextRiskNumber + 1);
    }
  };

  const handleDeleteRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les risques ?')) {
      setRisks([]);
      setNextRiskNumber(1);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
      {/* Theme Toggle - Fixed position */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 z-40 p-3 rounded-full shadow-lg transition-all hover:scale-110 cursor-pointer ${
          darkMode 
            ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
            : 'bg-white text-slate-600 hover:bg-slate-50'
        }`}
        title={darkMode ? 'Mode clair' : 'Mode sombre'}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Matrice de Risques
          </h1>
          <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Créez et exportez vos matrices de risques rapidement
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Matrix */}
          <div>
            <RiskMatrix
              risks={risks}
              onCellClick={handleCellClick}
              onRiskClick={handleRiskClick}
              matrixRef={matrixRef}
            />
            
            {/* Action Buttons below matrix */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={handleClearAll}
                disabled={risks.length === 0}
                className="px-4 py-2 text-sm rounded-lg border border-rose-600 text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Tout effacer
              </button>
              <ExportButtons matrixRef={matrixRef} darkMode={darkMode} />
            </div>
            
            <p className={`text-center text-sm mt-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              💡 Cliquez sur une cellule pour ajouter un risque
            </p>
          </div>

          {/* Risk List */}
          <div className="w-full lg:w-80">
            <RiskList risks={risks} onRiskClick={handleRiskClick} darkMode={darkMode} />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex justify-center">
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-800/50' : 'bg-white shadow-sm'}`}>
            <h3 className={`text-sm font-semibold mb-3 text-center ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Légende des niveaux de risque
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-green-500"></div>
                <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Faible (1-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-yellow-400"></div>
                <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Modéré (5-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-orange-500"></div>
                <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Élevé (10-15)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-red-600"></div>
                <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Critique (16-25)</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Risk Dialog */}
      <RiskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveRisk}
        onDelete={handleDeleteRisk}
        initialProbability={selectedCell?.probability}
        initialImpact={selectedCell?.impact}
        editRisk={editRisk}
      />

      {/* Footer */}
      <footer className={`py-4 text-center text-sm ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
        Matrice de Risques Online
      </footer>
    </div>
  );
}
