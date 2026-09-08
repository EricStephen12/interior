/**
 * Web Audio API synthesizer for luxury admin notifications
 * Requires zero audio asset downloads and works instantaneously across all modern browsers.
 */

export function playCashChime() {
  if (typeof window === 'undefined') return

  // Check if sound is muted by admin preference
  const isMuted = localStorage.getItem('sg_admin_chime_muted') === 'true'
  if (isMuted) return

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    // Harmonic Cash Register "Ka-ching" (Dual Bell: E6 & G#6)
    const playNote = (freq: number, delay: number, duration: number, gainVal: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)

      // Fast attack, exponential decay for bell resonance
      gain.gain.setValueAtTime(0.001, ctx.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(gainVal, ctx.currentTime + delay + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + duration)
    }

    // First ding (1318.51 Hz - E6)
    playNote(1318.51, 0, 0.4, 0.15)
    // Higher chime second ding (1661.22 Hz - G#6)
    playNote(1661.22, 0.09, 0.7, 0.2)
    // Subtle high overtone (2637 Hz - E7)
    playNote(2637.02, 0.1, 0.6, 0.08)
  } catch (err) {
    console.warn('[Audio] Failed to synthesize chime:', err)
  }
}

export function isChimeMuted(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('sg_admin_chime_muted') === 'true'
}

export function toggleChimeMute(): boolean {
  if (typeof window === 'undefined') return false
  const current = isChimeMuted()
  const next = !current
  localStorage.setItem('sg_admin_chime_muted', next ? 'true' : 'false')
  if (!next) {
    // Play test chime when unmuting
    playCashChime()
  }
  return next
}
