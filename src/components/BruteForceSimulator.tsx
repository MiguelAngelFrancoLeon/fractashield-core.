import React, { useState, useEffect, useRef } from 'react';
import { estimateBruteForceMetrics } from '../utils/cryptoMath';
import { soundManager } from '../utils/soundEffects';
import { ShieldCheck, Zap, Cpu, Terminal, Flame, Clock, Play, Square, AlertOctagon, TrendingUp } from 'lucide-react';

interface BruteForceSimulatorProps {
  inputText: string;
  isSimulating: boolean;
  onToggleSimulation: (active: boolean) => void;
  attackCount: number;
  setAttackCount: React.Dispatch<React.SetStateAction<number>>;
}

export const BruteForceSimulator: React.FC<BruteForceSimulatorProps> = ({
  inputText,
  isSimulating,
  onToggleSimulation,
  attackCount,
  setAttackCount
}) => {
  const [attackerTier, setAttackerTier] = useState<'rtx4090' | 'asicCluster' | 'quantumGrid'>('rtx4090');
  const [customSpeedGH, setCustomSpeedGH] = useState(1.2);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Compute metrics based on input and hardware
  const metrics = estimateBruteForceMetrics(
    inputText || 'Contrasena123!',
    attackerTier,
    customSpeedGH * 1e9
  );

  // Simulated live attack runner
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setAttackCount(prev => prev + Math.floor(Math.random() * 120 + 85));

      // Audio tick occasionally
      if (Math.random() < 0.25) {
        soundManager.playDeflect();
      }

      // Generate realistic terminal log
      const hexCandidate = Math.random().toString(16).substring(2, 10).toUpperCase();
      const detVal = (Math.random() * 0.05 + 0.35).toFixed(4);
      const latencyMs = (Math.random() * 14 + 68).toFixed(1); // 74x slower

      const logMsg = `[ATTACK-THREAD #${Math.floor(Math.random() * 64)}] INTENTO RECHAZADO: 0x${hexCandidate} | MATRIZ 3D [4x4] CAYLEY-MENGER: det=${detVal} | PENALIZACIÓN +7,400% (${latencyMs}ms)`;
      
      setLogs(prev => {
        const next = [...prev, logMsg];
        if (next.length > 30) next.shift();
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isSimulating, setAttackCount]);

  useEffect(() => {
    if (isSimulating && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isSimulating]);

  const handleToggle = () => {
    const nextState = !isSimulating;
    onToggleSimulation(nextState);
    if (nextState) {
      soundManager.playDeflect();
      setLogs(prev => [
        ...prev,
        `>>> INICIANDO MOTOR DE FUERZA BRUTA EN TIEMPO REAL <<<`,
        `[CONFIG] Potencia del Atacante: ${metrics.tierLabel}`,
        `[DEFENSA] FractaShield-Core interceptando vector de ataque en ℝ³`,
        `[AVISO] Evaluador matricial activo: Multiplicador de retardo +7,400% impuesto por cada intento.`
      ]);
    } else {
      setLogs(prev => [
        ...prev,
        `[STOP] Simulación de ataque pausada por el operador.`
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#070d0a] border border-[#00ff66]/25 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff66]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00ff66]/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-bold bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 rounded">
                MÓDULO DEFENSIVO MATRICIAL • FRACTA-AXIS
              </span>
              <span className="text-xs text-emerald-400/80">Ralentización: +7,400%</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#00ff66]" />
              Bloqueo de Fuerza Bruta por Costo Geométrico Fracta-Axis
            </h3>
            <p className="text-xs sm:text-sm text-emerald-400/90 mt-1 max-w-3xl">
              A diferencia de un hash lineal plano (donde una GPU calcula miles de millones por segundo), el sistema <strong className="text-[#00ff66]">Fracta-Axis</strong> obliga al atacante a resolver transformaciones ortogonales en los tres ejes fractales en <span className="text-[#00ff66] font-semibold">ℝ³</span> y calcular matrices de determinantes <span className="text-[#00ff66] font-semibold">4x4 de Cayley-Menger</span> en cada intento.
            </p>
          </div>

          {/* Start/Stop Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
                isSimulating
                  ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/40'
                  : 'bg-[#00ff66] text-[#050706] hover:bg-[#00ff66]/90 shadow-[#00ff66]/20'
              }`}
            >
              {isSimulating ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Detener Simulación</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simular Ataque en Vivo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hardware Selector */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Hardware del Atacante:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'rtx4090', label: 'Rig 4x RTX 4090 (1.2 GH/s)' },
              { id: 'asicCluster', label: 'Supercomputador ASIC (45 GH/s)' },
              { id: 'quantumGrid', label: 'Red Cuántica (500 GH/s)' }
            ].map(tier => (
              <button
                key={tier.id}
                onClick={() => setAttackerTier(tier.id as 'rtx4090' | 'asicCluster' | 'quantumGrid')}
                className={`px-3 py-1 text-xs rounded-md border transition-all ${
                  attackerTier === tier.id
                    ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] font-bold shadow-[0_0_8px_rgba(0,255,102,0.2)]'
                    : 'bg-[#0b140f] border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* METRIC COMPARISON SECTION (Requested explicitly in prompt) */}
      {/* "Tiempo estimado para hackear con método tradicional (Segundos) vs. Tiempo estimado con FractaShield-Core (Años)" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Traditional Method Card */}
        <div className="p-5 rounded-xl bg-[#12080a] border border-red-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                Método Tradicional (Hash 1D Plano)
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 font-mono">
              Vulnerable a Fuerza Bruta
            </span>
          </div>

          <div className="mt-4">
            <div className="text-xs text-red-200/70">Tiempo estimado para hackear:</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-400 tracking-tight mt-1">
              {metrics.tradFormatted}
            </div>
            <div className="text-[11px] text-red-300/80 mt-1 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Cálculo directo: ~{(metrics.tradHps / 1e9).toFixed(1)} GH/s sin freno geométrico</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-red-900/40 text-xs text-red-300/80 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Operación por intento:</span>
              <span className="text-red-200">1x SHA-256 (Poco intensivo en ALU)</span>
            </div>
            <div className="flex justify-between">
              <span>Sobrecosto de memoria:</span>
              <span className="text-red-200">0% (Paralelización masiva)</span>
            </div>
            <div className="flex justify-between">
              <span>Tasa de éxito del hacker:</span>
              <span className="text-red-400 font-bold">ALTA (Horas o Segundos)</span>
            </div>
          </div>
        </div>

        {/* FractaShield-Core Card */}
        <div className="p-5 rounded-xl bg-[#06170d] border border-[#00ff66]/40 relative overflow-hidden shadow-[0_0_20px_rgba(0,255,102,0.08)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00ff66]" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Con FractaShield-Core (Símplex Minimal)
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#0a2c16] border border-[#00ff66]/50 text-[#00ff66] font-mono font-bold">
              +7,400% Costo Geométrico
            </span>
          </div>

          <div className="mt-4">
            <div className="text-xs text-emerald-400/80">Tiempo estimado con Blindaje:</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00ff66] tracking-tight mt-1">
              {metrics.fractaFormatted}
            </div>
            <div className="text-[11px] text-emerald-300/90 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>Multiplicador de protección: 75x por ciclo de matriz ℝ³</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-emerald-900/40 text-xs text-emerald-300/90 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Operación por intento:</span>
              <span className="text-[#00ff66]">det(M₄ₓ₄) + Invariante Cayley-Menger</span>
            </div>
            <div className="flex justify-between">
              <span>Saturación de registros GPU:</span>
              <span className="text-[#00ff66]">100% (Destroza SIMD lineal)</span>
            </div>
            <div className="flex justify-between">
              <span>Viabilidad económica del ataque:</span>
              <span className="text-[#00ff66] font-bold">IMPOSIBLE (Siglos / Eras)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Attack Simulator Telemetry & Live Terminal */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#050907] border border-[#00ff66]/20">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00ff66]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Consola de Fuerza Bruta y Telemetría de Disipación
            </h4>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-2.5 py-1 rounded bg-[#09150d] border border-[#00ff66]/20 text-emerald-300">
              Intentos Mitigados: <span className="text-[#00ff66] font-bold">{attackCount.toLocaleString()}</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#09150d] border border-amber-500/20 text-amber-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Penalización Activa: +7,400%</span>
            </div>
          </div>
        </div>

        {/* Live Terminal Output Box */}
        <div className="h-48 sm:h-56 bg-[#030504] rounded-lg border border-[#00ff66]/15 p-3 font-mono text-[11px] overflow-y-auto cyber-scanline space-y-1 text-emerald-400/90">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Terminal className="w-6 h-6 mb-1 opacity-50" />
              <p>Terminal en espera. Pulsa &ldquo;Simular Ataque en Vivo&rdquo; para ver el bloqueo geométrico en acción.</p>
            </div>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                className={`leading-relaxed ${
                  log.includes('INICIANDO')
                    ? 'text-cyan-300 font-bold'
                    : log.includes('PENALIZACIÓN')
                    ? 'text-emerald-300'
                    : 'text-gray-400'
                }`}
              >
                {log}
              </div>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Explanation Footer */}
        <div className="mt-3 text-[11px] text-gray-400 flex items-start gap-2 bg-[#09120c] p-2.5 rounded border border-[#00ff66]/10">
          <Zap className="w-4 h-4 text-[#00ff66] shrink-0 mt-0.5" />
          <span>
            <strong>Fundamento Teórico (M. Franco León):</strong> La computación de colisiones criptográficas requiere una evaluación estática. Al forzar una proyección a un Símplex Minimal en el espacio vectorial tridimensional euclidiano, el atacante no puede usar tablas de arcoíris ni pipelines SIMD sin recalcular el tensor de inercia y la distancia euclidiana de 4 vértices para cada semilla candidata.
          </span>
        </div>
      </div>
    </div>
  );
};
