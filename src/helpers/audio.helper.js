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
         // Cannon-like explosion sound
         const osc = ctx.createOscillator()
         const noise = createNoiseBuffer(ctx)
         const noiseGain = ctx.createGain()
         noiseGain.connect(ctx.destination)

         osc.connect(gain)
         osc.type = 'sawtooth'
         osc.frequency.setValueAtTime(120, now)
         osc.frequency.exponentialRampToValueAtTime(40, now + 0.2)

         // Add noise burst for explosion effect
         const noiseNode = ctx.createBufferSource()
         noiseNode.buffer = noise
         noiseNode.connect(noiseGain)
         noiseGain.gain.setValueAtTime(0.4, now)
         noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
         noiseNode.start(now)
         noiseNode.stop(now + 0.2)

         gain.gain.setValueAtTime(0.4, now)
         gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
         osc.start(now)
         osc.stop(now + 0.2)
         break
      }
      case 'shot_hit': {
         // Metallic impact with explosion
         const osc = ctx.createOscillator()
         const noise = createNoiseBuffer(ctx)
         const noiseGain = ctx.createGain()
         noiseGain.connect(ctx.destination)

         osc.connect(gain)
         osc.type = 'square'
         osc.frequency.setValueAtTime(600, now)
         osc.frequency.exponentialRampToValueAtTime(150, now + 0.15)

         // Sharp noise burst for impact
         const noiseNode = ctx.createBufferSource()
         noiseNode.buffer = noise
         noiseNode.connect(noiseGain)
         noiseGain.gain.setValueAtTime(0.5, now)
         noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
         noiseNode.start(now)
         noiseNode.stop(now + 0.15)

         gain.gain.setValueAtTime(0.3, now)
         gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
         osc.start(now)
         osc.stop(now + 0.2)
         break
      }
      case 'shot_miss': {
         // Water splash sound
         const noise = createNoiseBuffer(ctx)
         const noiseGain = ctx.createGain()
         noiseGain.connect(ctx.destination)

         const noiseNode = ctx.createBufferSource()
         noiseNode.buffer = noise

         // Filter for water-like sound
         const filter = ctx.createBiquadFilter()
         filter.type = 'bandpass'
         filter.frequency.setValueAtTime(800, now)
         filter.Q.value = 0.5

         noiseNode.connect(filter)
         filter.connect(noiseGain)

         noiseGain.gain.setValueAtTime(0.25, now)
         noiseGain.gain.linearRampToValueAtTime(0.3, now + 0.1)
         noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

         noiseNode.start(now)
         noiseNode.stop(now + 0.4)
         break
      }
   }
}

function createNoiseBuffer(ctx) {
   const bufferSize = ctx.sampleRate * 0.5
   const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
   const data = buffer.getChannelData(0)

   for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
   }

   return buffer
}
