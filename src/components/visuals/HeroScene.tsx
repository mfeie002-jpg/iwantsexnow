import React, { useId } from "react";
import { PAL, ridgePath, scatter, uid } from "./art";

/**
 * Panoramic alpenglow scene used behind the home hero.
 * 1600x900 art, cropped with `slice` so it works from phone to ultrawide.
 */
export function HeroScene({ className, align = "xMidYMid" }: { className?: string; align?: string }) {
  const id = uid(useId());
  const W = 1600;
  const H = 900;
  const stars = scatter(2, 70, W, 360, 0.7, 1.9);
  const layers = [
    { seed: 3, base: 560, amp: 330, fill: `url(#${id}m1)`, o: 1 },
    { seed: 9, base: 640, amp: 250, fill: `url(#${id}m2)`, o: 1 },
    { seed: 15, base: 720, amp: 170, fill: `url(#${id}m3)`, o: 1 },
    { seed: 21, base: 790, amp: 90, fill: PAL.nacht, o: 1 },
  ];
  const streaks = Array.from({ length: 14 }, (_, i) => ({ y: 812 + i * 11, w: 420 - i * 22 + (i % 3) * 30 }));
  const cabin = [
    [1160, 780, 14, 18],
    [1190, 776, 12, 22],
    [1216, 782, 16, 16],
    [1248, 779, 10, 19],
  ];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={`${align} slice`}
      aria-hidden="true"
      focusable="false"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1738" />
          <stop offset="0.42" stopColor="#4a2a6e" />
          <stop offset="0.7" stopColor="#d4507a" />
          <stop offset="1" stopColor="#ffb067" />
        </linearGradient>
        <radialGradient id={`${id}sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff1cf" stopOpacity="1" />
          <stop offset="0.25" stopColor="#ffc47a" stopOpacity="0.7" />
          <stop offset="0.6" stopColor="#ff6b5e" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ff6b5e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}m1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffa9a0" />
          <stop offset="0.35" stopColor="#c0587f" />
          <stop offset="1" stopColor="#5a3070" />
        </linearGradient>
        <linearGradient id={`${id}m2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c0587f" />
          <stop offset="0.5" stopColor="#5a3070" />
          <stop offset="1" stopColor="#1f2755" />
        </linearGradient>
        <linearGradient id={`${id}m3`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2b66" />
          <stop offset="1" stopColor="#10224a" />
        </linearGradient>
        <linearGradient id={`${id}lake`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a3e6e" />
          <stop offset="0.5" stopColor="#2a2a5c" />
          <stop offset="1" stopColor="#07141a" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}sky)`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o * 0.75} />
      ))}
      <circle cx={1020} cy={640} r={520} fill={`url(#${id}sun)`} />
      <circle cx={1020} cy={640} r={74} fill="#fff1cf" opacity={0.96} />

      {layers.map((l, i) => (
        <path key={i} d={ridgePath(l.seed, W, 840, l.base, l.amp, 52)} fill={l.fill} opacity={l.o} />
      ))}

      <rect x={0} y={798} width={W} height={H - 798} fill={`url(#${id}lake)`} />
      {streaks.map((s, i) => (
        <rect key={i} x={1020 - s.w / 2} y={s.y} width={s.w} height={3} rx={1.5} fill="#ffd9a0" opacity={0.55 - i * 0.034} />
      ))}
      <rect x={0} y={797} width={W} height={2} fill="#fff" opacity={0.2} />

      <g>
        {cabin.map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={PAL.nacht} />
            <rect x={x + 3} y={y + 5} width={3.5} height={5} fill={PAL.bernstein} opacity={0.95} />
          </g>
        ))}
        <path d="M1154,782 L1167,768 L1180,782 Z M1184,778 L1196,762 L1208,778 Z M1212,784 L1224,772 L1236,784 Z" fill={PAL.nacht} />
      </g>
    </svg>
  );
}
