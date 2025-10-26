/**
 * Audio Manager for Halloween Background Music and Sound Effects
 */

class AudioManager {
  private bgMusic: HTMLAudioElement | null = null
  private musicVolume = 0.3
  private sfxVolume = 0.5
  private isAudioEnabled = true
  
  // Sound effect instances
  private victorySound: HTMLAudioElement | null = null
  private projectileSound: HTMLAudioElement | null = null
  
  /**
   * Initialize and play background music
   */
  playBackgroundMusic() {
    if (!this.isAudioEnabled) return
    
    try {
      if (!this.bgMusic) {
        this.bgMusic = new Audio('/sounds/horror-halloween-dark-piano-film-video-background-cinematic-257663.mp3')
        this.bgMusic.loop = true
        this.bgMusic.volume = this.musicVolume
      }
      
      // Only play if not already playing
      if (this.bgMusic.paused) {
        this.bgMusic.play().catch(err => {
          console.log('Audio autoplay blocked. User interaction needed:', err)
        })
        console.log('🎵 Halloween piano story music playing')
      }
    } catch (error) {
      console.error('Error loading background music:', error)
    }
  }
  
  /**
   * Stop background music
   */
  stopBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause()
      this.bgMusic.currentTime = 0
    }
  }
  
  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.bgMusic) {
      this.bgMusic.volume = this.musicVolume
    }
  }
  
  /**
   * Toggle audio on/off
   */
  toggleAudio() {
    this.isAudioEnabled = !this.isAudioEnabled
    
    if (!this.isAudioEnabled) {
      this.stopBackgroundMusic()
    } else {
      this.playBackgroundMusic()
    }
    
    console.log(`🔊 Audio ${this.isAudioEnabled ? 'ENABLED' : 'DISABLED'}`)
    return this.isAudioEnabled
  }

  /**
   * Get audio enabled state
   */
  getAudioEnabled() {
    return this.isAudioEnabled
  }

  /**
   * Play victory sound
   */
  playVictorySound() {
    if (!this.isAudioEnabled) return
    
    try {
      if (!this.victorySound) {
        this.victorySound = new Audio('/sounds/winners_W9Cpenj.mp3')
        this.victorySound.volume = 0.8
      }
      
      // Stop any currently playing victory sound and restart
      this.victorySound.pause()
      this.victorySound.currentTime = 0
      this.victorySound.play().catch(console.error)
    } catch (error) {
      console.error('Error playing victory sound:', error)
    }
  }
  
  /**
   * Play projectile sound
   */
  playProjectileSound() {
    if (!this.isAudioEnabled) return
    
    try {
      if (!this.projectileSound) {
        this.projectileSound = new Audio('/sounds/umgah-backzip.mp3')
        this.projectileSound.volume = 0.6
      }
      
      // Stop any currently playing projectile sound and restart
      this.projectileSound.pause()
      this.projectileSound.currentTime = 0
      this.projectileSound.play().catch(console.error)
    } catch (error) {
      console.error('Error playing projectile sound:', error)
    }
  }

  /**
   * Play sound effect
   */
  playSoundEffect(type: 'jump' | 'fall' | 'correct' | 'wrong' | 'land') {
    if (!this.isAudioEnabled) return
    
    // Create simple synthesized sounds using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    gainNode.gain.value = this.sfxVolume
    
    switch (type) {
      case 'jump':
        oscillator.frequency.value = 400
        oscillator.type = 'sine'
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
        break
        
      case 'fall':
        oscillator.frequency.value = 200
        oscillator.type = 'sawtooth'
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.4)
        break
        
      case 'correct':
        // Happy ascending tone
        oscillator.frequency.value = 523 // C5
        oscillator.type = 'sine'
        oscillator.start()
        oscillator.frequency.exponentialRampToValueAtTime(784, audioContext.currentTime + 0.2) // G5
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.stop(audioContext.currentTime + 0.3)
        break
        
      case 'wrong':
        // Sad descending tone
        oscillator.frequency.value = 400
        oscillator.type = 'triangle'
        oscillator.start()
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
        oscillator.stop(audioContext.currentTime + 0.4)
        break
        
      case 'land':
        oscillator.frequency.value = 100
        oscillator.type = 'square'
        gainNode.gain.value = 0.1
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.1)
        break
    }
  }
}

export const audioManager = new AudioManager()

