import * as THREE from 'three';

/**
 * Ultra Visual Effects (VFX) System for MU 3D Nexus / Solo Leveling / Zelda 2050.
 * Includes weapon slash energy trails, cyclone vortex rings, impact spark bursts, and camera shake.
 */

export interface SparkParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
  size: number;
}

export class UltraVfxManager {
  private scene: THREE.Scene;
  private sparkPoints: THREE.Points;
  private sparkGeo: THREE.BufferGeometry;
  private sparkPositions: Float32Array;
  private sparkColors: Float32Array;
  private sparkSizes: Float32Array;
  private sparks: SparkParticle[] = [];
  private maxSparks = 300;

  // Slash Trail
  private slashMesh: THREE.Mesh | null = null;
  private slashTimer = 0;
  private slashMaxDuration = 0.22;

  // Twisting Slash Cyclone Mesh
  private cycloneMesh: THREE.Group | null = null;
  private cycloneTimer = 0;
  private cycloneDuration = 0.45;

  // 🌀 Nexus Omega N_Ω Vortex Mesh (3-Operator Resonant Rings: T ∘ O ∘ F)
  private omegaVortexMesh: THREE.Group | null = null;
  private omegaVortexTimer = 0;
  private omegaVortexDuration = 0.95;

  // Camera Shake
  public shakeTrauma = 0;
  public shakeOffset = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // Initialize Spark Points Particle System
    this.sparkGeo = new THREE.BufferGeometry();
    this.sparkPositions = new Float32Array(this.maxSparks * 3);
    this.sparkColors = new Float32Array(this.maxSparks * 3);
    this.sparkSizes = new Float32Array(this.maxSparks);

    this.sparkGeo.setAttribute('position', new THREE.BufferAttribute(this.sparkPositions, 3));
    this.sparkGeo.setAttribute('color', new THREE.BufferAttribute(this.sparkColors, 3));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.sparkPoints = new THREE.Points(this.sparkGeo, sparkMat);
    this.scene.add(this.sparkPoints);

    // Build Slash Arc geometry (semi-circular ribbon)
    this.initSlashMesh();
    // Build Cyclone geometry
    this.initCycloneMesh();
    // Build Nexus Omega Vortex geometry (T ∘ O ∘ F)
    this.initOmegaVortexMesh();
  }

  private initSlashMesh() {
    const ringGeo = new THREE.RingGeometry(1.0, 1.85, 32, 1, 0, Math.PI * 0.95);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.slashMesh = new THREE.Mesh(ringGeo, ringMat);
    this.slashMesh.rotation.x = Math.PI * 0.5;
    this.slashMesh.visible = false;
    this.scene.add(this.slashMesh);
  }

  private initCycloneMesh() {
    this.cycloneMesh = new THREE.Group();

    // Outer swirling ring
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.18, 12, 36);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.5;
    this.cycloneMesh.add(ring1);

    // Inner fiery ring
    const ring2Geo = new THREE.TorusGeometry(1.6, 0.14, 12, 28);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI * 0.5;
    ring2.position.y = 0.25;
    this.cycloneMesh.add(ring2);

    this.cycloneMesh.visible = false;
    this.scene.add(this.cycloneMesh);
  }

  // 🌀 Initialize 3-Ring Resonant Vortex (T ∘ O ∘ F)
  private initOmegaVortexMesh() {
    this.omegaVortexMesh = new THREE.Group();

    // 1. Ring F (Force / Foundation - Outer Amber Ring)
    const ringFGeo = new THREE.TorusGeometry(4.2, 0.22, 16, 48);
    const ringFMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ringF = new THREE.Mesh(ringFGeo, ringFMat);
    ringF.rotation.x = Math.PI * 0.5;
    this.omegaVortexMesh.add(ringF);

    // 2. Ring O (Order / Optical - Mid Azure Ring)
    const ringOGeo = new THREE.TorusGeometry(2.8, 0.18, 16, 40);
    const ringOMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ringO = new THREE.Mesh(ringOGeo, ringOMat);
    ringO.rotation.x = Math.PI * 0.5;
    ringO.position.y = 0.25;
    this.omegaVortexMesh.add(ringO);

    // 3. Ring T (Time / Transmutation - Inner Magenta Ring)
    const ringTGeo = new THREE.TorusGeometry(1.6, 0.14, 16, 32);
    const ringTMat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ringT = new THREE.Mesh(ringTGeo, ringTMat);
    ringT.rotation.x = Math.PI * 0.5;
    ringT.position.y = 0.5;
    this.omegaVortexMesh.add(ringT);

    // 4. Central Invariant Singularity (Core Octahedron)
    const coreGeo = new THREE.OctahedronGeometry(0.65, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0.6;
    this.omegaVortexMesh.add(coreMesh);

    this.omegaVortexMesh.visible = false;
    this.scene.add(this.omegaVortexMesh);
  }

  // Trigger weapon slash arc
  public triggerSlashArc(origin: THREE.Vector3, dirAngle: number, colorHex = 0x38bdf8) {
    if (!this.slashMesh) return;
    this.slashMesh.position.set(origin.x, origin.y + 1.2, origin.z);
    this.slashMesh.rotation.z = -dirAngle + Math.PI * 0.25;
    (this.slashMesh.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
    (this.slashMesh.material as THREE.MeshBasicMaterial).opacity = 0.85;
    this.slashMesh.visible = true;
    this.slashTimer = this.slashMaxDuration;
  }

  // Trigger Twisting Slash Cyclone VFX
  public triggerTwistingSlashCyclone(origin: THREE.Vector3) {
    if (!this.cycloneMesh) return;
    this.cycloneMesh.position.set(origin.x, 0.8, origin.z);
    this.cycloneMesh.visible = true;
    this.cycloneTimer = this.cycloneDuration;
    this.addShake(0.45);

    // Spawn radial sparks
    for (let i = 0; i < 45; i++) {
      const angle = (i / 45) * Math.PI * 2;
      const speed = 4.5 + Math.random() * 5.0;
      this.sparks.push({
        pos: new THREE.Vector3(origin.x, 0.8, origin.z),
        vel: new THREE.Vector3(Math.cos(angle) * speed, Math.random() * 2.5 + 1.0, Math.sin(angle) * speed),
        color: new THREE.Color(i % 2 === 0 ? 0x00f0ff : 0xf59e0b),
        life: 0,
        maxLife: 0.35 + Math.random() * 0.2,
        size: 0.35
      });
    }
  }

  // 🌀 Trigger Nexus Omega N_Ω Vortex (∇ × v = ω vorticial singularity)
  public triggerNexusOmegaVortex(origin: THREE.Vector3, auraColorHex: string = '#a855f7', radius = 8.0) {
    if (!this.omegaVortexMesh) return;
    this.omegaVortexMesh.position.set(origin.x, 0.5, origin.z);
    this.omegaVortexMesh.scale.setScalar(radius / 4.2);
    this.omegaVortexMesh.visible = true;
    this.omegaVortexTimer = this.omegaVortexDuration;
    this.addShake(0.70);

    const auraColor = new THREE.Color(auraColorHex);

    // Spawn spiraling vortex particles with curl-velocity (∇ × F ≠ 0)
    for (let i = 0; i < 75; i++) {
      const angle = (i / 75) * Math.PI * 4;
      const dist = (i / 75) * radius * 0.85 + 0.8;
      const posX = origin.x + Math.cos(angle) * dist;
      const posZ = origin.z + Math.sin(angle) * dist;

      // Inward curl velocity vector
      const tangentX = -Math.sin(angle) * 7.5;
      const tangentZ = Math.cos(angle) * 7.5;
      const inwardX = -Math.cos(angle) * 4.0;
      const inwardZ = -Math.sin(angle) * 4.0;

      const sparkColor = (i % 3 === 0)
        ? new THREE.Color(0xd946ef) // T: Magenta
        : (i % 3 === 1)
        ? new THREE.Color(0x00f0ff) // O: Cyan
        : new THREE.Color(0xf59e0b); // F: Amber

      this.sparks.push({
        pos: new THREE.Vector3(posX, 0.4 + Math.random() * 1.2, posZ),
        vel: new THREE.Vector3(tangentX + inwardX, Math.random() * 3.5 + 1.5, tangentZ + inwardZ),
        color: sparkColor.lerp(auraColor, 0.35),
        life: 0,
        maxLife: 0.65 + Math.random() * 0.3,
        size: 0.42
      });
    }
  }

  // Spawn impact sparks
  public spawnHitSparks(pos: THREE.Vector3, isCrit = false) {
    const count = isCrit ? 35 : 18;
    const baseColor = isCrit ? new THREE.Color(0xffd700) : new THREE.Color(0x38bdf8);
    this.addShake(isCrit ? 0.4 : 0.2);

    for (let i = 0; i < count; i++) {
      if (this.sparks.length >= this.maxSparks) {
        this.sparks.shift();
      }
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        Math.random() * 5 + 1.5,
        (Math.random() - 0.5) * 5
      );
      this.sparks.push({
        pos: pos.clone(),
        vel: dir,
        color: baseColor.clone().offsetHSL((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.2),
        life: 0,
        maxLife: 0.25 + Math.random() * 0.25,
        size: 0.25
      });
    }
  }

  // Camera Shake trauma
  public addShake(amount: number) {
    this.shakeTrauma = Math.min(1.0, this.shakeTrauma + amount);
  }

  // Update loop
  public update(delta: number) {
    // 1. Update Camera Shake
    if (this.shakeTrauma > 0.001) {
      const shakePower = Math.pow(this.shakeTrauma, 2) * 0.65;
      this.shakeOffset.set(
        (Math.random() - 0.5) * 2 * shakePower,
        (Math.random() - 0.5) * 2 * shakePower,
        (Math.random() - 0.5) * 2 * shakePower
      );
      this.shakeTrauma = Math.max(0, this.shakeTrauma - delta * 2.2);
    } else {
      this.shakeOffset.set(0, 0, 0);
    }

    // 2. Update Slash Mesh
    if (this.slashTimer > 0 && this.slashMesh) {
      this.slashTimer -= delta;
      const progress = 1 - this.slashTimer / this.slashMaxDuration;
      const mat = this.slashMesh.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - progress) * 0.85;
      this.slashMesh.scale.setScalar(1 + progress * 0.4);
      if (this.slashTimer <= 0) {
        this.slashMesh.visible = false;
      }
    }

    // 3. Update Cyclone Mesh
    if (this.cycloneTimer > 0 && this.cycloneMesh) {
      this.cycloneTimer -= delta;
      const progress = 1 - this.cycloneTimer / this.cycloneDuration;
      this.cycloneMesh.rotation.y += delta * 18;
      this.cycloneMesh.scale.setScalar(1 + progress * 0.8);
      this.cycloneMesh.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress) * (i === 0 ? 0.9 : 0.7);
      });
      if (this.cycloneTimer <= 0) {
        this.cycloneMesh.visible = false;
      }
    }

    // 3.5. Update Nexus Omega N_Ω Vortex Mesh (T ∘ O ∘ F differential rotation)
    if (this.omegaVortexTimer > 0 && this.omegaVortexMesh) {
      this.omegaVortexTimer -= delta;
      const progress = 1 - this.omegaVortexTimer / this.omegaVortexDuration;
      const children = this.omegaVortexMesh.children;

      // Ring F (Outer): +12 rad/s
      if (children[0]) {
        children[0].rotation.z += delta * 12;
        const mat = (children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress) * 0.95;
      }
      // Ring O (Middle): -18 rad/s (Counter-rotation)
      if (children[1]) {
        children[1].rotation.z -= delta * 18;
        const mat = (children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress) * 0.9;
      }
      // Ring T (Inner): +26 rad/s (High velocity circulation)
      if (children[2]) {
        children[2].rotation.z += delta * 26;
        const mat = (children[2] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress) * 0.95;
      }
      // Central Core: Dual tumble
      if (children[3]) {
        children[3].rotation.y += delta * 15;
        children[3].rotation.x += delta * 10;
        const mat = (children[3] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress) * 0.85;
      }

      if (this.omegaVortexTimer <= 0) {
        this.omegaVortexMesh.visible = false;
      }
    }

    // 4. Update Sparks
    const posAttr = this.sparkGeo.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = this.sparkGeo.getAttribute('color') as THREE.BufferAttribute;

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.life += delta;
      if (s.life >= s.maxLife) {
        this.sparks.splice(i, 1);
        continue;
      }

      // Physics: velocity + gravity + air drag
      s.pos.addScaledVector(s.vel, delta);
      s.vel.y -= 9.8 * delta;
      s.vel.multiplyScalar(0.96);
    }

    // Write buffer attributes
    for (let i = 0; i < this.maxSparks; i++) {
      if (i < this.sparks.length) {
        const s = this.sparks[i];
        const alpha = 1 - s.life / s.maxLife;
        this.sparkPositions[i * 3] = s.pos.x;
        this.sparkPositions[i * 3 + 1] = s.pos.y;
        this.sparkPositions[i * 3 + 2] = s.pos.z;

        this.sparkColors[i * 3] = s.color.r * alpha;
        this.sparkColors[i * 3 + 1] = s.color.g * alpha;
        this.sparkColors[i * 3 + 2] = s.color.b * alpha;
      } else {
        this.sparkPositions[i * 3 + 1] = -9999;
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  }
}
