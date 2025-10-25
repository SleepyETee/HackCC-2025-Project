/**
 * Audio Manager for Halloween Background Music and Sound Effects
 */

class AudioManager {
  private bgMusic: HTMLAudioElement | null = null
  private musicVolume = 0.3
  private sfxVolume = 0.5
  
  /**
   * Initialize and play background music
   */
  playBackgroundMusic() {
    try {
      if (!this.bgMusic) {
        this.bgMusic = new Audio('/horror-halloween-dark-piano-film-video-background-cinematic-257663.mp3')
        this.bgMusic.loop = true
        this.bgMusic.volume = this.musicVolume
      }
      
      // Play music
      this.bgMusic.play().catch(err => {
        console.log('Audio autoplay blocked. User interaction needed:', err)
      })
      
      console.log('🎵 Halloween music playing')
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
   * Play sound effect
   */
  playSoundEffect(type: 'jump' | 'fall' | 'correct' | 'wrong' | 'land') {
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

