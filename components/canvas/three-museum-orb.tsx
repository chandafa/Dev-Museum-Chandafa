"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function colorFromCss(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value) return new THREE.Color(fallback);
  const [r, g, b] = value.split(/\s+/).map(Number);
  return new THREE.Color(r / 255, g / 255, b / 255);
}

export function ThreeMuseumOrb() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: colorFromCss("--museum-paper", "#f4f0e8"),
      roughness: 0.44,
      metalness: 0.28,
      wireframe: true
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.88, 2), coreMaterial);

    const ringAMaterial = new THREE.MeshBasicMaterial({
      color: colorFromCss("--museum-acid", "#d7ff58"),
      transparent: true,
      opacity: 0.8
    });

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.007, 12, 180), ringAMaterial);

    const ringBMaterial = new THREE.MeshBasicMaterial({
      color: colorFromCss("--museum-cyan", "#80f7ff"),
      transparent: true,
      opacity: 0.55
    });

    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.0055, 12, 180), ringBMaterial);

    ringA.rotation.x = Math.PI / 2.7;
    ringB.rotation.y = Math.PI / 2.3;
    group.add(core, ringA, ringB);

    const pointLight = new THREE.PointLight(colorFromCss("--museum-acid", "#d7ff58"), 2.2, 10);
    pointLight.position.set(3, 2, 4);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight("#ffffff", 0.6));

    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(420 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: colorFromCss("--museum-paper", "#f4f0e8"),
      size: 0.01,
      transparent: true,
      opacity: 0.72
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const syncThemeColors = () => {
      coreMaterial.color = colorFromCss("--museum-paper", "#f4f0e8");
      ringAMaterial.color = colorFromCss("--museum-acid", "#d7ff58");
      ringBMaterial.color = colorFromCss("--museum-cyan", "#80f7ff");
      starsMaterial.color = colorFromCss("--museum-paper", "#f4f0e8");
      pointLight.color = colorFromCss("--museum-acid", "#d7ff58");
    };

    const observer = new MutationObserver(syncThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let frame = 0;
    let animation = 0;

    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    const animate = () => {
      frame += 0.01;
      group.rotation.y += 0.006;
      group.rotation.x = Math.sin(frame) * 0.18;
      stars.rotation.y -= 0.0009;
      renderer.render(scene, camera);
      animation = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      renderer.dispose();
      core.geometry.dispose();
      ringA.geometry.dispose();
      ringB.geometry.dispose();
      coreMaterial.dispose();
      ringAMaterial.dispose();
      ringBMaterial.dispose();
      starsMaterial.dispose();
      starsGeometry.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
