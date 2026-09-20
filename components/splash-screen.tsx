"use client"

import { useState } from "react"

export function SplashScreen({
  onClaim,
  onFinished,
}: {
  onClaim: () => void
  onFinished: () => void
}) {
  const [leaving, setLeaving] = useState(false)

  const handleClaim = () => {
    // Fire immediately, inside the user gesture, so audio playback is allowed.
    onClaim()
    setLeaving(true)
    // Match the CSS fade-out duration before unmounting via parent.
    setTimeout(onFinished, 900)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-[900ms] ease-in-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(ellipse at center, #26221a 0%, #16130d 60%, #0e0c08 100%)",
      }}
    >
      <p className="animate-fade-up font-serif text-sm uppercase tracking-[0.35em] text-yellow-200/70">
        September 21st
      </p>

      <h1 className="animate-fade-up mt-6 max-w-2xl text-balance font-serif text-4xl italic leading-tight text-yellow-100 sm:text-5xl md:text-6xl [animation-delay:150ms]">
        Today is September 21st...
      </h1>

      <p className="animate-fade-up mt-5 max-w-md text-pretty text-base text-yellow-100/60 [animation-delay:300ms]">
        A little garden of yellow lilies, each petal holding a love message for you nini. Happy Yellow Flowers Day
      </p>

      <button
        type="button"
        onClick={handleClaim}
        className="animate-fade-up group relative mt-12 overflow-hidden rounded-full px-9 py-4 text-base font-medium text-[#1a1610] shadow-[0_0_40px_rgba(255,214,89,0.35)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/50 [animation-delay:500ms]"
      >
        <span
          aria-hidden="true"
          className="animate-glow-pulse absolute inset-0 rounded-full bg-gradient-to-b from-[#fff0a8] via-[#ffde59] to-[#f5b400]"
        />
        <span className="relative z-10">Claim my yellow flowers 💛</span>
      </button>
    </div>
  )
}
