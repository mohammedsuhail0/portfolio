import { ParticleTextEffect } from "./particle-text-effect"

export default function Demo() {
  const suhailWords = [
    "WELCOME",
    "FULL-STACK",
    "AI SYSTEMS",
    "SUHAIL"
  ]

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      <ParticleTextEffect words={suhailWords} isPreloader={false} />
    </div>
  )
}
