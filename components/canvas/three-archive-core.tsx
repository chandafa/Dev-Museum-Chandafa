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

function makeTubeBetween(start: THREE.Vector3, end: THREE.Vector3, radius: number, material: THREE.Material) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 18, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return mesh;
}

function makeFace(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, material: THREE.Material) {
  const geometry = new THREE.BufferGeometry().setFromPoints([a, b, c]);
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}

export function ThreeArchiveCore({ projects }: { projects: MuseumProject[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.18, 5.8);
    camera.lookAt(0, -0.05, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.85));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const prism = new THREE.Group();
    prism.rotation.x = -0.08;
    prism.rotation.z = 0.02;
    root.add(prism);

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: colorFromCss("--museum-paper", "#f4f0e8"),
      emissive: colorFromCss("--museum-paper", "#f4f0e8"),
      emissiveIntensity: 0.08,
      roughness: 0.28,
      metalness: 0.14
    });
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: colorFromCss("--museum-acid", "#d7ff58"),
      emissive: colorFromCss("--museum-acid", "#d7ff58"),
      emissiveIntensity: 0.24,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.74
    });
    const faceMaterial = new THREE.MeshPhysicalMaterial({
      color: colorFromCss("--museum-paper", "#f4f0e8"),
      transparent: true,
      opacity: 0.045,
      roughness: 0.22,
      metalness: 0.12,
      transmission: 0.18,
      thickness: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const dotMaterial = new THREE.MeshStandardMaterial({
      color: colorFromCss("--museum-cyan", "#80f7ff"),
      emissive: colorFromCss("--museum-cyan", "#80f7ff"),
      emissiveIntensity: 0.36,
      roughness: 0.2,
      metalness: 0.2
    });

    const top = new THREE.Vector3(0, 1.48, 0);
    const left = new THREE.Vector3(-1.48, -1.04, 0.72);
    const right = new THREE.Vector3(1.48, -1.04, 0.72);
    const back = new THREE.Vector3(0, -1.04, -1.48);
    const center = new THREE.Vector3(0, -0.28, 0.02);
    const vertices = [top, left, right, back];

    const faces = [
      [top, left, right],
      [top, right, back],
      [top, back, left],
      [left, back, right]
    ];
    faces.forEach(([a, b, c]) => prism.add(makeFace(a, b, c, faceMaterial)));

    const outerEdges: [THREE.Vector3, THREE.Vector3][] = [
      [top, left],
      [top, right],
      [top, back],
      [left, right],
      [right, back],
      [back, left]
    ];
    outerEdges.forEach(([a, b]) => prism.add(makeTubeBetween(a, b, 0.026, edgeMaterial)));

    const innerEdges: [THREE.Vector3, THREE.Vector3][] = [
      [center, top],
      [center, left],
      [center, right],
      [center, back]
    ];
    innerEdges.forEach(([a, b]) => prism.add(makeTubeBetween(a, b, 0.012, innerMaterial)));

    const dotGeometry = new THREE.SphereGeometry(0.05, 18, 18);
    vertices.concat(center).forEach((point, index) => {
      const dot = new THREE.Mesh(dotGeometry, index === 4 ? innerMaterial : dotMaterial);
      dot.position.copy(point);
      dot.userData.phase = index * 0.6;
      prism.add(dot);
    });

    const labelGroup = new THREE.Group();
    const topProjects = projects.slice(0, 10);
    topProjects.forEach((project, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: index % 2 ? colorFromCss("--museum-cyan", "#80f7ff") : colorFromCss("--museum-acid", "#d7ff58"),
        emissive: index % 2 ? colorFromCss("--museum-cyan", "#80f7ff") : colorFromCss("--museum-acid", "#d7ff58"),
        emissiveIntensity: 0.14,
        roughness: 0.28,
        metalness: 0.18,
        transparent: true,
        opacity: 0.66
      });
      const width = 0.12 + Math.min(0.28, project.score / 420);
      const chip = new THREE.Mesh(new THREE.BoxGeometry(width, 0.025, 0.042), material);
      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      chip.position.set(side * (1.08 + row * 0.04), 0.84 - row * 0.22, 0.92 - row * 0.08);
      chip.rotation.y = side * 0.62;
      chip.userData.phase = index * 0.42;
      labelGroup.add(chip);
    });
    prism.add(labelGroup);

    const cyan = colorFromCss("--museum-cyan", "#80f7ff");
    const acid = colorFromCss("--museum-acid", "#d7ff58");
    scene.add(new THREE.AmbientLight("#ffffff", 0.8));
    const key = new THREE.PointLight(acid, 1.45, 8);
    key.position.set(2.8, 2.8, 3.2);
    const rim = new THREE.PointLight(cyan, 1.25, 8);
    rim.position.set(-2.6, -1.2, 2.6);
    scene.add(key, rim);

    const syncThemeColors = () => {
      const isLight = document.documentElement.dataset.theme === "light";
      const edge = isLight ? colorFromCss("--museum-ink", "#08090a") : colorFromCss("--museum-paper", "#f4f0e8");
      const paper = colorFromCss("--museum-paper", "#f4f0e8");
      const nextAcid = colorFromCss("--museum-acid", "#d7ff58");
      const nextCyan = colorFromCss("--museum-cyan", "#80f7ff");
      edgeMaterial.color.copy(edge);
      edgeMaterial.emissive.copy(edge);
      faceMaterial.color.copy(paper);
      innerMaterial.color.copy(nextAcid);
      innerMaterial.emissive.copy(nextAcid);
      dotMaterial.color.copy(nextCyan);
      dotMaterial.emissive.copy(nextCyan);
      key.color.copy(nextAcid);
      rim.color.copy(nextCyan);
    };
    syncThemeColors();

    const observer = new MutationObserver(syncThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let animation = 0;
    let frame = 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    const animate = () => {
      frame += prefersReducedMotion ? 0.004 : 0.013;
      prism.rotation.y += prefersReducedMotion ? 0.002 : 0.009;
      prism.rotation.x = -0.1 + Math.sin(frame * 0.72) * 0.07;
      prism.rotation.z = Math.sin(frame * 0.5) * 0.035;
      labelGroup.children.forEach((child) => {
        child.position.y += Math.sin(frame * 2.1 + child.userData.phase) * 0.0008;
      });
      prism.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry === dotGeometry) {
          const pulse = 1 + Math.sin(frame * 2.4 + child.userData.phase) * 0.12;
          child.scale.setScalar(pulse);
        }
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
      prism.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
      edgeMaterial.dispose();
      innerMaterial.dispose();
      faceMaterial.dispose();
      dotMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [projects]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
