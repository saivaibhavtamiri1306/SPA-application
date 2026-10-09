import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'tv-three-background',
  standalone: true,
  template: '<div class="three-host" #host></div>',
  styles: [`.three-host{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.78}`]
})
export class ThreeBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;
  
  private renderer?: THREE.WebGLRenderer; 
  private frame = 0; 
  private onResize = () => this.resize();
  private scene = new THREE.Scene(); 
  private camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100); 
  private group = new THREE.Group();

  ngAfterViewInit(): void {
    const el = this.host.nativeElement; 
    this.scene.fog = new THREE.FogExp2(0x02040a, 0.035); 
    this.camera.position.z = 12; 
    this.scene.add(this.group);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); 
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    el.appendChild(this.renderer.domElement); 
    
    this.resize(); 
    window.addEventListener('resize', this.onResize);
    
    // Core shapes (Cyan)
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.8, 0.42, 128, 28),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.5 })
    ); 
    this.group.add(knot);
    
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.72, 2),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.3 })
    ); 
    this.group.add(core);
    
    // Orbit Rings (Cyan, Purple, Red)
    const ringColors: [number, number][] = [[4.2, 0x00f0ff], [5.1, 0xb535f6], [6.0, 0xff003c]];
    for (const [r, c] of ringColors) { 
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r, r + 0.045, 96),
        new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
      ); 
      ring.rotation.x = Math.PI / 2; 
      this.group.add(ring); 
    }
    
    // Particles / Dust
    const count = 900;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorA = new THREE.Color(0x00f0ff);
    const colorB = new THREE.Color(0xb535f6);

    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 13;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)], i * 3);
      
      const c = Math.random() > 0.5 ? colorA : colorB;
      colors.set([c.r, c.g, c.b], i * 3);
    }
    
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pg.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    this.group.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.6 })));
    
    // Animation Loop
    const animate = () => {
      knot.rotation.x += 0.0025;
      knot.rotation.y += 0.004;
      this.group.rotation.y += 0.001;
      this.group.rotation.x = Math.sin(performance.now() / 4500) * 0.06;
      this.renderer?.render(this.scene, this.camera);
      this.frame = requestAnimationFrame(animate);
    };
    animate();
  }

  private resize(): void { 
    if (!this.renderer) return;
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h); 
  }

  ngOnDestroy(): void { 
    cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose(); 
  }
}
