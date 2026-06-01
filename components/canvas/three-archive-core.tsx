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

export function ThreeArchiveCore({ projects }: { projects: MuseumProject[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.25, 7.6);
    camera.lookAt(0, 0.25, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.x = -0.12;
    scene.add(root);

    const acid = colorFromCss("--museum-acid", "#d7ff58");
    const cyan = colorFromCss("--museum-cyan", "#80f7ff");
    const paper = colorFromCss("--museum-paper", "#f4f0e8");

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: paper,
      roughness: 0.58,
      metalness: 0.18,
      transparent: true,
      opacity: 0.18
    });
    const base = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.08, 2.65), baseMaterial);
    base.position.y = -1.22;
    root.add(base);

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: paper,
      roughness: 0.28,
      metalness: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.82
    });
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.84, 2), coreMaterial);
    core.position.y = 0.28;
    root.add(core);

    const glassMaterial = new THREE.MeshBasicMaterial({
      color: cyan,
      transparent: true,
      opacity: 0.08,
      wireframe: true
    });
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.65, 1.65, 3, 3, 3), glassMaterial);
    glass.position.copy(core.position);
    root.add(glass);

    const bars = new THREE.Group();
    root.add(bars);
    const topProjects = projects.slice(0, 14);
    const barMaterials: THREE.MeshStandardMaterial[] = [];
    topProjects.forEach((project, index) => {
      const height = 0.5 + (project.score / 100) * 1.4;
      const material = new THREE.MeshStandardMaterial({
        color: colorFromHex(project.accent, index % 2 ? "#80f7ff" : "#d7ff58"),
        emissive: colorFromHex(project.accent, "#d7ff58"),
        emissiveIntensity: 0.08,
        roughness: 0.42,
        metalness: 0.32,
        transparent: true,
        opacity: 0.76
      });
      barMaterials.push(material);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.13, height, 0.13), material);
      const x = -2.05 + index * 0.315;
      bar.position.set(x, -1.18 + height / 2, index % 2 ? 0.95 : -0.95);
      bar.rotation.y = index % 2 ? 0.28 : -0.28;
      bar.userData.phase = index * 0.42;
      bars.add(bar);
    });

    const lineGroup = new THREE.Group();
    root.add(lineGroup);
    const lineMaterials: THREE.LineBasicMaterial[] = [];
    for (let i = 0; i < 7; i += 1) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.35 + i * 0.28, -0.82, -1.15),
        new THREE.Vector3(-1.25 + i * 0.12, -0.22 + i * 0.03, -0.38),
        new THREE.Vector3(0, 0.28, 0),
        new THREE.Vector3(1.25 - i * 0.12, -0.22 + i * 0.03, 0.38),
        new THREE.Vector3(2.35 - i * 0.28, -0.82, 1.15)
      ]);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
      const material = new THREE.LineBasicMaterial({ color: i % 2 ? acid : cyan, transparent: true, opacity: 0.16 + i * 0.018 });
      lineMaterials.push(material);
      const line = new THREE.Line(geometry, material);
      line.userData.phase = i * 0.31;
      lineGroup.add(line);
    }

    const plateMaterials: THREE.MeshBasicMaterial[] = [];
    const plates = new THREE.Group();
    root.add(plates);
    for (let i = 0; i < 4; i += 1) {
      const material = new THREE.MeshBasicMaterial({ color: paper, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
      plateMaterials.push(material);
      const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.28), material);
      plate.position.set(i < 2 ? -1.7 : 1.7, 0.86 - (i % 2) * 0.54, i % 2 ? -1.15 : 1.15);
      plate.rotation.y = i < 2 ? 0.65 : -0.65;
      plates.add(plate);
    }

    scene.add(new THREE.AmbientLight("#ffffff", 0.68));
    const keyLight = new THREE.PointLight(acid, 2.1, 8);
    keyLight.position.set(2.8, 3.2, 3.4);
    const rimLight = new THREE.PointLight(cyan, 1.25, 7);
    rimLight.position.set(-2.8, 1.8, -2.6);
    scene.add(keyLight, rimLight);

    const syncThemeColors = () => {
      const nextAcid = colorFromCss("--museum-acid", "#d7ff58");
      const nextCyan = colorFromCss("--museum-cyan", "#80f7ff");
      const nextPaper = colorFromCss("--museum-paper", "#f4f0e8");
      baseMaterial.color = nextPaper;
      coreMaterial.color = nextPaper;
      glassMaterial.color = nextCyan;
      plateMaterials.forEach((material) => { material.color = nextPaper; });
      keyLight.color = nextAcid;
      rimLight.color = nextCyan;
      lineMaterials.forEach((material, index) => {
        material.color = index % 2 ? nextCyan : nextAcid;
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
      root.rotation.y = Math.sin(frame * 0.55) * 0.18;
      core.rotation.x += 0.0045;
      core.rotation.y += 0.0075;
      glass.rotation.x -= 0.002;
      glass.rotation.y += 0.003;
      lineGroup.children.forEach((line) => {
        line.position.y = Math.sin(frame * 2 + line.userData.phase) * 0.035;
      });
      bars.children.forEach((child) => {
        child.scale.y = 1 + Math.sin(frame * 3 + child.userData.phase) * 0.055;
      });
      plates.children.forEach((plate, index) => {
        plate.position.y += Math.sin(frame * 1.8 + index) * 0.0009;
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
      bars.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
      });
      barMaterials.forEach((material) => material.dispose());
      lineGroup.children.forEach((child) => {
        const line = child as THREE.Line;
        line.geometry.dispose();
      });
      lineMaterials.forEach((material) => material.dispose());
      plates.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
      });
      plateMaterials.forEach((material) => material.dispose());
      base.geometry.dispose();
      baseMaterial.dispose();
      core.geometry.dispose();
      coreMaterial.dispose();
      glass.geometry.dispose();
      glassMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [projects]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
