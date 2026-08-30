import { useEffect, useRef } from 'react';

interface BlackHoleProps {
  particleCount?: number;
  baseSpeed?: number;
  pullStrength?: number;
  colors?: string[];
  particleSize?: number;
  glow?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  angle: number;
  orbitRadius: number;
  speed: number;
  phase: number;
}

export default function BlackHole({
  particleCount = 120,
  baseSpeed = 0.015,
  pullStrength = 0.0008,
  colors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'],
  particleSize = 1.5,
  glow = true,
}: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    const initParticles = (w: number, h: number) => {
      const particles: Particle[] = [];
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.45;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const orbitRadius = maxR * (0.2 + Math.random() * 0.8);
        const x = cx + Math.cos(angle) * orbitRadius;
        const y = cy + Math.sin(angle) * orbitRadius;
        const colorIdx = i % colors.length;

        particles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          radius: particleSize * (0.5 + Math.random() * 1),
          color: colors[colorIdx],
          angle,
          orbitRadius,
          speed: baseSpeed * (0.5 + Math.random() * 1.5),
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.005;

      // Draw faint center glow
      if (glow) {
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.35);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.02)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      const particles = particlesRef.current;
      const time = timeRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Orbital motion with slight wobble
        p.angle += p.speed;
        const wobble = Math.sin(time * 2 + p.phase) * 8;
        const currentR = p.orbitRadius + wobble;

        // Gravitational pull toward center (slow inward spiral)
        p.orbitRadius -= pullStrength * (p.orbitRadius * 0.3);

        // Reset if too close to center
        if (p.orbitRadius < 20) {
          p.orbitRadius = Math.min(w, h) * (0.35 + Math.random() * 0.4);
          p.angle = Math.random() * Math.PI * 2;
          p.phase = Math.random() * Math.PI * 2;
        }

        p.x = cx + Math.cos(p.angle) * currentR;
        p.y = cy + Math.sin(p.angle) * currentR;

        // Color cycling via hue shift simulation (opacity pulsing)
        const pulse = 0.5 + 0.5 * Math.sin(time * 3 + p.phase);
        const alpha = 0.2 + pulse * 0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Color cycling: blend between colors
        const colorIdx = Math.floor((time * 10 + p.phase * 2) % colors.length);
        const nextColorIdx = (colorIdx + 1) % colors.length;
        const blend = ((time * 10 + p.phase * 2) % 1);
        const baseColor = colors[colorIdx];
        const nextColor = colors[nextColorIdx];

        // Simple alpha blending for color cycling effect
        ctx.fillStyle = hexToRgba(baseColor, alpha * (1 - blend * 0.4));
        ctx.fill();

        // Draw trail / glow
        if (glow && p.radius > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(nextColor, alpha * 0.15);
          ctx.fill();
        }
      }

      // Draw spiral arms (subtle)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.3);
      for (let arm = 0; arm < 3; arm++) {
        ctx.beginPath();
        const armOffset = (arm / 3) * Math.PI * 2;
        for (let t = 0; t < Math.PI * 3; t += 0.05) {
          const r = t * 25;
          const x = Math.cos(t + armOffset) * r;
          const y = Math.sin(t + armOffset) * r;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + Math.sin(time + arm) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(animate);
    };

    const hexToRgba = (hex: string, alpha: number): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const isVisibleRef = { current: true };
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      io.disconnect();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [particleCount, baseSpeed, pullStrength, colors, particleSize, glow]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
