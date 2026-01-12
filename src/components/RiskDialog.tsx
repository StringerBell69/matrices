'use client';

import { Risk, PROBABILITY_LABELS, IMPACT_LABELS, ProbabilityLevel, ImpactLevel, getRiskColor } from '@/types';
import { useState, useEffect } from 'react';

interface RiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (risk: Omit<Risk, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  initialProbability?: ProbabilityLevel;
  initialImpact?: ImpactLevel;
  editRisk?: Risk | null;
}

export function RiskDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  initialProbability = 1,
  initialImpact = 1,
  editRisk,
}: RiskDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [probability, setProbability] = useState<ProbabilityLevel>(initialProbability);
  const [impact, setImpact] = useState<ImpactLevel>(initialImpact);

  useEffect(() => {
    if (editRisk) {
      setName(editRisk.name);
      setDescription(editRisk.description || '');
      setProbability(editRisk.probability);
      setImpact(editRisk.impact);
    } else {
      setName('');
      setDescription('');
      setProbability(initialProbability);
      setImpact(initialImpact);
    }
  }, [editRisk, initialProbability, initialImpact, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({
      id: editRisk?.id,
      name: name.trim(),
      description: description.trim() || undefined,
      probability,
      impact,
    } as Omit<Risk, 'id'> & { id?: string });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (editRisk && onDelete) {
      onDelete(editRisk.id);
      onOpenChange(false);
    }
  };

  const score = probability * impact;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-slate-800">
            {editRisk ? 'Modifier le risque' : 'Ajouter un risque'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {editRisk
              ? 'Modifiez les informations du risque'
              : 'Remplissez les informations du nouveau risque'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nom du risque *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Risque technique"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description optionnelle..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Probability & Impact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="probability" className="block text-sm font-medium text-slate-700 mb-1">
                  Probabilité
                </label>
                <select
                  id="probability"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value) as ProbabilityLevel)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 bg-white cursor-pointer"
                >
                  {([1, 2, 3, 4, 5] as ProbabilityLevel[]).map((p) => (
                    <option key={p} value={p}>
                      {p} - {PROBABILITY_LABELS[p]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="impact" className="block text-sm font-medium text-slate-700 mb-1">
                  Impact
                </label>
                <select
                  id="impact"
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value) as ImpactLevel)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 bg-white cursor-pointer"
                >
                  {([1, 2, 3, 4, 5] as ImpactLevel[]).map((i) => (
                    <option key={i} value={i}>
                      {i} - {IMPACT_LABELS[i]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Risk Score Preview */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Score de risque</p>
                <p className="text-xs text-slate-400">{PROBABILITY_LABELS[probability]} × {IMPACT_LABELS[impact]}</p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl ${getRiskColor(score)}`}>
                {score}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {editRisk && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              {editRisk ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
