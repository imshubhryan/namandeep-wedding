/**
 * Spectacular Wedding Party Popper & Confetti Engine
 * Features:
 * - Dual corner cannons firing upward & outward (true party popper arc)
 * - Center sparkle & floral burst directly over the card
 * - Gold ribbons, rose petals, shimmering metallic rectangles, stars & hearts
 * - High performance 60fps on mobile & desktop
 * - Safe for all devices (no reduced-motion lockouts)
 */

const PALETTE = [
  "#D4AF37", // Imperial Gold
  "#F5D78E", // Champagne Gold
  "#800020", // Deep Burgundy
  "#C77D93", // Dusty Rose
  "#F4C7D9", // Blush Pink
  "#E8A1B5", // Rose
  "#FFFFFF", // Pure Ivory/White
  "#E6BE8A", // Metallic Gold
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  drag: number;
  rotation: number;
  vr: number;
  size: number;
  color: string;
  kind: "confetti" | "petal" | "ribbon" | "star" | "heart";
  opacity: number;
  decay: number;
  wobble: number;
  wobbleSpeed: number;
}

export function celebrate(options?: {
  originX?: number; // 0 to 1
  originY?: number; // 0 to 1
  particleCount?: number;
}) {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const particles: Particle[] = [];

  // Helper to spawn a cannon burst
  const shootCannon = (
    startX: number,
    startY: number,
    angleDeg: number,
    spreadDeg: number,
    power: number,
    count: number,
  ) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const spreadRad = (spreadDeg * Math.PI) / 180;

    for (let i = 0; i < count; i++) {
      const a = angleRad + (Math.random() - 0.5) * spreadRad;
      const speed = power * (0.65 + Math.random() * 0.7);
      const kinds: Particle["kind"][] = [
        "confetti",
        "confetti",
        "petal",
        "ribbon",
        "star",
        "heart",
      ];
      const kind = kinds[Math.floor(Math.random() * kinds.length)];

      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        gravity: kind === "petal" ? 0.18 : 0.28,
        drag: kind === "ribbon" ? 0.96 : 0.975,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.25,
        size: kind === "ribbon" ? 14 + Math.random() * 12 : 7 + Math.random() * 8,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        kind,
        opacity: 1,
        decay: 0.005 + Math.random() * 0.007,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.08,
      });
    }
  };

  // 1. Left corner party popper (shoots towards center-top)
  shootCannon(width * 0.1, height * 0.95, -65, 45, Math.min(26, height * 0.032), 65);

  // 2. Right corner party popper (shoots towards center-top)
  shootCannon(width * 0.9, height * 0.95, -115, 45, Math.min(26, height * 0.032), 65);

  // 3. Center popper explosion
  shootCannon(width * 0.5, height * 0.65, -90, 80, Math.min(22, height * 0.028), 70);

  // Second wave 250ms later for dramatic crescendo
  setTimeout(() => {
    if (!canvas.parentElement) return;
    shootCannon(width * 0.2, height * 0.85, -60, 40, Math.min(24, height * 0.03), 40);
    shootCannon(width * 0.8, height * 0.85, -120, 40, Math.min(24, height * 0.03), 40);
    shootCannon(width * 0.5, height * 0.55, -90, 100, Math.min(20, height * 0.025), 45);
  }, 260);

  const drawHeart = (p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    const s = p.size * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s * 0.6, -s * 0.4, -s, s * 0.3, 0, s);
    ctx.bezierCurveTo(s, s * 0.3, s * 0.6, -s * 0.4, 0, s * 0.3);
    ctx.fill();
    ctx.restore();
  };

  const drawStar = (p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    const r = p.size * 0.7;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      ctx.lineTo(Math.cos(a + Math.PI / 4) * (r * 0.3), Math.sin(a + Math.PI / 4) * (r * 0.3));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawPetal = (p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity * 0.9;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawConfetti = (p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    // 3D tumble flip
    const xSkew = Math.cos(p.wobble);
    ctx.scale(xSkew, 1);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size * 2) / 3);
    ctx.restore();
  };

  const drawRibbon = (p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity * 0.85;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-p.size, 0);
    ctx.bezierCurveTo(-p.size * 0.5, -6, p.size * 0.5, 6, p.size, 0);
    ctx.stroke();
    ctx.restore();
  };

  let raf = 0;
  const loop = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx + Math.sin(p.wobble) * 0.8;
      p.y += p.vy;
      p.rotation += p.vr;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > height + 60) {
        particles.splice(i, 1);
        continue;
      }

      if (p.kind === "heart") drawHeart(p);
      else if (p.kind === "star") drawStar(p);
      else if (p.kind === "petal") drawPetal(p);
      else if (p.kind === "ribbon") drawRibbon(p);
      else drawConfetti(p);
    }

    if (particles.length > 0) {
      raf = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.remove();
    }
  };

  raf = requestAnimationFrame(loop);
}
