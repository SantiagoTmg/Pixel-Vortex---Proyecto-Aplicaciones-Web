export class Player {
    constructor(x, y, audioManager, particleSystem) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 300;
        this.health = 100;
        this.maxHealth = 100;
        this.bullets = [];
        this.lastShot = 0;
        this.shotCooldown = 0.2;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.audioManager = audioManager;
        this.particleSystem = particleSystem;
        
        this.activePowerUps = {
            shield: { active: false, timer: 0 },
            rapidfire: { active: false, timer: 0 }
        };
    }

    update(deltaTime, input) {
        this.updatePowerUps(deltaTime);
        
        let moving = false;
        if (input.isKeyPressed('ArrowLeft')) {
            this.x -= this.speed * deltaTime;
            moving = true;
        }
        if (input.isKeyPressed('ArrowRight')) {
            this.x += this.speed * deltaTime;
            moving = true;
        }
        if (input.isKeyPressed('ArrowUp')) {
            this.y -= this.speed * deltaTime;
            moving = true;
        }
        if (input.isKeyPressed('ArrowDown')) {
            this.y += this.speed * deltaTime;
            moving = true;
        }

        this.x = Math.max(this.width / 2, Math.min(800 - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(600 - this.height / 2, this.y));

        const currentCooldown = this.activePowerUps.rapidfire.active ? 
                              this.shotCooldown * 0.3 : this.shotCooldown;
        
        if (input.isKeyPressed('Space') && this.canShoot(currentCooldown)) {
            this.shoot();
        }

        if (this.invulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }

        if (moving && this.particleSystem && Math.random() < 0.3) {
            this.particleSystem.createTrail(
                this.x + (Math.random() - 0.5) * this.width * 0.5,
                this.y + this.height * 0.3,
                this.activePowerUps.shield.active ? '#00FFFF' : '#00FF00'
            );
        }

        this.updateBullets(deltaTime);
    }

    updatePowerUps(deltaTime) {
        for (let type in this.activePowerUps) {
            if (this.activePowerUps[type].active) {
                this.activePowerUps[type].timer -= deltaTime;
                if (this.activePowerUps[type].timer <= 0) {
                    this.activePowerUps[type].active = false;
                }
            }
        }
    }

    canShoot(cooldown) {
        const now = Date.now() / 1000;
        return now - this.lastShot >= cooldown;
    }

    shoot() {
        this.lastShot = Date.now() / 1000;
        
        const bullet = {
            x: this.x,
            y: this.y - this.height / 2,
            width: 8,
            height: 20,
            speed: 500,
            damage: 25
        };
        
        if (this.activePowerUps.rapidfire.active) {
            this.bullets.push({...bullet, x: this.x - 10});
            this.bullets.push({...bullet, x: this.x});
            this.bullets.push({...bullet, x: this.x + 10});
        } else {
            this.bullets.push(bullet);
        }
        
        // Reproducir sonido de forma segura
        if (this.audioManager && typeof this.audioManager.playSound === 'function') {
            this.audioManager.playSound('shoot', 0.3);
        } else {
            console.log("Shoot sound would play here");
        }
        
        if (this.particleSystem) {
            this.particleSystem.createSparkle(this.x, this.y - this.height / 2, '#FFFF00', 3);
        }
    }

    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= bullet.speed * deltaTime;

            if (bullet.y < -bullet.height) {
                this.bullets.splice(i, 1);
            }
        }
    }

    takeDamage(amount) {
        if (this.activePowerUps.shield.active) {
            if (this.particleSystem) {
                this.particleSystem.createSparkle(this.x, this.y, '#00FFFF', 5);
            }
            return false;
        }
        
        if (!this.invulnerable) {
            this.health -= amount;
            this.invulnerable = true;
            this.invulnerableTime = 1.0;
            
            if (this.particleSystem) {
                this.particleSystem.createExplosion(this.x, this.y, '#FF0000', 8, 80, 0.5);
            }
            
            if (this.audioManager) {
                this.audioManager.playSound('damage', 0.5);
            }
            
            if (this.health <= 0) {
                this.health = 0;
                if (this.audioManager) {
                    this.audioManager.playSound('explosion', 1.0);
                }
                if (this.particleSystem) {
                    this.particleSystem.createExplosion(this.x, this.y, '#FF6B6B', 30, 150, 1.5);
                }
                return true;
            }
        }
        return false;
    }

    applyPowerUp(powerUp) {
        const effect = powerUp.collect();
        
        switch(effect.effect) {
            case 'heal':
                this.health = Math.min(this.maxHealth, this.health + effect.value);
                break;
            case 'shield':
                this.activePowerUps.shield.active = true;
                this.activePowerUps.shield.timer = effect.value;
                break;
            case 'rapidfire':
                this.activePowerUps.rapidfire.active = true;
                this.activePowerUps.rapidfire.timer = effect.value;
                break;
            case 'score':
                // ✅ SUMAR PUNTOS AL UI
                if (this.uiManager) {
                    this.uiManager.addScore(powerUp.value);
                } else {
                    console.log(`Score power-up collected: +${powerUp.value} (no UI reference)`);
                }
                break;
        }
        
        if (this.particleSystem) {
            this.particleSystem.createSparkle(this.x, this.y, powerUp.color, 15);
        }
        
        if (this.audioManager) {
            this.audioManager.playSound('powerup', 0.7);
        }
        
        return effect;
    }

    hasShield() {
        return this.activePowerUps.shield.active;
    }

    render(renderer) {
        if (this.activePowerUps.shield.active) {
            renderer.context.save();
            renderer.context.globalAlpha = 0.3;
            renderer.context.strokeStyle = '#00FFFF';
            renderer.context.lineWidth = 3;
            renderer.context.beginPath();
            renderer.context.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
            renderer.context.stroke();
            renderer.context.restore();
        }
        
        if (!this.invulnerable || Math.floor(Date.now() / 100) % 2 === 0) {
            // Usar drawSprite en lugar de drawAnimatedSprite para imagen completa
            renderer.drawSprite('player', this.x, this.y, this.width, this.height);
        }
        
        this.bullets.forEach(bullet => {
            renderer.drawSprite('bullet', bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        const canvasWidth = renderer.context.canvas.width;
        const healthBarWidth = 200;
        const healthBarHeight = 20;
        const healthBarX = canvasWidth - healthBarWidth - 20; // 20px desde el borde derecho
        const healthBarY = 20; // 20px desde el borde superior
        
        renderer.drawHealthBar(healthBarX, healthBarY, healthBarWidth, healthBarHeight, this.health, this.maxHealth);

        this.renderPowerUpIndicators(renderer);
    }

    renderPowerUpIndicators(renderer) {
        let yOffset = 50;
        
        if (this.activePowerUps.shield.active) {
            const timeLeft = this.activePowerUps.shield.timer.toFixed(1);
            renderer.drawText(`🛡 ${timeLeft}s`, 20, yOffset, '#00FFFF', 16);
            yOffset += 20;
        }
        
        if (this.activePowerUps.rapidfire.active) {
            const timeLeft = this.activePowerUps.rapidfire.timer.toFixed(1);
            renderer.drawText(`⚡ ${timeLeft}s`, 20, yOffset, '#FFFF00', 16);
        }
    }

    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    getBullets() {
        return this.bullets;
    }

    removeBullet(index) {
        if (index >= 0 && index < this.bullets.length) {
            this.bullets.splice(index, 1);
        }
    }
}