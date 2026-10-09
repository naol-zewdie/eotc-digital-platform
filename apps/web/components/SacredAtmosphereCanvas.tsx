'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SacredAtmosphereCanvasProps {
  className?: string;
  variant?: 'header' | 'quote' | 'footer';
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uTextureSize;
  uniform vec2 uMouse;
  uniform float uParallaxStrength;
  uniform float uDistiortionMultiplier;
  uniform float uGlassStrength;
  uniform float ustripesFrequency;
  uniform float uglassSmoothness;
  uniform float uEdgePadding;
  uniform float uGlassDrift;

  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) {
      return uv;
    }
    vec2 scale = uResolution / textureSize;
    float coverScale = max(scale.x, scale.y);
    vec2 scaledSize = textureSize * coverScale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
  }

  // Symmetrically centered fluted displacement: perfectly balanced across all columns
  float displacement(float x, float numStripes, float strength) {
    float modulo = 1.0 / numStripes;
    return (mod(x, modulo) - (modulo * 0.5)) * strength;
  }

  float fractalGlass(float x) {
    float distortion = 0.0;
    for (int i = -5; i <= 5; i++) {
      distortion += displacement(x + float(i) * uglassSmoothness, ustripesFrequency, uGlassStrength);
    }
    return x + (distortion / 11.0);
  }

  float smoothEdge(float x, float padding) {
    if (x < padding) {
      return smoothstep(0.0, padding, x);
    }
    if (x > 1.0 - padding) {
      return 1.0 - smoothstep(1.0 - padding, 1.0, x);
    }
    return 1.0;
  }

  void main() {
    vec2 uv = vUv;
    float originalX = uv.x;
    float edgeFactor = smoothEdge(originalX, uEdgePadding);
    float distortedX = fractalGlass(originalX + uGlassDrift);

    uv.x = mix(originalX, distortedX, edgeFactor);

    float distortionFactor = uv.x - originalX;
    float parallaxDirection = -sign(0.5 - uMouse.x);
    vec2 parallaxOffset = vec2(
      parallaxDirection * abs(uMouse.x - 0.5) * uParallaxStrength * abs(distortionFactor) * uDistiortionMultiplier,
      0.0
    );

    uv += parallaxOffset * edgeFactor;

    vec2 coverUv = getCoverUV(uv, uTextureSize);

    vec4 color = texture2D(uTexture, coverUv);
    gl_FragColor = color;
  }
`;

export const SacredAtmosphereCanvas: React.FC<SacredAtmosphereCanvasProps> = ({
  className = '',
  variant = 'header',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. High-resolution canvas for soft liquid silk drapery
    const fluidCanvas = document.createElement('canvas');
    const fWidth = 1920;
    const fHeight = 1080;
    fluidCanvas.width = fWidth;
    fluidCanvas.height = fHeight;
    const ctx = fluidCanvas.getContext('2d');

    // 2. Three.js Scene Setup (Orthographic plane covering full viewport)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearAlpha(0);
    container.appendChild(renderer.domElement);

    const fluidTexture = new THREE.CanvasTexture(fluidCanvas);
    fluidTexture.minFilter = THREE.LinearFilter;
    fluidTexture.magFilter = THREE.LinearFilter;
    fluidTexture.wrapS = THREE.MirroredRepeatWrapping;
    fluidTexture.wrapT = THREE.MirroredRepeatWrapping;
    fluidTexture.generateMipmaps = false;

    // Uniforms matching Door Dennis dd25SceneDefaults
    const uniforms = {
      uTexture: { value: fluidTexture },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uTextureSize: { value: new THREE.Vector2(fWidth, fHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uParallaxStrength: { value: 0.08 },
      uDistiortionMultiplier: { value: 10.0 },
      uGlassStrength: { value: 2.0 },
      ustripesFrequency: { value: 8.0 }, // 8 vertical fluted columns
      uglassSmoothness: { value: 0.0001 },
      uEdgePadding: { value: 0.02 },
      uGlassDrift: { value: 0.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse Tracking with lerping
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouseX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        targetMouseY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Procedural Broad Liquid Silk Drapery
    // Renders wide, soft, feathered billowing fabric folds across ALL columns (matching Screenshot 1)
    let time = 0;

    const renderFluidWaves = () => {
      if (!ctx) return;

      // Base warm light cream / off-white background fill
      ctx.fillStyle = '#F7F5F0';
      ctx.fillRect(0, 0, fWidth, fHeight);

      // Subtle atmospheric warmth gradient
      const bgGrad = ctx.createLinearGradient(0, 0, fWidth, fHeight);
      bgGrad.addColorStop(0, 'rgba(247, 245, 240, 1)');
      bgGrad.addColorStop(0.5, 'rgba(242, 239, 232, 0.96)');
      bgGrad.addColorStop(1, 'rgba(238, 234, 226, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, fWidth, fHeight);

      // 8 Broad billowing silk folds spanning the whole width seamlessly
      const foldCount = 8;
      const foldSpacing = fWidth / (foldCount - 1);

      for (let f = 0; f < foldCount; f++) {
        const baseX = f * foldSpacing;
        const foldSpeed = time * 0.28 + f * 0.9;
        const foldWidth = 260 + (f % 3) * 60; // Broad 260-380px soft width

        ctx.save();
        ctx.beginPath();

        const steps = 32;
        const stepY = (fHeight + 160) / steps;

        // Left boundary of the broad silk fold
        for (let s = 0; s <= steps; s++) {
          const y = -80 + s * stepY;
          const sway =
            Math.sin(y * 0.0028 + foldSpeed) * 55 +
            Math.cos(y * 0.0055 - foldSpeed * 0.6) * 30 +
            Math.sin(y * 0.01 + foldSpeed * 1.1) * 12;
          const x = baseX + sway - foldWidth * 0.5;

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Right boundary of the broad silk fold
        for (let s = steps; s >= 0; s--) {
          const y = -80 + s * stepY;
          const sway =
            Math.sin(y * 0.0028 + foldSpeed) * 55 +
            Math.cos(y * 0.0055 - foldSpeed * 0.6) * 30 +
            Math.sin(y * 0.01 + foldSpeed * 1.1) * 12;
          const x = baseX + sway + foldWidth * 0.5;

          ctx.lineTo(x, y);
        }

        ctx.closePath();

        // Broad feathered gradient across the fold
        const curSway = Math.sin(foldSpeed) * 40;
        const gradX = baseX + curSway;
        const foldGrad = ctx.createLinearGradient(
          gradX - foldWidth * 0.5,
          0,
          gradX + foldWidth * 0.5,
          0
        );

        if (f % 2 === 0) {
          // Soft celestial slate-blue silk fold (matching Screenshot 1)
          foldGrad.addColorStop(0, 'rgba(165, 192, 222, 0.0)');
          foldGrad.addColorStop(0.35, 'rgba(155, 185, 218, 0.32)');
          foldGrad.addColorStop(0.50, 'rgba(178, 204, 232, 0.42)');
          foldGrad.addColorStop(0.65, 'rgba(155, 185, 218, 0.32)');
          foldGrad.addColorStop(1, 'rgba(165, 192, 222, 0.0)');
        } else {
          // Luminous silver / sacred brass highlight ribbon
          foldGrad.addColorStop(0, 'rgba(215, 230, 246, 0.0)');
          foldGrad.addColorStop(0.35, 'rgba(215, 230, 246, 0.32)');
          foldGrad.addColorStop(0.50, 'rgba(200, 157, 60, 0.14)');
          foldGrad.addColorStop(0.65, 'rgba(225, 238, 250, 0.28)');
          foldGrad.addColorStop(1, 'rgba(215, 230, 246, 0.0)');
        }

        ctx.fillStyle = foldGrad;
        ctx.fill();
        ctx.restore();
      }

      // 3 Diagonal ambient silk glazes crossing the screen softly
      const diagonalGlazes = 3;
      for (let d = 0; d < diagonalGlazes; d++) {
        ctx.save();
        ctx.beginPath();
        const dSpeed = time * 0.18 + d * 2.2;
        const dWidth = 420;
        const startX = (d / (diagonalGlazes - 1)) * fWidth * 0.75 + fWidth * 0.12;

        ctx.moveTo(startX - dWidth, -80);

        const steps = 28;
        const stepY = (fHeight + 160) / steps;

        for (let s = 0; s <= steps; s++) {
          const y = -80 + s * stepY;
          const diagSway = Math.sin(y * 0.0018 + dSpeed) * 90 + Math.cos(y * 0.004 - dSpeed * 0.5) * 45;
          const x = startX + diagSway + (y / fHeight) * 80;
          ctx.lineTo(x + dWidth, y);
        }

        for (let s = steps; s >= 0; s--) {
          const y = -80 + s * stepY;
          const diagSway = Math.sin(y * 0.0018 + dSpeed) * 90 + Math.cos(y * 0.004 - dSpeed * 0.5) * 45;
          const x = startX + diagSway + (y / fHeight) * 80;
          ctx.lineTo(x - dWidth, y);
        }

        ctx.closePath();

        const dGrad = ctx.createLinearGradient(startX - dWidth, 0, startX + dWidth, 0);
        dGrad.addColorStop(0, 'rgba(168, 196, 226, 0.0)');
        dGrad.addColorStop(0.5, 'rgba(182, 208, 235, 0.22)');
        dGrad.addColorStop(1, 'rgba(168, 196, 226, 0.0)');

        ctx.fillStyle = dGrad;
        ctx.fill();
        ctx.restore();
      }

      // Vertical optical column highlight glazes across all 8 stripes
      const vertGrad = ctx.createLinearGradient(0, 0, fWidth, 0);
      for (let i = 0; i <= 8; i++) {
        const stop = i / 8;
        vertGrad.addColorStop(Math.max(0, stop - 0.015), 'rgba(255, 255, 255, 0.0)');
        vertGrad.addColorStop(stop, 'rgba(255, 255, 255, 0.12)');
        vertGrad.addColorStop(Math.min(1, stop + 0.015), 'rgba(255, 255, 255, 0.0)');
      }
      ctx.fillStyle = vertGrad;
      ctx.fillRect(0, 0, fWidth, fHeight);
    };

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (!prefersReducedMotion) {
        time += delta;

        // Smooth mouse lerp
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        uniforms.uMouse.value.set(mouseX, mouseY);

        // Continuous subtle glass drift from Door Dennis
        uniforms.uGlassDrift.value += delta * 0.006;
        if (uniforms.uGlassDrift.value > 1.0) {
          uniforms.uGlassDrift.value -= 1.0;
        }

        // Render full-width liquid silk drapery
        renderFluidWaves();
        fluidTexture.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      uniforms.uResolution.value.set(width, height);
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      fluidTexture.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}
      aria-hidden="true"
    />
  );
};
