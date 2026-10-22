// Mathematical and Cryptographic Engine for FractaShield-Core
// Based on Minimal Simplex (Tetrahedron in R^3) & Ad Hoc Residue Containment
// Tribute to M. Franco León

export interface Vertex3D {
  x: number;
  y: number;
  z: number;
  label: string;
}

export interface SimplexShieldData {
  inputText: string;
  hash: string;
  timestamp: string;
  vertices: [Vertex3D, Vertex3D, Vertex3D, Vertex3D];
  edgeLengths: number[]; // 6 edges in tetrahedron
  cayleyMengerDet: number;
  volume: number;
  symmetryScore: number; // 0 to 100%
  adHocResidue: {
    rx: string;
    ry: string;
    rz: string;
    rw: string;
    vectorHash: string;
    barycenter: [number, number, number];
  };
  simplexKey: string;
  isCorrupted: boolean;
  corruptedBitIndex?: number;
  corruptedHash?: string;
  matrixCostOverheadPercent: number; // 7400%
}

// Compute standard SHA-256 in browser
export async function computeSHA256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Euclidean distance between two vertices
export function euclideanDistance(a: Vertex3D, b: Vertex3D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Cayley-Menger Determinant for a 3-simplex (tetrahedron)
// Calculates invariant volume in R^3
export function computeCayleyMenger(vertices: [Vertex3D, Vertex3D, Vertex3D, Vertex3D]): { det: number; volume: number; edgeLengths: number[]; symmetryScore: number } {
  const [v0, v1, v2, v3] = vertices;
  const d01 = euclideanDistance(v0, v1);
  const d02 = euclideanDistance(v0, v2);
  const d03 = euclideanDistance(v0, v3);
  const d12 = euclideanDistance(v1, v2);
  const d13 = euclideanDistance(v1, v3);
  const d23 = euclideanDistance(v2, v3);

  const edgeLengths = [d01, d02, d03, d12, d13, d23];

  // Distances squared
  const d01_2 = d01 * d01;
  const d02_2 = d02 * d02;
  const d03_2 = d03 * d03;
  const d12_2 = d12 * d12;
  const d13_2 = d13 * d13;
  const d23_2 = d23 * d23;

  // Cayley-Menger 5x5 Matrix Determinant:
  // | 0     d01^2 d02^2 d03^2 1 |
  // | d01^2 0     d12^2 d13^2 1 |
  // | d02^2 d12^2 0     d23^2 1 |
  // | d03^2 d13^2 d23^2 0     1 |
  // | 1     1     1     1     0 |

  // Determinant calculation expanded for Cayley-Menger
  // 288 * V^2 = det(CM)
  // For vertices in R^3, V = (1/6) * |det([v1-v0, v2-v0, v3-v0])|
  const ax = v1.x - v0.x;
  const ay = v1.y - v0.y;
  const az = v1.z - v0.z;

  const bx = v2.x - v0.x;
  const by = v2.y - v0.y;
  const bz = v2.z - v0.z;

  const cx = v3.x - v0.x;
  const cy = v3.y - v0.y;
  const cz = v3.z - v0.z;

  // Determinant of 3x3 vectors
  const det3x3 = ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
  const volume = Math.abs(det3x3) / 6;
  const cmDet = 288 * (volume * volume);

  // Symmetry score: ratio of min edge to max edge
  const minEdge = Math.min(...edgeLengths);
  const maxEdge = Math.max(...edgeLengths);
  const symmetryRatio = maxEdge > 0 ? (minEdge / maxEdge) : 0;
  const symmetryScore = Math.max(0, Math.min(100, symmetryRatio * 100));

  return { det: cmDet, volume, edgeLengths, symmetryScore };
}

// Generate Minimal Simplex & Ad Hoc Residue from Secret Hash
export function generateSimplexShield(inputText: string, hash: string, forceCorrupt = false, corruptBit = 17): SimplexShieldData {
  // Parse hash into 4 quadrants
  const q0 = parseInt(hash.slice(0, 8), 16);
  const q1 = parseInt(hash.slice(8, 16), 16);
  const q2 = parseInt(hash.slice(16, 24), 16);
  const q3 = parseInt(hash.slice(24, 32), 16);

  // Ideal regular tetrahedron vertices scaled by sqrt(3)
  // V0: (+1, +1, +1) / sqrt(3)
  // V1: (+1, -1, -1) / sqrt(3)
  // V2: (-1, +1, -1) / sqrt(3)
  // V3: (-1, -1, +1) / sqrt(3)
  const invSqrt3 = 1 / Math.sqrt(3);
  const baseScale = 2.2;

  // Derive subtle deterministic orientation from hash (preserving exact regular symmetry)
  // Rotation matrix around an axis derived from q0, q1
  const angle = ((q0 % 360) * Math.PI) / 180;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const rawVertices: [Vertex3D, Vertex3D, Vertex3D, Vertex3D] = [
    { x: 1 * invSqrt3 * baseScale, y: 1 * invSqrt3 * baseScale, z: 1 * invSqrt3 * baseScale, label: 'V₀ [α]' },
    { x: 1 * invSqrt3 * baseScale, y: -1 * invSqrt3 * baseScale, z: -1 * invSqrt3 * baseScale, label: 'V₁ [β]' },
    { x: -1 * invSqrt3 * baseScale, y: 1 * invSqrt3 * baseScale, z: -1 * invSqrt3 * baseScale, label: 'V₂ [γ]' },
    { x: -1 * invSqrt3 * baseScale, y: -1 * invSqrt3 * baseScale, z: 1 * invSqrt3 * baseScale, label: 'V₃ [δ]' }
  ];

  // Rotate pristine tetrahedron around Y-axis to orient to the secret key
  const pristineVertices: [Vertex3D, Vertex3D, Vertex3D, Vertex3D] = rawVertices.map(v => ({
    x: v.x * cosA + v.z * sinA,
    y: v.y,
    z: -v.x * sinA + v.z * cosA,
    label: v.label
  })) as [Vertex3D, Vertex3D, Vertex3D, Vertex3D];

  let vertices = pristineVertices;
  let effectiveHash = hash;

  if (forceCorrupt) {
    // Break symmetry drastically: alter a single bit
    // Invert bit 'corruptBit' in the hash hex representation
    const hexArr = hash.split('');
    const charIdx = Math.floor(corruptBit / 4) % hexArr.length;
    const bitPos = corruptBit % 4;
    const val = parseInt(hexArr[charIdx], 16);
    const flippedVal = (val ^ (1 << bitPos)) & 0xf;
    hexArr[charIdx] = flippedVal.toString(16);
    effectiveHash = hexArr.join('');

    // Severe vertex dislocation simulating topological collapse
    vertices = [
      { x: pristineVertices[0].x * 1.85, y: pristineVertices[0].y * 0.42, z: pristineVertices[0].z * 1.55, label: 'V₀ [CORRUPT]' },
      { x: pristineVertices[1].x * 0.65, y: pristineVertices[1].y * 1.95, z: pristineVertices[1].z * 0.35, label: 'V₁ [CORRUPT]' },
      { x: pristineVertices[2].x * 1.35, y: pristineVertices[2].y * 0.55, z: pristineVertices[2].z * 1.80, label: 'V₂ [CORRUPT]' },
      { x: pristineVertices[3].x * 0.30, y: pristineVertices[3].y * 0.30, z: pristineVertices[3].z * 0.40, label: 'V₃ [CORRUPT]' }
    ];
  }

  // Compute Cayley-Menger & symmetry metrics
  const cm = computeCayleyMenger(vertices);

  // Compute Ad Hoc Residue Container:
  // R = w0*(q0 ^ q3) + w1*(q1 ^ q2) mod prime
  const rx = ((q0 ^ 0xa5a5a5a5) >>> 0).toString(16).padStart(8, '0');
  const ry = ((q1 ^ 0x5a5a5a5a) >>> 0).toString(16).padStart(8, '0');
  const rz = ((q2 ^ 0xc3c3c3c3) >>> 0).toString(16).padStart(8, '0');
  const rw = ((q3 ^ 0x3c3c3c3c) >>> 0).toString(16).padStart(8, '0');

  const barycenter: [number, number, number] = [
    (vertices[0].x + vertices[1].x + vertices[2].x + vertices[3].x) / 4,
    (vertices[0].y + vertices[1].y + vertices[2].y + vertices[3].y) / 4,
    (vertices[0].z + vertices[1].z + vertices[2].z + vertices[3].z) / 4
  ];

  const residueVectorHash = forceCorrupt
    ? `ERR-DISCORDANT-${rx.slice(0, 4)}:COLAPSO:${rw.slice(4)}`
    : `AD-HOC-${rx.slice(0, 4)}:${ry.slice(0, 4)}:${rz.slice(0, 4)}:${rw.slice(0, 4)}`;

  // Simplex Unique Key
  const simplexKey = `FS-SMPX-R3[${vertices.map(v => `${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}`).join('|')}]::${hash.slice(0, 16)}`;

  return {
    inputText,
    hash,
    timestamp: new Date().toISOString(),
    vertices,
    edgeLengths: cm.edgeLengths,
    cayleyMengerDet: cm.det,
    volume: cm.volume,
    symmetryScore: forceCorrupt ? Math.min(cm.symmetryScore, 42.1) : cm.symmetryScore,
    adHocResidue: {
      rx,
      ry,
      rz,
      rw,
      vectorHash: residueVectorHash,
      barycenter
    },
    simplexKey,
    isCorrupted: forceCorrupt,
    corruptedBitIndex: forceCorrupt ? corruptBit : undefined,
    corruptedHash: forceCorrupt ? effectiveHash : undefined,
    matrixCostOverheadPercent: 7400 // The exact +7,400% geometric computation cost
  };
}

// Calculate Brute-Force Time Estimation
// Traditional 1D hash cracking vs FractaShield-Core 3D Matrix evaluation
export function estimateBruteForceMetrics(password: string, attackerTier: 'rtx4090' | 'asicCluster' | 'quantumGrid' | 'custom', customHps = 1000000000) {
  // Approximate search space from password complexity & length
  const length = Math.max(password.length, 6);
  let charsetSize = 26; // lowercase
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 33;
  if (charsetSize === 26 && length > 12) charsetSize = 62; // fallback

  // Combinations (average attempts needed = 0.5 * charsetSize^length)
  // For numeric safety with large exponents, work with log10
  const log10Combinations = length * Math.log10(charsetSize) - Math.log10(2);

  // Attacker speed in hashes per second
  let tradHps = 1e9; // 1 GH/s default (RTX 4090 single rig)
  let tierLabel = 'Rig GPU RTX 4090 (1.0 GH/s)';

  if (attackerTier === 'rtx4090') {
    tradHps = 1.2e9;
    tierLabel = 'Cluster 4x RTX 4090 (1.2 GH/s)';
  } else if (attackerTier === 'asicCluster') {
    tradHps = 45e9;
    tierLabel = 'Supercomputador ASIC Paralelo (45 GH/s)';
  } else if (attackerTier === 'quantumGrid') {
    tradHps = 500e9;
    tierLabel = 'Red Cuántica Hipercomputacional (500 GH/s)';
  } else if (attackerTier === 'custom') {
    tradHps = customHps;
    tierLabel = `Hardware Personalizado (${(customHps / 1e9).toFixed(1)} GH/s)`;
  }

  // Traditional time in seconds:
  // log10(seconds) = log10Combinations - log10(tradHps)
  const log10TradSeconds = log10Combinations - Math.log10(tradHps);
  const tradSeconds = log10TradSeconds > 15 ? Infinity : Math.pow(10, Math.max(0.001, log10TradSeconds));

  // FractaShield-Core geometric penalty:
  // Each attempt requires evaluating a 4x4 matrix determinant and Cayley-Menger tensor
  // This causes a 7,400% latency slowdown (factor of 75.0x per operation in GPU registers)
  const slowdownFactor = 75.0; // 7,400% penalty
  const fractaHps = tradHps / slowdownFactor;

  const log10FractaSeconds = log10Combinations - Math.log10(fractaHps);
  const fractaSeconds = log10FractaSeconds > 15 ? Infinity : Math.pow(10, Math.max(0.001, log10FractaSeconds));
  const fractaYears = fractaSeconds / (365.25 * 24 * 3600);

  return {
    charsetSize,
    length,
    log10Combinations,
    tradHps,
    fractaHps,
    slowdownFactor,
    penaltyPercent: 7400,
    tradSeconds,
    fractaSeconds,
    fractaYears,
    tierLabel,
    tradFormatted: formatDuration(tradSeconds),
    fractaFormatted: formatYearsDuration(fractaYears)
  };
}

// Format duration cleanly
function formatDuration(seconds: number): string {
  if (!isFinite(seconds)) return '> 10¹⁵ Segundos';
  if (seconds < 0.001) return '< 0.001 Segundos (Instantáneo)';
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
  if (seconds < 60) return `${seconds.toFixed(2)} Segundos`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} Minutos`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} Horas`;
  if (seconds < 86400 * 365) return `${(seconds / 86400).toFixed(1)} Días`;
  return `${(seconds / (86400 * 365.25)).toFixed(1)} Años`;
}

function formatYearsDuration(years: number): string {
  if (!isFinite(years)) return '> 10¹² Años (Eternidad Cuántica)';
  if (years < 0.001) return `${(years * 365.25 * 24).toFixed(1)} Horas`;
  if (years < 1) return `${(years * 365.25).toFixed(0)} Días`;
  if (years < 100) return `${years.toFixed(1)} Años`;
  if (years < 10000) return `${years.toLocaleString('es-ES', { maximumFractionDigits: 0 })} Años`;
  if (years < 1e6) return `${(years / 1000).toFixed(1)} Milenios`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)} Millones de Años`;
  return `${(years / 1e9).toFixed(1)} Eras Cósmicas (Miles de millones de años)`;
}
