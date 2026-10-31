import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function YuusukeBackground({ isListening, isProcessing }) {
  const mountRef = useRef(null);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene, Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 8.5);

    // 2. Renderer with soft warm tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 3. Yuusuke 3D Spatial Geometry: Floating Architectural Glass Sheets & Ribbons
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Subtle floating plane sheets (architectural layers in yuusuke.work style)
    const sheetGeo = new THREE.PlaneGeometry(3.6, 2.4);
    const sheetMat = new THREE.MeshBasicMaterial({
      color: 0x385741, // Wispr Sage Green
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });

    const sheets = [];
    const sheetConfigs = [
      { pos: [-3.8, 1.5, -2], rot: [0.3, 0.4, -0.1] },
      { pos: [4.2, 0.5, -3], rot: [-0.2, -0.5, 0.2] },
      { pos: [-2.5, -2.5, -1], rot: [0.4, -0.2, 0.3] },
      { pos: [3.5, -2.0, -1.5], rot: [-0.3, 0.3, -0.2] },
    ];

    sheetConfigs.forEach(cfg => {
      const mesh = new THREE.Mesh(sheetGeo, sheetMat);
      mesh.position.set(...cfg.pos);
      mesh.rotation.set(...cfg.rot);
      worldGroup.add(mesh);
      sheets.push({ mesh, initialRot: cfg.rot, initialPos: cfg.pos });
    });

    // 4. Kinetic Floating Ribbon Paths (Continuous lines in space)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -2, -2),
      new THREE.Vector3(-2, 2, 0),
      new THREE.Vector3(2, -1, 1),
      new THREE.Vector3(6, 2, -1),
    ]);

    const ribbonGeo = new THREE.TubeGeometry(curve, 70, 0.015, 8, false);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0x385741,
      transparent: true,
      opacity: 0.25,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    worldGroup.add(ribbon);

    // 5. Minimalist Ambient Dust Particles (Warm Sage & Ivory)
    const dustCount = 200;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
      dustPositions[i] = (Math.random() - 0.5) * 16;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x385741,
      transparent: true,
      opacity: 0.35,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    worldGroup.add(dust);

    // 6. Yuusuke Dynamic Camera Lerp on Mouse Movement
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 7. Render Loop with Smooth Inertial Camera Motion
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Fluid camera interpolation (Yuusuke's signature camera easing)
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      camera.position.x = mouse.x * 1.5;
      camera.position.y = 1.2 + mouse.y * 1.0;
      camera.lookAt(0, 0, 0);

      // Speed multiplier when voice active
      const speed = isListening ? 2.5 : isProcessing ? 3.5 : 1.0;

      // Floating gentle oscillation of sheets
      sheets.forEach((s, idx) => {
        s.mesh.position.y = s.initialPos[1] + Math.sin(time * 0.8 * speed + idx) * 0.15;
        s.mesh.rotation.y = s.initialRot[1] + Math.cos(time * 0.5 * speed + idx) * 0.1;
      });

      worldGroup.rotation.y = Math.sin(time * 0.1) * 0.08;
      dust.rotation.y = time * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isListening, isProcessing]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#FBF9F1]">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Wispr Flow Warm Cream Ambient Glows */}
      <div className="absolute -top-40 right-10 w-[550px] h-[550px] bg-[#E9EFE9]/70 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-[#FFFFEB]/80 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Hairline Paper Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #385741 1px, transparent 1px), linear-gradient(to bottom, #385741 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
    </div>
  );
}
