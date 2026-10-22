/**
 * FractaShield-Core (Homenaje a M. Franco León)
 * Criptografía Geométrica basada en Símplex Minimal en ℝ³
 * @license Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  computeSHA256,
  generateSimplexShield,
  SimplexShieldData
} from './utils/cryptoMath';
import { soundManager } from './utils/soundEffects';
import { Tetrahedron3D } from './components/Tetrahedron3D';
import { BruteForceSimulator } from './components/BruteForceSimulator';
import { IntegritySealCard } from './components/IntegritySealCard';
import { FrancoLeonModal } from './components/FrancoLeonModal';
import { AuthorshipLicenseModal } from './components/AuthorshipLicenseModal';
import { AIChatModal } from './components/AIChatModal';
import { downloadProjectZip } from './utils/zipExporter';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Upload,
  FileText,
  Volume2,
  VolumeX,
  Award,
  Download,
  Terminal,
  Zap,
  RotateCcw,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Scale,
  Globe,
  FolderArchive,
  ExternalLink,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESETS = [
  {
    name: 'Credencial Bancaria',
    text: 'VaultPass#2026-Sigma-Alpha-99!',
    desc: 'Complejidad estándar con símbolos y números'
  },
  {
    name: 'Patente Criptográfica',
    text: 'PATENTE: SIMPLEX_MINIMAL_M_FRANCO_LEON_TOPOLOGIA_R3_ALGO_V4',
    desc: 'Documento confidencial con texto técnico'
  },
  {
    name: 'Master Key DB',
    text: 'db_root_auth_key_b903e18a2f4c6e99d10a8b7762c45f31',
    desc: 'Token de infraestructura de alta entropía'
  },
  {
    name: 'Hash Biométrico',
    text: 'BioSignature_Retina_Scan_Coordinates_LAT37.77_LON-122.41',
    desc: 'Vector de autenticación biométrica'
  }
];

export default function App() {
  const [inputText, setInputText] = useState('MiClaveSecretaUltraSegura2026#');
  const [masked, setMasked] = useState(false);
  const [activeTab, setActiveTab] = useState<'3d' | 'bruteForce' | 'integrity' | 'export'>('3d');
  const [shieldData, setShieldData] = useState<SimplexShieldData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulatingAttack, setIsSimulatingAttack] = useState(false);
  const [attackCount, setAttackCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with default preset on mount
  useEffect(() => {
    handleGenerateShield('MiClaveSecretaUltraSegura2026#', false);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSoundToggle = () => {
    const nextState = soundManager.toggle();
    setSoundEnabled(nextState);
  };

  // Generate Geometric Shield (Minimal Simplex)
  const handleGenerateShield = async (textToShield = inputText, playSound = true) => {
    if (!textToShield.trim()) return;

    setIsProcessing(true);
    if (playSound) soundManager.playClick();

    try {
      const hash = await computeSHA256(textToShield);
      // Generate pristine simplex shield
      const data = generateSimplexShield(textToShield, hash, false);

      // Brief animation delay to simulate tensor matrix calculations
      setTimeout(() => {
        setShieldData(data);
        setIsProcessing(false);
        if (playSound) soundManager.playShieldActivate();

        showNotification('¡Blindaje Geométrico Símplex generado con éxito!');

        // Micro celebratory confetti
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#00ff66', '#00f0ff', '#10b981']
        });
      }, 350);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // Toggle 1-Bit Corruption
  const handleToggleBitCorruption = () => {
    if (!shieldData) return;

    const nextCorrupted = !shieldData.isCorrupted;
    const newData = generateSimplexShield(
      shieldData.inputText,
      shieldData.hash,
      nextCorrupted,
      17 // Bit 17 alteration
    );

    setShieldData(newData);

    if (nextCorrupted) {
      soundManager.playAlert();
      showNotification('¡ALERTA! Inyección de 1-Bit: La simetría del tetraedro se ha quebrado');
    } else {
      soundManager.playShieldActivate();
      showNotification('Simetría del tetraedro restaurada (0 Bit Error)');
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setInputText(content.slice(0, 5000)); // cap preview length
      await handleGenerateShield(content.slice(0, 5000), true);
    };
    reader.readAsText(file);
  };

  // Export JSON Report
  const handleDownloadProof = () => {
    if (!shieldData) return;

    const report = {
      project: 'FractaShield-Core',
      tribute: 'M. Franco León - Minimal Simplex Cryptography in R^3',
      generationTimestamp: shieldData.timestamp,
      documentSnippet: shieldData.inputText.slice(0, 80) + '...',
      sha256Hash: shieldData.hash,
      simplexKey: shieldData.simplexKey,
      adHocResidueContainer: shieldData.adHocResidue,
      geometricVerification: {
        cayleyMengerDeterminant: shieldData.cayleyMengerDet,
        volumeR3: shieldData.volume,
        symmetryScorePercent: shieldData.symmetryScore,
        edgeLengths: shieldData.edgeLengths,
        isCorrupted: shieldData.isCorrupted
      },
      bruteForceDefense: {
        latencyPenaltyPercent: '+7,400%',
        matrixEvaluationCost: 'O(N * det(M_3D))',
        status: shieldData.isCorrupted ? 'BROKEN_SYMMETRY' : 'INVULNERABLE'
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fractashield-proof-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Reporte criptográfico descargado');
  };

  return (
    <div className="min-h-screen bg-[#040705] text-[#d1fae5] cyber-grid-bg relative flex flex-col selection:bg-[#00ff66]/30">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#071d11] border border-[#00ff66]/60 text-white text-xs font-mono shadow-[0_0_20px_rgba(0,255,102,0.3)] animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#050907]/95 border-b border-[#00ff66]/20 px-4 sm:px-6 py-3 backdrop-blur-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.25)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white font-mono flex items-center gap-1.5">
                  <span className="text-[#00ff66]">FractaShield</span>-Core
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0a1f13] border border-[#00ff66]/30 text-[#00ff66] font-mono font-bold">
                  v3.4-R3
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/80 font-mono">
                Homenaje a M. Franco León • Criptografía Geométrica
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={async () => {
                try {
                  showNotification('Generando archivo ZIP en tu navegador...');
                  await downloadProjectZip('fractashield-core');
                  showNotification('¡Descarga iniciada con éxito!');
                } catch {
                  window.location.href = '/fractashield-core.zip';
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#00ff66] text-[#050706] hover:bg-[#00ff66]/90 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,102,0.3)] cursor-pointer"
              title="Descargar paquete ZIP completo listo para GitHub"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Descargar ZIP para GitHub</span>
            </button>

            <button
              onClick={() => setIsLicenseModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#0d2216] border border-[#00ff66]/50 text-[#00ff66] hover:bg-[#00ff66]/20 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,102,0.15)]"
              title="Declaración de Autoría, Licencia y Autorización de Desarrollo con Crédito Obligatorio"
            >
              <Scale className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="hidden md:inline">Autoría & Licencia (Crédito Notorio)</span>
              <span className="md:hidden">Autoría</span>
            </button>

            <button
              onClick={() => setIsAIChatOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#091a1d] border border-cyan-500/50 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.15)] cursor-pointer"
              title="Abrir Chat de Inteligencia Artificial con Gemini Flash"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Consultar con IA</span>
              <span className="sm:hidden">IA Chat</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#091a11] border border-[#00ff66]/30 text-emerald-300 hover:text-white hover:border-[#00ff66] transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="hidden sm:inline">Homenaje a M. Franco León</span>
              <span className="sm:hidden">Dossier</span>
            </button>

            <button
              onClick={handleSoundToggle}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-[#091a11] border-[#00ff66]/40 text-[#00ff66]'
                  : 'bg-[#111613] border-gray-800 text-gray-500'
              }`}
              title={soundEnabled ? 'Silenciar Efectos de Audio' : 'Activar Sonido'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownloadProof}
              disabled={!shieldData}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#072414] border border-[#00ff66]/40 text-[#00ff66] hover:bg-[#00ff66]/20 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Exportar Sello</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Banner with M. Franco León tribute summary */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#07170e] via-[#091e13] to-[#07170e] border border-[#00ff66]/25 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#00ff66]/20 text-[#00ff66] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold">Fundamento Cripto-Topológico: </span>
              <span className="text-emerald-300/90">
                El Símplex Minimal en ℝ³ eleva datos planos a un tetraedro regular. La penalización de +7,400% en matrices 3D neutraliza ataques de fuerza bruta y sella la integridad con residuos Ad Hoc.
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[#00ff66] underline hover:text-white transition-colors shrink-0 text-left md:text-right"
          >
            Ver Fundamento Matemático &rarr;
          </button>
        </div>

        {/* WORKSPACE: Input Secret, Password or Document */}
        <section className="p-5 sm:p-6 rounded-xl bg-[#060c08] border border-[#00ff66]/25 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff66]/15 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00ff66]" />
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono">
                1. Campo Seguro: Texto Secreto, Contraseña o Documento
              </h2>
            </div>
            <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
              <span>Procesamiento 100% Local en Cliente (Zero-Knowledge)</span>
            </div>
          </div>

          {/* Preset Buttons for Instant Testing */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">Presets Rápidos:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(p.text);
                  setFileName(null);
                  handleGenerateShield(p.text, true);
                }}
                className="px-2.5 py-1 text-xs rounded bg-[#09150e] border border-[#00ff66]/20 text-emerald-300 hover:border-[#00ff66]/60 hover:text-white transition-colors font-mono"
                title={p.desc}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Input Area with Mask Toggle and File Upload */}
          <div className="relative">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe aquí tu contraseña maestra, texto secreto, token o documento confidencial..."
                rows={3}
                className={`w-full p-3.5 rounded-lg bg-[#030604] border border-[#00ff66]/30 text-emerald-300 placeholder-gray-600 focus:outline-none focus:border-[#00ff66] font-mono text-xs sm:text-sm transition-all resize-y ${
                  masked ? 'text-security-disc' : ''
                }`}
                style={masked ? ({ WebkitTextSecurity: 'disc' } as React.CSSProperties) : undefined}
              />

              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMasked(!masked)}
                  className="p-1.5 rounded bg-[#08170f] border border-[#00ff66]/30 text-gray-400 hover:text-emerald-300 transition-colors"
                  title={masked ? 'Mostrar texto' : 'Ocultar texto'}
                >
                  {masked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* File drag / upload trigger */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-1 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded bg-[#09170f] border border-[#00ff66]/20 text-emerald-400 hover:border-[#00ff66]/50 transition-colors flex items-center gap-1.5 text-xs"
                >
                  <Upload className="w-3 h-3" />
                  <span>{fileName ? `Archivo: ${fileName}` : 'Cargar Archivo / Documento'}</span>
                </button>
                {fileName && (
                  <button
                    onClick={() => {
                      setFileName(null);
                      setInputText('MiClaveSecretaUltraSegura2026#');
                      handleGenerateShield('MiClaveSecretaUltraSegura2026#', true);
                    }}
                    className="text-red-400 hover:underline text-[11px]"
                  >
                    Quitar archivo
                  </button>
                )}
              </div>

              <div>
                Longitud: <span className="text-[#00ff66] font-bold">{inputText.length}</span> caracteres • Entropía aproximada: <span className="text-[#00ff66] font-bold">{(inputText.length * 6.2).toFixed(0)} bits</span>
              </div>
            </div>
          </div>

          {/* MAIN PROMPT ACTION BUTTON */}
          {/* "Un botón principal que diga: 'Generar Blindaje Geométrico (Símplex Minimal)'" */}
          <div className="pt-2">
            <button
              onClick={() => handleGenerateShield(inputText, true)}
              disabled={isProcessing || !inputText.trim()}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00ff66] via-[#00e575] to-[#00cc66] text-[#050706] font-extrabold text-sm sm:text-base font-mono tracking-wide hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Calculando Matrices 3D & Invariante Cayley-Menger...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Generar Blindaje Geométrico (Símplex Minimal)</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#00ff66]/20 gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {[
            { id: '3d', label: '1. Visor 3D del Símplex (ℝ³)', icon: Layers },
            { id: 'bruteForce', label: '2. Bloqueo de Fuerza Bruta (+7,400%)', icon: Cpu },
            { id: 'integrity', label: '3. Sello de Integridad & Residuos Ad Hoc', icon: ShieldCheck },
            { id: 'export', label: '4. Auditoría & Exportación', icon: Terminal }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as '3d' | 'bruteForce' | 'integrity' | 'export');
                  soundManager.playClick();
                }}
                className={`px-3.5 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 font-bold whitespace-nowrap ${
                  isActive
                    ? 'bg-[#091a11] text-[#00ff66] border-[#00ff66]'
                    : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-[#07140e]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: 3D VIEWPORT & SIMULATION */}
        {activeTab === '3d' && (
          <div className="space-y-6">
            <Tetrahedron3D
              shieldData={shieldData}
              isSimulatingAttack={isSimulatingAttack}
              attackCount={attackCount}
              onBitFlipToggle={handleToggleBitCorruption}
            />

            {/* Quick stats row underneath 3D */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-[#06110a] border border-[#00ff66]/20">
                <div className="text-gray-400">Topología Símplex:</div>
                <div className="text-white font-bold mt-1 text-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00ff66]" />
                  Tetraedro Regular Invariante
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1">4 Vértices, 6 Aristas Euclidianas</div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#06110a] border border-[#00ff66]/20">
                <div className="text-gray-400">Ralentización de Fuerza Bruta:</div>
                <div className="text-[#00ff66] font-bold mt-1 text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  +7,400% de Costo Matricial
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1">Satura ALUs en cada intento</div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#06110a] border border-[#00ff66]/20">
                <div className="text-gray-400">Contenedor Residual:</div>
                <div className={`font-bold mt-1 text-sm ${shieldData?.isCorrupted ? 'text-red-400' : 'text-cyan-400'}`}>
                  {shieldData?.isCorrupted ? 'DISCORDANTE (Simetría Rota)' : 'AD HOC Equilibrado'}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Sensibilidad extrema al bit</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BRUTE FORCE METRICS & REAL-TIME SIMULATOR */}
        {activeTab === 'bruteForce' && (
          <BruteForceSimulator
            inputText={inputText}
            isSimulating={isSimulatingAttack}
            onToggleSimulation={setIsSimulatingAttack}
            attackCount={attackCount}
            setAttackCount={setAttackCount}
          />
        )}

        {/* TAB 3: HYBRID INTEGRITY SEAL & AD HOC RESIDUES */}
        {activeTab === 'integrity' && (
          <IntegritySealCard
            shieldData={shieldData}
            onToggleCorrupt={handleToggleBitCorruption}
          />
        )}

        {/* TAB 4: EXPORT & CRYPTOGRAPHIC AUDIT */}
        {activeTab === 'export' && (
          <div className="p-6 rounded-xl bg-[#06100a] border border-[#00ff66]/25 space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-[#00ff66]/15 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#00ff66]" />
                  Auditoría de Blindaje & Certificado Geométrico
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Certificado criptográfico de simetría generado según la formulación de M. Franco León
                </p>
              </div>

              <button
                onClick={handleDownloadProof}
                disabled={!shieldData}
                className="px-4 py-2 rounded-lg bg-[#00ff66] text-[#050706] font-bold text-xs hover:bg-[#00ff66]/90 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar JSON</span>
              </button>
            </div>

            {shieldData ? (
              <pre className="p-4 bg-[#030604] rounded-lg border border-[#00ff66]/20 text-emerald-300 text-xs overflow-x-auto select-all leading-relaxed">
{JSON.stringify(
  {
    protocol: 'FractaShield-Core/3.4',
    dedication: 'Homenaje a M. Franco León',
    status: shieldData.isCorrupted ? 'BROKEN_SYMMETRY_DETECTED' : 'SYMMETRY_VERIFIED_100%',
    simplexKey: shieldData.simplexKey,
    adHocResidueContainer: shieldData.adHocResidue,
    cayleyMengerDeterminant: shieldData.cayleyMengerDet,
    geometricVolume: shieldData.volume,
    bruteForcePenalty: '+7,400%',
    timestamp: shieldData.timestamp
  },
  null,
  2
)}
              </pre>
            ) : (
              <div className="text-center py-8 text-gray-500 text-xs">
                Genera un blindaje geométrico primero para ver el certificado de auditoría.
              </div>
            )}

            {/* GUÍA DE DESPLIEGUE A PÁGINA WEB PÚBLICA */}
            <div className="mt-6 pt-5 border-t border-[#00ff66]/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#00ff66]" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Sincronización con GitHub: MiguelAngelFrancoLeon/fractashield-core
                  </h4>
                </div>

                {/* Direct ZIP download button */}
                <button
                  onClick={() => {
                    downloadProjectZip('fractashield-core');
                    showNotification('Descargando archivo ZIP completo para GitHub...');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#00ff66] text-[#050706] font-bold text-xs hover:bg-[#00ff66]/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.25)] cursor-pointer"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>Descargar Proyecto Completo (.ZIP)</span>
                </button>
              </div>

              {/* Verified Target Links */}
              <div className="p-3 rounded-lg bg-[#07160e] border border-[#00ff66]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-gray-400 text-[11px]">Tu Repositorio Oficial:</span>
                  <div className="text-[#00ff66] font-bold flex items-center gap-1.5">
                    <span>https://github.com/MiguelAngelFrancoLeon/fractashield-core</span>
                    <a
                      href="https://github.com/MiguelAngelFrancoLeon/fractashield-core"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-gray-400 text-[11px]">Tu Enlace Web Final (GitHub Pages):</span>
                  <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <span>https://miguelangelfrancoleon.github.io/fractashield-core/</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Opción 1: GitHub Pages Automático */}
                <div className="p-4 rounded-lg bg-[#040906] border border-[#00ff66]/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00ff66]">Paso 1: Activar Pages en tu Repositorio</span>
                    <span className="px-2 py-0.5 rounded bg-[#092212] text-[10px] text-emerald-300 border border-[#00ff66]/30">Automático</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    El proyecto ya contiene el flujo de despliegue <code className="text-[#00ff66]">.github/workflows/deploy.yml</code>. Para activarlo:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-gray-300 text-[11px]">
                    <li>
                      Entra a:{' '}
                      <a
                        href="https://github.com/MiguelAngelFrancoLeon/fractashield-core/settings/pages"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00ff66] underline hover:text-white inline-flex items-center gap-1"
                      >
                        Settings ➔ Pages
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </li>
                    <li>
                      En <strong>&ldquo;Build and deployment ➔ Source&rdquo;</strong>, selecciona{' '}
                      <strong className="text-white">&ldquo;GitHub Actions&rdquo;</strong>.
                    </li>
                    <li>
                      ¡Listo! En 1 minuto GitHub publicará tu web automáticamente.
                    </li>
                  </ol>
                </div>

                {/* Opción 2: Subida por Web o Git */}
                <div className="p-4 rounded-lg bg-[#040906] border border-cyan-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">Paso 2: Subir los Archivos al Repo</span>
                    <span className="px-2 py-0.5 rounded bg-[#091a1d] text-[10px] text-cyan-300 border border-cyan-500/30">2 Métodos</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Puedes subir los archivos de dos formas:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-300 text-[11px]">
                    <li>
                      <strong className="text-white">Opción Fácil (Sin consola):</strong> Pulsa el botón verde de arriba <strong className="text-[#00ff66]">&ldquo;Descargar Proyecto Completo (.ZIP)&rdquo;</strong>, descomprímelo en tu PC y arrastra los archivos a tu página de GitHub en <strong className="text-white">&ldquo;Add file ➔ Upload files&rdquo;</strong>.
                    </li>
                    <li>
                      <strong className="text-white">Opción Terminal (Git):</strong> Ejecuta los comandos que ves abajo en tu computadora.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Comandos Git para sincronizar */}
              <div className="p-3.5 rounded-lg bg-[#030604] border border-[#00ff66]/20 font-mono text-[11px] text-gray-300 space-y-2">
                <div className="text-gray-400 font-bold uppercase text-[10px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                    Comandos Git exactos para MiguelAngelFrancoLeon/fractashield-core:
                  </span>
                  <span className="text-[#00ff66] text-[10px]">Listo para copiar</span>
                </div>
                <div className="p-3 bg-[#010302] rounded border border-[#00ff66]/15 text-emerald-400 select-all space-y-0.5 overflow-x-auto text-[11px]">
                  <div>git init</div>
                  <div>git remote add origin https://github.com/MiguelAngelFrancoLeon/fractashield-core.git</div>
                  <div>git add .</div>
                  <div>git commit -m &quot;feat: FractaShield-Core - M. Franco Leon&quot;</div>
                  <div>git branch -M main</div>
                  <div>git push -u origin main</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#00ff66]/15 bg-[#030705] py-4 px-4 sm:px-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            FractaShield-Core • Dedicado en memoria y homenaje a las aportaciones de <span className="text-[#00ff66] font-semibold">M. Franco León</span>
          </div>
          <div className="text-gray-400">
            Símplex Minimal en ℝ³ • Seguridad Geométrica sin Servidor
          </div>
        </div>
      </footer>

      {/* Franco Leon Tribute Modal */}
      <FrancoLeonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Authorship & Credit Authorization Modal */}
      <AuthorshipLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />

      {/* Floating AI Chat Trigger Button */}
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-4 py-2.5 rounded-full bg-[#00ff66] text-[#050706] font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.45)] hover:bg-[#00ff66]/90 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#050706]"
        title="Abrir Chat de Inteligencia Artificial FractaShield"
      >
        <Bot className="w-4 h-4 stroke-[2.5]" />
        <span>Consultar con IA</span>
      </button>

      {/* AI Chat Assistant Modal */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}
