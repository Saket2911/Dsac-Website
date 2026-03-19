import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

/* ─── Keyframes ─── */
const heroCSS = `
@keyframes hero-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
`;

/* ─── Canvas Particles ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const mouseTrailRef = useRef([]);
  const animRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      mouseTrailRef.current.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (mouseTrailRef.current.length > 12) mouseTrailRef.current.shift();
    };
    window.addEventListener("mousemove", handleMouse);

    // Particles: dots, stars, rings
    const count = 70;
    particlesRef.current = Array.from({ length: count }, () => {
      const r = Math.random();
      const type = r > 0.88 ? "star" : r > 0.78 ? "ring" : "dot";
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === "star" ? Math.random() * 3 + 2.5 : type === "ring" ? Math.random() * 3 + 2 : Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.12,
        opacity: type === "star" ? Math.random() * 0.4 + 0.35 : Math.random() * 0.35 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.006,
        type,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        drift: Math.random() * Math.PI * 2, // for gentle sine wave drift
        driftSpeed: Math.random() * 0.003 + 0.001,
      };
    });

    // Spawn shooting stars periodically
    const spawnShootingStar = () => {
      const fromLeft = Math.random() > 0.5;
      shootingStarsRef.current.push({
        x: fromLeft ? -20 : canvas.width + 20,
        y: Math.random() * canvas.height * 0.5,
        speedX: fromLeft ? (Math.random() * 3 + 4) : -(Math.random() * 3 + 4),
        speedY: Math.random() * 1.5 + 0.5,
        life: 1,
        length: Math.random() * 60 + 40,
        size: Math.random() * 1.5 + 0.8,
      });
    };

    let shootingInterval = setInterval(() => {
      if (Math.random() > 0.4) spawnShootingStar(); // ~60% chance every 3s
    }, 3000);
    // First one appears early
    setTimeout(spawnShootingStar, 1500);

    const drawCrossGlow = (ctx, x, y, size, opacity) => {
      ctx.save();
      ctx.globalAlpha = opacity * 0.4;
      ctx.strokeStyle = `rgba(210, 185, 110, 1)`;
      ctx.lineWidth = 0.5;
      // Horizontal line
      ctx.beginPath(); ctx.moveTo(x - size * 2.5, y); ctx.lineTo(x + size * 2.5, y); ctx.stroke();
      // Vertical line
      ctx.beginPath(); ctx.moveTo(x, y - size * 2.5); ctx.lineTo(x, y + size * 2.5); ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current++;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // === Draw mouse trail (subtle golden ripple) ===
      for (let i = mouseTrailRef.current.length - 1; i >= 0; i--) {
        const t = mouseTrailRef.current[i];
        t.life -= 0.025;
        if (t.life <= 0) { mouseTrailRef.current.splice(i, 1); continue; }
        const r = (1 - t.life) * 25 + 3;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(198, 167, 94, ${t.life * 0.1})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // === Draw particles ===
      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let pushX = 0, pushY = 0;
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.35;
          pushX = (dx / dist) * force; pushY = (dy / dist) * force;
        }

        // Sine wave drift
        p.drift += p.driftSpeed;
        const driftOffset = Math.sin(p.drift) * 0.15;

        p.x += p.speedX + pushX + driftOffset;
        p.y += p.speedY + pushY;
        p.pulse += p.pulseSpeed;
        p.twinkle += p.twinkleSpeed;

        // Wrap
        if (p.x < -15) p.x = canvas.width + 15;
        if (p.x > canvas.width + 15) p.x = -15;
        if (p.y < -15) p.y = canvas.height + 15;
        if (p.y > canvas.height + 15) p.y = -15;

        const breathe = 0.5 + 0.5 * Math.sin(p.pulse);
        const op = p.opacity * breathe;

        if (p.type === "star") {
          const tw = 0.5 + 0.5 * Math.sin(p.twinkle);
          const sop = op * tw;
          // Soft glow
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          g.addColorStop(0, `rgba(210, 185, 110, ${sop * 0.45})`);
          g.addColorStop(0.5, `rgba(198, 167, 94, ${sop * 0.12})`);
          g.addColorStop(1, "transparent");
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
          // Cross glow lines
          drawCrossGlow(ctx, p.x, p.y, p.size, sop);
          // Core dot
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230, 210, 150, ${sop * 1.1})`; ctx.fill();
        } else if (p.type === "ring") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(198, 167, 94, ${op * 0.55})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          // Tiny center dot
          ctx.beginPath(); ctx.arc(p.x, p.y, 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(198, 167, 94, ${op * 0.7})`; ctx.fill();
        } else {
          // Regular dot with soft glow
          if (p.size > 1) {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            g.addColorStop(0, `rgba(198, 167, 94, ${op * 0.12})`);
            g.addColorStop(1, "transparent");
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
          }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(195, 175, 120, ${op * 1.2})`; ctx.fill();
        }
      }

      // === Connection lines ===
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].type === "star") continue;
        for (let j = i + 1; j < particles.length; j++) {
          if (particles[j].type === "star") continue;
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(195, 175, 120, ${0.06 * (1 - d / 90)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // === Shooting stars ===
      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const s = shootingStarsRef.current[i];
        s.x += s.speedX;
        s.y += s.speedY;
        s.life -= 0.008;

        if (s.life <= 0 || s.x < -100 || s.x > canvas.width + 100) {
          shootingStarsRef.current.splice(i, 1);
          continue;
        }

        // Trail
        const tailX = s.x - (s.speedX / Math.abs(s.speedX)) * s.length;
        const tailY = s.y - (s.speedY / Math.abs(s.speedY || 1)) * s.length * (s.speedY / Math.abs(s.speedX));
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.6, `rgba(210, 190, 120, ${s.life * 0.25})`);
        grad.addColorStop(1, `rgba(230, 210, 150, ${s.life * 0.65})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.stroke();

        // Head glow
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
        hg.addColorStop(0, `rgba(230, 215, 160, ${s.life * 0.75})`);
        hg.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = hg; ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      clearInterval(shootingInterval);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

/* ─── Morphing Logo Animation ─── */
/*
 * "VASAVI COLLEGE OF ENGINEERING" split into 4 groups:
 *   Group 0: "VASAVI"       → D  (the 'V' at index 0 is the anchor)
 *   Group 1: "COLLEGE"      → S  (the 'C' at index 0 of group is anchor)
 *   Group 2: "OF"           → A  (the 'O' is anchor)
 *   Group 3: "ENGINEERING"  → C  (the 'E' is anchor)
 *
 * Phase 1 (0–2s):     Full text types in
 * Phase 2 (2–3.2s):   Non-target letters fade, groups highlight, targets morph
 * Phase 3 (3.2s+):    Letters grow big = final DSAC logo
 */
function MorphingLogo() {
  const [phase, setPhase] = useState("college"); // just "college" ↔ "dsac"

  const groups = [
    { word: "VASAVI",      target: "D", color: "#b5984a" },
    { word: "COLLEGE",     target: "S", color: "#c6a75e" },
    { word: "OF",          target: "A", color: "#a8893d" },
    { word: "ENGINEERING", target: "C", color: "#d4b96a" },
  ];

  useEffect(() => {
    let t1, t2;
    const run = () => {
      setPhase("college");
      t1 = setTimeout(() => setPhase("dsac"), 2500);
      t2 = setTimeout(() => run(), 7000); // show DSAC for ~4.5s then loop
    };
    run();
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  let globalIndex = 0;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center items-center flex-wrap">
        {groups.map((group, gi) => {
          const letters = group.word.split("");
          const startIdx = globalIndex;
          globalIndex += letters.length;

          return (
            <React.Fragment key={gi}>
              <div className="flex items-center" style={{ overflow: "visible" }}>
                {letters.map((char, ci) => {
                  const flatIdx = startIdx + ci;
                  const isTarget = ci === 0;
                  const isDsac = phase === "dsac";

                  const displayChar = isDsac && isTarget ? group.target : char;
                  const shouldHide = isDsac && !isTarget;

                  const fontSize = isDsac && isTarget
                    ? "clamp(5rem, 16vw, 11rem)"
                    : "clamp(0.85rem, 2vw, 1.5rem)";

                  return (
                    <motion.span
                      key={ci}
                      className="inline-block"
                      style={{
                        fontFamily: isDsac && isTarget
                          ? "'Playfair Display', serif"
                          : "'DM Sans', sans-serif",
                        fontWeight: isDsac && isTarget ? 900 : 600,
                        letterSpacing: isDsac ? "0.04em" : "0.15em",
                        lineHeight: 1,
                        overflow: "hidden",
                        ...(isDsac && isTarget ? {
                          background: "linear-gradient(90deg, #1a1815 0%, #2a2520 20%, #c6a75e 50%, #2a2520 80%, #1a1815 100%)",
                          backgroundSize: "200% 100%",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          animation: "hero-shimmer 4s ease-in-out infinite",
                          animationDelay: `${gi * 0.5}s`,
                        } : {
                          color: "#6b6050",
                        }),
                      }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{
                        opacity: shouldHide ? 0 : 1,
                        y: 0,
                        fontSize,
                        width: shouldHide ? 0 : "auto",
                      }}
                      transition={{
                        opacity: { duration: 0.6, delay: phase === "college" ? flatIdx * 0.02 : 0.1 },
                        y: { duration: 0.5, delay: phase === "college" ? flatIdx * 0.02 : 0 },
                        fontSize: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                        width: { duration: 0.5 },
                      }}
                    >
                      {displayChar}
                    </motion.span>
                  );
                })}
              </div>

              {/* Space between words */}
              {gi < groups.length - 1 && (
                <motion.span
                  style={{ display: "inline-block" }}
                  animate={{
                    width: phase === "college" ? "0.5em" : 0,
                    opacity: phase === "college" ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Hero Section ─── */
export default function HeroSection() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const logoX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const logoY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [logoHovered, setLogoHovered] = useState(false);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f8f6f2 0%, #f0ece4 50%, #efe9df 100%)" }}
    >
      <style>{heroCSS}</style>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(230,224,212,0.5) 100%)" }} />

      {/* Floating orbs */}
      <motion.div className="absolute pointer-events-none" style={{ width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,167,94,0.14) 0%, transparent 65%)", filter: "blur(50px)" }} animate={{ opacity: [0.3, 0.8, 0.5, 0.9, 0.3], left: ["5%", "15%", "8%", "20%", "5%"], top: ["10%", "28%", "15%", "32%", "10%"] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute pointer-events-none" style={{ width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(198,167,94,0.1) 0%, transparent 65%)", filter: "blur(60px)" }} animate={{ opacity: [0.2, 0.6, 0.4, 0.7, 0.2], right: ["5%", "18%", "10%", "20%", "5%"], top: ["5%", "22%", "12%", "28%", "5%"] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
      <motion.div className="absolute pointer-events-none" style={{ width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,160,100,0.12) 0%, transparent 60%)", filter: "blur(45px)" }} animate={{ opacity: [0.2, 0.5, 0.7, 0.4, 0.2], left: ["12%", "22%", "15%", "28%", "12%"], bottom: ["5%", "18%", "10%", "22%", "5%"] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }} />

      {/* Center pulse */}
      <motion.div className="absolute pointer-events-none" style={{ left: "50%", top: "40%", transform: "translate(-50%, -50%)", width: 700, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(198,167,94,0.1) 0%, transparent 55%)", filter: "blur(80px)" }} animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.06, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

      {/* Canvas Particles */}
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.2 }}>
        <ParticleCanvas />
      </motion.div>

      {/* ═══════ Main Content ═══════ */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* Morphing Logo — floats + parallax */}
        <motion.div
          className="relative mb-4 cursor-pointer"
          style={{ x: logoX, y: logoY }}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Hover glow */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              inset: "-15%", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(198,167,94,0.12) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
            animate={{ opacity: logoHovered ? 0.8 : 0.2 }}
            transition={{ duration: 0.5 }}
          />

          <MorphingLogo />

          {/* Department */}
          <motion.div
            className="flex items-center justify-center gap-3 mt-4 mb-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div style={{ width: 30, height: 1, background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.35))" }} />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(0.55rem, 1vw, 0.7rem)",
                letterSpacing: "0.35em",
                color: "#9a8a6e",
                fontWeight: 500,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Department Of Information Technology
            </p>
            <div style={{ width: 30, height: 1, background: "linear-gradient(90deg, rgba(198,167,94,0.35), transparent)" }} />
          </motion.div>

          {/* Shimmer divider */}
          <motion.div
            className="mx-auto overflow-hidden"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "50%", opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          >
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, transparent 0%, rgba(198,167,94,0.15) 20%, rgba(198,167,94,0.4) 50%, rgba(198,167,94,0.15) 80%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "hero-shimmer 3s ease-in-out infinite",
            }} />
          </motion.div>
        </motion.div>

        {/* Content below — always visible */}
        <motion.div
          className="flex flex-col items-center mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Club full name */}
          <motion.p
            variants={fadeUp}
            className="tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#7a6f5c", fontWeight: 500, fontSize: "clamp(0.7rem, 1.3vw, 0.9rem)" }}
          >
            Data Structures & Algorithms Club
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="font-medium italic mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "#c6a75e", fontSize: "clamp(1.15rem, 2.5vw, 1.6rem)" }}
          >
            Learn. Build. Elevate.
          </motion.p>

          {/* Diamond separator */}
          <motion.div variants={fadeUp} className="mb-4" style={{ color: "#c6a75e", opacity: 0.5, fontSize: "0.5rem", letterSpacing: "1em" }}>
            ✦ ✦ ✦
          </motion.div>

          {/* Supporting Text */}
          <motion.p
            variants={fadeUp}
            className="leading-relaxed max-w-xl mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#7a7060", fontSize: "clamp(0.85rem, 1.4vw, 1rem)" }}
          >
            Your gateway to mastering problem-solving, collaborative coding, and
            building a strong technical mindset — together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <Link href="/about">
              <motion.button
                className="px-7 py-3.5 rounded-full text-sm font-semibold text-white cursor-pointer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "linear-gradient(135deg, #c6a75e 0%, #a8893d 100%)",
                  boxShadow: "0 4px 20px rgba(198,167,94,0.2)",
                  letterSpacing: "0.05em",
                  transition: "all 0.3s ease",
                }}
                whileHover={{ boxShadow: "0 8px 36px rgba(198,167,94,0.35)", y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Learn More
              </motion.button>
            </Link>
            <Link href="/events">
              <motion.button
                className="px-7 py-3.5 rounded-full text-sm font-semibold cursor-pointer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#8a7a5e",
                  letterSpacing: "0.05em",
                  border: "1.5px solid rgba(198,167,94,0.18)",
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                }}
                whileHover={{ borderColor: "rgba(198,167,94,0.45)", background: "rgba(198,167,94,0.08)", y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Events
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
        <motion.div className="w-5 h-9 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: "rgba(30,25,20,0.15)" }} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          <motion.div className="w-1 h-2 rounded-full" style={{ backgroundColor: "rgba(30,25,20,0.3)" }} animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

