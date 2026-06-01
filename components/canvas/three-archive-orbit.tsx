"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MuseumProject } from "@/types/project";

function colorFromCss(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value) return new THREE.Color(fallback);
  const [r, g, b] = value.split(/\s+/).map(Number);
  return new THREE.Color(r / 255, g / 255, b / 255);
}

function colorFromHex(hex: string, fallback: string) {
  try {
    return new THREE.Color(hex || fallback);
  } catch {
    return new THREE.Color(fallback);
  }
}

export function ThreeArchiveOrbit({ projects }: { projects: MuseumProject[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.18, 6.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.x = -0.18;
    scene.add(root);

    const acid = colorFromCss("--museum-acid", "#d7ff58");
    const cyan = colorFromCss("--museum-cyan", "#80f7ff");
    const paper = colorFromCss("--museum-paper", "#f4f0e8");

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: paper,
      roughness: 0.32,
      metalness: 0.55,
      wireframe: true,
      transparent: true,
      opacity: 0.92
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 2), coreMaterial);
    root.add(core);

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: acid,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.05, 36, 36), glowMaterial);
    root.add(glow);

    const ringMaterials: THREE.Material[] = [];
    const ringGroup = new THREE.Group();
    root.add(ringGroup);

    const makeRing = (radius: number, tube: number, color: THREE.Color, opacity: number, rotation: [number, number, number]) => {
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
      ringMaterials.push(material);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 220), material);
      ring.rotation.set(...rotation);
      ringGroup.add(ring);
      return ring;
    };

    makeRing(1.28, 0.005, acid, 0.62, [Math.PI / 2.55, 0.35, 0]);
    makeRing(1.72, 0.0045, cyan, 0.44, [Math.PI / 1.86, 0, 0.55]);
    makeRing(2.14, 0.004, paper, 0.22, [Math.PI / 2.25, -0.45, 0.25]);

    const satelliteGroup = new THREE.Group();
    root.add(satelliteGroup);

    const topProjects = projects.slice(0, 16);
    const satellites: { mesh: THREE.Mesh; radius: number; speed: number; offset: number; y: number }[] = [];
    const satelliteGeometry = new THREE.SphereGeometry(0.055, 16, 16);

    topProjects.forEach((project, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: colorFromHex(project.accent, index % 2 ? "#80f7ff" : "#d7ff58"),
        roughness: 0.38,
        metalness: 0.35,
        emissive: colorFromHex(project.accent, "#d7ff58"),
        emissiveIntensity: 0.18
      });
      const mesh = new THREE.Mesh(satelliteGeometry, material);
      mesh.userData.name = project.name;
      satelliteGroup.add(mesh);
      satellites.push({
        mesh,
        radius: 1.1 + (index % 4) * 0.33,
        speed: 0.24 + (index % 5) * 0.035,
        offset: (index / Math.max(1, topProjects.length)) * Math.PI * 2,
        y: ((index % 5) - 2) * 0.13
      });
    });

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 380;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < positions.length; i += 3) {
      const radius = 1.2 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = (Math.random() - 0.5) * 2.5;
      positions[i + 2] = Math.sin(angle) * radius;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: paper,
      size: 0.011,
      transparent: true,
      opacity: 0.58
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    root.add(particles);

    const ambient = new THREE.AmbientLight("#ffffff", 0.58);
    const point = new THREE.PointLight(acid, 2.2, 9);
    point.position.set(3, 2.8, 3.2);
    scene.add(ambient, point);

    const syncThemeColors = () => {
      const nextAcid = colorFromCss("--museum-acid", "#d7ff58");
      const nextCyan = colorFromCss("--museum-cyan", "#80f7ff");
      const nextPaper = colorFromCss("--museum-paper", "#f4f0e8");
      coreMaterial.color = nextPaper;
      glowMaterial.color = nextAcid;
      particlesMaterial.color = nextPaper;
      point.color = nextAcid;
      ringMaterials.forEach((material, index) => {
        if (material instanceof THREE.MeshBasicMaterial) {
          material.color = index === 0 ? nextAcid : index === 1 ? nextCyan : nextPaper;
        }
      });
    };

    const observer = new MutationObserver(syncThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let frame = 0;
    let animation = 0;

    const resize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    const animate = () => {
      frame += 0.012;
      root.rotation.y += 0.0028;
      core.rotation.x += 0.006;
      core.rotation.y += 0.007;
      glow.scale.setScalar(1 + Math.sin(frame * 2) * 0.04);
      ringGroup.rotation.z += 0.0022;
      particles.rotation.y -= 0.0008;

      satellites.forEach((satellite, index) => {
        const angle = frame * satellite.speed + satellite.offset;
        const tilt = index % 2 ? 0.58 : -0.45;
        satellite.mesh.position.set(
          Math.cos(angle) * satellite.radius,
          Math.sin(angle * 1.24) * 0.19 + satellite.y,
          Math.sin(angle) * satellite.radius * Math.cos(tilt)
        );
      });

      renderer.render(scene, camera);
      animation = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      satelliteGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.Material;
          mat.dispose();
        }
      });
      satelliteGeometry.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      core.geometry.dispose();
      coreMaterial.dispose();
      glow.geometry.dispose();
      glowMaterial.dispose();
      ringGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
      });
      ringMaterials.forEach((material) => material.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [projects]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
