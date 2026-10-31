import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BizarroBackground({ isListening, isProcessing }) {
  const mountRef = useRef(null);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 3. Subtle Ambient Particle Grid (Bizar.ro signature)
    const particleCount = 450;
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      opacities[i] = Math.random() * 0.4 + 0.1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.028,
      color: 0x818cf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Subtle Undulating Wave Ribbons (Fluid background atmosphere)
    const planeGeo = new THREE.PlaneGeometry(16, 12, 40, 40);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = -Math.PI / 3.5;
    planeMesh.position.y = -2;
    scene.add(planeMesh);

    // 5. Mouse Parallax
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera sway with cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;
      camera.position.x = mouse.x * 0.6;
      camera.position.y = mouse.y * 0.4;
      camera.lookAt(0, 0, 0);

      // Speed up gently when voice is active
      const speed = isListening ? 2.5 : isProcessing ? 3.5 : 1.0;

      particles.rotation.y = time * 0.015 * speed;
      particles.rotation.x = time * 0.008 * speed;

      // Undulate plane wireframe
      const pos = planeGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 0.5 + time * 0.8 * speed) * Math.cos(v * 0.5 + time * 0.6 * speed) * 0.4;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isListening, isProcessing]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#050609]">
      {/* Three.js full-screen ambient canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Subtle organic gradient glows */}
      <div className="absolute -top-60 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Hairline Grid Overlay (Bizar.ro style) */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
    </div>
  );
}
