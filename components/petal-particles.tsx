"use client"

import { useEffect, useRef } from "react"

type Petal = {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  rotation: number
  rotationSpeed: number
  sway: number
  swaySpeed: number
  opacity: number
  hue: number
}

const PETAL_COLORS = [
  { h: 48, s: 96, l: 62 }, // golden yellow
  { h: 45, s: 93, l: 58 }, // amber
  { h: 52, s: 98, l: 68 }, // light yellow
  { h: 40, s: 90, l: 55 }, // deep gold
]

export function PetalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = 1
    let petals: Petal[] = []
    let animationId = 0

    const petalCount = () => {
      if (width < 640) return 14
      if (width < 1024) return 22
      return 32
    }

    const makePetal = (initial = false): Petal => {
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : -20 - Math.random() * height * 0.3,
        size: 8 + Math.random() * 14,
        speedY: 0.4 + Math.random() * 0.9,
        speedX: -0.3 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: -0.02 + Math.random() * 0.04,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.02,
        opacity: 0.35 + Math.random() * 0.45,
        hue: (color.h << 16) | (color.s << 8) | color.l,
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      petals = Array.from({ length: petalCount() }, () => makePetal(true))
    }

    const drawPetal = (p: Petal) => {
      const l = p.hue & 0xff
      const s = (p.hue >> 8) & 0xff
      const h = (p.hue >> 16) & 0xff
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity
      const grad = ctx.createLinearGradient(0, -p.size, 0, p.size)
      grad.addColorStop(0, `hsl(${h}, ${s}%, ${Math.min(l + 12, 85)}%)`)
      grad.addColorStop(1, `hsl(${h}, ${s}%, ${l}%)`)
      ctx.fillStyle = grad
      // simple petal shape
      ctx.beginPath()
      ctx.moveTo(0, -p.size)
      ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.4, p.size * 0.5, p.size * 0.6, 0, p.size)
      ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.6, -p.size * 0.6, -p.size * 0.4, 0, -p.size)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of petals) {
        p.sway += p.swaySpeed
        p.x += p.speedX + Math.sin(p.sway) * 0.5
        p.y += p.speedY
        p.rotation += p.rotationSpeed
        if (p.y - p.size > height) {
          Object.assign(p, makePetal(false))
        }
        if (p.x < -30) p.x = width + 30
        if (p.x > width + 30) p.x = -30
        drawPetal(p)
      }
      animationId = requestAnimationFrame(tick)
    }

    resize()
    if (prefersReduced) {
      // draw a single static frame, no animation loop
      for (const p of petals) drawPetal(p)
    } else {
      tick()
    }

    window.addEventListener("resize", resize)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10"
    />
  )
}
