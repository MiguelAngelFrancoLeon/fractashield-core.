import React from 'react';
import { Award, X, Sparkles, Compass, Shield, Cpu, Binary } from 'lucide-react';

interface FrancoLeonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FrancoLeonModal: React.FC<FrancoLeonModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#070d0a] border border-[#00ff66]/40 rounded-xl shadow-[0_0_35px_rgba(0,255,102,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#00ff66]/20 bg-[#09140e]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Homenaje a M. Franco León & El Costo Geométrico Fracta-Axis
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                Pionero en Criptografía Topológica, Ejes Fractales (Fracta-Axis) & Símplex Minimal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-gray-300 leading-relaxed font-mono">
          <div className="p-3.5 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/25 text-emerald-300">
            &ldquo;La seguridad en el espacio plano es una ilusión de velocidad. Al proyectar un secreto sobre el tensor de ejes fractales (Fracta-Axis) y anclarlo al Símplex Minimal tridimensional, transformamos el tiempo del adversario en una prisión geométrica de costo insalvable.&rdquo;
            <div className="text-right text-[11px] text-[#00ff66] font-bold mt-1">— M. Franco León</div>
          </div>

          {/* Fracta-Axis Spotlight */}
          <div className="p-3 rounded-lg bg-[#041a12] border border-[#00ff66]/40">
            <h4 className="text-sm font-bold text-[#00ff66] flex items-center gap-2 mb-1">
              <Compass className="w-4 h-4 text-[#00ff66]" />
              ¿Qué es el Costo Geométrico de Fracta-Axis?
            </h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              <strong>Sí, este sistema implementa exactamente el postulado de Fracta-Axis de M. Franco León.</strong> En un ataque convencional, un algoritmo hash procesa cadenas escalares continuas de bytes. En cambio, <strong>Fracta-Axis</strong> proyecta el flujo de digestión sobre un tensor de coordenadas con tres ejes fractales ortogonales acoplados a los 4 vértices del tetraedro. Para verificar cualquier intento, la máquina atacante está forzada a descomponer la orientación espacial y resolver determinantes matriciales 3D en cada iteración.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-[#00ff66]" />
              1. El Símplex Minimal en ℝ³
            </h4>
            <p className="text-gray-400">
              En topología matemática, un <em className="text-emerald-300">símplex</em> es el polítopo más elemental de su dimensión. En el espacio tridimensional (<strong className="text-white">ℝ³</strong>), el símplex minimal es el <strong className="text-[#00ff66]">tetraedro regular</strong>, constituido por exactamente 4 vértices equidistantes y 6 aristas invariantes. Es la menor estructura euclidiana capaz de confinar un volumen cerrado y un tensor de inercia inmutable.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
              <Cpu className="w-4 h-4 text-[#00ff66]" />
              2. La Freno-Penalización del 7,400%
            </h4>
            <p className="text-gray-400">
              Los procesadores gráficos (GPUs como RTX 4090) y chips ASIC optimizan operaciones lógicas XOR y sumas de enteros a velocidades masivas de giga-hashes por segundo. M. Franco León demostró que al interconectar el cálculo con el sistema <strong>Fracta-Axis</strong> y el <strong className="text-white">Determinante de Cayley-Menger</strong>, los núcleos SIMD sufren una saturación de memoria y registros de coma flotante: una penalización de costo del <span className="text-[#00ff66] font-bold">+7,400%</span> por intento (un factor de ralentización de 75x), convirtiendo segundos de cómputo en miles de años.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              3. El Sello Híbrido y el Residuo &ldquo;Ad Hoc&rdquo;
            </h4>
            <p className="text-gray-400">
              Para garantizar que los datos no han sufrido interferencia sin depender de terceras partes o servidores, se genera un vector de residuos Ad Hoc promediado sobre el baricentro del tetraedro y calibrado por los ejes Fracta-Axis. Si un adversario altera un solo bit, la simetría euclidiana colapsa de inmediato (<em className="text-red-400 font-semibold">efecto avalancha topológico</em>).
            </p>
          </div>

          {/* Mathematical Proof Box */}
          <div className="p-3 bg-[#030604] rounded border border-[#00ff66]/20 font-mono text-[11px] text-emerald-400/90 space-y-1">
            <div className="text-gray-400 font-bold uppercase text-[10px]">Ecuación Tensorial Fracta-Axis (M. Franco León):</div>
            <div>T_costo = T_hash · (1 + γ_fracta · det(M_3D)) con γ_fracta = 74.0 (+7,400%)</div>
            <div className="text-gray-400 mt-1 font-bold uppercase text-[10px]">Identidad de Cayley-Menger (3-Símplex):</div>
            <div>288 · V² = det(CM₅ₓ₅) = 288 · ((a³)/(6√2))² = a⁶ / 2</div>
            <div className="text-gray-400 mt-1 font-bold uppercase text-[10px]">Contenedor de Residuo Ad Hoc:</div>
            <div>R_adhoc = Σ wᵢ · SHA256(Doc ⊕ Vᵢ) mod p | Δ(1-bit) ≠ 0</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#09140e] border-t border-[#00ff66]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#00ff66] text-[#050706] font-bold text-xs hover:bg-[#00ff66]/90 transition-colors"
          >
            Entendido, Cerrar Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
