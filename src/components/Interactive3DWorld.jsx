import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Interactive3DWorld({ isListening, isProcessing }) {
  const mountRef = useRef(null);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 3. Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x385741, 4.5, 30); // Wispr Sage Green
    pointLight1.position.set(6, 6, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xd97706, 3.0, 30); // Warm Gold Amber
    pointLight2.position.set(-6, -4, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x4338ca, 3.5, 30); // Deep Indigo
    pointLight3.position.set(0, 8, -4);
    scene.add(pointLight3);

    // 4. Kinetic 3D Sculptures Floating in the World (Unique, NOT square boxes!)
    // A. Complex Mobius / Torus Knot Sculpture (Right Background)
    const knotGeo = new THREE.TorusKnotGeometry(2.0, 0.45, 128, 32, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAF8F2,
      emissive: 0x385741,
      emissiveIntensity: 0.35,
      roughness: 0.18,
      metalness: 0.15,
      transmission: 0.7, // Frosted glass refraction
      thickness: 1.2,
      transparent: true,
      opacity: 0.65,
      clearcoat: 0.8,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    knotMesh.position.set(5.5, 1.0, -3.5);
    worldGroup.add(knotMesh);

    // B. Second Iridescent Twisted Ribbon Knot (Left Background)
    const knot2Geo = new THREE.TorusKnotGeometry(1.6, 0.3, 100, 24, 3, 5);
    const knot2Mat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFBEB,
      emissive: 0xD97706,
      emissiveIntensity: 0.3,
      roughness: 0.25,
      transmission: 0.6,
      thickness: 1.0,
      transparent: true,
      opacity: 0.55,
      clearcoat: 0.6,
    });
    const knot2Mesh = new THREE.Mesh(knot2Geo, knot2Mat);
    knot2Mesh.position.set(-5.5, -2.0, -4.0);
    worldGroup.add(knot2Mesh);

    // C. Elegant Orbital Rings (Wispr Flow Whispering Rings)
    const rings = [];
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x385741,
      transparent: true,
      opacity: 0.25,
    });
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.TorusGeometry(3.2 + i * 1.4, 0.015, 16, 120);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = (i * Math.PI) / 4;
      ring.rotation.y = (i * Math.PI) / 6;
      worldGroup.add(ring);
      rings.push(ring);
    }

    // 5. Flowing 3D Particle Constellation (800 particles that react to cursor)
    const particleCount = 800;
    const posArray = new Float32Array(particleCount * 3);
    const originPos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 12;

      posArray[i3] = x;
      posArray[i3 + 1] = y;
      posArray[i3 + 2] = z;

      originPos[i3] = x;
      originPos[i3 + 1] = y;
      originPos[i3 + 2] = z;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x385741,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particles);

    // 6. Interactive Cursor Magnetic Physics & Scroll Parallax
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 7. 60 FPS Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse interpolation (inertia)
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.05;
      const scrollOffset = scrollY * 0.003;

      // Camera glides dynamically across the whole 3D world as you move mouse and scroll!
      camera.position.x = mouse.x * 2.2;
      camera.position.y = mouse.y * 1.5 - scrollOffset;
      camera.lookAt(0, -scrollOffset, 0);

      // Speed multiplier when voice is active
      const speed = isListening ? 3.0 : isProcessing ? 4.5 : 1.0;

      // Rotating the unique Torus Knot sculptures
      knotMesh.rotation.x = time * 0.15 * speed;
      knotMesh.rotation.y = time * 0.22 * speed;
      knotMesh.position.y = 1.0 + Math.sin(time * 0.8) * 0.4;

      knot2Mesh.rotation.x = -time * 0.18 * speed;
      knot2Mesh.rotation.z = time * 0.12 * speed;
      knot2Mesh.position.y = -2.0 + Math.cos(time * 0.7) * 0.35;

      // Rotating orbital rings
      rings.forEach((ring, idx) => {
        ring.rotation.z += (0.002 * (idx + 1)) * speed;
        ring.rotation.x += (0.001 * (idx + 1)) * speed;
      });

      // Interactive particle motion (drifting gently with slight cursor repulsion)
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ox = originPos[i3];
        const oy = originPos[i3 + 1];
        const oz = originPos[i3 + 2];

        // Wave oscillation
        positions[i3] = ox + Math.sin(time * 0.5 + oy) * 0.3;
        positions[i3 + 1] = oy + Math.cos(time * 0.5 + ox) * 0.3;
        positions[i3 + 2] = oz + Math.sin(time * 0.8 + ox) * 0.2;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isListening, isProcessing]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#FAF8F2]">
      {/* Interactive 3D WebGL Canvas spanning the ENTIRE viewport */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Subtle organic light reflections in Wispr Flow colors */}
      <div className="absolute top-10 right-1/4 w-[650px] h-[650px] bg-[#E9EFE9]/60 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-[#FFFBEB]/70 rounded-full blur-[160px] pointer-events-none" />

      {/* Fine architectural grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #385741 1px, transparent 1px), linear-gradient(to bottom, #385741 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
