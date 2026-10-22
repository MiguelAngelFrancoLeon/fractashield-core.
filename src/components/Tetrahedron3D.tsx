import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SimplexShieldData } from '../utils/cryptoMath';
import { Maximize2, RotateCcw, Eye, ShieldAlert, Sparkles, Orbit, Compass } from 'lucide-react';

interface Tetrahedron3DProps {
  shieldData: SimplexShieldData | null;
  isSimulatingAttack: boolean;
  attackCount: number;
  onBitFlipToggle?: () => void;
}

export const Tetrahedron3D: React.FC<Tetrahedron3DProps> = ({
  shieldData,
  isSimulatingAttack,
  attackCount,
  onBitFlipToggle
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef(shieldData);
  const isAttackRef = useRef(isSimulatingAttack);
  const attackCountRef = useRef(attackCount);

  // Local controls state
  const [wireframeOnly, setWireframeOnly] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showFractaAxis, setShowFractaAxis] = useState(true);
  const [cameraZoomLevel, setCameraZoomLevel] = useState(1);
  const showFractaAxisRef = useRef(true);

  // Sync refs to avoid re-triggering Three.js render loop
  useEffect(() => {
    dataRef.current = shieldData;
  }, [shieldData]);

  useEffect(() => {
    isAttackRef.current = isSimulatingAttack;
  }, [isSimulatingAttack]);

  useEffect(() => {
    attackCountRef.current = attackCount;
  }, [attackCount]);

  useEffect(() => {
    showFractaAxisRef.current = showFractaAxis;
  }, [showFractaAxis]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050706, 0.045);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- Lighting Rig ---
    const ambientLight = new THREE.AmbientLight(0x092014, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00ff66, 2.2);
    keyLight.position.set(4, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.8);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(16, 24, 0x00ff66, 0x0c2517);
    gridHelper.position.y = -2.4;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // --- Minimal Simplex Composite Group ---
    const simplexGroup = new THREE.Group();
    scene.add(simplexGroup);

    // 1. Solid Semi-Transparent Holographic Faces
    const faceGeometry = new THREE.BufferGeometry();
    const faceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ff66,
      emissive: 0x003314,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      opacity: 0.45,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
    simplexGroup.add(faceMesh);

    // 2. Thick Glowing Wireframe Edges
    const edgeLinesGroup = new THREE.Group();
    simplexGroup.add(edgeLinesGroup);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    });

    // 3. Four Vertex Spheres (V0, V1, V2, V3)
    const vertexSpheres: THREE.Mesh[] = [];
    const vertexGlows: THREE.Mesh[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const glowGeo = new THREE.SphereGeometry(0.24, 16, 16);

    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xe0fff0,
      emissive: 0x00ff66,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.9
    });

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00ff66,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });

    for (let i = 0; i < 4; i++) {
      const sp = new THREE.Mesh(sphereGeo, sphereMat);
      const gw = new THREE.Mesh(glowGeo, glowMat);
      sp.add(gw);
      simplexGroup.add(sp);
      vertexSpheres.push(sp);
      vertexGlows.push(gw);
    }

    // 4. Central Invariant Atomic Core (Icosahedron floating in barycenter)
    const coreGeo = new THREE.IcosahedronGeometry(0.38, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x005544,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    simplexGroup.add(coreMesh);

    // 4b. Fracta-Axis Coordinate System (M. Franco León Tensor Axes)
    const fractaAxesGroup = new THREE.Group();
    simplexGroup.add(fractaAxesGroup);

    // Axis Lines: X (Amber/Cyan), Y (Neon Green), Z (Electric Blue)
    const axisMatX = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.6 });
    const axisMatY = new THREE.LineBasicMaterial({ color: 0x00ff66, transparent: true, opacity: 0.6 });
    const axisMatZ = new THREE.LineBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.6 });

    const lineGeoX = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3, 0, 0), new THREE.Vector3(3, 0, 0)]);
    const lineGeoY = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, 3, 0)]);
    const lineGeoZ = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -3), new THREE.Vector3(0, 0, 3)]);

    fractaAxesGroup.add(new THREE.Line(lineGeoX, axisMatX));
    fractaAxesGroup.add(new THREE.Line(lineGeoY, axisMatY));
    fractaAxesGroup.add(new THREE.Line(lineGeoZ, axisMatZ));

    // Fractal Harmonic Rings
    const ringGeo1 = new THREE.RingGeometry(1.6, 1.62, 32);
    const ringGeo2 = new THREE.RingGeometry(2.4, 2.42, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff66, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat);
    ring1.rotation.x = Math.PI / 2;
    const ring2 = new THREE.Mesh(ringGeo2, ringMat);
    ring2.rotation.x = Math.PI / 2;
    fractaAxesGroup.add(ring1);
    fractaAxesGroup.add(ring2);

    // 5. Particle Attack Lasers & Impact Rings
    const attackParticlesCount = 35;
    const attackGeo = new THREE.BufferGeometry();
    const attackPositions = new Float32Array(attackParticlesCount * 3);
    const attackColors = new Float32Array(attackParticlesCount * 3);

    for (let i = 0; i < attackParticlesCount; i++) {
      attackPositions[i * 3] = (Math.random() - 0.5) * 8;
      attackPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      attackPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      attackColors[i * 3] = 1;
      attackColors[i * 3 + 1] = 0.2;
      attackColors[i * 3 + 2] = 0.2;
    }

    attackGeo.setAttribute('position', new THREE.BufferAttribute(attackPositions, 3));
    attackGeo.setAttribute('color', new THREE.BufferAttribute(attackColors, 3));

    const attackPointsMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const attackPoints = new THREE.Points(attackGeo, attackPointsMat);
    attackPoints.visible = false;
    scene.add(attackPoints);

    // Reusable Math objects for zero GC in loop
    const currentVerts = [
      new THREE.Vector3(1, 1, 1),
      new THREE.Vector3(1, -1, -1),
      new THREE.Vector3(-1, 1, -1),
      new THREE.Vector3(-1, -1, 1)
    ];
    const targetVerts = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ];

    // Mouse drag interaction for orbital rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile / touchpads
    let prevTouchX = 0;
    let prevTouchY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevTouchX;
      const deltaY = e.touches[0].clientY - prevTouchY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    domEl.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Read current state from refs
      const currentData = dataRef.current;
      const isAttacking = isAttackRef.current;
      const isCorrupted = currentData?.isCorrupted ?? false;

      // Update target vertices from shieldData
      if (currentData && currentData.vertices) {
        for (let i = 0; i < 4; i++) {
          targetVerts[i].set(
            currentData.vertices[i].x,
            currentData.vertices[i].y,
            currentData.vertices[i].z
          );
        }
      }

      // Smoothly damp current vertices towards target
      for (let i = 0; i < 4; i++) {
        currentVerts[i].lerp(targetVerts[i], Math.min(1, delta * 8));
        vertexSpheres[i].position.copy(currentVerts[i]);
      }

      // Rebuild faces geometry (4 triangular faces for a tetrahedron)
      // Indices: (0, 1, 2), (0, 2, 3), (0, 3, 1), (1, 3, 2)
      const positions = new Float32Array([
        // Face 0
        currentVerts[0].x, currentVerts[0].y, currentVerts[0].z,
        currentVerts[1].x, currentVerts[1].y, currentVerts[1].z,
        currentVerts[2].x, currentVerts[2].y, currentVerts[2].z,
        // Face 1
        currentVerts[0].x, currentVerts[0].y, currentVerts[0].z,
        currentVerts[2].x, currentVerts[2].y, currentVerts[2].z,
        currentVerts[3].x, currentVerts[3].y, currentVerts[3].z,
        // Face 2
        currentVerts[0].x, currentVerts[0].y, currentVerts[0].z,
        currentVerts[3].x, currentVerts[3].y, currentVerts[3].z,
        currentVerts[1].x, currentVerts[1].y, currentVerts[1].z,
        // Face 3
        currentVerts[1].x, currentVerts[1].y, currentVerts[1].z,
        currentVerts[3].x, currentVerts[3].y, currentVerts[3].z,
        currentVerts[2].x, currentVerts[2].y, currentVerts[2].z
      ]);

      faceGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      faceGeometry.computeVertexNormals();

      // Clear & redraw edges
      while (edgeLinesGroup.children.length > 0) {
        const obj = edgeLinesGroup.children[0];
        edgeLinesGroup.remove(obj);
      }

      // 6 edges connecting vertices
      const edgePairs = [
        [0, 1], [0, 2], [0, 3],
        [1, 2], [1, 3], [2, 3]
      ];

      edgePairs.forEach(([a, b]) => {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          currentVerts[a],
          currentVerts[b]
        ]);
        const line = new THREE.Line(lineGeo, edgeMaterial);
        edgeLinesGroup.add(line);
      });

      // Color scheme based on state: Green (Pristine), Crimson/Orange (Corrupted), Cyber Cyan/Yellow (Under Attack)
      if (isCorrupted) {
        faceMaterial.color.setHex(0xff1144);
        faceMaterial.emissive.setHex(0x550011);
        edgeMaterial.color.setHex(0xff3355);
        sphereMat.color.setHex(0xffaacc);
        sphereMat.emissive.setHex(0xff0033);
        glowMat.color.setHex(0xff0044);
        coreMat.color.setHex(0xff0055);
        coreMat.emissive.setHex(0x660011);
      } else if (isAttacking) {
        // Attack mode: pulsing emerald and cyan energy
        const flash = Math.sin(elapsed * 12) > 0;
        faceMaterial.color.setHex(flash ? 0x00ff88 : 0x00ddff);
        faceMaterial.emissive.setHex(0x004433);
        edgeMaterial.color.setHex(0x33ffff);
        sphereMat.color.setHex(0xd0ffff);
        sphereMat.emissive.setHex(0x00eeff);
        glowMat.color.setHex(0x00e5ff);
        coreMat.color.setHex(0x00e5ff);
        coreMat.emissive.setHex(0x006655);
      } else {
        // Pristine normal state
        faceMaterial.color.setHex(0x00ff66);
        faceMaterial.emissive.setHex(0x003314);
        edgeMaterial.color.setHex(0x00ff88);
        sphereMat.color.setHex(0xe0fff0);
        sphereMat.emissive.setHex(0x00ff66);
        glowMat.color.setHex(0x00ff66);
        coreMat.color.setHex(0x00ffff);
        coreMat.emissive.setHex(0x005544);
      }

      // Barycenter Core position
      const bcX = (currentVerts[0].x + currentVerts[1].x + currentVerts[2].x + currentVerts[3].x) / 4;
      const bcY = (currentVerts[0].y + currentVerts[1].y + currentVerts[2].y + currentVerts[3].y) / 4;
      const bcZ = (currentVerts[0].z + currentVerts[1].z + currentVerts[2].z + currentVerts[3].z) / 4;
      coreMesh.position.set(bcX, bcY, bcZ);
      coreMesh.rotation.x += delta * 1.5;
      coreMesh.rotation.y += delta * 2.2;

      // Brute-force attack visual particles
      if (isAttacking) {
        attackPoints.visible = true;
        const posAttr = attackGeo.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < attackParticlesCount; i++) {
          // Stream towards simplex vertices and ricochet
          const targetVertex = currentVerts[i % 4];
          const px = posArray[i * 3];
          const py = posArray[i * 3 + 1];
          const pz = posArray[i * 3 + 2];

          const dirX = targetVertex.x - px;
          const dirY = targetVertex.y - py;
          const dirZ = targetVertex.z - pz;
          const dist = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

          if (dist < 0.25 || Math.random() < 0.02) {
            // Respawn particle at boundary
            const angle = Math.random() * Math.PI * 2;
            const r = 4.5 + Math.random() * 2;
            posArray[i * 3] = Math.cos(angle) * r;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 4;
            posArray[i * 3 + 2] = Math.sin(angle) * r;
          } else {
            posArray[i * 3] += (dirX / dist) * delta * 7.5;
            posArray[i * 3 + 1] += (dirY / dist) * delta * 7.5;
            posArray[i * 3 + 2] += (dirZ / dist) * delta * 7.5;
          }
        }
        posAttr.needsUpdate = true;
      } else {
        attackPoints.visible = false;
      }

      // Fracta-Axis Coordinate Visibility
      fractaAxesGroup.visible = showFractaAxisRef.current;

      // Simplex Group Rotation
      if (autoRotate && !isDragging) {
        targetRotY += delta * 0.45;
      }

      simplexGroup.rotation.y = THREE.MathUtils.damp(simplexGroup.rotation.y, targetRotY, 8, delta);
      simplexGroup.rotation.x = THREE.MathUtils.damp(simplexGroup.rotation.x, targetRotX, 8, delta);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      faceGeometry.dispose();
      faceMaterial.dispose();
      edgeMaterial.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      attackGeo.dispose();
      attackPointsMat.dispose();
      renderer.dispose();

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [autoRotate]);

  const resetCamera = () => {
    setAutoRotate(true);
  };

  const isCorrupted = shieldData?.isCorrupted ?? false;

  return (
    <div className="relative w-full h-[420px] lg:h-[480px] bg-[#030605] rounded-xl border border-[#00ff66]/20 overflow-hidden shadow-2xl flex flex-col">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top HUD Info Badge */}
      <div className="relative z-10 flex items-center justify-between p-3.5 bg-gradient-to-b from-[#050807]/90 via-[#050807]/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${isCorrupted ? 'bg-red-500 shadow-[0_0_8px_#ff0044]' : 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]'}`} />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase flex items-center gap-1.5">
              <span>SÍMPLEX MINIMAL EN ℝ³</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0a1a10] border border-[#00ff66]/30 text-[#00ff66]">
                4 VÉRTICES | 6 ARISTAS
              </span>
            </span>
            <span className="text-[11px] text-emerald-500/80 font-mono">
              Invariante Cayley-Menger: {shieldData ? shieldData.cayleyMengerDet.toFixed(4) : '0.0000'} | Vol: {shieldData ? shieldData.volume.toFixed(4) : '0.0000'} u³
            </span>
          </div>
        </div>

        {/* State Tag */}
        <div className="pointer-events-auto">
          {isCorrupted ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/80 border border-red-500/60 text-red-400 text-xs font-semibold animate-none">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>¡SIMETRÍA ROTA (1-BIT CORRUPTO)!</span>
            </div>
          ) : isSimulatingAttack ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/70 border border-amber-500/50 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>ATAQUE EN CURSO (+7,400% LATENCIA)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#062012]/80 border border-[#00ff66]/40 text-[#00ff66] text-xs font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
              <span>BLINDAJE ACTIVO: SIMETRÍA 100%</span>
            </div>
          )}
        </div>
      </div>

      {/* Center Watermark / Overlay info if not yet created */}
      {!shieldData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center px-4">
          <div className="p-4 rounded-xl bg-[#09120c]/85 border border-[#00ff66]/20 backdrop-blur-none max-w-md">
            <Orbit className="w-8 h-8 text-[#00ff66] mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-emerald-300">Geometría Criptográfica en Espera</p>
            <p className="text-xs text-emerald-500/80 mt-1">
              Introduce un texto secreto o documento y pulsa &ldquo;Generar Blindaje Geométrico&rdquo; para construir el Símplex Minimal tridimensional.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Dock (Zero Viewport Occlusion) */}
      <div className="relative mt-auto z-10 p-3 bg-gradient-to-t from-[#050807]/95 via-[#050807]/80 to-transparent flex flex-wrap items-center justify-between gap-2 border-t border-[#00ff66]/15">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 rounded text-xs border transition-colors flex items-center gap-1 ${
              autoRotate
                ? 'bg-[#00ff66]/20 border-[#00ff66]/50 text-[#00ff66]'
                : 'bg-[#0b140f] border-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Alternar rotación automática"
          >
            <Orbit className="w-3 h-3" />
            <span>{autoRotate ? 'Giro: ON' : 'Giro: OFF'}</span>
          </button>

          <button
            onClick={resetCamera}
            className="px-2.5 py-1 rounded text-xs bg-[#0b140f] border border-[#00ff66]/30 text-emerald-400 hover:bg-[#00ff66]/10 transition-colors flex items-center gap-1"
            title="Resetear vista"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Centrar</span>
          </button>

          <button
            onClick={() => setShowFractaAxis(!showFractaAxis)}
            className={`px-2.5 py-1 rounded text-xs border transition-colors flex items-center gap-1 ${
              showFractaAxis
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-[#0b140f] border-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Alternar visualización de Ejes Fractales Fracta-Axis (M. Franco León)"
          >
            <Compass className="w-3 h-3" />
            <span>{showFractaAxis ? 'Fracta-Axis: ON' : 'Fracta-Axis: OFF'}</span>
          </button>

          {/* Quick 1-Bit Corruption toggle right from 3D viewport */}
          {shieldData && onBitFlipToggle && (
            <button
              onClick={onBitFlipToggle}
              className={`px-3 py-1 rounded text-xs border font-semibold transition-all flex items-center gap-1.5 ${
                isCorrupted
                  ? 'bg-red-600/25 border-red-500 text-red-300 hover:bg-red-600/40 shadow-[0_0_10px_rgba(255,0,0,0.3)]'
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>{isCorrupted ? 'Restaurar Simetría (0 Bit Error)' : 'Simular Inyección 1-Bit'}</span>
            </button>
          )}
        </div>

        {/* 3D Coordinate coordinates indicator */}
        <div className="flex items-center gap-3 text-[11px] text-emerald-400/90 font-mono">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-gray-400">V₀: ({shieldData?.vertices[0].x.toFixed(1) ?? '1.3'}, {shieldData?.vertices[0].y.toFixed(1) ?? '1.3'})</span>
            <span className="text-gray-400">V₁: ({shieldData?.vertices[1].x.toFixed(1) ?? '1.3'}, {shieldData?.vertices[1].y.toFixed(1) ?? '-1.3'})</span>
            <span className="text-gray-400">V₂: ({shieldData?.vertices[2].x.toFixed(1) ?? '-1.3'}, {shieldData?.vertices[2].y.toFixed(1) ?? '1.3'})</span>
            <span className="text-gray-400">V₃: ({shieldData?.vertices[3].x.toFixed(1) ?? '-1.3'}, {shieldData?.vertices[3].y.toFixed(1) ?? '-1.3'})</span>
          </div>
          <span className="text-[#00ff66] bg-[#07170e] px-2 py-0.5 rounded border border-[#00ff66]/20">
            {isCorrupted ? 'Δ Simetría: ERROR' : 'Simetría: 100.0%'}
          </span>
        </div>
      </div>
    </div>
  );
};
