export class AudioManager {
    constructor(assetLoader) {
        this.assetLoader = assetLoader;
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.muted = false;
        this.audioContext = null;
        
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn("Web Audio API not supported:", error);
        }
    }

    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    resumeMusic() {
        if (this.currentMusic && this.currentMusic.paused) {
            this.currentMusic.play().catch(e => console.log("Music resume failed:", e));
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.currentMusic) {
            this.currentMusic.volume = volume; // ← Esto está bien
        }
    }

    // Y en playMusic, asegúrate de aplicar el volumen:
    playMusic(soundKey, loop = true, volume = 1.0) {
        const sound = this.sounds[soundKey];
        if (sound && !this.muted) {
            // Detener música actual si hay alguna
            if (this.currentMusic) {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
            }
            
            this.currentMusic = sound.cloneNode();
            this.currentMusic.loop = loop;
            this.currentMusic.volume = volume * this.musicVolume; // ← Aplicar volumen
            this.currentMusic.play().catch(e => console.log("Music play failed:", e));
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = volume;
    }

    playSound(soundKey, volume = 1.0) {
        const sound = this.sounds[soundKey];
        if (sound && !this.muted) {
            try {
                const audio = sound.cloneNode();
                audio.volume = volume * this.sfxVolume;
                audio.play().catch(e => console.log("Audio play failed:", e));
            } catch (error) {
                console.warn("Error playing sound:", soundKey, error);
            }
        }
    }

    loadSound(key, path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = path;
            
            audio.addEventListener('canplaythrough', () => {
                this.sounds[key] = audio;
                resolve(audio);
            });
            
            audio.addEventListener('error', (error) => {
                console.warn(`Failed to load sound: ${key}`, error);
                // Crear un audio dummy para evitar errores
                this.sounds[key] = { cloneNode: () => ({ play: () => {}, pause: () => {} }) };
                resolve(this.sounds[key]);
            });
            
            // Forzar carga
            audio.load();
        });
    }

    muteAll() {
        this.muted = true;
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    unmuteAll() {
        this.muted = false;
        if (this.currentMusic && this.currentMusic.paused) {
            this.currentMusic.play();
        }
    }
}