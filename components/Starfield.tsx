"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
  layer: number;
  fadeIn: number; // 0-1
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  fill: string;
  ring: string;
  hasRing: boolean;
  opacity: number;
  driftX: number;
  driftY: number;
  layer: number;
  sprite: HTMLCanvasElement | null;
}

// Fixed full-page canvas starfield with parallax, planets, and shooting stars.
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let running = false;
    let staticMode = false;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let planets: Planet[] = [];
    let w = 0;
    let h = 0;
    let pageH = 0;
    let scrollY = 0;
    let time = 0;
    let nextSpawn = 80;
    let disposed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 767px)");

    const PARALLAX = [0.15, 0.35, 0.6];

    function computeStatic() {
      return motionMq.matches || mobileMq.matches;
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      pageH = document.documentElement.scrollHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
      initPlanets();
    }

    function refreshPageHeight() {
      const next = document.documentElement.scrollHeight;
      if (Math.abs(next - pageH) < 50) return;
      pageH = next;
      initStars();
      initPlanets();
      if (staticMode) drawStatic();
    }

    function initStars() {
      // Cap star count to stay light on low-end devices
      const budget = w < 768 ? 220 : 500;
      const totalCount = Math.min(Math.floor((w * pageH) / 10000), budget);
      stars = [];
      for (let i = 0; i < totalCount; i++) {
        const layer = Math.random() < 0.5 ? 0 : Math.random() < 0.6 ? 1 : 2;
        stars.push({
          x: Math.random() * w,
          y: Math.random() * pageH,
          size: Math.random() * (layer === 2 ? 2.2 : layer === 1 ? 1.6 : 1.0) + 0.2,
          baseOpacity: Math.random() * (layer === 2 ? 0.7 : 0.5) + 0.15,
          twinkleSpeed: Math.random() * 0.03 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer,
        });
      }
    }

    // Pre-render each planet glow to an offscreen sprite once, so the hot
    // per-frame loop is a cheap drawImage instead of a gradient allocation.
    function makePlanetSprite(radius: number, fill: string): HTMLCanvasElement {
      const pad = 2;
      const size = Math.ceil((radius + pad) * 2);
      const sprite = document.createElement("canvas");
      sprite.width = size;
      sprite.height = size;
      const sctx = sprite.getContext("2d");
      if (sctx) {
        const c = size / 2;
        const grad = sctx.createRadialGradient(
          c - radius * 0.3, c - radius * 0.3, 0,
          c, c, radius
        );
        grad.addColorStop(0, fill);
        grad.addColorStop(1, "transparent");
        sctx.beginPath();
        sctx.arc(c, c, radius, 0, Math.PI * 2);
        sctx.fillStyle = grad;
        sctx.fill();
      }
      return sprite;
    }

    function initPlanets() {
      const defs = [
        { fill: "rgba(180,160,200,0.18)", ring: "rgba(180,160,200,0.09)" },
        { fill: "rgba(160,180,220,0.14)", ring: "rgba(160,180,220,0.07)" },
        { fill: "rgba(200,170,150,0.12)", ring: "rgba(200,170,150,0.06)" },
      ];
      const count = w < 768 ? 2 : Math.max(2, Math.floor(pageH / 1500));
      planets = Array.from({ length: count }, (_, i) => {
        const d = defs[i % defs.length];
        const layer = Math.random() < 0.5 ? 1 : 2;
        const radius = Math.random() * 25 + 12;
        return {
          x: Math.random() * w * 0.8 + w * 0.1,
          y: Math.random() * pageH * 0.9 + pageH * 0.05,
          radius,
          fill: d.fill,
          ring: d.ring,
          hasRing: Math.random() > 0.4,
          opacity: Math.random() * 0.25 + 0.08,
          driftX: (Math.random() - 0.5) * 0.02,
          driftY: (Math.random() - 0.5) * 0.01,
          layer,
          sprite: makePlanetSprite(radius, d.fill),
        };
      });
    }

    function spawnShootingStar() {
      if (shootingStars.length >= 2) return;
      const layer = Math.random() < 0.5 ? 1 : 2;
      shootingStars.push({
        x: Math.random() * w * 0.6 + w * 0.2,
        y: Math.random() * h * 0.4,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 5 + 4,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 0, // start at 0, fade in
        life: 0,
        maxLife: Math.random() * 45 + 35,
        layer,
        fadeIn: 0,
      });
    }

    function drawPlanet(p: Planet, screenY: number) {
      if (!ctx) return;
      ctx.globalAlpha = p.opacity;
      if (p.sprite) {
        const size = p.sprite.width;
        ctx.drawImage(p.sprite, p.x - size / 2, screenY - size / 2, size, size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.fill;
        ctx.fill();
      }
      if (p.hasRing) {
        ctx.beginPath();
        ctx.ellipse(p.x, screenY, p.radius * 1.8, p.radius * 0.4, -0.2, 0, Math.PI);
        ctx.strokeStyle = p.ring;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(p.x, screenY, p.radius * 1.8, p.radius * 0.4, -0.2, Math.PI, Math.PI * 2);
        ctx.strokeStyle = p.ring;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawStatic() {
      if (!ctx || disposed) return;
      ctx.clearRect(0, 0, w, h);
      const sy = scrollY;
      for (const s of stars) {
        const screenY = s.y - sy * PARALLAX[s.layer];
        if (screenY < -10 || screenY > h + 10) continue;
        ctx.beginPath();
        ctx.arc(s.x, screenY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.baseOpacity})`;
        ctx.fill();
      }
      for (const p of planets) {
        const screenY = p.y - sy * PARALLAX[p.layer];
        if (screenY < -80 || screenY > h + 80) continue;
        drawPlanet(p, screenY);
      }
    }

    function draw() {
      if (!ctx || disposed) {
        running = false;
        return;
      }
      time++;
      ctx.clearRect(0, 0, w, h);

      const sy = scrollY;

      // --- Stars ---
      for (const s of stars) {
        const screenY = s.y - sy * PARALLAX[s.layer];
        if (screenY < -10 || screenY > h + 10) continue;

        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.baseOpacity * (0.5 + twinkle * 0.5);
        ctx.beginPath();
        ctx.arc(s.x, screenY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      // --- Planets ---
      for (const p of planets) {
        p.x += p.driftX;
        p.y += p.driftY;
        if (p.x < -60) p.x = w + 60;
        if (p.x > w + 60) p.x = -60;
        if (p.y < -60) p.y = pageH + 60;
        if (p.y > pageH + 60) p.y = -60;

        const screenY = p.y - sy * PARALLAX[p.layer];
        if (screenY < -80 || screenY > h + 80) continue;

        drawPlanet(p, screenY);
      }

      // --- Shooting stars ---
      if (time >= nextSpawn) {
        spawnShootingStar();
        nextSpawn = time + Math.floor(Math.random() * 120) + 80;
      }

      shootingStars = shootingStars.filter((s) => {
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const screenY = s.y - sy * PARALLAX[s.layer];

        // Smooth fade in first 15 frames, smooth fade out over remaining life
        const fadeInEnd = 15;
        const fadeOutStart = s.maxLife * 0.6;

        if (s.life < fadeInEnd) {
          // Ease in
          s.fadeIn = s.life / fadeInEnd;
          s.fadeIn = s.fadeIn * s.fadeIn; // quadratic ease in
        } else if (s.life > fadeOutStart) {
          // Ease out
          const fadeProgress = (s.life - fadeOutStart) / (s.maxLife - fadeOutStart);
          s.fadeIn = 1 - fadeProgress * fadeProgress; // quadratic ease out
        }

        s.opacity = s.fadeIn;
        if (s.opacity <= 0.01) return false;

        if (screenY < -50 || screenY > h + 50) return true;

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = screenY - Math.sin(s.angle) * s.length;

        // Trail gradient
        const trailGrad = ctx.createLinearGradient(tailX, tailY, s.x, screenY);
        trailGrad.addColorStop(0, "rgba(255,255,255,0)");
        trailGrad.addColorStop(0.7, `rgba(255,255,255,${s.opacity * 0.3})`);
        trailGrad.addColorStop(1, `rgba(255,255,255,${s.opacity * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, screenY);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glow head with radial gradient
        const headGrad = ctx.createRadialGradient(s.x, screenY, 0, s.x, screenY, 4);
        headGrad.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
        headGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(s.x, screenY, 4, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();

        return true;
      });

      animId = requestAnimationFrame(draw);
    }

    function startLoop() {
      if (running || disposed || staticMode) return;
      running = true;
      draw();
    }

    function stopLoop() {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      animId = 0;
    }

    function applyMode() {
      const next = computeStatic();
      if (next === staticMode) {
        if (next) drawStatic();
        return;
      }
      staticMode = next;
      if (staticMode) {
        stopLoop();
        drawStatic();
      } else {
        drawStatic();
        startLoop();
      }
    }

    function onScroll() {
      scrollY = window.scrollY;
    }

    // Static mode: draw once per scroll, no animation loop.
    let ticking = false;
    const onScrollStatic = () => {
      scrollY = window.scrollY;
      if (!staticMode || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (staticMode) drawStatic();
      });
    };

    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (disposed) return;
        applyMode();
        resize();
        if (staticMode) drawStatic();
      }, 150);
    };

    // Pause the loop when the tab is hidden to save CPU/battery.
    const onVis = () => {
      if (disposed) return;
      if (document.hidden) {
        stopLoop();
      } else if (!staticMode) {
        startLoop();
      } else {
        drawStatic();
      }
    };

    const onModeChange = () => {
      if (disposed) return;
      applyMode();
      resize();
      if (staticMode) drawStatic();
      else startLoop();
    };

    // Keep star coverage in sync when content height changes
    // (language switch, images loading, sections expanding).
    let heightTimer: number | null = null;
    const heightObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (heightTimer !== null) window.clearTimeout(heightTimer);
            heightTimer = window.setTimeout(() => {
              if (!disposed) refreshPageHeight();
            }, 300);
          })
        : null;
    heightObserver?.observe(document.documentElement);

    staticMode = computeStatic();
    resize();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScrollStatic, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    if (typeof motionMq.addEventListener === "function") {
      motionMq.addEventListener("change", onModeChange);
      mobileMq.addEventListener("change", onModeChange);
    }

    if (staticMode) drawStatic();
    else startLoop();

    return () => {
      disposed = true;
      stopLoop();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollStatic);
      window.removeEventListener("resize", onResize);
      if (typeof motionMq.removeEventListener === "function") {
        motionMq.removeEventListener("change", onModeChange);
        mobileMq.removeEventListener("change", onModeChange);
      }
      heightObserver?.disconnect();
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      if (heightTimer !== null) window.clearTimeout(heightTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
