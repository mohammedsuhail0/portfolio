import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoading } from "../../context/LoadingProvider";
import { useTheme } from "../../context/ThemeContext";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const { isLoading } = useLoading();
  const { theme } = useTheme();
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (!canvasDiv.current) return;

    let isMounted = true;
    const container = canvasDiv.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 68;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    const isLight = theme === "light";

    // 2. Galaxy & Starfield Construction
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Tilt the galaxy gracefully for a dramatic cosmic perspective
    galaxyGroup.rotation.x = 0.55;
    galaxyGroup.rotation.z = -0.22;

    // -------------------------------------------------------------
    // SHADER: Realistic Circular Stars with Core Glow & Optical Spikes
    // -------------------------------------------------------------
    const starVertexShader = `
      uniform float uTime;
      uniform float uPixelRatio;

      attribute float aSize;
      attribute vec3 aColor;
      attribute float aTwinkleSpeed;
      attribute float aTwinklePhase;
      attribute float aSpike;

      varying vec3 vColor;
      varying float vAlpha;
      varying float vSpike;

      void main() {
        vColor = aColor;
        vSpike = aSpike;

        // Organic twinkle scintillation
        float twinkle = sin(uTime * aTwinkleSpeed + aTwinklePhase);
        vAlpha = 0.65 + 0.35 * twinkle;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float dist = -mvPosition.z;

        // Size attenuation based on distance
        gl_PointSize = aSize * uPixelRatio * (260.0 / max(dist, 1.0));
        gl_PointSize = max(gl_PointSize, 1.5 * uPixelRatio);

        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const starFragmentShader = `
      uniform float uThemeIsLight;

      varying vec3 vColor;
      varying float vAlpha;
      varying float vSpike;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);

        // Discard fragments outside circular boundary (ELIMINATES SQUARES COMPLETELY)
        if (dist > 0.5) {
          discard;
        }

        // 1. Intense piercing white core
        float core = exp(-dist * 16.0) * 1.5;

        // 2. Soft atmospheric radiant glow
        float halo = exp(-dist * 5.2) * 0.75;

        // 3. Astrophotography diffraction cross-flare (James Webb / Hubble spike)
        float spike = 0.0;
        if (vSpike > 0.05) {
          float spikeH = max(0.0, 1.0 - abs(coord.y) * 18.0) * exp(-abs(coord.x) * 4.0);
          float spikeV = max(0.0, 1.0 - abs(coord.x) * 18.0) * exp(-abs(coord.y) * 4.0);
          float diag1 = max(0.0, 1.0 - abs(coord.x + coord.y) * 14.0) * 0.25;
          float diag2 = max(0.0, 1.0 - abs(coord.x - coord.y) * 14.0) * 0.25;
          spike = (spikeH + spikeV + diag1 + diag2) * vSpike;
        }

        float totalIntensity = core + halo + spike;

        if (uThemeIsLight > 0.5) {
          vec3 finalColor = vColor * (0.8 + 0.2 * totalIntensity);
          float alpha = min(totalIntensity * vAlpha * 0.65, 0.85);
          gl_FragColor = vec4(finalColor, alpha);
        } else {
          // Luminous white core blending into the star's atmospheric tint
          vec3 coreTint = mix(vColor, vec3(1.0, 1.0, 1.0), clamp(core * 0.85, 0.0, 1.0));
          vec3 finalColor = coreTint * totalIntensity;
          float alpha = min(totalIntensity * vAlpha, 1.0);
          gl_FragColor = vec4(finalColor, alpha);
        }
      }
    `;

    const starUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uThemeIsLight: { value: isLight ? 1.0 : 0.0 },
    };

    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: starUniforms,
      transparent: true,
      depthWrite: false,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    // -------------------------------------------------------------
    // GENERATE GALAXY SPIRAL STARS & BULGE (7,000 stars)
    // -------------------------------------------------------------
    const galaxyStarCount = 7000;
    const galaxyGeo = new THREE.BufferGeometry();
    const gPositions = new Float32Array(galaxyStarCount * 3);
    const gColors = new Float32Array(galaxyStarCount * 3);
    const gSizes = new Float32Array(galaxyStarCount);
    const gTwinkleSpeed = new Float32Array(galaxyStarCount);
    const gTwinklePhase = new Float32Array(galaxyStarCount);
    const gSpikes = new Float32Array(galaxyStarCount);

    const colorCoreGold = new THREE.Color(isLight ? 0x0284c7 : 0xfde68a);
    const colorCoreWhite = new THREE.Color(isLight ? 0x0369a1 : 0xffffff);
    const colorArmCyan = new THREE.Color(isLight ? 0x0891b2 : 0x38bdf8);
    const colorArmIce = new THREE.Color(isLight ? 0x2563eb : 0xa5f3fc);
    const colorArmViolet = new THREE.Color(isLight ? 0x4f46e5 : 0x818cf8);
    const colorArmMagenta = new THREE.Color(isLight ? 0x7c3aed : 0xc084fc);

    const branches = 3;
    const galaxyRadius = 55;

    for (let i = 0; i < galaxyStarCount; i++) {
      // Radius distribution: concentrated exponentially towards core
      const r = Math.pow(Math.random(), 1.6) * galaxyRadius;
      const branchAngle = ((i % branches) * (2 * Math.PI)) / branches;
      // Logarithmic spiral twist
      const spinAngle = r * 0.17;
      const angle = branchAngle + spinAngle;

      // Realistic arm dispersion: tighter near center, wider at fringe
      const spread = (r / galaxyRadius) * 4.8 + 1.2;
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (spread * 0.45);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread;

      gPositions[i * 3] = Math.cos(angle) * r + randomX;
      gPositions[i * 3 + 1] = randomY;
      gPositions[i * 3 + 2] = Math.sin(angle) * r + randomZ;

      // Color selection based on distance from galactic center
      let starColor: THREE.Color;
      if (r < 12) {
        // Galactic core: warm gold, amber, brilliant solar white
        starColor = Math.random() < 0.4 ? colorCoreWhite : colorCoreGold;
      } else if (r < 32) {
        // Inner arms: vibrant cyan, ice blue, diamond white
        const mix = Math.random();
        starColor = mix < 0.35 ? colorCoreWhite : mix < 0.7 ? colorArmCyan : colorArmIce;
      } else {
        // Outer arms: deep cosmic violet, magenta, and electric blue
        const mix = Math.random();
        starColor = mix < 0.4 ? colorArmCyan : mix < 0.7 ? colorArmViolet : colorArmMagenta;
      }

      gColors[i * 3] = starColor.r;
      gColors[i * 3 + 1] = starColor.g;
      gColors[i * 3 + 2] = starColor.b;

      // Stellar magnitude & sizes
      const randType = Math.random();
      if (randType < 0.035) {
        // Rare supergiant anchor stars with majestic diffraction spikes
        gSizes[i] = 3.6 + Math.random() * 2.2;
        gSpikes[i] = 0.85 + Math.random() * 0.4;
      } else if (randType < 0.25) {
        // Medium luminous stars
        gSizes[i] = 1.8 + Math.random() * 1.2;
        gSpikes[i] = 0.0;
      } else {
        // Vast sea of fine stellar pinpoints
        gSizes[i] = 0.7 + Math.random() * 0.8;
        gSpikes[i] = 0.0;
      }

      gTwinkleSpeed[i] = 1.5 + Math.random() * 3.5;
      gTwinklePhase[i] = Math.random() * Math.PI * 2;
    }

    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(gPositions, 3));
    galaxyGeo.setAttribute("color", new THREE.BufferAttribute(gColors, 3));
    galaxyGeo.setAttribute("aSize", new THREE.BufferAttribute(gSizes, 1));
    galaxyGeo.setAttribute("aTwinkleSpeed", new THREE.BufferAttribute(gTwinkleSpeed, 1));
    galaxyGeo.setAttribute("aTwinklePhase", new THREE.BufferAttribute(gTwinklePhase, 1));
    galaxyGeo.setAttribute("aSpike", new THREE.BufferAttribute(gSpikes, 1));

    const galaxyStars = new THREE.Points(galaxyGeo, starMaterial);
    galaxyGroup.add(galaxyStars);

    // -------------------------------------------------------------
    // GENERATE AMBIENT DEEP-SPACE FIELD STARS (3,500 stars)
    // -------------------------------------------------------------
    const fieldStarCount = 3500;
    const fieldGeo = new THREE.BufferGeometry();
    const fPositions = new Float32Array(fieldStarCount * 3);
    const fColors = new Float32Array(fieldStarCount * 3);
    const fSizes = new Float32Array(fieldStarCount);
    const fTwinkleSpeed = new Float32Array(fieldStarCount);
    const fTwinklePhase = new Float32Array(fieldStarCount);
    const fSpikes = new Float32Array(fieldStarCount);

    for (let i = 0; i < fieldStarCount; i++) {
      // Wide 3D sphere/box enclosing the complete viewport
      fPositions[i * 3] = (Math.random() - 0.5) * 140;
      fPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      fPositions[i * 3 + 2] = (Math.random() - 0.5) * 110;

      const choice = Math.random();
      let color: THREE.Color;
      if (choice < 0.5) {
        color = colorCoreWhite;
      } else if (choice < 0.75) {
        color = colorArmIce;
      } else if (choice < 0.9) {
        color = colorCoreGold;
      } else {
        color = colorArmViolet;
      }

      fColors[i * 3] = color.r;
      fColors[i * 3 + 1] = color.g;
      fColors[i * 3 + 2] = color.b;

      if (choice < 0.02) {
        fSizes[i] = 3.5 + Math.random() * 1.8;
        fSpikes[i] = 0.9;
      } else if (choice < 0.2) {
        fSizes[i] = 1.6 + Math.random() * 0.9;
        fSpikes[i] = 0.0;
      } else {
        fSizes[i] = 0.6 + Math.random() * 0.7;
        fSpikes[i] = 0.0;
      }

      fTwinkleSpeed[i] = 1.2 + Math.random() * 2.8;
      fTwinklePhase[i] = Math.random() * Math.PI * 2;
    }

    fieldGeo.setAttribute("position", new THREE.BufferAttribute(fPositions, 3));
    fieldGeo.setAttribute("color", new THREE.BufferAttribute(fColors, 3));
    fieldGeo.setAttribute("aSize", new THREE.BufferAttribute(fSizes, 1));
    fieldGeo.setAttribute("aTwinkleSpeed", new THREE.BufferAttribute(fTwinkleSpeed, 1));
    fieldGeo.setAttribute("aTwinklePhase", new THREE.BufferAttribute(fTwinklePhase, 1));
    fieldGeo.setAttribute("aSpike", new THREE.BufferAttribute(fSpikes, 1));

    const fieldStars = new THREE.Points(fieldGeo, starMaterial);
    scene.add(fieldStars);

    // -------------------------------------------------------------
    // SHADER & PARTICLES: GALAXY NEBULA GAS CLOUDS (160 clouds)
    // -------------------------------------------------------------
    const nebulaVertexShader = `
      uniform float uPixelRatio;

      attribute float aSize;
      attribute vec3 aColor;
      attribute float aAlpha;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = aColor;
        vAlpha = aAlpha;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float dist = -mvPosition.z;

        gl_PointSize = aSize * uPixelRatio * (280.0 / max(dist, 1.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const nebulaFragmentShader = `
      uniform float uThemeIsLight;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        // Ultra-soft celestial gaussian puff
        float puff = smoothstep(0.5, 0.0, dist) * exp(-dist * 2.4);

        if (uThemeIsLight > 0.5) {
          gl_FragColor = vec4(vColor, puff * vAlpha * 0.12);
        } else {
          gl_FragColor = vec4(vColor * puff, puff * vAlpha * 0.32);
        }
      }
    `;

    const nebulaMaterial = new THREE.ShaderMaterial({
      vertexShader: nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uThemeIsLight: { value: isLight ? 1.0 : 0.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    const nebulaCount = 160;
    const nebulaGeo = new THREE.BufferGeometry();
    const nPositions = new Float32Array(nebulaCount * 3);
    const nColors = new Float32Array(nebulaCount * 3);
    const nSizes = new Float32Array(nebulaCount);
    const nAlphas = new Float32Array(nebulaCount);

    const nebulaPalette = [
      new THREE.Color(isLight ? 0x0284c7 : 0x4f46e5), // Indigo
      new THREE.Color(isLight ? 0x0891b2 : 0x06b6d4), // Cyan
      new THREE.Color(isLight ? 0x2563eb : 0x7c3aed), // Violet
      new THREE.Color(isLight ? 0x0369a1 : 0xa855f7), // Purple/Magenta
      new THREE.Color(isLight ? 0x0284c7 : 0x1e3a8a), // Deep Navy
    ];

    for (let i = 0; i < nebulaCount; i++) {
      const r = Math.pow(Math.random(), 1.4) * (galaxyRadius * 0.95);
      const branchAngle = ((i % branches) * (2 * Math.PI)) / branches;
      const spinAngle = r * 0.17;
      const angle = branchAngle + spinAngle;

      const spread = (r / galaxyRadius) * 6.5 + 2.0;
      const rx = (Math.random() - 0.5) * spread;
      const ry = (Math.random() - 0.5) * (spread * 0.6);
      const rz = (Math.random() - 0.5) * spread;

      nPositions[i * 3] = Math.cos(angle) * r + rx;
      nPositions[i * 3 + 1] = ry;
      nPositions[i * 3 + 2] = Math.sin(angle) * r + rz;

      const color = nebulaPalette[Math.floor(Math.random() * nebulaPalette.length)];
      nColors[i * 3] = color.r;
      nColors[i * 3 + 1] = color.g;
      nColors[i * 3 + 2] = color.b;

      // Volumetric cloud sizes
      nSizes[i] = 18.0 + Math.random() * 28.0;
      nAlphas[i] = 0.15 + Math.random() * 0.22;
    }

    nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nPositions, 3));
    nebulaGeo.setAttribute("color", new THREE.BufferAttribute(nColors, 3));
    nebulaGeo.setAttribute("aSize", new THREE.BufferAttribute(nSizes, 1));
    nebulaGeo.setAttribute("aAlpha", new THREE.BufferAttribute(nAlphas, 1));

    const nebulaClouds = new THREE.Points(nebulaGeo, nebulaMaterial);
    galaxyGroup.add(nebulaClouds);

    // -------------------------------------------------------------
    // DYNAMIC SHOOTING STAR (METEOR STREAK)
    // -------------------------------------------------------------
    const meteorLength = 6.0;
    const meteorGeo = new THREE.BufferGeometry();
    const meteorPositions = new Float32Array([0, 0, 0, 0, 0, 0]);
    const meteorColors = new Float32Array([
      1.0, 1.0, 1.0, // Head: brilliant diamond white
      0.22, 0.74, 0.97, // Tail: luminous cyan
    ]);
    meteorGeo.setAttribute("position", new THREE.BufferAttribute(meteorPositions, 3));
    meteorGeo.setAttribute("color", new THREE.BufferAttribute(meteorColors, 3));

    const meteorMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    });
    const meteor = new THREE.Line(meteorGeo, meteorMaterial);
    scene.add(meteor);

    let meteorActive = false;
    let meteorProgress = 0;
    let meteorStartX = 0;
    let meteorStartY = 0;
    let meteorStartZ = 0;
    let meteorDirX = -1;
    let meteorDirY = -0.6;
    let meteorSpeed = 48.0;
    let nextMeteorTime = 2.5;

    // 3. Subtle Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // 5. Mouse Parallax & Scroll Reactivity
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let targetScrollY = 0;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.targetX = normX;
      mouse.targetY = normY;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset;
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      const pr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pr);
      starUniforms.uPixelRatio.value = pr;
      nebulaMaterial.uniforms.uPixelRatio.value = pr;
    };

    window.addEventListener("resize", handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastTime = 0;
    let cameraZ = 68;
    const targetCameraZ = 45;

    const animate = () => {
      if (!isMounted) return;
      animationFrameId = requestAnimationFrame(animate);

      // Do not compete with preloader on GPU while loading
      if (isLoadingRef.current) {
        return;
      }

      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(elapsedTime - lastTime, 0.1);
      lastTime = elapsedTime;

      // Smooth cosmic warp dive-in on hero arrival
      if (cameraZ > targetCameraZ + 0.05) {
        cameraZ += (targetCameraZ - cameraZ) * 0.04;
        camera.position.z = cameraZ;
      } else if (camera.position.z !== targetCameraZ) {
        camera.position.z = targetCameraZ;
      }

      // Pass time to star shader for smooth organic twinkling
      starUniforms.uTime.value = elapsedTime;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Smooth scroll parallax
      scrollY += (targetScrollY - scrollY) * 0.05;

      // Slow, hypnotic cosmic drift and galaxy rotation
      galaxyGroup.rotation.y = elapsedTime * 0.018 + mouse.x * 0.12;
      galaxyGroup.rotation.x = 0.55 + mouse.y * 0.08;

      fieldStars.rotation.y = elapsedTime * 0.008 + mouse.x * 0.05;
      fieldStars.rotation.x = elapsedTime * 0.005 + mouse.y * 0.03;

      // Scroll shifts camera along Y so space glides as user navigates sections
      camera.position.x = mouse.x * 2.8;
      camera.position.y = mouse.y * 2.2 - scrollY * 0.015;
      camera.lookAt(0, -scrollY * 0.015, 0);

      // Meteor / Shooting star state machine
      if (!meteorActive) {
        if (elapsedTime > nextMeteorTime) {
          meteorActive = true;
          meteorProgress = 0;
          meteorStartX = (Math.random() - 0.2) * 50;
          meteorStartY = 20 + Math.random() * 25;
          meteorStartZ = (Math.random() - 0.5) * 30;
          meteorDirX = -(0.8 + Math.random() * 0.4);
          meteorDirY = -(0.5 + Math.random() * 0.4);
          meteorSpeed = 40 + Math.random() * 25;
        }
      } else {
        meteorProgress += delta;
        const currentDist = meteorProgress * meteorSpeed;
        const headX = meteorStartX + meteorDirX * currentDist;
        const headY = meteorStartY + meteorDirY * currentDist;
        const headZ = meteorStartZ;

        const tailX = headX - meteorDirX * meteorLength;
        const tailY = headY - meteorDirY * meteorLength;
        const tailZ = headZ;

        const posAttr = meteorGeo.attributes.position as THREE.BufferAttribute;
        posAttr.setXYZ(0, headX, headY, headZ);
        posAttr.setXYZ(1, tailX, tailY, tailZ);
        posAttr.needsUpdate = true;

        // Fade in rapidly, then fade out
        if (meteorProgress < 0.2) {
          meteorMaterial.opacity = (meteorProgress / 0.2) * (isLight ? 0.6 : 0.95);
        } else if (meteorProgress < 0.9) {
          meteorMaterial.opacity = (1 - (meteorProgress - 0.2) / 0.7) * (isLight ? 0.6 : 0.95);
        } else {
          meteorActive = false;
          meteorMaterial.opacity = 0;
          nextMeteorTime = elapsedTime + 3.0 + Math.random() * 4.5;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isMounted = false;
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      galaxyGeo.dispose();
      fieldGeo.dispose();
      nebulaGeo.dispose();
      meteorGeo.dispose();
      starMaterial.dispose();
      nebulaMaterial.dispose();
      meteorMaterial.dispose();
    };
  }, [theme]);

  return <div className="global-starfield-container" ref={canvasDiv} />;
};

export default Scene;
