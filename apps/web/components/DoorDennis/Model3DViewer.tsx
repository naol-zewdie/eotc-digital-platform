'use client';

import React, { useEffect, useRef, useState } from 'react';
import type * as THREE_TYPES from 'three';

interface Model3DViewerProps {
  modelUrl?: string;
  className?: string;
  autoRotateSpeed?: number;
  scaleMultiplier?: number;
  interactive?: boolean;
  cameraDistance?: number;
  showShadows?: boolean;
  ambientIntensity?: number;
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({
  modelUrl = '/hl._joachim.glb',
  className = 'w-full h-full',
  autoRotateSpeed = 0.008,
  scaleMultiplier = 1.0,
  interactive = true,
  cameraDistance = 2.4,
  showShadows = true,
  ambientIntensity = 1.4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isDisposed = false;
    let cleanupListeners: (() => void) | undefined;
    let cleanupThree: (() => void) | undefined;

    (async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

        if (isDisposed || !container) return;

        // Dimensions
        const width = container.clientWidth || 300;
        const height = container.clientHeight || 300;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0, cameraDistance);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        if (showShadows) {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        container.appendChild(renderer.domElement);

        // Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xfff6ea, ambientIntensity);
        scene.add(ambientLight);

        // Key Light (Sacred Warm Sunlight)
        const keyLight = new THREE.DirectionalLight(0xfff5dd, 2.2);
        keyLight.position.set(3, 4, 3);
        scene.add(keyLight);

        // Fill Light (Soft cool skylight)
        const fillLight = new THREE.DirectionalLight(0xd9e6f2, 1.2);
        fillLight.position.set(-3, -1, -2);
        scene.add(fillLight);

        // Top Rim Light
        const rimLight = new THREE.DirectionalLight(0xc89d3c, 1.8);
        rimLight.position.set(0, 5, -2);
        scene.add(rimLight);

        // Soft point light for metallic sparkle
        const pointLight = new THREE.PointLight(0xfffaed, 1.5, 10);
        pointLight.position.set(0, 2, 2);
        scene.add(pointLight);

        // Pivot group for centering and smooth mouse tilt
        const pivot = new THREE.Group();
        scene.add(pivot);

        // Load Model
        const loader = new GLTFLoader();

        loader.load(
          modelUrl,
          (gltf) => {
            if (isDisposed) return;

            const model = gltf.scene;

            // Compute Bounding Box to normalize scale and center
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Center model geometry at origin
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            // Scale model to fit in standardized unit sphere
            const maxDim = Math.max(size.x, size.y, size.z);
            const normalizedScale = (1.5 / (maxDim || 1)) * scaleMultiplier;
            model.scale.setScalar(normalizedScale);

            // Enhance material reflections if needed
            model.traverse((child) => {
              if ((child as THREE_TYPES.Mesh).isMesh) {
                const mesh = child as THREE_TYPES.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
              }
            });

            pivot.add(model);
            setLoading(false);
          },
          (xhr) => {
            if (xhr.lengthComputable) {
              const percent = Math.round((xhr.loaded / xhr.total) * 100);
              setLoadProgress(percent);
            }
          },
          (err) => {
            console.error('Failed to load 3D GLTF model:', err);
            setError('Failed to load 3D model');
            setLoading(false);
          }
        );

        // Mouse Interaction
        let targetRotationX = 0;
        let targetRotationY = 0;
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
          if (!interactive) return;
          const rect = container.getBoundingClientRect();
          const clientX = e.clientX - rect.left;
          const clientY = e.clientY - rect.top;

          // Normalized coordinates (-1 to 1)
          mouseX = (clientX / rect.width) * 2 - 1;
          mouseY = -(clientY / rect.height) * 2 + 1;

          targetRotationX = mouseY * 0.35;
          targetRotationY = mouseX * 0.55;
        };

        const handleMouseLeave = () => {
          targetRotationX = 0;
          targetRotationY = 0;
        };

        if (interactive) {
          window.addEventListener('mousemove', handleMouseMove, { passive: true });
          container.addEventListener('mouseleave', handleMouseLeave);
        }

        // Resize Handler
        const handleResize = () => {
          if (!container || isDisposed) return;
          const w = container.clientWidth || 300;
          const h = container.clientHeight || 300;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        // Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
          if (isDisposed) return;
          animationFrameId = requestAnimationFrame(animate);

          // Continuous ambient rotation
          pivot.rotation.y += autoRotateSpeed;

          // Smooth lerp to mouse tilt
          pivot.rotation.x += (targetRotationX - pivot.rotation.x) * 0.05;
          pivot.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.04; // Gentle floating bob

          renderer.render(scene, camera);
        };

        animate();

        cleanupListeners = () => {
          if (interactive) {
            window.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
          }
          resizeObserver.disconnect();
        };

        cleanupThree = () => {
          scene.traverse((obj) => {
            if ((obj as THREE_TYPES.Mesh).isMesh) {
              const mesh = obj as THREE_TYPES.Mesh;
              mesh.geometry?.dispose();
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m.dispose());
              } else if (mesh.material) {
                mesh.material.dispose();
              }
            }
          });

          renderer.dispose();
          if (renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (e) {
        console.error('Error initializing 3D viewer:', e);
        setError('3D viewer initialization error');
        setLoading(false);
      }
    })();

    return () => {
      isDisposed = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      cleanupListeners?.();
      cleanupThree?.();
    };
  }, [modelUrl, autoRotateSpeed, scaleMultiplier, interactive, cameraDistance, ambientIntensity, showShadows]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading state indicator */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="w-8 h-8 rounded-full border-2 border-[#C89D3C] border-t-transparent animate-spin mb-2" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A7771]">
            Loading 3D Emblem {loadProgress > 0 ? `${loadProgress}%` : ''}
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};
