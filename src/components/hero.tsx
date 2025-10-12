"use client";
import React, { useEffect, useRef } from 'react';

// Full-viewport particle field driven by mouse movement
export default function Hero({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function setSize() {
      const w = (canvas.width = Math.max(1, canvas.clientWidth) * devicePixelRatio);
      const h = (canvas.height = Math.max(1, canvas.clientHeight) * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    setSize();

    // particle count scales with viewport size but never too low
    const baseCount = Math.max(120, Math.floor((canvas.clientWidth * canvas.clientHeight) / 25000));
    const particles = Array.from({ length: baseCount }).map(() => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      size: 3 + Math.random() * 4,
      hue: 200 + Math.random() * 100,
    }));

    // background stars (static-ish) for depth
    const starCount = Math.max(120, Math.floor((canvas.clientWidth * canvas.clientHeight) / 40000));
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: Math.random() * 1.8,
      a: 0.4 + Math.random() * 0.9,
    }));

    // simple galaxies (rare) as rotating blobs
    const galaxies: Array<any> = [];
    if (canvas.clientWidth > 600) {
      for (let i = 0; i < 3; i++) {
        galaxies.push({
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          r: 40 + Math.random() * 120,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() - 0.5) * 0.002,
          hue: 200 + Math.random() * 120,
        });
      }
    }

    // choose a small subset of particles for constellation lines
    const constellationCount = Math.max(8, Math.min(20, Math.floor(baseCount / 8)));
    const constellationIndices = new Set<number>();
    while (constellationIndices.size < constellationCount) {
      constellationIndices.add(Math.floor(Math.random() * particles.length));
    }
    const constIndices = Array.from(constellationIndices);

    const mouse = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2, vx: 0, vy: 0, lastX: null as number | null, lastY: null as number | null, speed: 0 };

    function resize() {
      setSize();
      // reposition mouse to center to avoid big impulse on resize
      mouse.x = canvas.clientWidth / 2;
      mouse.y = canvas.clientHeight / 2;
    }

    function draw() {
      // ensure we have sane canvas dimensions
      const cw = Number.isFinite(canvas.clientWidth) && canvas.clientWidth > 0 ? canvas.clientWidth : 1;
      const ch = Number.isFinite(canvas.clientHeight) && canvas.clientHeight > 0 ? canvas.clientHeight : 1;
      ctx.clearRect(0, 0, cw, ch);

      // background gradient
      const bg = ctx.createLinearGradient(0, 0, cw, ch);
      bg.addColorStop(0, '#03030a');
      bg.addColorStop(0.4, '#07102a');
      bg.addColorStop(1, '#070916');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cw, ch);

      // nebula layers
      for (let i = 0; i < 6; i++) {
        const nx = Math.abs(Math.sin((performance.now() * 0.0001 + i) * (0.3 + i * 0.1)));
        const ny = Math.abs(Math.cos((performance.now() * 0.00007 + i) * (0.25 + i * 0.12)));
        const cx = (nx * cw * 1.2) % cw - cw * 0.1;
        const cy = (ny * ch * 1.2) % ch - ch * 0.1;
        const rad = Math.max(1, Math.min(cw, ch) * (0.25 + i * 0.06));
        const safeCx = Number.isFinite(cx) ? cx : cw / 2;
        const safeCy = Number.isFinite(cy) ? cy : ch / 2;
        const safeRad = Number.isFinite(rad) && rad > 0 ? rad : Math.min(cw, ch) * 0.3;
        const neb = ctx.createRadialGradient(safeCx, safeCy, 0, safeCx, safeCy, safeRad);
        neb.addColorStop(0, `rgba(${100 + i * 20}, ${30 + i * 10}, ${140 + i * 10}, 0.18)`);
        neb.addColorStop(0.5, `rgba(${60 + i * 10}, ${10 + i * 5}, ${90 + i * 10}, 0.06)`);
        neb.addColorStop(1, 'rgba(10,6,18,0)');
        ctx.fillStyle = neb;
        ctx.fillRect(safeCx - safeRad, safeCy - safeRad, safeRad * 2, safeRad * 2);
      }

      // background stars
      for (const s of stars) {
        const sx = Number.isFinite(s.x) ? s.x : Math.random() * cw;
        const sy = Number.isFinite(s.y) ? s.y : Math.random() * ch;
        const sr = Math.max(0.2, Number.isFinite(s.r) ? s.r : 1);
        const sa = Number.isFinite(s.a) ? s.a : 0.6;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // motion strength
      const movementStrength = 20 + Math.min(mouse.speed * 0.9, 140);

      // particles
      for (const p of particles) {
        p.x = Number.isFinite(p.x) ? p.x : Math.random() * cw;
        p.y = Number.isFinite(p.y) ? p.y : Math.random() * ch;
        p.vx = Number.isFinite(p.vx) ? p.vx : 0;
        p.vy = Number.isFinite(p.vy) ? p.vy : 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

        // proximity-based repulsion
        const CM_TO_PX = 96 / 2.54;
        const influenceRadius = 0.5 * CM_TO_PX;
        if (dist < influenceRadius) {
          const repulseFactor = (1 - dist / influenceRadius);
          const repulseStrength = 220 * repulseFactor + Math.min(mouse.speed * 3, 300);
          p.vx -= (dx / dist) * repulseStrength * 0.012;
          p.vy -= (dy / dist) * repulseStrength * 0.012;
        } else {
          const force = movementStrength / (dist * dist);
          p.vx += (dx / dist) * force * 0.01;
          p.vy += (dy / dist) * force * 0.01;
        }

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.95;
        p.vy *= 0.95;

        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        if (p.y < -10) p.y = ch + 10;
        if (p.y > ch + 10) p.y = -10;

        // draw particle glow/core
        const hue = Number.isFinite(p.hue) ? p.hue : 220;
        const gradRad = Math.max(8, Math.min(48, 24));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gradRad);
        grad.addColorStop(0, `rgba(255,255,255,0.98)`);
        grad.addColorStop(0.12, `hsla(${hue}, 90%, 75%, 0.7)`);
        grad.addColorStop(0.45, `hsla(${hue}, 70%, 50%, 0.22)`);
        grad.addColorStop(1, 'rgba(30,10,40,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - gradRad, p.y - gradRad, gradRad * 2, gradRad * 2);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.arc(p.x, p.y, Math.max(1.6, p.size * 0.9), 0, Math.PI * 2);
        ctx.fill();
      }

      // connecting lines between particles
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.globalAlpha = 1 - d / 120;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // constellation connections
      ctx.lineWidth = 0.9;
      for (let aIdx = 0; aIdx < constIndices.length; aIdx++) {
        const i = constIndices[aIdx];
        const a = particles[i];
        const neighbors: Array<{ idx: number; d: number }> = [];
        for (let bIdx = 0; bIdx < constIndices.length; bIdx++) {
          if (bIdx === aIdx) continue;
          const j = constIndices[bIdx];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          neighbors.push({ idx: j, d });
        }
        neighbors.sort((x, y) => x.d - y.d);
        const connectCount = Math.min(3, neighbors.length);
        for (let n = 0; n < connectCount; n++) {
          const nb = neighbors[n];
          if (nb.d > Math.min(cw, ch) * 0.45) continue;
          const b = particles[nb.idx];
          const alpha = Math.max(0.06, 0.35 - nb.d / 800);
          ctx.strokeStyle = `rgba(180,210,255,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(220,230,255,0.92)';
        ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // galaxies
      for (const gbl of galaxies) {
        gbl.angle += gbl.speed;
        const gx = Number.isFinite(gbl.x) ? gbl.x : cw / 2;
        const gy = Number.isFinite(gbl.y) ? gbl.y : ch / 2;
        const gr = Math.max(10, Number.isFinite(gbl.r) ? gbl.r : 40);
        const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        gg.addColorStop(0, `rgba(255,240,220,0.9)`);
        gg.addColorStop(0.2, `hsla(${gbl.hue}, 80%, 60%, 0.35)`);
        gg.addColorStop(0.6, `hsla(${gbl.hue}, 50%, 35%, 0.08)`);
        gg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gg;
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(gbl.angle);
        ctx.fillRect(-gr, -gr, gr * 2, gr * 2);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (mouse.lastX !== null && mouse.lastY !== null) {
        const dx = x - mouse.lastX;
        const dy = y - mouse.lastY;
        const dt = 16; // approx frame time — used to smooth
        const vx = dx / (dt || 1);
        const vy = dy / (dt || 1);
        mouse.speed = Math.sqrt(vx * vx + vy * vy) * 10;
      }
      mouse.lastX = x;
      mouse.lastY = y;
      mouse.x = x;
      mouse.y = y;
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
