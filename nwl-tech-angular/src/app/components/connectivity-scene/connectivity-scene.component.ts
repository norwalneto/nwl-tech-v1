import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
  PLATFORM_ID,
} from '@angular/core';

type ThreeNamespace = typeof import('three');
type ThreeScene = import('three').Scene;
type ThreeGroup = import('three').Group;
type ThreeMesh = import('three').Mesh;
type ThreeRenderer = import('three').WebGLRenderer;
type ThreeGeometry = import('three').BufferGeometry;
type ThreeMaterial = import('three').Material;
type ThreeTexture = import('three').Texture;
type OrbitPulse = {
  path: ThreeGroup;
  halo: ThreeMesh;
  speed: number;
  phase: number;
};

@Component({
  selector: 'app-connectivity-scene',
  standalone: true,
  templateUrl: './connectivity-scene.component.html',
  styleUrl: './connectivity-scene.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectivitySceneComponent implements AfterViewInit, OnDestroy {
  @Output() readonly ready = new EventEmitter<void>();

  private renderer?: ThreeRenderer;
  private scene?: ThreeScene;
  private camera?: import('three').PerspectiveCamera;
  private world?: ThreeGroup;
  private globe?: ThreeGroup;
  private surfaceFlow?: ThreeGroup;
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;
  private frameId = 0;
  private previousFrame = 0;
  private elapsed = 0;
  private brandMaterial?: import('three').MeshBasicMaterial;
  private brandFadeElapsed = 0;
  private brandFadeComplete = false;
  private prefersReducedMotion = false;
  private motionPreference?: MediaQueryList;
  private sceneReady = false;
  private isVisible = true;
  private destroyed = false;
  private readonly orbitPulses: OrbitPulse[] = [];

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = this.motionPreference.matches;
    this.motionPreference.addEventListener('change', this.handleMotionPreferenceChange);
    void this.initializeScene();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopAnimation();
    this.motionPreference?.removeEventListener('change', this.handleMotionPreferenceChange);
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    this.disposeSceneResources();
    this.renderer?.dispose();
    this.renderer = undefined;
  }

  private disposeSceneResources(): void {
    const geometries = new Set<ThreeGeometry>();
    const materials = new Set<ThreeMaterial>();
    const textures = new Set<ThreeTexture>();

    this.scene?.traverse((object) => {
      const renderable = object as {
        geometry?: ThreeGeometry;
        material?: ThreeMaterial | ThreeMaterial[];
      };
      if (renderable.geometry) geometries.add(renderable.geometry);

      const objectMaterials = renderable.material
        ? Array.isArray(renderable.material)
          ? renderable.material
          : [renderable.material]
        : [];

      for (const material of objectMaterials) {
        materials.add(material);
        for (const value of Object.values(material)) {
          if (
            value &&
            typeof value === 'object' &&
            'isTexture' in value &&
            value.isTexture === true
          ) {
            textures.add(value as ThreeTexture);
          }
        }
      }
    });

    textures.forEach((texture) => texture.dispose());
    materials.forEach((material) => material.dispose());
    geometries.forEach((geometry) => geometry.dispose());

    this.scene = undefined;
    this.world = undefined;
    this.globe = undefined;
    this.surfaceFlow = undefined;
    this.brandMaterial = undefined;
    this.orbitPulses.length = 0;
  }

  private readonly handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  };

  private readonly handleMotionPreferenceChange = (event: MediaQueryListEvent): void => {
    this.prefersReducedMotion = event.matches;
    if (event.matches && this.brandMaterial && !this.brandFadeComplete) {
      this.brandMaterial.opacity = 1;
      this.brandFadeComplete = true;
      this.markSceneReady('scene-ready');
    }
  };

  private startAnimation(): void {
    if (this.frameId || this.destroyed || document.hidden || !this.isVisible) return;
    this.frameId = requestAnimationFrame(this.animate);
  }

  private stopAnimation(): void {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.previousFrame = 0;
  }

  private async initializeScene(): Promise<void> {
    let THREE: ThreeNamespace;

    try {
      THREE = await import('three');
    } catch {
      this.markSceneReady('scene-fallback');
      return;
    }

    if (this.destroyed) return;
    const canvas = this.elementRef.nativeElement.querySelector('canvas');
    if (!canvas) {
      this.markSceneReady('scene-fallback');
      return;
    }

    try {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;

      this.renderer = renderer;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
      this.camera.position.set(0, 0, 8.6);

      this.world = new THREE.Group();
      this.scene.add(this.world);
      this.globe = new THREE.Group();
      this.globe.rotation.x = 0.025;
      this.world.add(this.globe);
      this.addLighting(THREE);
      this.addGlobe(THREE);
      this.addOrbitalPaths(THREE);
      this.addBrandMark(THREE);
      this.resize();

      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.elementRef.nativeElement);
      this.visibilityObserver = new IntersectionObserver(([entry]) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) this.startAnimation();
        else this.stopAnimation();
      });
      this.visibilityObserver.observe(this.elementRef.nativeElement);
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      this.startAnimation();
    } catch {
      this.markSceneReady('scene-fallback');
      this.disposeSceneResources();
      this.renderer?.dispose();
      this.renderer = undefined;
    }
  }

  private markSceneReady(className?: string): void {
    if (className) this.elementRef.nativeElement.classList.add(className);
    if (this.sceneReady) return;

    this.sceneReady = true;
    this.ready.emit();
    window.dispatchEvent(new Event('nwl-scene-ready'));
  }

  private addLighting(THREE: ThreeNamespace): void {
    if (!this.scene) return;

    this.scene.add(new THREE.AmbientLight(0x8eece0, 1.65));

    const keyLight = new THREE.PointLight(0x9effd3, 24, 18, 2);
    keyLight.position.set(-3.8, 3.1, 5.4);
    this.scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x18b9d2, 18, 16, 2);
    rimLight.position.set(4.6, -1.8, -2.5);
    this.scene.add(rimLight);
  }

  private addGlobe(THREE: ThreeNamespace): void {
    const globe = this.globe;
    if (!globe) return;

    const radius = 1.82;
    const gridRadius = radius + 0.035;
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 72, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x102e38,
        emissive: 0x06191d,
        emissiveIntensity: 0.42,
        metalness: 0.22,
        roughness: 0.42,
        clearcoat: 0.68,
        clearcoatRoughness: 0.28,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      }),
    );
    shell.renderOrder = 0;
    globe.add(shell);

    const positions: number[] = [];
    const colors: number[] = [];
    const addGridPath = (samples: import('three').Vector3[], closePath = false): void => {
      const count = closePath ? samples.length : samples.length - 1;
      const dimColor = new THREE.Color(0x147a88);
      const brightColor = new THREE.Color(0x9af7cb);

      for (let index = 0; index < count; index += 1) {
        const start = samples[index];
        const end = samples[(index + 1) % samples.length];
        positions.push(start.x, start.y, start.z, end.x, end.y, end.z);

        const depth = (start.z + end.z) * 0.5;
        const visibility = THREE.MathUtils.lerp(0.18, 0.94, THREE.MathUtils.smoothstep(depth, -0.85, 0.8));
        const lineColor = dimColor.clone().lerp(brightColor, visibility * 0.78);
        for (let point = 0; point < 2; point += 1) {
          colors.push(lineColor.r * visibility, lineColor.g * visibility, lineColor.b * visibility);
        }
      }
    };

    const longitudes = 16;
    for (let longitude = 0; longitude < longitudes; longitude += 1) {
      const angle = (longitude / longitudes) * Math.PI;
      const samples: import('three').Vector3[] = [];
      for (let step = 0; step <= 144; step += 1) {
        const angleAroundMeridian = (step / 144) * Math.PI * 2;
        samples.push(
          new THREE.Vector3(
            gridRadius * Math.sin(angleAroundMeridian) * Math.sin(angle),
            gridRadius * Math.cos(angleAroundMeridian),
            gridRadius * Math.sin(angleAroundMeridian) * Math.cos(angle),
          ),
        );
      }
      addGridPath(samples);
    }

    const latitudes = 11;
    for (let latitudeIndex = 1; latitudeIndex < latitudes; latitudeIndex += 1) {
      const latitude = -Math.PI / 2 + (latitudeIndex / latitudes) * Math.PI;
      const samples: import('three').Vector3[] = [];
      for (let step = 0; step < 144; step += 1) {
        const longitude = (step / 144) * Math.PI * 2;
        samples.push(
          new THREE.Vector3(
            gridRadius * Math.cos(latitude) * Math.sin(longitude),
            gridRadius * Math.sin(latitude),
            gridRadius * Math.cos(latitude) * Math.cos(longitude),
          ),
        );
      }
      addGridPath(samples, true);
    }

    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    gridGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const grid = new THREE.LineSegments(
      gridGeometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.76,
        depthWrite: false,
      }),
    );
    grid.renderOrder = 1;
    globe.add(grid);

    const nodeGeometry = new THREE.SphereGeometry(0.026, 10, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x8fffd0 });
    const glowGeometry = new THREE.SphereGeometry(0.072, 10, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x27dbba,
      transparent: true,
      opacity: 0.19,
      depthWrite: false,
    });

    for (let latitudeStep = -4; latitudeStep <= 4; latitudeStep += 1) {
      for (let longitudeStep = 0; longitudeStep < 12; longitudeStep += 1) {
        if ((latitudeStep + longitudeStep) % 3 !== 0) continue;

        const latitude = latitudeStep * 0.31 + 0.09 * Math.sin(longitudeStep * 2.7);
        const longitude = (longitudeStep / 12) * Math.PI * 2 + latitudeStep * 0.22;
        const point = new THREE.Vector3(
          (radius + 0.045) * Math.cos(latitude) * Math.sin(longitude),
          (radius + 0.045) * Math.sin(latitude),
          (radius + 0.045) * Math.cos(latitude) * Math.cos(longitude),
        );
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(point);
        globe.add(node);

        if ((latitudeStep * 5 + longitudeStep) % 5 === 0) {
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          glow.position.copy(point);
          globe.add(glow);
        }
      }
    }

    this.addSurfaceFlow(THREE, radius, globe);
  }

  private addSurfaceFlow(THREE: ThreeNamespace, radius: number, globe: ThreeGroup): void {
    const flow = new THREE.Group();
    const definitions = [
      { longitude: -0.72, latitude: 0.72, drift: 0.25, phase: 0.2, color: 0x9bffd5 },
      { longitude: 1.28, latitude: -0.72, drift: -0.25, phase: 2.2, color: 0x52e9e0 },
    ];

    for (const definition of definitions) {
      const points: import('three').Vector3[] = [];
      const samples = 144;

      for (let step = 0; step <= samples; step += 1) {
        const progress = step / samples;
        const latitude = definition.latitude + (progress - 0.5) * definition.drift + 0.1 * Math.sin(progress * Math.PI * 2 + definition.phase);
        const longitude = definition.longitude + (progress - 0.5) * 1.45 + 0.12 * Math.sin(progress * Math.PI * 2 + definition.phase);
        points.push(
          new THREE.Vector3(
            (radius + 0.055) * Math.cos(latitude) * Math.sin(longitude),
            (radius + 0.055) * Math.sin(latitude),
            (radius + 0.055) * Math.cos(latitude) * Math.cos(longitude),
          ),
        );
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, samples, 0.009, 5, false);
      const aura = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: definition.color,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      aura.renderOrder = 2;
      const core = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: definition.color,
          transparent: true,
          opacity: 0.64,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      core.renderOrder = 3;
      flow.add(aura, core);
    }

    this.surfaceFlow = flow;
    globe.add(flow);
  }

  private addOrbitalPaths(THREE: ThreeNamespace): void {
    const world = this.world;
    if (!world) return;

    const orbitalDefinitions = [
      { radius: 2.18, tube: 0.012, color: 0x38cfc4, opacity: 0.38, x: 1.03, y: 0.18, z: 0.12, speed: 0.34, phase: 0.12 },
      { radius: 2.38, tube: 0.009, color: 0x82f4ca, opacity: 0.24, x: 0.44, y: -0.8, z: -0.43, speed: -0.27, phase: 2.4 },
    ];

    orbitalDefinitions.forEach((orbit, index) => {
      const pivot = new THREE.Group();
      pivot.rotation.set(orbit.x, orbit.y, orbit.z);

      const aura = new THREE.Mesh(
        new THREE.TorusGeometry(orbit.radius, orbit.tube * 3, 8, 180),
        new THREE.MeshBasicMaterial({
          color: orbit.color,
          transparent: true,
          opacity: orbit.opacity * 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      aura.renderOrder = 2;
      pivot.add(aura);

      const line = new THREE.Mesh(
        new THREE.TorusGeometry(orbit.radius, orbit.tube, 8, 180),
        new THREE.MeshBasicMaterial({
          color: orbit.color,
          transparent: true,
          opacity: orbit.opacity,
          depthWrite: false,
        }),
      );
      line.renderOrder = 3;
      pivot.add(line);

      const path = new THREE.Group();
      path.rotation.z = orbit.phase;
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(index === 0 ? 0.052 : 0.043, 14, 12),
        new THREE.MeshBasicMaterial({ color: orbit.color, toneMapped: false }),
      );
      beacon.position.set(orbit.radius, 0, 0.018);
      beacon.renderOrder = 5;
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(index === 0 ? 0.13 : 0.11, 14, 12),
        new THREE.MeshBasicMaterial({
          color: orbit.color,
          transparent: true,
          opacity: 0.24,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      halo.position.copy(beacon.position);
      halo.renderOrder = 4;
      path.add(halo, beacon);
      pivot.add(path);
      this.orbitPulses.push({ path, halo, speed: orbit.speed, phase: orbit.phase });
      world.add(pivot);
    });
  }

  private addBrandMark(THREE: ThreeNamespace): void {
    const globe = this.globe;
    if (!globe) return;

    const logoUrl = new URL('assets/nwl-logo-cutout.webp', document.baseURI).toString();
    new THREE.TextureLoader().load(
      logoUrl,
      (texture) => {
        if (this.destroyed || !this.world) {
          texture.dispose();
          return;
        }

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = this.renderer?.capabilities.getMaxAnisotropy() ?? 1;
        const width = 1.82;
        const height = 1.92;
        const decalRadius = 1.88;
        const logoGeometry = new THREE.PlaneGeometry(width, height, 48, 48);
        const vertices = logoGeometry.attributes['position'] as import('three').BufferAttribute;
        for (let index = 0; index < vertices.count; index += 1) {
          const x = vertices.getX(index);
          const y = vertices.getY(index);
          const depth = Math.sqrt(Math.max(0, decalRadius * decalRadius - x * x - y * y));
          vertices.setZ(index, depth + 0.012);
        }
        logoGeometry.computeVertexNormals();

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: this.prefersReducedMotion ? 1 : 0,
          alphaTest: 0.02,
          side: THREE.DoubleSide,
          depthWrite: false,
          toneMapped: false,
        });
        const logo = new THREE.Mesh(logoGeometry, material);
        logo.renderOrder = 4;
        globe.add(logo);
        this.brandMaterial = material;

        if (this.prefersReducedMotion) {
          this.brandFadeComplete = true;
        }
        this.markSceneReady('scene-ready');
      },
      undefined,
      () => this.markSceneReady('scene-logo-unavailable'),
    );
  }

  private resize(): void {
    if (!this.renderer || !this.camera) return;
    const { width, height } = this.elementRef.nativeElement.getBoundingClientRect();
    if (!width || !height) return;

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.position.z = 8.1;
    this.camera.updateProjectionMatrix();
  }

  private readonly animate = (now: number): void => {
    this.frameId = 0;
    if (!this.renderer || !this.scene || !this.camera || !this.globe) return;

    if (!this.isVisible || document.hidden) {
      this.previousFrame = 0;
      return;
    }

    const delta = this.previousFrame === 0 ? 0 : Math.min((now - this.previousFrame) / 1000, 0.05);
    this.previousFrame = now;
    this.elapsed += delta * (this.prefersReducedMotion ? 0.16 : 1);

    this.globe.rotation.y = (this.elapsed * Math.PI * 2) / 22;
    if (this.surfaceFlow) this.surfaceFlow.rotation.y = (this.elapsed * Math.PI * 2) / 17;
    for (const pulse of this.orbitPulses) {
      pulse.path.rotation.z = pulse.phase + this.elapsed * pulse.speed;
      const glow = this.prefersReducedMotion
        ? 1
        : 1 + Math.sin(this.elapsed * 2 + pulse.phase) * 0.15;
      pulse.halo.scale.setScalar(glow);
    }

    this.updateBrandReveal(delta);

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.animate);
  };

  private updateBrandReveal(delta: number): void {
    const material = this.brandMaterial;
    if (!material || this.brandFadeComplete) return;

    const duration = 3;
    this.brandFadeElapsed = Math.min(this.brandFadeElapsed + delta, duration);
    const progress = this.brandFadeElapsed / duration;
    material.opacity = progress * progress * (3 - 2 * progress);

    if (progress >= 1) {
      this.brandFadeComplete = true;
    }
  }
}
