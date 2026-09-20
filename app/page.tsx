"use client"

import { useRef, useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { FlowerDisplay } from "@/components/flower-display"
import { PetalParticles } from "@/components/petal-particles"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)
  const [entered, setEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleClaim = () => {
    setEntered(true)
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.6
      audio.play().catch(() => {
        // Autoplay may be blocked; the toggle button lets the user start it.
      })
    }
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#14110b] text-yellow-50">
      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,214,89,0.10), transparent 70%)",
        }}
      />

      {/* ==========================================================
          BACKGROUND MUSIC
          Replace the src below with your own audio file. Drop the
          file into the /public folder (e.g. /public/song.mp3) and
          set src="/song.mp3".
          ========================================================== */}
      <audio ref={audioRef} loop preload="auto" src="/background-music.mp3">
        Your browser does not support the audio element.
      </audio>

      <PetalParticles />

      {/* Main content */}
      <div
        className={`relative z-20 flex min-h-dvh flex-col items-center px-4 pb-16 pt-10 transition-opacity duration-1000 sm:pt-14 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      >
        <header className="animate-fade-up text-center [animation-delay:200ms]">
          <h1 className="mx-auto max-w-3xl text-balance font-serif text-3xl italic leading-tight text-yellow-100 sm:text-4xl md:text-5xl">
            For the love of my life nini on this September 21st
          </h1>
          <p className="animate-float-hint mt-4 text-pretty text-sm text-yellow-200/60 sm:text-base">
            Click on each petal to discover how much I love you
          </p>
        </header>

        <div className="mt-4 flex w-full flex-1 items-center justify-center sm:mt-8">
          <FlowerDisplay />
        </div>
      </div>

      {showSplash && (
        <SplashScreen onClaim={handleClaim} onFinished={() => setShowSplash(false)} />
      )}
    </main>
  )
}
