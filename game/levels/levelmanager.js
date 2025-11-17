import { Enemy } from '../entities/enemy.js';
import { PowerUp } from '../entities/powerup.js';
import { BossEnemy } from '../entities/bossenemy.js';

export class LevelManager {
    constructor(audioManager, particleSystem) {
        this.currentLevel = 1;
        this.enemies = [];
        this.powerUps = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2.0;
        this.enemiesSpawned = 0;
        this.enemiesPerWave = 10;
        this.waveCompleted = false;
        this.audioManager = audioManager;
        this.particleSystem = particleSystem;
        
        this.boss = null;
        this.bossSpawned = false;
        this.bossLevelInterval = 3;
        this.powerUpChance = 0.2;
        
        this.onLevelComplete = null;
    }

    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.enemies = [];
        this.powerUps = [];
        this.boss = null;
        this.bossSpawned = false;
        this.spawnTimer = 0;
        this.enemiesSpawned = 0;
        this.waveCompleted = false;
        
        this.enemiesPerWave = 8 + (levelNumber * 2);
        this.spawnInterval = Math.max(0.8, 2.0 - (levelNumber * 0.1));
        this.powerUpChance = 0.15 + (levelNumber * 0.02);
    }

    update(deltaTime, player) {
        if (!this.bossSpawned && !this.waveCompleted) {
            this.spawnTimer += deltaTime;
            
            if (this.spawnTimer >= this.spawnInterval && this.enemiesSpawned < this.enemiesPerWave) {
                this.spawnEnemy();
                this.spawnTimer = 0;
                this.enemiesSpawned++;
                
                if (this.enemiesSpawned >= this.enemiesPerWave) {
                    this.waveCompleted = true;
                }
            }
        }
        
        if (this.waveCompleted && !this.bossSpawned && this.currentLevel % this.bossLevelInterval === 0) {
            this.spawnBoss();
        }
        
        this.enemies.forEach(enemy => {
            if (enemy.isActive()) {
                enemy.update(deltaTime);
            }
        });
        
        if (this.boss && this.boss.isActive()) {
            this.boss.update(deltaTime, player);
        }
        
        this.powerUps.forEach(powerUp => {
            if (powerUp.isActive()) {
                powerUp.update(deltaTime);
            }
        });
        
        this.enemies = this.enemies.filter(enemy => enemy.isActive());
        this.powerUps = this.powerUps.filter(powerUp => powerUp.isActive());
        
        if (this.isLevelComplete()) {
            this.completeLevel();
        }
    }

    spawnEnemy() {
        const types = ['basic', 'fast', 'tank'];
        const weights = [0.6, 0.3, 0.1];
        
        let random = Math.random();
        let type = 'basic';
        let cumulativeWeight = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                type = types[i];
                break;
            }
        }
        
        const x = 50 + Math.random() * 700;
        const y = -50;
        
        this.enemies.push(new Enemy(x, y, type, this.audioManager));
    }

    spawnBoss() {
        this.boss = new BossEnemy(400, 100, this.currentLevel, this.audioManager, this.particleSystem);
        this.bossSpawned = true;
        
        if (this.audioManager) {
            this.audioManager.playSound('boss_spawn', 1.0);
        }
    }

    spawnPowerUp(x, y) {
        const testPowerUpChance = 0.2; 
        
        if (Math.random() > testPowerUpChance) return;
        
        const types = ['health', 'shield', 'rapidfire', 'score'];
        const weights = [0.4, 0.25, 0.25, 0.1];
        
        let random = Math.random();
        let type = 'health';
        let cumulativeWeight = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                type = types[i];
                break;
            }
        }
        
        console.log(`🎁 Spawning power-up: ${type} at (${x}, ${y})`);
        this.powerUps.push(new PowerUp(x, y, type));
    }

    onEnemyDestroyed(enemy, x, y) {
        this.spawnPowerUp(x, y);
        
        if (this.particleSystem) {
            this.particleSystem.createExplosion(x, y, '#FF6B6B', 15, 100, 1.0);
        }
    }

    isLevelComplete() {
        return this.waveCompleted && 
               this.enemies.length === 0 && 
               (!this.boss || !this.boss.isActive());
    }

    completeLevel() {
        if (this.particleSystem) {
            for (let i = 0; i < 20; i++) {
                this.particleSystem.createSparkle(
                    Math.random() * 800,
                    Math.random() * 600,
                    '#00FFFF',
                    3
                );
            }
        }
        
        if (this.audioManager) {
            this.audioManager.playSound('level_complete', 0.8);
        }
        
        if (typeof this.onLevelComplete === 'function') {
            this.onLevelComplete(this.currentLevel);
        }
    }

    onEnemyDestroyed(enemy, x, y) {
        if (enemy.isBoss) {  // O alguna forma de identificar que es un boss
            // Manejar destrucción del boss
            this.boss = null;
            this.onLevelComplete(this.currentLevel);
        } else {
            // Manejar destrucción de enemigos normales
            this.trySpawnPowerUp(x, y);
        }
    }

    hasActiveBoss() {
        return this.boss && this.boss.isActive && this.boss.isActive();
    }

    getEnemies() {
        return this.enemies;
    }

    getPowerUps() {
        return this.powerUps;
    }

    getBoss() {
        return this.boss;
    }

    hasActiveBoss() {
        return this.boss && this.boss.isActive();
    }

    removePowerUp(index) {
        if (index >= 0 && index < this.powerUps.length) {
            this.powerUps.splice(index, 1);
        }
    }
}