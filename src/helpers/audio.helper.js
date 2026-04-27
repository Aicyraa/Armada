import gameMusicPath from '../assets/gameMusic.mp3'

let backgroundMusic = null
let isMuted = false
let audioContext = null
let isMusicStarted = false

function getAudioContext() {
   if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
   }
   if (audioContext.state === 'suspended') {
      audioContext.resume()
   }
   return audioContext
}

export function playBackgroundMusic() {
   if (isMusicStarted) return
   isMusicStarted = true

   // Resume AudioContext if it exists
   if (audioContext) {
      getAudioContext()
   }

   if (backgroundMusic) return
   backgroundMusic = new Audio(gameMusicPath)
   backgroundMusic.loop = true
   backgroundMusic.volume = 0.3

   // Ensure AudioContext is ready
   getAudioContext()

   backgroundMusic.play().then(() => {
      console.log('Music started playing')
   }).catch(err => {
      console.log('Music playback failed:', err)
   })
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

   // Also mute AudioContext sounds
   if (audioContext) {
      audioContext.suspend().then(() => {
         if (!isMuted) audioContext.resume()
      })
   }

   const btn = document.querySelector('#mute-btn')
   if (btn) {
      btn.textContent = isMuted ? '🔇' : '🔊'
      btn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute')
   }

   console.log('Mute toggled:', isMuted)
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
