import React, { useState } from 'react';
import { SimplexShieldData } from '../utils/cryptoMath';
import { soundManager } from '../utils/soundEffects';
import { ShieldCheck, ShieldAlert, Key, Hash, Layers, Copy, Check, Binary, RefreshCw } from 'lucide-react';

interface IntegritySealCardProps {
  shieldData: SimplexShieldData | null;
  onToggleCorrupt: () => void;
}

export const IntegritySealCard: React.FC<IntegritySealCardProps> = ({
  shieldData,
  onToggleCorrupt
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedResidue, setCopiedResidue] = useState(false);

  if (!shieldData) {
    return (
      <div className="p-6 rounded-xl bg-[#070c09] border border-[#00ff66]/15 text-center text-gray-500">
        <Layers className="w-8 h-8 text-[#00ff66]/40 mx-auto mb-2" />
        <p className="text-sm font-semibold text-emerald-400/80">Sello de Integridad Híbrido no generado</p>
        <p className="text-xs text-gray-500 mt-1">
          Ingresa un texto o documento arriba y pulsa &ldquo;Generar Blindaje Geométrico&rdquo;.
        </p>
      </div>
    );
  }

  const isCorrupted = shieldData.isCorrupted;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(shieldData.simplexKey);
    setCopiedKey(true);
    soundManager.playClick();
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyResidue = () => {
    navigator.clipboard.writeText(shieldData.adHocResidue.vectorHash);
    setCopiedResidue(true);
    soundManager.playClick();
    setTimeout(() => setCopiedResidue(false), 2000);
  };

  const handleToggle = () => {
    onToggleCorrupt();
    if (!isCorrupted) {
      soundManager.playAlert();
    } else {
      soundManager.playShieldActivate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Sello de Integridad Card */}
      <div className={`p-5 sm:p-6 rounded-xl transition-all duration-300 border ${
        isCorrupted
          ? 'bg-[#14080a] border-red-500/50 shadow-[0_0_25px_rgba(255,0,50,0.18)]'
          : 'bg-[#06120b] border-[#00ff66]/30 shadow-[0_0_20px_rgba(0,255,102,0.06)]'
      }`}>
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#00ff66]/15">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border ${
              isCorrupted
                ? 'bg-red-950/80 border-red-500/60 text-red-400'
                : 'bg-[#092b17] border-[#00ff66]/50 text-[#00ff66]'
            }`}>
              {isCorrupted ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Criptografía Topológica
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  isCorrupted
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40'
                }`}>
                  {isCorrupted ? 'INTEGRIDAD COMPROMETIDA' : 'INTEGRIDAD GARANTIZADA LOCAL'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Sello de Integridad Híbrido (Símplex Minimal)
              </h3>
            </div>
          </div>

          {/* Interactive 1-Bit Attack Button */}
          <button
            onClick={handleToggle}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              isCorrupted
                ? 'bg-[#00ff66] text-[#050706] hover:bg-[#00ff66]/90 shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                : 'bg-red-600/90 text-white hover:bg-red-500 shadow-[0_0_12px_rgba(255,0,0,0.3)]'
            }`}
          >
            {isCorrupted ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Bit Original (0 Anomalías)</span>
              </>
            ) : (
              <>
                <Binary className="w-3.5 h-3.5" />
                <span>Simular Ataque: Inyectar 1-Bit Corrupto</span>
              </>
            )}
          </button>
        </div>

        {/* Symmetry Status Alert */}
        <div className={`mt-4 p-3.5 rounded-lg border flex items-start gap-3 text-xs ${
          isCorrupted
            ? 'bg-red-950/40 border-red-500/40 text-red-200'
            : 'bg-[#071d11]/70 border-[#00ff66]/20 text-emerald-300'
        }`}>
          {isCorrupted ? (
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[#00ff66] shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-semibold">
              {isCorrupted
                ? '¡RUPTURA DE LA SIMETRÍA DEL TETRAEDRO DETECTADA!'
                : 'Invariancia Geométrica Verificada: Simetría Euclidiana Perfecta (100.0%)'}
            </p>
            <p className="text-[11px] text-gray-400">
              {isCorrupted
                ? 'Se ha modificado exactamente 1 bit en el documento. Por el efecto avalancha y el principio de M. Franco León, las aristas del tetraedro han perdido su razón constante, quebrando el determinante de Cayley-Menger e invalidando el contenedor de residuos Ad Hoc.'
                : 'El documento está protegido y sellado matemáticamente en tu navegador. Cualquier alteración de incluso 1 solo bit romperá de forma irreversible la simetría tridimensional del tetraedro.'}
            </p>
          </div>
        </div>

        {/* Dual Artifacts: Símplex Key & Ad Hoc Residue Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          {/* 1. Clave Matemática Única (El Símplex) */}
          <div className="p-4 rounded-lg bg-[#040806] border border-[#00ff66]/20">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#00ff66]/10">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#00ff66]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Clave Matemática del Símplex (ℝ³)
                </span>
              </div>
              <button
                onClick={handleCopyKey}
                className="px-2 py-0.5 rounded text-[11px] bg-[#0d2114] border border-[#00ff66]/30 text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedKey ? <Check className="w-3 h-3 text-[#00ff66]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="font-mono text-xs text-emerald-400/90 break-all bg-[#020403] p-2.5 rounded border border-[#00ff66]/10 select-all">
              {shieldData.simplexKey}
            </div>

            <div className="mt-3 text-[11px] text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Vértices del Símplex:</span>
                <span className="text-emerald-300 font-mono">4 Vértices Equidistantes</span>
              </div>
              <div className="flex justify-between">
                <span>Determinante Cayley-Menger:</span>
                <span className={`font-mono ${isCorrupted ? 'text-red-400 font-bold' : 'text-emerald-300'}`}>
                  {shieldData.cayleyMengerDet.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Índice de Simetría:</span>
                <span className={`font-mono font-bold ${isCorrupted ? 'text-red-400' : 'text-[#00ff66]'}`}>
                  {shieldData.symmetryScore.toFixed(1)}% {isCorrupted ? '(Deformado)' : '(Óptimo)'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Contenedor de Residuos "Ad Hoc" */}
          <div className="p-4 rounded-lg bg-[#040806] border border-[#00ff66]/20">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#00ff66]/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Contenedor de Residuos &ldquo;Ad Hoc&rdquo;
                </span>
              </div>
              <button
                onClick={handleCopyResidue}
                className="px-2 py-0.5 rounded text-[11px] bg-[#091a1d] border border-cyan-500/30 text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedResidue ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedResidue ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="font-mono text-xs text-cyan-400/90 break-all bg-[#020403] p-2.5 rounded border border-cyan-500/20 select-all">
              {shieldData.adHocResidue.vectorHash}
            </div>

            <div className="mt-3 text-[11px] text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Cuadrantes Vectoriales:</span>
                <span className="text-cyan-300 font-mono">
                  [Rx: 0x{shieldData.adHocResidue.rx.slice(0, 4)} | Ry: 0x{shieldData.adHocResidue.ry.slice(0, 4)}]
                </span>
              </div>
              <div className="flex justify-between">
                <span>Baricentro Residual [X, Y, Z]:</span>
                <span className="text-cyan-300 font-mono">
                  ({shieldData.adHocResidue.barycenter[0].toFixed(2)}, {shieldData.adHocResidue.barycenter[1].toFixed(2)}, {shieldData.adHocResidue.barycenter[2].toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estado de Verificación:</span>
                <span className={`font-mono font-bold ${isCorrupted ? 'text-red-400' : 'text-cyan-300'}`}>
                  {isCorrupted ? 'FALLO: RESIDUO INCOHERENTE' : 'VÁLIDO (Local Zero-Trust)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Edges Metric Table */}
        <div className="mt-4 pt-3 border-t border-[#00ff66]/15">
          <div className="text-xs font-semibold text-gray-300 mb-2 flex items-center justify-between">
            <span>Métricas de Aristas Tridimensionales del Tetraedro:</span>
            <span className="text-[11px] text-gray-400 font-normal">
              {isCorrupted ? 'Aristas desfasadas por inyección de bit' : 'Equidistancia teórica: d = 2.45 u'}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {shieldData.edgeLengths.map((len, idx) => {
              const labels = ['d(0,1)', 'd(0,2)', 'd(0,3)', 'd(1,2)', 'd(1,3)', 'd(2,3)'];
              return (
                <div
                  key={idx}
                  className={`p-2 rounded text-center border font-mono ${
                    isCorrupted && Math.abs(len - 2.54) > 0.3
                      ? 'bg-red-950/60 border-red-500/50 text-red-300'
                      : 'bg-[#040805] border-[#00ff66]/15 text-emerald-300'
                  }`}
                >
                  <div className="text-[10px] text-gray-400">{labels[idx]}</div>
                  <div className="text-xs font-bold mt-0.5">{len.toFixed(3)} u</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
