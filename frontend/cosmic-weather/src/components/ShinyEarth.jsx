"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShinyEarth() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    // Increased canvas size for bigger Earth
    renderer.setSize(600, 600);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 96, 96);
    const textureLoader = new THREE.TextureLoader();

    const earthDayTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
    );
    const earthNightTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_night_2048.jpg"
    );
    const earthSpecularTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"
    );
    const earthNormalTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"
    );
    const earthCloudTexture = textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"
    );

    const earthDayMaterial = new THREE.MeshPhongMaterial({
      map: earthDayTexture,
      specularMap: earthSpecularTexture,
      normalMap: earthNormalTexture,
      normalScale: new THREE.Vector2(0.6, 0.6),
      specular: new THREE.Color(0x333333),
      shininess: 30,
      transparent: true,
      opacity: 1,
    });

    const earthNightMaterial = new THREE.MeshBasicMaterial({
      map: earthNightTexture,
      transparent: true,
      opacity: 0.9,
    });

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthDay = new THREE.Mesh(geometry, earthDayMaterial);
    earthGroup.add(earthDay);

    const earthNight = new THREE.Mesh(geometry, earthNightMaterial);
    earthNight.rotation.y = Math.PI;
    earthGroup.add(earthNight);

    const cloudGeometry = new THREE.SphereGeometry(1.01, 96, 96);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: earthCloudTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });

    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(clouds);

    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x4db6ac,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphere);

    const ambientLight = new THREE.AmbientLight(0x333333, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x4db6ac, 0.5);
    fillLight.position.set(-3, -1, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(-2, 1, -3);
    scene.add(rimLight);

    camera.position.z = 2.6;

    const animate = () => {
      requestAnimationFrame(animate);

      earthGroup.rotation.y += 0.002;
      clouds.rotation.y += 0.0022;

      const rotation = earthGroup.rotation.y % (Math.PI * 2);
      const dayOpacity = Math.sin(rotation) * 0.5 + 0.5;
      const nightOpacity = 1 - dayOpacity;

      earthDayMaterial.opacity = Math.min(1, dayOpacity * 1.5);
      earthNightMaterial.opacity = Math.min(1, nightOpacity * 1.2);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize for responsiveness
    const handleResize = () => {
      if (!mountRef.current) return;
      const { width, height } = mountRef.current.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ filter: "drop-shadow(0 0 20px rgba(77, 182, 172, 0.25))" }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}