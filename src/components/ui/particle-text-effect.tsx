import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 50
  maxSpeed = 8.0
  maxForce = 0.65
  particleSize = 2.0
  isKilled = false

  startColor = { r: 129, g: 140, b: 248 }
  targetColor = { r: 129, g: 140, b: 248 }
  colorWeight = 0
  colorBlendRate = 0.03

  move() {
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const dSq = dx * dx + dy * dy
    
    // Once settled, sleep to save CPU/GPU cycles
    if (dSq < 0.3 && Math.abs(this.vel.x) < 0.05 && Math.abs(this.vel.y) < 0.05) {
      this.pos.x = this.target.x
      this.pos.y = this.target.y
      this.vel.x = 0
      this.vel.y = 0
      return
    }

    const distance = Math.sqrt(dSq)
    let proximityMult = 1

    if (distance < this.closeEnoughTarget) {
      proximityMult = Math.max(0.12, distance / this.closeEnoughTarget)
    }

    if (distance > 0) {
      const desiredX = (dx / distance) * this.maxSpeed * proximityMult
      const desiredY = (dy / distance) * this.maxSpeed * proximityMult

      const steerX = (desiredX - this.vel.x) * 0.1
      const steerY = (desiredY - this.vel.y) * 0.1

      this.acc.x += steerX
      this.acc.y += steerY
    }

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.vel.x *= 0.92
    this.vel.y *= 0.92

    this.pos.x += this.vel.x
    this.pos.y += this.vel.y

    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight)
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight)
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight)

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(this.pos.x, this.pos.y, this.particleSize, this.particleSize)
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      this.target.x = Math.random() > 0.5 ? width + 40 : -40
      this.target.y = Math.random() * height

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0

      this.isKilled = true
    }
  }
}

interface ParticleTextEffectProps {
  words?: string[]
  className?: string
  onComplete?: () => void
  onWarpStart?: () => void
  isPreloader?: boolean
}

// WELCOME is first and SUHAIL is last as requested
const DEFAULT_WORDS = ["WELCOME", "FULL-STACK", "AI SYSTEMS", "SUHAIL"]

export function ParticleTextEffect({ 
  words = DEFAULT_WORDS,
  className = "",
  onComplete,
  onWarpStart,
  isPreloader = true
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const frameCountRef = useRef(0)
  const wordIndexRef = useRef(0)
  const completedRef = useRef(false)
  const isWarpingRef = useRef(false)
  const warpProgressRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false })

  const pixelSteps = 3

  const nextWord = (word: string, canvas: HTMLCanvasElement) => {
    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement("canvas")
    }
    const offscreen = offscreenRef.current
    const offscreenCtx = offscreen.getContext("2d", { willReadFrequently: true })
    if (!offscreenCtx) return

    // Clean responsive font sizing
    const isMobile = canvas.width < 768
    const baseFontSize = isMobile
      ? Math.min(canvas.width / (word.length * 0.72), 68)
      : Math.min(canvas.width / (word.length * 0.68), canvas.height / 3.2, 115)

    const fontStr = `900 ${Math.round(baseFontSize)}px Arial, sans-serif`
    offscreenCtx.font = fontStr

    // Compute bounding box for text only (avoids scanning millions of empty pixels!)
    const metrics = offscreenCtx.measureText(word)
    const textWidth = Math.ceil(metrics.width) + 30
    const textHeight = Math.ceil(baseFontSize * 1.3) + 30

    offscreen.width = textWidth
    offscreen.height = textHeight

    offscreenCtx.font = fontStr
    offscreenCtx.fillStyle = "white"
    offscreenCtx.textAlign = "center"
    offscreenCtx.textBaseline = "middle"
    offscreenCtx.fillText(word, textWidth / 2, textHeight / 2)

    const imgData = offscreenCtx.getImageData(0, 0, textWidth, textHeight)
    const data = imgData.data

    const offsetX = Math.floor((canvas.width - textWidth) / 2)
    const offsetY = Math.floor((canvas.height - textHeight) / 2)

    // Palette per word
    const colorPalette = [
      { r: 129, g: 140, b: 248 }, // Electric Indigo (#818cf8) for WELCOME
      { r: 168, g: 85, b: 247 },  // Cyber Violet (#a855f7) for FULL-STACK
      { r: 45, g: 212, b: 191 },  // Neon Teal (#2dd4bf) for AI SYSTEMS
      { r: 56, g: 189, b: 248 },  // Electric Cyan (#38bdf8) for SUHAIL
    ]
    const newColor = colorPalette[wordIndexRef.current % colorPalette.length]

    // Collect ONLY the actual text coordinates
    const targets: Vector2D[] = []
    for (let y = 0; y < textHeight; y += pixelSteps) {
      for (let x = 0; x < textWidth; x += pixelSteps) {
        const idx = (y * textWidth + x) * 4
        if (data[idx + 3] > 70) {
          targets.push({ x: offsetX + x, y: offsetY + y })
        }
      }
    }

    // Fast randomized shuffle
    for (let i = targets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = targets[i]
      targets[i] = targets[j]
      targets[j] = temp
    }

    const particles = particlesRef.current
    const isFirstRun = particles.length === 0

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      let p: Particle

      if (i < particles.length) {
        p = particles[i]
        p.isKilled = false
        p.target.x = target.x
        p.target.y = target.y
      } else {
        p = new Particle()
        if (isFirstRun) {
          // Soft atmospheric halo spawn around the word for instantaneous 60fps start
          const angle = Math.random() * Math.PI * 2
          const dist = Math.random() * 220 + 40
          p.pos.x = target.x + Math.cos(angle) * dist
          p.pos.y = target.y + Math.sin(angle) * dist
        } else {
          p.pos.x = Math.random() * canvas.width
          p.pos.y = Math.random() * canvas.height
        }
        p.target.x = target.x
        p.target.y = target.y
        particles.push(p)
      }

      p.startColor = {
        r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
        g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
        b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
      }
      p.targetColor = newColor
      p.colorWeight = 0
    }

    // Kill surplus particles
    for (let i = targets.length; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height)
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const particles = particlesRef.current

    // Pure black background with subtle motion trail for smooth movement
    ctx.fillStyle = "rgba(0, 0, 0, 0.16)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const isWarping = isWarpingRef.current
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    if (isWarping) {
      warpProgressRef.current += 0.022
      const warpProg = warpProgressRef.current
      const maxDim = Math.max(canvas.width, canvas.height)

      // Expanding electric cyan shockwave ring connecting SUHAIL to Hero
      const ringRadius = warpProg * (maxDim * 0.72)
      const ringAlpha = Math.max(0, 1 - warpProg * 1.08)

      if (ringAlpha > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha * 0.85})`
        ctx.lineWidth = Math.max(1.5, 14 * (1 - warpProg * 0.75))
        ctx.shadowColor = "#38bdf8"
        ctx.shadowBlur = 28
        ctx.stroke()

        // Inner harmonic ring
        if (warpProg > 0.08) {
          ctx.beginPath()
          ctx.arc(cx, cy, ringRadius * 0.65, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(168, 85, 247, ${ringAlpha * 0.45})`
          ctx.lineWidth = Math.max(1, 6 * (1 - warpProg))
          ctx.shadowColor = "#a855f7"
          ctx.shadowBlur = 16
          ctx.stroke()
        }
        ctx.restore()
      }

      // Signal completion ~220ms into warp so hero components materialize through shockwave
      if (warpProg >= 0.32 && !completedRef.current) {
        completedRef.current = true
        if (onComplete) {
          onComplete()
        }
      }

      // Disperse complete
      if (warpProg >= 1.0) {
        return
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]

      if (isWarping) {
        const dx = particle.pos.x - cx
        const dy = particle.pos.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const warpProg = warpProgressRef.current
        const push = 1.6 + warpProg * 8.5

        particle.vel.x += (dx / dist) * push
        particle.vel.y += (dy / dist) * push
        particle.pos.x += particle.vel.x
        particle.pos.y += particle.vel.y

        // Render luminous speed streak in direction of hyperspace motion
        const speed = Math.sqrt(particle.vel.x * particle.vel.x + particle.vel.y * particle.vel.y)
        const streakLen = Math.min(speed * 2.8, 120)
        const streakAlpha = Math.max(0, 1 - warpProg * 0.85)

        ctx.strokeStyle = `rgba(56, 189, 248, ${streakAlpha})`
        ctx.lineWidth = Math.max(1.2, particle.particleSize * 0.75)
        ctx.beginPath()
        ctx.moveTo(particle.pos.x, particle.pos.y)
        ctx.lineTo(
          particle.pos.x - (particle.vel.x / (speed || 1)) * streakLen,
          particle.pos.y - (particle.vel.y / (speed || 1)) * streakLen
        )
        ctx.stroke()
        continue
      }

      particle.move()
      particle.draw(ctx)

      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1)
        }
      }
    }

    // Smooth interactive scatter on cursor interaction
    if (!isWarping && mouseRef.current.isPressed) {
      particles.forEach((particle) => {
        const dx = particle.pos.x - mouseRef.current.x
        const dy = particle.pos.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 120 && distance > 0) {
          particle.vel.x += (dx / distance) * 7.5
          particle.vel.y += (dy / distance) * 7.5
        }
      })
    }

    // Slow, comfortable word transitions (~210 frames ~3.5 seconds per word)
    if (!isWarping) {
      frameCountRef.current++
      if (frameCountRef.current % 210 === 0) {
        const nextIdx = wordIndexRef.current + 1
        if (nextIdx >= words.length) {
          // Completed cycling through all words (finishing on SUHAIL)!
          if (!isWarpingRef.current) {
            isWarpingRef.current = true
            if (onWarpStart) {
              onWarpStart()
            }
          }
        } else {
          wordIndexRef.current = nextIdx
          nextWord(words[wordIndexRef.current], canvas)
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (words[wordIndexRef.current]) {
        nextWord(words[wordIndexRef.current], canvas)
      }
    }

    updateSize()
    animate()

    const handleResize = () => {
      updateSize()
    }

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.isPressed = true
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current.isPressed = false
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [words])

  return (
    <div 
      className={`particle-fullscreen-preloader ${className}`}
      style={{
        position: isPreloader ? "fixed" : "relative",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000000",
        overflow: "hidden",
        zIndex: 999999,
        cursor: "default",
        userSelect: "none"
      }}
      onClick={() => {
        // Clicking anywhere acts as an instant skip if desired
        if (onComplete && !completedRef.current) {
          completedRef.current = true
          onComplete()
        }
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%", 
          height: "100%",
          display: "block",
          backgroundColor: "#000000"
        }}
      />
    </div>
  )
}

export default ParticleTextEffect
