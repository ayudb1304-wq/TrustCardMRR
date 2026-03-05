'use client';

import React, { useEffect, useId, useRef } from 'react';

type Metal = 'gold' | 'silver' | 'bronze' | 'platinum';

export type MetallicBusinessCardProps = {
  name?: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoSrc?: string;
  logoAlt?: string;
  badge?: React.ReactNode;

  metal?: Metal;
  width?: number;
  radius?: number;
  maxRotation?: number;
  influenceRadius?: number;
  ease?: number;
  lightFollow?: number;
  mode?: 'light' | 'dark' | 'system';

  compact?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
};

const METAL_BG: Record<Metal, string> = {
  gold: '#ffcc70',
  silver: '#dddde0',
  bronze: '#df9070',
  platinum: '#ffffff',
};

// Metal-aware ink/glow tokens (picked to contrast each finish)
const METAL_TOKENS: Record<
  Metal,
  { ink: string; sub: string; glow1: string; glow2: string }
> = {
  gold: {
    ink: 'oklch(0.22 0.06 70)',     // deep warm ink
    sub: 'oklch(0.38 0.03 70)',     // softer warm
    glow1: 'rgba(255, 215, 170, .55)',
    glow2: 'rgba(255, 235, 200, .28)',
  },
  bronze: {
    ink: 'oklch(0.20 0.06 45)',
    sub: 'oklch(0.36 0.03 45)',
    glow1: 'rgba(255, 200, 165, .52)',
    glow2: 'rgba(255, 215, 185, .26)',
  },
  silver: {
    ink: 'oklch(0.16 0 240)',       // neutral charcoal
    sub: 'oklch(0.40 0 240)',
    glow1: 'rgba(255, 255, 255, .46)',
    glow2: 'rgba(245, 245, 255, .22)',
  },
  platinum: {
    ink: 'oklch(0.15 0 250)',
    sub: 'oklch(0.38 0 250)',
    glow1: 'rgba(255, 255, 255, .42)',
    glow2: 'rgba(235, 240, 255, .2)',
  },
};

export default function MetallicBusinessCard({
  name = 'Rahil Vahora',
  role = 'Software Developer',
  company = 'ABCD',
  email = 'rahilisvahora@gmail.com',
  phone,
  website,
  logoSrc,
  logoAlt = 'Logo',
  badge,

  metal = 'silver',
  width = 420,
  radius = 16,
  maxRotation = 40,
  influenceRadius = 500,
  ease = 0.08,
  lightFollow = 0.4,
  mode = 'system',

  compact = false,
  align = 'left',
  className = '',
}: MetallicBusinessCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const reactId = useId();
  const safeId = reactId.replace(/:/g, '');
  const ids = { noise: `noiseFilter-${safeId}` };

  const current = useRef({ angle: 0, x: 0, y: 0 });
  const target = useRef({ angle: 0, x: 0, y: 0 });
  const currentG = useRef({ x: 50, y: 50 });
  const targetG = useRef({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const applyVars = () => {
    const host = wrapRef.current;
    if (!host) return;
    host.style.setProperty('--gradient-rotation', `${current.current.angle}deg`);
    host.style.setProperty('--rotate-x', `${current.current.x}deg`);
    host.style.setProperty('--rotate-y', `${current.current.y}deg`);
    host.style.setProperty('--gradient-position-x', `${currentG.current.x}%`);
    host.style.setProperty('--gradient-position-y', `${currentG.current.y}%`);
  };

  const tick = () => {
    const t = ease;
    current.current.angle = lerp(current.current.angle, target.current.angle, t);
    current.current.x = lerp(current.current.x, target.current.x, t);
    current.current.y = lerp(current.current.y, target.current.y, t);
    currentG.current.x = lerp(currentG.current.x, targetG.current.x, t);
    currentG.current.y = lerp(currentG.current.y, targetG.current.y, t);
    applyVars();
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease]);

  const resetTargets = () => {
    target.current = { angle: 0, x: 0, y: 0 };
    targetG.current = { x: 50, y: 50 };
  };

  const handlePointer = (e: React.PointerEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const inRange = dist < influenceRadius;
    const mult = Math.max(0.1, 1 - Math.min(1, dist / influenceRadius));

    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (inRange) {
      targetG.current.x = 50 - (nx - 0.5) * 100 * lightFollow;
      targetG.current.y = 50 - (ny - 0.5) * 100 * lightFollow;

      target.current.y = (nx - 0.5) * maxRotation * 2 * mult;
      target.current.x = (0.5 - ny) * maxRotation * 2 * mult;

      const angleTop = 120 * (1 - nx);
      const angleBottom = 120 * nx;
      target.current.angle = (angleTop * (1 - ny) + angleBottom * ny) * mult;
    } else {
      target.current.angle = 0;
    }
  };

  const wrapMode = mode === 'system' ? undefined : (mode as 'light' | 'dark');

  const height = Math.round(width / 1.586);
  const alignCss =
    align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  const textAlign =
    align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';

  const titleId = `card-title-${safeId}`;

  const ink = METAL_TOKENS[metal];

  return (
    <div
      ref={wrapRef}
      data-theme={wrapMode}
      className={['metal-wrap', className].join(' ')}
      style={
        {
          '--bg-card': METAL_BG[metal],
          '--border-radius': `${radius}px`,
          '--noise-filter': `url(#${ids.noise})`,
          '--ink': ink.ink,
          '--ink-sub': ink.sub,
          '--glow-1': ink.glow1,
          '--glow-2': ink.glow2,
        } as React.CSSProperties
      }
      role="region"
      aria-labelledby={titleId}
    >
      {/* unique SVG noise filter */}
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <filter
          id={ids.noise}
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.3"
            numOctaves="4"
            seed="15"
            stitchTiles="stitch"
            result="turbulence"
          />
          <feSpecularLighting
            surfaceScale="1"
            specularConstant="1.8"
            specularExponent="10"
            lightingColor="#7957A8"
            in="turbulence"
            result="specularLighting"
          >
            <feDistantLight azimuth="3" elevation="50" />
          </feSpecularLighting>
          <feColorMatrix
            type="saturate"
            values="0"
            in="specularLighting"
            result="colormatrix"
          />
        </filter>
      </svg>

      <div
        ref={cardRef}
        className="card"
        style={{ width, height }}
        onPointerMove={handlePointer}
        onPointerLeave={resetTargets}
        onBlur={resetTargets}
      >
        {/* content layer */}
        <div
          className={['content', compact ? 'compact' : ''].join(' ')}
          style={{ alignItems: alignCss, textAlign }}
        >
          {badge ? <div className="badge-slot">{badge}</div> : null}

          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt}
              className="logo"
              aria-hidden={logoAlt ? undefined : true}
            />
          ) : null}

          <div className="text-block">
            <h3 id={titleId} className="name">
              {name}
            </h3>
            {role ? <p className="role">{role}</p> : null}
            {company ? <p className="company">{company}</p> : null}
          </div>

          {(email || phone || website) && (
            <div className="contact">
              {email ? (
                <p className="item" aria-label={`Email ${email}`}>
                  {email}
                </p>
              ) : null}
              {phone ? (
                <p className="item" aria-label={`Phone ${phone}`}>
                  {phone}
                </p>
              ) : null}
              {website ? (
                <p className="item" aria-label={`Website ${website}`}>
                  {website}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .metal-wrap {
          --gradient-rotation: 0deg;
          --gradient-position-x: 50%;
          --gradient-position-y: 50%;
          --rotate-x: 0deg;
          --rotate-y: 0deg;
          display: grid;
          place-items: center;
          color-scheme: light dark;
          font-family: var(--font-playwrite-nz), ui-sans-serif, system-ui,
            Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji',
            'Segoe UI Emoji';
        }
        .metal-wrap[data-theme='dark'] {
          background: #000;
        }
        .metal-wrap[data-theme='light'] {
          background: #fff;
        }

        .card {
          position: relative;
          border-radius: var(--border-radius);
          transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out, box-shadow 0.2s ease-out;
          overflow: hidden;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.25),
            inset -1px -1px 2px rgba(0, 0, 0, 0.3),
            inset 1px 1px 2px rgba(255, 255, 255, 0.3);
          background:
            radial-gradient(
              ellipse 160% 120% at var(--gradient-position-x)
                var(--gradient-position-y),
              transparent 0%,
              rgba(0, 0, 0, 1) 100%
            ),
            conic-gradient(
              from var(--gradient-rotation) at 50% 50%,
              rgba(0, 0, 0, 0.6) -120deg,
              rgba(255, 255, 255, 0.4) 9deg,
              rgba(0, 0, 0, 0.4) 60deg,
              rgba(0, 0, 0, 0.06) 107deg,
              rgba(0, 0, 0, 0.3) 131deg,
              rgba(0, 0, 0, 0) 188deg,
              rgba(0, 0, 0, 0.6) 240deg,
              rgba(255, 255, 255, 0.4) 367deg
            ),
            var(--bg-card);
        }
        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--border-radius);
          filter: var(--noise-filter);
          opacity: 0.25;
          z-index: 1;
        }
        .card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--border-radius);
          background: var(--bg-card);
          mix-blend-mode: color;
          z-index: 2;
        }

        /* content layer */
        .content {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: grid;
          grid-template-rows: 1fr auto auto;
          gap: 0.45rem;
          padding: 1.1rem 1.25rem;
          /* readable ink on reflective bg */
          color: var(--ink);
          text-shadow:
            0 1px 0 rgba(255, 255, 255, 0.30),
            0 8px 22px var(--glow-1),
            0 2px 10px var(--glow-2);
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        :global([data-theme='dark']) .content {
          /* nudge contrast in dark canvas */
          text-shadow:
            0 1px 0 rgba(255, 255, 255, 0.22),
            0 10px 26px var(--glow-1),
            0 3px 12px var(--glow-2);
        }

        /* glass panel for readability */
        .content::before {
          content: '';
          position: absolute;
          inset: 0.6rem;
          border-radius: calc(var(--border-radius) - 8px);
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.02)
            ),
            radial-gradient(
              80% 40% at 50% 0%,
              rgba(255, 255, 255, 0.06),
              transparent 60%
            );
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(2px) saturate(1.07);
          z-index: -1;
        }
        .content.compact {
          padding: 0.6rem 0.75rem;
          gap: 0.25rem;
        }
        .content.compact .name {
          font-size: 0.72rem;
          line-height: 1.1;
        }
        .content.compact .role {
          font-size: 0.6rem;
          line-height: 1.15;
        }
        .content.compact .company {
          font-size: 0.56rem;
          line-height: 1.1;
        }
        .content.compact .contact {
          font-size: 0.5rem;
          gap: 0.08rem;
        }
        .content.compact .contact .item:last-child {
          font-size: 0.44rem;
        }

        .badge-slot {
          position: absolute;
          top: 0.7rem;
          left: 0.8rem;
          z-index: 4;
          line-height: 1;
        }
        .content.compact .badge-slot {
          top: 0.4rem;
          left: 0.5rem;
        }

        .logo {
          position: absolute;
          top: 0.9rem;
          right: 0.9rem;
          height: 28px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.35));
          pointer-events: none;
        }
        .content.compact .logo {
          top: 0.6rem;
          right: 0.6rem;
          height: 22px;
        }

        .text-block {
          align-self: end;
          display: grid;
          gap: 0.15rem;
        }

        /* Name: slightly heavier with subtle stroke for metals */
        .name {
          margin: 0;
          font-weight: 800;
          letter-spacing: 0.01em;
          line-height: 1.12;
          font-size: clamp(1.05rem, 0.9rem + 0.6vw, 1.25rem);
          color: var(--ink);
          /* subtle outline for bright metals */
          -webkit-text-stroke: 0.25px rgba(0, 0, 0, 0.25);
        }

        .role {
          margin: 0.05rem 0 0 0;
          color: var(--ink);
          font-weight: 800;
          letter-spacing: 0.02em;
          line-height: 1.25;
          font-size: 0.92rem;
          
        }

        .company {
          margin: 0.1rem 0 0 0;
          color: var(--ink);
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.01em;
          line-height: 1.18;
          font-variant-caps: all-small-caps;
        }

        .contact {
          align-self: end;
          display: grid;
          gap: 0.14rem;
          color: var(--ink);
          font-size: 0.80rem;
          letter-spacing: 0.015em;
          font-weight: 700;
        }
        .contact .item {
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .contact .item:last-child {
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          font-size: 0.72rem;
          text-transform: uppercase;
          opacity: 0.75;
        }

        /* alignment helpers */
        .content {
          justify-items: ${alignCss};
        }
        .text-block,
        .contact {
          text-align: ${textAlign};
        }
      `}</style>
    </div>
  );
}

export { MetallicBusinessCard };
