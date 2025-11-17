import { InputManager } from './engine/input.js';
import { Renderer } from './engine/renderer.js';
import { Physics } from './engine/physics.js';
import { AssetLoader } from './engine/assetloader.js';
import { AudioManager } from './engine/audiomanager.js';
import { ParticleSystem } from './engine/particlesystem.js';
import { Player } from './game/entities/player.js';
import { LevelManager } from './game/levels/levelmanager.js';
import { UIManager } from './game/ui/uimanager.js';
import { HighScoreManager } from './game/ui/highscoremanager.js';

class Game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Módulos del engine
        this.assetLoader = null;
        this.input = null;
        this.renderer = null;
        this.physics = null;
        this.audioManager = null;
        this.particleSystem = null;
        
        // Módulos del juego
        this.player = null;
        this.levelManager = null;
        this.ui = null;
        this.highScoreManager = null;
        
        this.states = {
            LOADING: 'loading',
            MENU: 'menu', 
            PLAYING: 'playing',
            PAUSED: 'paused',
            GAME_OVER: 'game_over',
            LEVEL_COMPLETE: 'level_complete'
        };
        
        this.currentState = this.states.LOADING;
        this.animationFrameId = null;

        this.settings = {
            musicVolume: 0.7,
            sfxVolume: 0.7,
            playerName: 'Player'
        };

        this.isPaused = false;
    }

    async init() {
        console.log("Iniciando juego..");
        
        // Configurar canvas
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');

        this.centerGame();
        
        // Inicializar cargador de assets
        this.assetLoader = new AssetLoader();
        
        // Inicializar módulos del engine
        this.input = new InputManager(this.canvas);
        this.renderer = new Renderer(this.context, this.assetLoader);
        this.physics = new Physics();
        this.audioManager = new AudioManager(this.assetLoader);
        this.particleSystem = new ParticleSystem();
        
        // Inicializar módulos del juego
        this.levelManager = new LevelManager(this.audioManager, this.particleSystem);
        this.ui = new UIManager();
        this.highScoreManager = new HighScoreManager();
        
        // Configurar event handlers
        this.levelManager.onLevelComplete = (level) => this.onLevelComplete(level);
        
        this.currentState = this.states.LOADING;
        this.showScreen('loadingScreen');
        
        await this.loadAssets();
        this.assetsLoaded();
    }

    centerGame() {
        const container = document.getElementById('gameContainer');
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%, -50%)';
    }

    async loadAssets() {
        console.log("Cargando recursos del juego...");
        
        try {
            // Actualizar progreso de carga
            const updateProgress = () => {
                const progress = this.assetLoader.getProgress();
                document.getElementById('loadingProgress').textContent = 
                    Math.round(progress * 100) + '%';
            };
            
            // Cargar sprites
            await this.assetLoader.loadImage('player', 'assets/sprites/player.png');
            updateProgress();
            await this.assetLoader.loadImage('bullet', 'assets/sprites/bullet.png');
            await this.assetLoader.loadImage('enemy_basic', 'assets/sprites/enemy_basic.png');
            await this.assetLoader.loadImage('enemy_fast', 'assets/sprites/enemy_fast.png');
            await this.assetLoader.loadImage('enemy_tank', 'assets/sprites/enemy_tank.png');
            await this.assetLoader.loadImage('boss_1', 'assets/sprites/boss_1.png');
            await this.assetLoader.loadImage('boss_2', 'assets/sprites/boss_2.png');
            await this.assetLoader.loadImage('powerup_health', 'assets/sprites/powerup_health.png');
            await this.assetLoader.loadImage('powerup_shield', 'assets/sprites/powerup_shield.png');
            await this.assetLoader.loadImage('powerup_rapidfire', 'assets/sprites/powerup_rapidfire.png');
            await this.assetLoader.loadImage('powerup_score', 'assets/sprites/powerup_score.png');
            updateProgress();
            
            // Cargar sonidos con manejo de errores
            const soundPromises = [
                this.audioManager.loadSound('shoot', 'assets/audio/shoot.mp3'),
                this.audioManager.loadSound('hit', 'assets/audio/hit.mp3'),
                this.audioManager.loadSound('explosion', 'assets/audio/explosion.mp3'),
                this.audioManager.loadSound('damage', 'assets/audio/damage.mp3'),
                this.audioManager.loadSound('powerup', 'assets/audio/powerup.mp3'),
                this.audioManager.loadSound('boss_spawn', 'assets/audio/boss_spawn.mp3'),
                this.audioManager.loadSound('boss_shoot', 'assets/audio/boss_shoot.mp3'),
                this.audioManager.loadSound('boss_phase', 'assets/audio/boss_phase.mp3'),
                this.audioManager.loadSound('boss_explosion', 'assets/audio/boss_explosion.mp3'),
                this.audioManager.loadSound('level_complete', 'assets/audio/level_complete.mp3'),
                this.audioManager.loadSound('background_music', 'assets/audio/background.mp3')
            ];
            
            await Promise.allSettled(soundPromises);
            updateProgress();
            
        } catch (error) {
            console.warn("Some assets failed to load:", error);
        }
    }

    assetsLoaded() {
        
        // Cargar configuración
        this.loadSettings();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Actualizar high score en el menú
        this.updateMainMenuHighScore();
        
        this.hideScreens();
        this.currentState = this.states.MENU;
        this.showScreen('mainMenu');
        
        this.lastTime = performance.now();
        this.gameLoop();
    }

    setupEventListeners() {
        
        // Botón START GAME
        const startBtn = document.getElementById('startGameBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
        
        // Botón NEXT LEVEL
        const nextLevelBtn = document.getElementById('nextLevelBtn');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => {
                this.nextLevel();
            });
        }
        
        // Botón PLAY AGAIN
        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.restartGame();
            });
        }
        
        // Botones MAIN MENU (pueden haber múltiples)
        const mainMenuBtn1 = document.getElementById('mainMenuBtn1');
        const mainMenuBtn2 = document.getElementById('mainMenuBtn2');
        
        if (mainMenuBtn1) {
            mainMenuBtn1.addEventListener('click', () => {
                this.showMainMenu();
            });
        }
        
        if (mainMenuBtn2) {
            mainMenuBtn2.addEventListener('click', () => {
                this.showMainMenu();
            });
        }

        const backFromScoresBtn = document.getElementById('backFromScoresBtn');
        
        if (backFromScoresBtn) {
            backFromScoresBtn.addEventListener('click', () => {
                this.showMainMenu();
            });
        }
        
        // Botones adicionales de configuración
        const highScoresBtn = document.getElementById('highScoresBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        const backSettingsBtn = document.getElementById('backSettingsBtn');
        const resumeGameBtn = document.getElementById('resumeGameBtn');
        const pauseToMenuBtn = document.getElementById('pauseToMenuBtn');

        if (highScoresBtn) {
            highScoresBtn.addEventListener('click', () => {
                this.showHighScores();
            });
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }

        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        if (backSettingsBtn) {
            backSettingsBtn.addEventListener('click', () => {
                this.showMainMenu();
            });
        }

        if (resumeGameBtn) {
            resumeGameBtn.addEventListener('click', () => {
                this.togglePause();
            });
        }

        if (pauseToMenuBtn) {
            pauseToMenuBtn.addEventListener('click', () => {
                this.showMainMenu();
            });
        }

        // Tecla ESC para pausar
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                this.togglePause();
            }
        });

    }

    startGame() {
        console.log("Empezando juego...");
        this.currentState = this.states.PLAYING;
        this.hideScreens();
        
        // Reiniciar jugador
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 100, 
                            this.audioManager, this.particleSystem);
        this.ui.score = 0;
        this.levelManager.startLevel(1);
        
        // Iniciar música
        if (this.audioManager) {
            this.audioManager.playMusic('background_music', true, 0.5);
        }
    }

    nextLevel() {
        console.log("Cargando siguiente nivel...");
        this.currentState = this.states.PLAYING;
        this.hideScreens();
        this.levelManager.startLevel(this.levelManager.currentLevel + 1);
    }

    restartGame() {
        console.log("Reiniciando juego...");
        this.startGame();
    }

    showMainMenu() {
        this.currentState = this.states.MENU;
        this.hideScreens();
        this.updateMainMenuHighScore();
        this.showScreen('mainMenu');
        
        // Detener música del juego
        if (this.audioManager) {
            this.audioManager.stopMusic();
        }
        
    }

    showHighScores() {
        this.currentState = this.states.MENU;
        this.hideScreens();
        this.showScreen('highScoresScreen');
        
        // Actualizar la lista de high scores
        this.updateHighScoresDisplay();
    }

    updateHighScoresDisplay() {
        const highScoresList = document.getElementById('highScoresList');
        if (!highScoresList) return;
        
        const scores = this.highScoreManager.getScores();
        
        if (scores.length === 0) {
            highScoresList.innerHTML = '<p> Sin puntajes altos </p>';
            return;
        }
        
        let html = '';
        scores.forEach((score, index) => {
            html += `
                <div class="high-score-item">
                    <span class="rank">${index + 1}.</span>
                    <span class="name">${score.name}</span>
                    <span class="score">${score.score}</span>
                    <span class="level">Level ${score.level}</span>
                </div>
            `;
        });
        
        highScoresList.innerHTML = html;
    }

    hideScreens() {
        const screens = document.querySelectorAll('.game-layer');
        screens.forEach(screen => {
            screen.style.display = 'none';
        });
    }

    showScreen(id) {
        const screen = document.getElementById(id);
        if (screen) {
            screen.style.display = 'flex';
        }
    }

    updateMainMenuHighScore() {
        const topScore = this.highScoreManager.getTopScore();
        const element = document.getElementById('mainMenuHighScore');
        if (element) {
            element.textContent = `Puntaje más alto: ${topScore}`;
        }
    }

    onLevelComplete(level) {
        this.currentState = this.states.LEVEL_COMPLETE;
        
        // Actualizar UI
        document.getElementById('levelScore').textContent = `Score: ${this.ui.score}`;
        this.showScreen('levelCompleteScreen');
        
        // Bonus por completar nivel
        const levelBonus = level * 500;
        this.ui.addScore(levelBonus);
        console.log(`Bonus por nivel completado: +${levelBonus}`);
    }

    gameOver() {
        this.currentState = this.states.GAME_OVER;
        
        // Solo considerar high score si el puntaje es significativo
        const MIN_HIGH_SCORE = 5000; // Aumentamos el mínimo requerido
        
        let isNewHighScore = false;
        let rank = 0;
        
        if (this.ui.score >= MIN_HIGH_SCORE) {
            isNewHighScore = this.highScoreManager.isHighScore(this.ui.score);
            
            if (isNewHighScore) {
                rank = this.highScoreManager.addScore(this.settings.playerName, this.ui.score, this.levelManager.currentLevel);
            }
        }
        
        // Actualizar UI
        document.getElementById('finalScore').textContent = `Score: ${this.ui.score}`;
        
        // SOLO mostrar si es realmente un high score
        const newHighScoreElement = document.getElementById('newHighScore');
        if (newHighScoreElement) {
            newHighScoreElement.style.display = isNewHighScore ? 'block' : 'none';
        }
        
        const highScoreNameInput = document.getElementById('highScoreNameInput');
        if (highScoreNameInput) {
            highScoreNameInput.style.display = isNewHighScore ? 'block' : 'none';
            if (isNewHighScore) {
                document.getElementById('highScoreName').value = this.settings.playerName;
            }
        }
        
        this.showScreen('gameOverScreen');
        
        // Detener música
        if (this.audioManager) {
            this.audioManager.stopMusic();
        }
    }

    update(deltaTime) {
        this.input.update();
        this.particleSystem.update(deltaTime);
        
        if (this.player) {
            this.player.update(deltaTime, this.input);
        }
        
        if (this.levelManager) {
            this.levelManager.update(deltaTime, this.player);
        }
        
        this.checkCollisions();
        this.physics.update(deltaTime);
        
        if (this.player && this.player.health <= 0) {
            this.gameOver();
        }
    }

    saveHighScoreName() {
        const nameInput = document.getElementById('highScoreName');
        if (nameInput) {
            const playerName = nameInput.value.trim() || this.settings.playerName;
            this.settings.playerName = playerName;
            
            // Actualizar el score con el nuevo nombre
            this.highScoreManager.updateLastName(playerName);
            
            // Guardar configuración
            localStorage.setItem('gameSettings', JSON.stringify(this.settings));
        }
    }

    checkCollisions() {
        if (!this.player) return;
        
        const enemies = this.levelManager.getEnemies();
        const powerUps = this.levelManager.getPowerUps();
        const boss = this.levelManager.getBoss();
        
        // VERIFICAR QUE HAYA ELEMENTOS ANTES DE PROCESAR COLISIONES
        if (enemies.length === 0 && !boss && powerUps.length === 0) return;
        
        const collisions = this.physics.checkAllCollisions(this.player, enemies, powerUps, boss);
        
        collisions.forEach(collision => {
            try {
                switch(collision.type) {
                    case 'bullet_enemy':
                        this.handleBulletEnemyCollision(collision, enemies);
                        break;
                        
                    case 'player_enemy':
                        if (collision.playerDead) {
                        }
                        break;
                        
                    case 'boss_bullet_player':
                        this.handleBossBulletCollision(collision, boss);
                        break;
                        
                    case 'player_powerup':
                        this.handlePowerUpCollision(collision, powerUps);
                        break;
                        
                    default:
                }
            } catch (error) {
                console.warn("Error processing collision:", error, collision);
            }
        });
    }

    handleBulletEnemyCollision(collision, enemies) {
        this.player.removeBullet(collision.bulletIndex);
        
        if (collision.enemyDestroyed) {
            this.ui.addScore(collision.scoreValue);
            
            // VERIFICAR SI ES EL BOSS PRIMERO
            if (collision.isBoss) {
                // Manejar destrucción del boss
                const boss = this.levelManager.getBoss();
                if (boss && boss.isActive && boss.isActive()) {
                    const x = boss.x || collision.x || 0;
                    const y = boss.y || collision.y || 0;
                    this.levelManager.onEnemyDestroyed(boss, x, y);
                }
            } 
            // MANEJAR ENEMIGOS NORMALES
            else if (collision.enemyIndex >= 0 && collision.enemyIndex < enemies.length) {
                const enemy = enemies[collision.enemyIndex];
                if (enemy && enemy.isActive && enemy.isActive()) {
                    const x = enemy.x || collision.x || 0;
                    const y = enemy.y || collision.y || 0;
                    this.levelManager.onEnemyDestroyed(enemy, x, y);
                    
                    // Marcar el enemigo como inactivo
                    enemy.active = false;
                }
            } else {
                console.warn("Invalid enemy index:", collision.enemyIndex, "Enemies count:", enemies.length);
            }
        }
    }

    handleBossBulletCollision(collision, boss) {
        // VERIFICAR QUE EL BOSS Y SUS BALAS EXISTAN
        if (boss && boss.getBullets) {
            const bossBullets = boss.getBullets();
            if (bossBullets && collision.bulletIndex >= 0 && collision.bulletIndex < bossBullets.length) {
                bossBullets.splice(collision.bulletIndex, 1);
            }
        }
        
        if (collision.playerDead) {
            console.log("Jugador destruido por bala del jefe.");
        }
    }

    handlePowerUpCollision(collision, powerUps) {
        // El power-up ya fue aplicado al jugador en physics.js mediante player.applyPowerUp()
        // Solo necesitamos marcarlo como inactivo
        const powerUp = powerUps[collision.powerUpIndex];
        if (powerUp && powerUp.isActive) {
            powerUp.active = false;
            powerUp.collected = true;

             // SUMAR PUNTOS SI ES UN POWER-UP DE SCORE
            if (collision.powerUpEffect.effect === 'score') {
                this.ui.addScore(collision.powerUpEffect.value);
            }
            
            // Reproducir sonido del power-up (si no se está reproduciendo ya en player.js)
            if (this.audioManager) {
                this.audioManager.playSound('powerup', 0.7);
            }
        }
    }

    render() {
        this.renderer.drawBackground();
        this.particleSystem.render(this.renderer);
        
        const powerUps = this.levelManager.getPowerUps();
        powerUps.forEach(powerUp => {
            if (powerUp.isActive()) {
                powerUp.render(this.renderer);
            }
        });
        
        const enemies = this.levelManager.getEnemies();
        enemies.forEach(enemy => {
            if (enemy.isActive()) {
                enemy.render(this.renderer);
            }
        });
        
        const boss = this.levelManager.getBoss();
        if (boss && boss.isActive()) {
            boss.render(this.renderer);
        }
        
        if (this.player) {
            this.player.render(this.renderer);
        }
        
        this.ui.render(this.renderer);
        
        // Mostrar información del juego
        this.renderer.drawText(`Level: ${this.levelManager.currentLevel}`, 20, 80, '#FFFFFF', 18);
        this.renderer.drawText(`Score: ${this.ui.score}`, 20, 110, '#FFFF00', 18);
        
        if (this.levelManager.hasActiveBoss()) {
            this.renderer.drawText('BOSS BATTLE!', 400, 60, '#FF0000', 24, 'center');
        }
    }

    trySpawnPowerUp(x, y) {
        // Probabilidad de spawn (20% de chance)
        const spawnChance = 0.2;
        
        if (Math.random() < spawnChance) {
            // Tipos de power-ups disponibles
            const powerUpTypes = ['health', 'shield', 'rapidfire', 'score'];
            
            // Seleccionar tipo aleatorio
            const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            
            
            // Crear y agregar el power-up al LevelManager
            this.levelManager.spawnPowerUp(x, y, randomType);
        }
    }

    gameLoop(currentTime = 0) {
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.deltaTime = Math.min(this.deltaTime, 0.1);
        this.lastTime = currentTime;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch(this.currentState) {
            case this.states.PLAYING:
                this.update(this.deltaTime);
                this.render();
                break;
            case this.states.PAUSED:
                // Dibujar juego pausado (con overlay)
                this.render();
                this.renderPauseOverlay();
                break;
            case this.states.MENU:
                this.renderMenu();
                break;
            case this.states.LOADING:
                this.renderLoading();
                break;
            case this.states.GAME_OVER:
            case this.states.LEVEL_COMPLETE:
                // Estas pantallas se manejan con HTML
                break;
        }

        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    togglePause() {
        if (this.currentState === this.states.PLAYING) {
            this.currentState = this.states.PAUSED;
            this.showScreen('pauseScreen');
            
            // Pausar música de forma segura
            if (this.audioManager && typeof this.audioManager.pauseMusic === 'function') {
                this.audioManager.pauseMusic();
            }
            
        } else if (this.currentState === this.states.PAUSED) {
            this.currentState = this.states.PLAYING;
            this.hideScreens();
            
            // Reanudar música de forma segura
            if (this.audioManager && typeof this.audioManager.resumeMusic === 'function') {
                this.audioManager.resumeMusic();
            }
            
        }
    }

    updateVolumeSettings() {
        if (this.audioManager) {
            this.audioManager.setMusicVolume(this.settings.musicVolume);
            this.audioManager.setSFXVolume(this.settings.sfxVolume);
        }
    }

    // NUEVO MÉTODO: Mostrar configuración
    showSettings() {
        this.currentState = this.states.MENU;
        this.hideScreens();
        this.showScreen('settingsScreen');
        
        // Cargar valores actuales
        this.loadSettingsToUI();
    }

    // NUEVO MÉTODO: Cargar configuración a la UI
    loadSettingsToUI() {
        const musicSlider = document.getElementById('musicVolume');
        const sfxSlider = document.getElementById('sfxVolume');
        const playerNameInput = document.getElementById('playerName');
        
        if (musicSlider) musicSlider.value = this.settings.musicVolume * 100;
        if (sfxSlider) sfxSlider.value = this.settings.sfxVolume * 100;
        if (playerNameInput) playerNameInput.value = this.settings.playerName;
    }

    // NUEVO MÉTODO: Guardar configuración
    saveSettings() {
        const musicSlider = document.getElementById('musicVolume');
        const sfxSlider = document.getElementById('sfxVolume');
        const playerNameInput = document.getElementById('playerName');
        
        if (musicSlider) this.settings.musicVolume = musicSlider.value / 100;
        if (sfxSlider) this.settings.sfxVolume = sfxSlider.value / 100;
        if (playerNameInput) this.settings.playerName = playerNameInput.value || 'Player';
        
        this.updateVolumeSettings();
        
        // Guardar en localStorage
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
        
        this.showMainMenu();
    }

    // NUEVO MÉTODO: Cargar configuración guardada
    loadSettings() {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.updateVolumeSettings();
        }
    }

    // Dibujar overlay de pausa
    renderPauseOverlay() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.context.fillStyle = '#FFFFFF';
        this.context.font = '36px Arial';
        this.context.textAlign = 'center';
        this.context.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.context.font = '18px Arial';
        this.context.fillText('Presiona ESC para continuar', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    renderMenu() {
        this.renderer.drawMenu();
    }

    renderLoading() {
        this.renderer.drawLoading();
    }
}

let gameInstance = null;

window.addEventListener('load', () => {
    gameInstance = new Game();
    gameInstance.init();
    window.game = gameInstance; // Asegurar que esté disponible globalmente
});

// Reanudar audio context en interacción del usuario
document.addEventListener('click', () => {
    if (window.game && window.game.audioManager) {
        window.game.audioManager.resumeAudioContext();
    }
});