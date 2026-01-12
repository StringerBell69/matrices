'use client';

import { exportToPNG, exportToPDF } from '@/utils/export';
import { useState } from 'react';

interface ExportButtonsProps {
  matrixRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
  darkMode?: boolean;
}

export function ExportButtons({ matrixRef, filename = 'matrice-risques', darkMode = false }: ExportButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPNG = async () => {
    if (matrixRef.current && !isExporting) {
      setIsExporting(true);
      setIsOpen(false);
      await exportToPNG(matrixRef.current, filename);
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (matrixRef.current && !isExporting) {
      setIsExporting(true);
      setIsOpen(false);
      await exportToPDF(matrixRef.current, filename);
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 text-sm cursor-pointer"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Export...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exporter
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-48 rounded-lg shadow-lg border z-50 py-1 ${
            darkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={handleExportPNG}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 cursor-pointer ${
                darkMode 
                  ? 'text-slate-300 hover:bg-slate-700' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              PNG (Image)
            </button>
            <button
              onClick={handleExportPDF}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 cursor-pointer ${
                darkMode 
                  ? 'text-slate-300 hover:bg-slate-700' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              PDF (Document)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
