'use client';

import React, { useEffect, useId, useRef } from 'react';
import styles from './metallic-business-card.module.css';

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

const METAL_TOKENS: Record<
  Metal,
  { ink: string; sub: string; glow1: string; glow2: string }
> = {
  gold: {
    ink: 'oklch(0.22 0.06 70)',
    sub: 'oklch(0.38 0.03 70)',
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
    ink: 'oklch(0.16 0 240)',
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

  const contentClasses = [styles.content, compact ? styles.compact : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={wrapRef}
      data-theme={wrapMode}
      className={[styles.metalWrap, className].filter(Boolean).join(' ')}
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
        className={styles.card}
        style={{ width, height }}
        onPointerMove={handlePointer}
        onPointerLeave={resetTargets}
        onBlur={resetTargets}
      >
        <div
          className={contentClasses}
          style={{ alignItems: alignCss, textAlign, justifyItems: alignCss } as React.CSSProperties}
        >
          {badge ? <div className={styles.badgeSlot}>{badge}</div> : null}

          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt}
              className={styles.logo}
              aria-hidden={logoAlt ? undefined : true}
            />
          ) : null}

          <div className={styles.textBlock} style={{ textAlign }}>
            <h3 id={titleId} className={styles.name}>
              {name}
            </h3>
            {role ? <p className={styles.role}>{role}</p> : null}
            {company ? <p className={styles.company}>{company}</p> : null}
          </div>

          {(email || phone || website) && (
            <div className={styles.contact} style={{ textAlign }}>
              {email ? (
                <p className={styles.item} aria-label={`Email ${email}`}>
                  {email}
                </p>
              ) : null}
              {phone ? (
                <p className={styles.item} aria-label={`Phone ${phone}`}>
                  {phone}
                </p>
              ) : null}
              {website ? (
                <p className={styles.item} aria-label={`Website ${website}`}>
                  {website}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { MetallicBusinessCard };
