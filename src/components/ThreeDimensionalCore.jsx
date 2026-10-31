import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Mic, Activity, Crosshair, Sparkles, Terminal, Shield, ArrowUpRight, Zap } from 'lucide-react';

export default function ThreeDimensionalCore({ 
  isListening, 
  isProcessing, 
  financialScore = 84, 
  safeToSpend = 75000, 
  currency = "₹" 
}) {
  const mountRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 640;
    const height = 440;

    // 1. Scene, Camera, High-Precision WebGL
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // 2. Cinematic Lighting (Bizar.ro Noir Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x818cf8, 4.5);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xec4899, 4, 25);
    fillLight.position.set(-6, -4, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x06b6d4, 3.5, 20);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    // 3. The Bizar.ro Centerpiece: Organic Morphing Liquid Chrome Entity
    // Using a dense subdivided icosahedron with per-vertex noise deformation
    const sphereRadius = 1.8;
    const sphereGeo = new THREE.IcosahedronGeometry(sphereRadius, 32);
    const originalPositions = sphereGeo.attributes.position.clone();

    // Liquid Chrome / Obsidian Physical Material
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0c16,
      emissive: 0x1e1b4b,
      roughness: 0.12,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      wireframe: false,
    });

    const sculptureMesh = new THREE.Mesh(sphereGeo, chromeMat);
    scene.add(sculptureMesh);

    // Outer Delicate Wireframe Aura (Active Theory / Bizarro signature)
    const wireGeo = new THREE.IcosahedronGeometry(2.1, 4);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // 4. Floating Astrolabe Fine Hairline Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.008, 16, 120), ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.006, 16, 120), ringMat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    scene.add(ring2);

    // 5. Minimalist Floating Coordinate Particles
    const dustCount = 180;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
      dustPos[i] = (Math.random() - 0.5) * 12;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // 6. Inertial Mouse Tracking
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouse.targetY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Simplex Noise Math for fluid ripples
    const noise = (x, y, z) => {
      return Math.sin(x * 1.5 + y * 2.1) * Math.cos(z * 1.8 + x * 0.7);
    };

    // 7. Render Loop
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = now;
      }

      // Smooth camera interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x * 1.2;
      camera.position.y = mouse.y * 0.8;
      camera.lookAt(0, 0, 0);

      // Liquid Surface Displacement
      const posAttr = sphereGeo.attributes.position;
      const origPos = originalPositions.array;
      const count = posAttr.count;

      const rippleSpeed = isListening ? 4.5 : isProcessing ? 6.0 : 1.8;
      const distortionAmp = isListening ? 0.35 : isProcessing ? 0.45 : 0.15;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = origPos[i3];
        const oy = origPos[i3 + 1];
        const oz = origPos[i3 + 2];

        // 3D Simplex Wave Ripple
        const wave = noise(ox * 1.2 + time * rippleSpeed, oy * 1.2 + time * rippleSpeed, oz * 1.2) * distortionAmp;
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const normX = ox / len;
        const normY = oy / len;
        const normZ = oz / len;

        posAttr.setXYZ(i, ox + normX * wave, oy + normY * wave, oz + normZ * wave);
      }
      posAttr.needsUpdate = true;
      sphereGeo.computeVertexNormals();

      // Slow elegant rotations
      sculptureMesh.rotation.y = time * 0.15;
      wireMesh.rotation.y = -time * 0.08;
      wireMesh.rotation.z = time * 0.05;

      ring1.rotation.z += 0.003;
      ring2.rotation.z -= 0.002;
      dust.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isListening, isProcessing]);

  return (
    <div className="relative w-full rounded-2xl bg-[#05060a] border border-white/10 shadow-2xl p-6 backdrop-blur-2xl mb-8 overflow-hidden font-mono">
      {/* Editorial Crosshairs & Coordinate Markers (Bizar.ro Aesthetic) */}
      <div className="absolute top-3 left-3 text-[9px] text-zinc-500 tracking-widest uppercase flex items-center space-x-2">
        <Crosshair className="w-3 h-3 text-zinc-400" />
        <span>SYS.04 / LIVING_MONEY_MATRIX</span>
      </div>
      <div className="absolute top-3 right-3 text-[9px] text-zinc-500 tracking-widest uppercase flex items-center space-x-3">
        <span>FPS: <strong className="text-emerald-400">{fps}</strong></span>
        <span>•</span>
        <span>WEBGL 2.0</span>
      </div>

      <div className="absolute bottom-3 left-3 text-[9px] text-zinc-600 tracking-widest uppercase hidden sm:block">
        RAYMARCH_NOISE: SIMPLEX_4D // LATENCY 38MS
      </div>
      <div className="absolute bottom-3 right-3 text-[9px] text-zinc-600 tracking-widest uppercase hidden sm:block">
        VOICE_INTENT_RECEPTOR [WISPR_FLOW_PRO]
      </div>

      {/* Subtle Background Radial Gradients */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main 3D Canvas Stage */}
      <div className="relative flex flex-col items-center justify-center pt-4">
        <div ref={mountRef} className="w-full h-[400px] cursor-crosshair select-none" />

        {/* Floating Minimalist HUD Overlays */}
        <div className="absolute top-10 left-6 z-10 pointer-events-none hidden md:block">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            DISCRETIONARY_RESERVOIR
          </div>
          <div className="text-3xl font-light text-white font-sans tracking-tight">
            {currency}{safeToSpend.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 tracking-wider mt-1">
            AUTONOMOUS BURN VELOCITY: SAFE
          </div>
        </div>

        <div className="absolute top-10 right-6 z-10 pointer-events-none text-right hidden md:block">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 flex items-center justify-end">
            FINANCIAL_HEALTH_SCORE
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-1.5"></span>
          </div>
          <div className="text-3xl font-light text-white font-sans tracking-tight">
            {financialScore}<span className="text-sm text-zinc-500">/100</span>
          </div>
          <div className="text-[10px] text-zinc-500 tracking-wider mt-1">
            WHAT-IF ENGINE SYNCED
          </div>
        </div>

        {/* Minimal Dynamic Voice Island (Apple VisionOS / Bizar.ro Hybrid) */}
        <div className="absolute bottom-6 pointer-events-none text-center">
          <div className={`px-4 py-1.5 rounded-full text-[11px] tracking-wider uppercase backdrop-blur-xl border transition-all duration-300 ${
            isListening 
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/20 scale-105'
              : isProcessing
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20 scale-105 animate-pulse'
              : 'bg-zinc-900/80 text-zinc-300 border-white/10'
          }`}>
            {isListening 
              ? '● WISPR FLOW RECORDING STREAM // SPEAK NATURALLY' 
              : isProcessing
              ? '▲ PARSING INTENTS & RESOLVING SELF-CORRECTIONS' 
              : '■ 3D LIVING MONEY MODEL // CURSOR PARALLAX ACTIVE'}
          </div>
        </div>
      </div>
    </div>
  );
}
