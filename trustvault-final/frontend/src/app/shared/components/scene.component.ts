import { AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'tv-scene', standalone: true, template: '<div #host class="scene-host" aria-hidden="true"></div>',
 
})
export class SceneComponent implements AfterViewInit, OnDestroy {
  @Input() accent: 'cyan' | 'red' = 'cyan';
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;
  private renderer?: THREE.WebGLRenderer; private scene?: THREE.Scene; private camera?: THREE.PerspectiveCamera; private world?: THREE.Group; private frame = 0;
  private readonly mouse = { x: 0, y: 0 }; private readonly clock = new THREE.Clock(); private reduced = false;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.zone.runOutsideAngular(() => this.init());
  }

  private init(): void {
    const el = this.host.nativeElement;
    const w = el.clientWidth || innerWidth; const h = el.clientHeight || innerHeight;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040a, 0.035);
    this.camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 80); this.camera.position.z = 12;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h); this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); el.appendChild(this.renderer.domElement);
    this.world = new THREE.Group(); this.scene.add(this.world);

    const primary = this.accent === 'red' ? 0xff003c : 0x00f0ff;
    const secondary = this.accent === 'red' ? 0xb535f6 : 0x06b6d4;
    const material = new THREE.MeshPhysicalMaterial({ color: primary, emissive: secondary, emissiveIntensity: .55, metalness: .8, roughness: .18, wireframe: true, transparent: true, opacity: .75 });
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.55, .38, 128, 30), material); this.world.add(knot);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 32), new THREE.MeshBasicMaterial({ color: secondary, transparent: true, opacity: .22, blending: THREE.AdditiveBlending })); this.world.add(glow);

    const rings = new THREE.Group();
    [3.7, 4.7, 5.7].forEach((r, i) => {
      const color = [primary, secondary, 0xff003c][i];
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + .04, 64), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: .45 }));
      ring.rotation.x = i === 0 ? Math.PI / 2 : i === 1 ? Math.PI / 3 : Math.PI / 4; rings.add(ring);
    });
    this.world.add(rings);

    const N = 1400, positions = new Float32Array(N * 3), colors = new Float32Array(N * 3);
    const c1 = new THREE.Color(primary), c2 = new THREE.Color(secondary);
    for (let i = 0; i < N; i++) { const r = 8 + Math.random() * 16, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1); const c = Math.random() > .5 ? c1 : c2; positions.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)], i * 3); colors.set([c.r, c.g, c.b], i * 3); }
    const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.world.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: .045, vertexColors: true, transparent: true, opacity: .55, blending: THREE.AdditiveBlending })));
    this.scene.add(new THREE.AmbientLight(0x404040)); this.world.add(new THREE.PointLight(primary, 2, 45));
    this.loop(knot, rings, glow);
  }

  private loop(knot: THREE.Mesh, rings: THREE.Group, glow: THREE.Mesh): void {
    const d = Math.min(this.clock.getDelta(), .05), t = this.clock.elapsedTime;
    if (!this.reduced) { knot.rotation.x += d * .25; knot.rotation.y += d * .38; rings.rotation.y += d * .08; }
    glow.scale.setScalar(1 + Math.sin(t * 2.8) * .045); this.world!.position.x += (((innerWidth >= 1024 ? 4 : 0)) - this.world!.position.x) * Math.min(1, d * 2.5);
    this.camera!.position.x += (this.mouse.x * 1.6 - this.camera!.position.x) * .035; this.camera!.position.y += (this.mouse.y * 1.4 - this.camera!.position.y) * .035; this.camera!.lookAt(this.world!.position);
    this.renderer!.render(this.scene!, this.camera!); this.frame = requestAnimationFrame(() => this.loop(knot, rings, glow));
  }

  @HostListener('window:mousemove', ['$event']) onMouseMove(e: MouseEvent): void { this.mouse.x = e.clientX / innerWidth * 2 - 1; this.mouse.y = -(e.clientY / innerHeight) * 2 + 1; }
  @HostListener('window:resize') onResize(): void { if (!this.renderer || !this.camera || !this.host) return; const el = this.host.nativeElement; this.camera.aspect = el.clientWidth / el.clientHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(el.clientWidth, el.clientHeight); }
  ngOnDestroy(): void { cancelAnimationFrame(this.frame); this.renderer?.dispose(); this.host.nativeElement.innerHTML = ''; }
}
