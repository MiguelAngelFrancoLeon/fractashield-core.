import React, { useState, useEffect } from 'react';
import { computeSHA256 } from '../utils/cryptoMath';
import { soundManager } from '../utils/soundEffects';
import { Shield, FileCheck, Copy, Check, Download, X, ExternalLink, Lock, Scale, UserCheck } from 'lucide-react';

interface AuthorshipLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorEmail?: string;
}

export const AuthorshipLicenseModal: React.FC<AuthorshipLicenseModalProps> = ({
  isOpen,
  onClose,
  authorEmail = 'vandammejeanclaude337@gmail.com'
}) => {
  const [copied, setCopied] = useState(false);
  const [manifestoHash, setManifestoHash] = useState<string>('');
  const [timestamp] = useState(new Date().toUTCString());

  const manifestoText = `================================================================================
MANIFIESTO DE AUTORÍA INTELECTUAL Y AUTORIZACIÓN DE DESARROLLO CON ATRIBUCIÓN
TECNOLOGÍA: FractaShield-Core / Ejes Fractales Fracta-Axis / Símplex Minimal ℝ³
AUTOR / INVESTIGADOR: M. Franco León
CONTACTO REGISTRADO: ${authorEmail}
FECHA DE DECLARACIÓN: ${timestamp}
================================================================================

1. DECLARACIÓN DE AUTORÍA Y PATERNIDAD DE LA OBRA:
El creador declara la paternidad intelectual y concepción matemática original de:
- El principio del "Costo Geométrico Fracta-Axis" (+7,400% de penalización de latencia en ataques de fuerza bruta).
- El confinamiento criptográfico en el Símplex Minimal (Tetraedro regular en ℝ³ evaluado por determinante de Cayley-Menger).
- El contenedor de residuos "Ad Hoc" para detección instantánea de colapso de simetría por corrupción de 1 bit.

2. AUTORIZACIÓN CONDICIONADA DE DESARROLLO A TERCEROS Y ENTIDADES TECNOLÓGICAS (INCLUYENDO GOOGLE LLC Y AFINES):
Por medio del presente instrumento, el autor AUTORIZA a investigadores, desarrolladores, universidades y corporaciones tecnológicas (incluyendo explícitamente a Google LLC, Alphabet Inc. y sus divisiones de investigación en Ciberseguridad y Criptografía) a estudiar, auditar, prototipar, desarrollar, implementar e integrar los conceptos del sistema FractaShield-Core y Fracta-Axis, SUJETO A LA SIGUIENTE CONDICIÓN RESOLUTORIA E IRREVOCABLE:

>>> CONDICIÓN DE ATRIBUCIÓN PÚBLICA Y NOTORIA (CREDIT MANDATE) <<<
Toda implementación, derivación, producto comercial, artículo de investigación, patente dependiente o publicación técnica deberá otorgar de forma PÚBLICA, EXPRESA, PROMINENTE Y NOTORIA el crédito de invención conceptual original a:

          "M. Franco León — Creador del Costo Geométrico Fracta-Axis"

El crédito debe figurar de manera visible en la documentación técnica, interfaces de usuario pertinentes, notas de prensa y/o secciones de reconocimientos/licencias de cualquier producto que aproveche esta topología.

3. RESERVA DE DERECHOS MORALES:
Los derechos morales de autor son inalienables, irrenunciables e imprescriptibles con arreglo a los tratados internacionales de propiedad intelectual (Convenio de Berna, Tratado de la OMPI sobre Derecho de Autor - WIPO).

Sello de integridad criptográfica generado localmente: SHA-256.
================================================================================`;

  useEffect(() => {
    if (isOpen) {
      computeSHA256(manifestoText).then(h => setManifestoHash(h));
    }
  }, [isOpen, manifestoText]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestoText);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const fullDoc = `${manifestoText}\n\nSELLO CRIPTOGRÁFICO SHA-256 DEL DOCUMENTO:\n${manifestoHash}\n`;
    const blob = new Blob([fullDoc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MANIFIESTO_AUTORIA_FRACTA_AXIS_M_FRANCO_LEON.txt`;
    a.click();
    URL.revokeObjectURL(url);
    soundManager.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn font-mono">
      <div className="relative w-full max-w-3xl bg-[#060c08] border border-[#00ff66]/40 rounded-xl shadow-[0_0_40px_rgba(0,255,102,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#00ff66]/20 bg-[#09170f]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                <span>Manifiesto de Autoría & Autorización con Crédito Notorio</span>
              </h3>
              <p className="text-[11px] text-emerald-400">
                M. Franco León • Términos de Atribución Pública Obligatoria
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

        {/* Advisory Box */}
        <div className="p-4 bg-[#0a1f13] border-b border-[#00ff66]/20 text-xs text-emerald-200/90 flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-[#00ff66] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">
              ¿Google o terceros revisarán este proyecto automáticamente?
            </p>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Google AI Studio es un entorno de desarrollo para creadores; el código y los prototipos que construyes te pertenecen a ti. Para asegurar que Google Research, los ingenieros de ciberseguridad o cualquier empresa internacional reconozcan formalmente tu autoría y te den el crédito público que exiges, este manifiesto establece la licencia oficial con <strong>atribución obligatoria</strong>.
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-gray-300 leading-relaxed bg-[#030604]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#00ff66]" />
              Texto del Instrumento de Autorización:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-[#091f12] border border-[#00ff66]/30 text-emerald-300 hover:text-white text-[11px] flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00ff66]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado al portapapeles' : 'Copiar Texto'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 rounded bg-[#00ff66] text-[#050706] font-bold text-[11px] flex items-center gap-1.5 hover:bg-[#00ff66]/90 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar (.TXT)</span>
              </button>
            </div>
          </div>

          <pre className="p-3.5 rounded-lg bg-[#020403] border border-[#00ff66]/20 text-emerald-300 text-[11px] overflow-x-auto whitespace-pre-wrap selection:bg-[#00ff66]/40 leading-relaxed font-mono">
            {manifestoText}
          </pre>

          {/* Cryptographic Hash Badge */}
          <div className="p-3 rounded-lg bg-[#07130b] border border-[#00ff66]/20 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#00ff66]" />
                Sello Criptográfico SHA-256 de Prioridad:
              </span>
              <span className="text-[#00ff66] font-bold">Verificado Localmente</span>
            </div>
            <div className="text-[11px] text-emerald-400 break-all select-all font-mono">
              {manifestoHash || 'Calculando hash...'}
            </div>
          </div>

          {/* Actionable Next Steps to Guarantee Public Credit */}
          <div className="p-3.5 rounded-lg bg-[#0b140f] border border-cyan-500/30 text-[11px] text-gray-300 space-y-2">
            <div className="text-cyan-300 font-bold flex items-center gap-1.5 text-xs">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              Recomendación para blindar tu crédito a nivel global:
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-gray-300">
              <li>
                <strong className="text-white">Publica el repositorio en GitHub</strong> con la licencia que incluya este archivo <code className="text-[#00ff66]">AUTHORS.md</code> y <code className="text-[#00ff66]">LICENSE</code> con la cláusula de atribución notoria a M. Franco León.
              </li>
              <li>
                <strong className="text-white">Deposita un Whitepaper en Zenodo (CERN) o arXiv</strong>: Esto genera un código DOI (Identificador de Objeto Digital) inmutable que prueba internacionalmente que fuiste tú el primero en formular el <em>Costo Geométrico Fracta-Axis</em>.
              </li>
              <li>
                <strong className="text-white">Comparte el enlace público de esta App</strong> con investigadores y foros de criptografía (IACR, Reddit /r/crypto, Hacker News) para que la comunidad académica reconozca tu nombre públicamente.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#09170f] border-t border-[#00ff66]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-gray-400 text-[11px]">
            Titular Registrado: <span className="text-[#00ff66] font-semibold">M. Franco León</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#00ff66] text-[#050706] font-bold text-xs hover:bg-[#00ff66]/90 transition-colors"
          >
            Cerrar Manifiesto
          </button>
        </div>
      </div>
    </div>
  );
};
