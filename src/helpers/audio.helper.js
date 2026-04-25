import gameMusicPath from '../assets/gameMusic.mp3'

let backgroundMusic = null
let isMuted = false
let audioContext = null

function getAudioContext() {
   if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
   }
   return audioContext
}

export function playBackgroundMusic() {
   if (backgroundMusic) return
   backgroundMusic = new Audio(gameMusicPath)
   backgroundMusic.loop = true
   backgroundMusic.volume = 0.3
   backgroundMusic.play().catch(() => {})
}

export function stopBackgroundMusic() {
   if (backgroundMusic) {
      backgroundMusic.pause()
      backgroundMusic = null
   }
}

export function toggleMute() {
   isMuted = !isMuted
   if (backgroundMusic) {
      backgroundMusic.muted = isMuted
   }
   const btn = document.querySelector('#mute-btn')
   if (btn) {
      btn.textContent = isMuted ? '🔇' : '🔊'
   }
}

export function playSound(type) {
   if (isMuted) return

   const ctx = getAudioContext()
   const gain = ctx.createGain()
   gain.connect(ctx.destination)

   const now = ctx.currentTime

   switch (type) {
      case 'fire_shot': {
         const osc = ctx.createOscillator()
         osc.connect(gain)
         osc.type = 'sawtooth'
         osc.frequency.setValueAtTime(150, now)
         osc.frequency.exponentialRampToValueAtTime(50, now + 0.15)
         gain.gain.setValueAtTime(0.3, now)
         gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
         osc.start(now)
         osc.stop(now + 0.15)
         break
      }
      case 'shot_hit': {
         const osc = ctx.createOscillator()
         osc.connect(gain)
         osc.type = 'square'
         osc.frequency.setValueAtTime(880, now)
         osc.frequency.setValueAtTime(440, now + 0.05)
         gain.gain.setValueAtTime(0.2, now)
         gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
         osc.start(now)
         osc.stop(now + 0.2)
         break
      }
      case 'shot_miss': {
         const osc = ctx.createOscillator()
         osc.connect(gain)
         osc.type = 'sine'
         osc.frequency.setValueAtTime(220, now)
         osc.frequency.exponentialRampToValueAtTime(110, now + 0.3)
         gain.gain.setValueAtTime(0.15, now)
         gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
         osc.start(now)
         osc.stop(now + 0.3)
         break
      }
   }
}
