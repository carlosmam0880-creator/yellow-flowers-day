"use client"

import type React from "react"

type LilyProps = {
  /** Global message indices assigned to each of the 6 petals, in order. */
  messageIndices: number[]
  activeIndex: number | null
  onPetalActivate: (index: number, event: React.SyntheticEvent) => void
  className?: string
}

// A single lily petal path, tip pointing up, base at the origin (0,0).
const PETAL_PATH =
  "M0,0 C -20,-46 -26,-98 0,-140 C 26,-98 20,-46 0,0 Z"
const PETAL_VEIN = "M0,-6 C -4,-50 -3,-100 0,-134"

export function Lily({
  messageIndices,
  activeIndex,
  onPetalActivate,
  className,
}: LilyProps) {
  const petalCount = 6

  return (
    <svg
      viewBox="-170 -170 340 340"
      className={className}
      role="group"
      aria-label="Yellow lily with interactive petals"
    >
      <defs>
        <radialGradient id="petalGrad" cx="50%" cy="90%" r="90%">
          <stop offset="0%" stopColor="#fff6c9" />
          <stop offset="45%" stopColor="#ffde59" />
          <stop offset="100%" stopColor="#f0b400" />
        </radialGradient>
        <radialGradient id="petalGradActive" cx="50%" cy="90%" r="90%">
          <stop offset="0%" stopColor="#fffbe6" />
          <stop offset="40%" stopColor="#ffe97a" />
          <stop offset="100%" stopColor="#ffc61a" />
        </radialGradient>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff2b0" />
          <stop offset="100%" stopColor="#e88f00" />
        </radialGradient>
      </defs>

      {/* Petals */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (360 / petalCount) * i
        const globalIndex = messageIndices[i]
        const isActive = activeIndex === globalIndex
        return (
          <g
            key={i}
            transform={`rotate(${angle})`}
            className="lily-petal"
            data-active={isActive || undefined}
            role="button"
            tabIndex={0}
            aria-label={`Petal ${i + 1} — reveal a love message`}
            onClick={(e) => onPetalActivate(globalIndex, e)}
            onMouseEnter={(e) => onPetalActivate(globalIndex, e)}
            onFocus={(e) => onPetalActivate(globalIndex, e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onPetalActivate(globalIndex, e)
              }
            }}
          >
            <path
              d={PETAL_PATH}
              fill={isActive ? "url(#petalGradActive)" : "url(#petalGrad)"}
              stroke="#c98a00"
              strokeWidth={1}
              strokeOpacity={0.35}
            />
            <path
              d={PETAL_VEIN}
              fill="none"
              stroke="#d19700"
              strokeWidth={1.2}
              strokeOpacity={0.4}
            />
            {/* freckle detail typical of lilies */}
            <circle cx={-5} cy={-42} r={1.6} fill="#d97a00" opacity={0.5} />
            <circle cx={4} cy={-58} r={1.4} fill="#d97a00" opacity={0.5} />
            <circle cx={-3} cy={-74} r={1.2} fill="#d97a00" opacity={0.4} />
          </g>
        )
      })}

      {/* Stamens */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (360 / 6) * i + 30
        return (
          <g key={`stamen-${i}`} transform={`rotate(${angle})`}>
            <path
              d="M0,0 C 3,-18 2,-34 0,-46"
              fill="none"
              stroke="#e6a100"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <ellipse cx={0} cy={-50} rx={4} ry={7} fill="#b45f00" />
          </g>
        )
      })}

      {/* Flower center */}
      <circle cx={0} cy={0} r={14} fill="url(#centerGrad)" />
      <circle cx={0} cy={0} r={6} fill="#c96f00" opacity={0.8} />
    </svg>
  )
}
