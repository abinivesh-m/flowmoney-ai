import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, RotateCw, Sparkles, Layers, Box, Eye } from 'lucide-react';

export default function YuusukeSpatialVaults({ 
  isListening, 
  isProcessing, 
  currency = "₹" 
}) {
  const mountRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const [selectedVault, setSelectedVault] = useState(null);
  const [cameraMode, setCameraMode] = useState("isometric"); // "isometric" | "front" | "top"

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 640;
    const height = 440;

    // 1. Scene, Camera, High-Quality WebGL
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.8, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // 2. Sophisticated Warm Studio Lighting (Wispr Flow Palette)
    const ambientLight = new THREE.AmbientLight(0xFFFBEB, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
    mainLight.position.set(6, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const sageFillLight = new THREE.DirectionalLight(0x385741, 1.8);
    sageFillLight.position.set(-6, -2, -3);
    scene.add(sageFillLight);

    // 3. Ground Shadow Receiver Plane
    const groundGeo = new THREE.PlaneGeometry(16, 16);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    ground.receiveShadow = true;
    scene.add(ground);

    // 4. Yuusuke 3D Floating Spatial Vaults (Tangible, Beveled Frosted Blocks)
    const vaultsData = [
      {
        id: "macbook",
        name: "MacBook Pro M3 Max",
        amount: "₹1,42,000 / ₹1,80,000",
        pct: 0.78,
        color: 0x385741, // Wispr Sage
        coreColor: 0x558060,
        pos: [-2.2, 0.2, 0],
        dim: [1.5, 1.8, 1.5],
      },
      {
        id: "central_engine",
        name: "Living Cashflow Core",
        amount: "₹75,000 Safe Buffer",
        pct: 1.0,
        color: 0x18191B, // Charcoal
        coreColor: 0xA3E635, // Neon Lime / Mint
        pos: [0, -0.2, 0],
        dim: [1.8, 1.4, 1.8],
      },
      {
        id: "japan",
        name: "Japan Spring Sakura",
        amount: "₹95,000 / ₹3,20,000",
        pct: 0.30,
        color: 0xD97706, // Warm Amber
        coreColor: 0xF59E0B,
        pos: [2.2, 0.5, 0],
        dim: [1.5, 2.0, 1.5],
      },
    ];

    const vaultBlocks = vaultsData.map((data) => {
      const vGroup = new THREE.Group();
      vGroup.position.set(...data.pos);

      // Outer Frosted Glass Monolith
      const outerGeo = new THREE.BoxGeometry(...data.dim);
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        emissive: data.color,
        emissiveIntensity: 0.15,
        roughness: 0.15,
        transmission: 0.65, // True frosted glass transmission
        thickness: 0.8,
        transparent: true,
        opacity: 0.85,
        reflectivity: 0.6,
        clearcoat: 0.5,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      outerMesh.castShadow = true;
      outerMesh.receiveShadow = true;
      vGroup.add(outerMesh);

      // Inner Glowing Liquid Core Block (Height represents % filled)
      const innerHeight = (data.dim[1] - 0.2) * data.pct;
      const innerGeo = new THREE.BoxGeometry(data.dim[0] - 0.25, innerHeight, data.dim[2] - 0.25);
      const innerMat = new THREE.MeshStandardMaterial({
        color: data.coreColor,
        emissive: data.coreColor,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      innerMesh.position.y = -data.dim[1] / 2 + innerHeight / 2 + 0.12;
      vGroup.add(innerMesh);

      // Delicate Hairline Wireframe Frame
      const edges = new THREE.EdgesGeometry(outerGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: data.color, linewidth: 2, transparent: true, opacity: 0.6 });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      vGroup.add(wireframe);

      stageGroup.add(vGroup);
      return { ...data, vGroup, outerMesh, innerMesh };
    });

    // 5. Connecting Particle Cashflow Bridges (Streaming between blocks)
    const bridgeParticleCount = 200;
    const bridgePos = new Float32Array(bridgeParticleCount * 3);
    const bridgeProgress = [];

    for (let i = 0; i < bridgeParticleCount; i++) {
      const isLeft = i % 2 === 0;
      bridgeProgress.push({
        isLeft,
        t: Math.random(),
        speed: 0.008 + Math.random() * 0.008,
      });

      bridgePos[i * 3] = (Math.random() - 0.5) * 4;
      bridgePos[i * 3 + 1] = 0;
      bridgePos[i * 3 + 2] = 0;
    }

    const bridgeGeo = new THREE.BufferGeometry();
    bridgeGeo.setAttribute('position', new THREE.BufferAttribute(bridgePos, 3));
    const bridgeMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x385741,
      transparent: true,
      opacity: 0.85,
    });
    const bridgePoints = new THREE.Points(bridgeGeo, bridgeMat);
    stageGroup.add(bridgePoints);

    // 6. Interactive Inertial Mouse Orbit & Drag
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotationTarget = { x: 0, y: 0 };
    let mouseNorm = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseNorm.targetX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseNorm.targetY = -((e.clientY - rect.top) / height - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        rotationTarget.y += deltaX * 0.008;
        rotationTarget.x += deltaY * 0.008;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => { isDragging = false; };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 7. 60 FPS Render Loop with Yuusuke-style Camera & Floating Oscillations
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera sway (Yuusuke effect)
      mouseNorm.x += (mouseNorm.targetX - mouseNorm.x) * 0.05;
      mouseNorm.y += (mouseNorm.targetY - mouseNorm.y) * 0.05;

      // Camera positioning based on mode + subtle mouse parallax
      const baseX = cameraMode === "isometric" ? 4.5 : cameraMode === "front" ? 0 : 0;
      const baseY = cameraMode === "isometric" ? 3.8 : cameraMode === "front" ? 0.8 : 7.5;
      const baseZ = cameraMode === "isometric" ? 6.5 : cameraMode === "front" ? 7.2 : 0.1;

      camera.position.x = baseX + mouseNorm.x * 0.8;
      camera.position.y = baseY + mouseNorm.y * 0.6;
      camera.position.z = baseZ;
      camera.lookAt(0, 0, 0);

      const speedMult = isListening ? 3.0 : isProcessing ? 4.5 : 1.0;

      // Smooth rotation with drag
      stageGroup.rotation.y += (rotationTarget.y - stageGroup.rotation.y) * 0.06;
      stageGroup.rotation.x += (rotationTarget.x - stageGroup.rotation.x) * 0.06;

      // Floating gentle levitation for each 3D block
      vaultBlocks.forEach((vb, idx) => {
        vb.vGroup.position.y = vb.pos[1] + Math.sin(time * 1.5 * speedMult + idx * 1.2) * 0.08;
        vb.vGroup.rotation.y = Math.sin(time * 0.6 * speedMult + idx) * 0.06;
      });

      // Animate flowing particle streams between Central Engine and Vaults
      const positions = bridgeGeo.attributes.position.array;
      for (let i = 0; i < bridgeParticleCount; i++) {
        const bp = bridgeProgress[i];
        bp.t += bp.speed * speedMult;
        if (bp.t > 1) bp.t = 0;

        const startX = 0;
        const targetX = bp.isLeft ? -2.2 : 2.2;
        const targetY = bp.isLeft ? 0.2 : 0.5;

        positions[i * 3] = THREE.MathUtils.lerp(startX, targetX, bp.t);
        positions[i * 3 + 1] = THREE.MathUtils.lerp(-0.2, targetY, bp.t) + Math.sin(bp.t * Math.PI) * 0.4;
        positions[i * 3 + 2] = Math.sin(bp.t * Math.PI * 2) * 0.15;
      }
      bridgeGeo.attributes.position.needsUpdate = true;

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
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [cameraMode, isListening, isProcessing]);

  return (
    <div className="w-full rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] shadow-lg p-5 font-mono text-[#18191B] mb-8 relative overflow-hidden">
      {/* Header with Camera Perspective Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6E1D1]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#E9EFE9] text-[#385741]">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider font-sans">
                Interactive 3D Living Money Architecture
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E9EFE9] text-[#385741]">
                WebGL 60FPS • Click & Drag
              </span>
            </div>
            <p className="text-[10px] text-[#6E726D]">
              Physical 3D Goal Vaults levitate and dynamically fill with cashflow energy
            </p>
          </div>
        </div>

        {/* Camera Angle Toggle Buttons (Yuusuke Style) */}
        <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase">
          <span className="text-[#88857B] mr-1 hidden sm:inline">VIEW:</span>
          <button
            onClick={() => setCameraMode("isometric")}
            className={`px-2.5 py-1 rounded-full border transition-all ${
              cameraMode === "isometric"
                ? 'bg-[#385741] text-[#FFFFEB] border-[#385741]'
                : 'bg-[#F4EFE2] text-[#6E726D] border-[#D5CFBE] hover:bg-[#EAE4D5]'
            }`}
          >
            Isometric
          </button>
          <button
            onClick={() => setCameraMode("front")}
            className={`px-2.5 py-1 rounded-full border transition-all ${
              cameraMode === "front"
                ? 'bg-[#385741] text-[#FFFFEB] border-[#385741]'
                : 'bg-[#F4EFE2] text-[#6E726D] border-[#D5CFBE] hover:bg-[#EAE4D5]'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setCameraMode("top")}
            className={`px-2.5 py-1 rounded-full border transition-all ${
              cameraMode === "top"
                ? 'bg-[#385741] text-[#FFFFEB] border-[#385741]'
                : 'bg-[#F4EFE2] text-[#6E726D] border-[#D5CFBE] hover:bg-[#EAE4D5]'
            }`}
          >
            Top Down
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Mount */}
      <div className="relative flex items-center justify-center pt-2">
        <div ref={mountRef} className="w-full h-[420px] cursor-grab active:cursor-grabbing select-none" />

        {/* 3D Floating Vault Interactive Overlay Callouts */}
        <div className="absolute top-6 left-6 pointer-events-none hidden md:block">
          <div className="p-3 rounded-xl bg-[#FBF9F1]/90 border border-[#D5CFBE] shadow-md backdrop-blur-md text-xs">
            <div className="text-[9px] font-bold text-[#385741] uppercase tracking-wider flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#385741] mr-1.5 animate-pulse"></span>
              3D VAULT: MACBOOK PRO
            </div>
            <div className="text-base font-bold text-[#18191B] font-mono mt-0.5">₹1.42L / ₹1.80L</div>
            <div className="text-[10px] text-[#6E726D]">78% Height Filled in 3D Space</div>
          </div>
        </div>

        <div className="absolute top-6 right-6 pointer-events-none hidden md:block text-right">
          <div className="p-3 rounded-xl bg-[#FBF9F1]/90 border border-[#D5CFBE] shadow-md backdrop-blur-md text-xs">
            <div className="text-[9px] font-bold text-[#D97706] uppercase tracking-wider flex items-center justify-end">
              3D VAULT: JAPAN SAKURA
              <span className="w-2 h-2 rounded-full bg-[#D97706] ml-1.5 animate-pulse"></span>
            </div>
            <div className="text-base font-bold text-[#18191B] font-mono mt-0.5">₹95,000 / ₹3.20L</div>
            <div className="text-[10px] text-[#6E726D]">30% Height Filled in 3D Space</div>
          </div>
        </div>

        {/* Bottom Status Pill */}
        <div className="absolute bottom-4 pointer-events-none text-center">
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md border transition-all duration-300 shadow-md ${
            isListening
              ? 'bg-rose-100 text-rose-800 border-rose-300 scale-105'
              : isProcessing
              ? 'bg-amber-100 text-amber-800 border-amber-300 scale-105 animate-pulse'
              : 'bg-[#E9EFE9] text-[#385741] border-[#C2D4C5]'
          }`}>
            {isListening
              ? '🎙️ WISPR RECORDING // ACCELERATING 3D FLOW...'
              : isProcessing
              ? '⚡ SIMULATING CASHFLOW STREAM...'
              : '✨ CLICK & DRAG 3D BLOCKS • MOVE MOUSE FOR CAMERA EASE'}
          </div>
        </div>
      </div>
    </div>
  );
}
