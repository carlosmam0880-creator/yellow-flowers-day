"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Lily } from "@/components/lily"
import { petalMessages } from "@/lib/messages"

type Popup = {
  index: number
  x: number
  y: number
} | null

export function FlowerDisplay() {
  const [popup, setPopup] = useState<Popup>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Three lilies, each owning 6 consecutive message indices.
  const lilies = [
    { indices: [0, 1, 2, 3, 4, 5], size: "w-[62vw] max-w-[420px]" },
    { indices: [6, 7, 8, 9, 10, 11], size: "w-[40vw] max-w-[260px]" },
    { indices: [12, 13, 14, 15, 16, 17], size: "w-[40vw] max-w-[260px]" },
  ]

  const activate = useCallback(
    (index: number, event: React.SyntheticEvent) => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      const rect = containerRef.current?.getBoundingClientRect()
      // Derive a point from the triggering element.
      const target = event.currentTarget as Element
      const tRect = target.getBoundingClientRect()
      const baseX = tRect.left + tRect.width / 2
      const baseY = tRect.top + tRect.height / 2
      const x = rect ? baseX - rect.left : baseX
      const y = rect ? baseY - rect.top : baseY
      setPopup({ index, x, y })
    },
    [],
  )

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setPopup(null), 400)
  }, [])

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  // Clamp popup within container width.
  const containerWidth = containerRef.current?.clientWidth ?? 0
  const clampedX = popup
    ? Math.min(Math.max(popup.x, 130), Math.max(containerWidth - 130, 130))
    : 0

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-center"
      onMouseLeave={scheduleHide}
    >
      <div className="relative flex flex-col items-center">
        {/* Main lily */}
        <Lily
          messageIndices={lilies[0].indices}
          activeIndex={popup?.index ?? null}
          onPetalActivate={activate}
          className={`${lilies[0].size} drop-shadow-[0_0_40px_rgba(255,214,89,0.25)]`}
        />
        {/* Two supporting lilies */}
        <div className="-mt-10 flex items-start justify-center gap-2 sm:-mt-16 sm:gap-6">
          <Lily
            messageIndices={lilies[1].indices}
            activeIndex={popup?.index ?? null}
            onPetalActivate={activate}
            className={`${lilies[1].size} -rotate-12 drop-shadow-[0_0_30px_rgba(255,214,89,0.2)]`}
          />
          <Lily
            messageIndices={lilies[2].indices}
            activeIndex={popup?.index ?? null}
            onPetalActivate={activate}
            className={`${lilies[2].size} rotate-12 drop-shadow-[0_0_30px_rgba(255,214,89,0.2)]`}
          />
        </div>
      </div>

      {/* Floating message popup */}
      {popup && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full"
          style={{ left: clampedX, top: Math.max(popup.y - 16, 8) }}
        >
          <div className="animate-message-in relative max-w-[240px] rounded-2xl border border-yellow-300/30 bg-[#1a1712]/95 px-5 py-4 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:max-w-[280px]">
            <p className="font-serif text-sm leading-relaxed text-yellow-100 sm:text-base text-pretty">
              {petalMessages[popup.index]}
            </p>
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-full -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-[#1a1712]/95"
            />
          </div>
        </div>
      )}
    </div>
  )
}
