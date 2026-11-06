import * as THREE from 'three';

/**
 * Procedural Texture Generator for Ultra Cinematic 3D Graphics.
 * Generates rich Canvas-based PBR-ready diffuse, bump, and emissive maps.
 */

// 1. Procedural Stone Cobblestone & Dirt Terrain Texture
export function createCobblestoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base earthy stone color
  ctx.fillStyle = '#222831';
  ctx.fillRect(0, 0, 1024, 1024);

  // Cobblestone grid
  const cols = 16;
  const rows = 16;
  const cellW = 1024 / cols;
  const cellH = 1024 / rows;

  for (let r = 0; r < rows; r++) {
    const rowOffset = (r % 2) * (cellW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * cellW + rowOffset + (Math.sin(r * 3 + c) * 3);
      const y = r * cellH + (Math.cos(c * 2 + r) * 3);
      const stoneW = cellW - 6 + (Math.sin(r + c) * 3);
      const stoneH = cellH - 6 + (Math.cos(r * 2) * 2);

      // Gradient per stone for 3D depth
      const lum = 38 + Math.floor(Math.sin(c * 17 + r * 31) * 12);
      const grad = ctx.createRadialGradient(
        x + stoneW * 0.4, y + stoneH * 0.4, 4,
        x + stoneW * 0.5, y + stoneH * 0.5, stoneW * 0.7
      );
      grad.addColorStop(0, `hsl(215, 14%, ${lum + 8}%)`);
      grad.addColorStop(0.7, `hsl(215, 12%, ${lum}%)`);
      grad.addColorStop(1, `hsl(220, 18%, ${lum - 14}%)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      // Rounded cobblestone shape
      ctx.roundRect(x + 3, y + 3, stoneW, stoneH, 8);
      ctx.fill();

      // Stone edge highlights
      ctx.strokeStyle = `hsla(210, 15%, ${lum + 20}%, 0.35)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // Micro-grit noise overlay
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 18;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 18);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 2. Bump Map for Cobblestone Depth
export function createCobblestoneBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, 512, 512);

  const cols = 16;
  const rows = 16;
  const cellW = 512 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const rowOffset = (r % 2) * (cellW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * cellW + rowOffset;
      const y = r * cellH;
      const stoneW = cellW - 4;
      const stoneH = cellH - 4;

      const grad = ctx.createRadialGradient(
        x + stoneW * 0.5, y + stoneH * 0.5, 2,
        x + stoneW * 0.5, y + stoneH * 0.5, stoneW * 0.5
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.65, '#aaaaaa');
      grad.addColorStop(1, '#111111');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, stoneW, stoneH, 6);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 18);
  return texture;
}

// 3. Ancient Runic Weathered Granite Pillar Texture
export function createRunicPillarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Weathered dark granite gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 1024);
  bgGrad.addColorStop(0, '#111622');
  bgGrad.addColorStop(0.5, '#1e293b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 1024);

  // Stone masonry cracks and lines
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  for (let y = 60; y < 1024; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.sin(y) * 4));
    ctx.lineTo(512, y + (Math.cos(y) * 4));
    ctx.stroke();
  }

  // Glowing carved cyber-runes in the center
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;

  const runes = [
    '◇───◈───◇',
    'ᚲ ᛟ ᚱ ᛖ',
    '▲ ⚔ ▲',
    'ᚦ ᚨ ᚱ ᚲ',
    '❖ ── ❖',
    'ᛉ ᛚ ᛗ ᛞ',
    '◈───◆───◈'
  ];

  ctx.font = 'bold 28px serif';
  ctx.fillStyle = '#7dd3fc';
  ctx.textAlign = 'center';

  runes.forEach((rune, idx) => {
    const ry = 140 + idx * 110;
    ctx.fillText(rune, 256, ry);

    // Decorative vertical runic line
    ctx.beginPath();
    ctx.moveTo(256, ry + 15);
    ctx.lineTo(256, ry + 65);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 4. Cyber Royal Shield Texture (Hylian / Lorencia hybrid)
export function createShieldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Royal deep cobalt background
  const bgGrad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
  bgGrad.addColorStop(0, '#1e3a8a');
  bgGrad.addColorStop(0.7, '#0f172a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Golden border trim
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 14;
  ctx.strokeRect(18, 18, 476, 476);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.strokeRect(26, 26, 460, 460);

  // Golden Cyber Crest in center (Triforce & Phoenix Wing)
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 16;

  // Upper triangle
  ctx.beginPath();
  ctx.moveTo(256, 120);
  ctx.lineTo(310, 200);
  ctx.lineTo(202, 200);
  ctx.closePath();
  ctx.fill();

  // Bottom left triangle
  ctx.beginPath();
  ctx.moveTo(202, 204);
  ctx.lineTo(256, 284);
  ctx.lineTo(148, 284);
  ctx.closePath();
  ctx.fill();

  // Bottom right triangle
  ctx.beginPath();
  ctx.moveTo(310, 204);
  ctx.lineTo(364, 284);
  ctx.lineTo(256, 284);
  ctx.closePath();
  ctx.fill();

  // Red Lorencia Dragon Crest under the triforce
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#dc2626';
  ctx.beginPath();
  ctx.arc(256, 360, 36, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 5. Sky Dome Starfield & Horizon Atmosphere
export function createSkyDomeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Zenith to horizon gradient: deep dark space down to moody cyan/purple horizon
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#04070d');
  grad.addColorStop(0.4, '#080d19');
  grad.addColorStop(0.75, '#131b2e');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Twinkling stars
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 380;
    const size = Math.random() * 1.8 + 0.4;
    const alpha = Math.random() * 0.8 + 0.2;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, size, size);
  }

  // Cyan nebula dust streak
  const nebGrad = ctx.createRadialGradient(512, 280, 20, 512, 280, 400);
  nebGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
  nebGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
  nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebGrad;
  ctx.fillRect(0, 0, 1024, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
