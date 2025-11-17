export class BossEnemy {
    constructor(x, y, level, audioManager, particleSystem) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.audioManager = audioManager;
        this.particleSystem = particleSystem;
        
        this.width = 120 + (level * 20);
        this.height = 80 + (level * 15);
        this.health = 500 + (level * 200);
        this.maxHealth = this.health;
        this.speed = 50;
        this.scoreValue = 1000 * level;
        
        this.active = true;
        this.movingRight = true;
        this.attackTimer = 0;
        this.attackPattern = 0;
        this.attackCooldown = 2.0;
        this.bullets = [];
        
        this.phase = 1;
        this.phaseThreshold = this.maxHealth * 0.5;
    }

    update(deltaTime, player) {
        if (!this.active) return;
        
        if (this.movingRight) {
            this.x += this.speed * deltaTime;
            if (this.x > 700 - this.width / 2) {
                this.movingRight = false;
            }
        } else {
            this.x -= this.speed * deltaTime;
            if (this.x < 100 + this.width / 2) {
                this.movingRight = true;
            }
        }
        
        this.attackTimer += deltaTime;
        if (this.attackTimer >= this.attackCooldown) {
            this.attack(player);
            this.attackTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 3;
        }
        
        this.updateBullets(deltaTime);
        
        if (this.health <= this.phaseThreshold && this.phase === 1) {
            this.changeToPhase2();
        }
    }

    changeToPhase2() {
        this.phase = 2;
        this.speed *= 1.5;
        this.attackCooldown *= 0.6;
        
        if (this.particleSystem) {
            this.particleSystem.createExplosion(this.x, this.y, '#FF0000', 50, 200, 2.0);
        }
        
        if (this.audioManager) {
            this.audioManager.playSound('boss_phase', 1.0);
        }
    }

    attack(player) {
        const playerX = player ? player.x : 400;
        const playerY = player ? player.y : 300;
        
        switch(this.attackPattern) {
            case 0:
                this.createTargetedShot(playerX, playerY);
                break;
            case 1:
                this.createFanShot(player); // ← Pasar el jugador como parámetro
                break;
            case 2:
                this.createCircleShot();
                break;
        }
        
        if (this.audioManager) {
            this.audioManager.playSound('boss_shoot', 0.7);
        }
    }

    createTargetedShot(targetX, targetY) {
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        const speed = 200;
        
        this.bullets.push({
            x: this.x,
            y: this.y + 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            width: 12,
            height: 12,
            damage: 30,
            color: '#FF0000'
        });
    }

    createFanShot(player) {
        const playerX = player ? player.x : 400;
        const playerY = player ? player.y : 300;
        
        const count = 5 + this.level;
        const spread = Math.PI / 3;
        
        // Calcular ángulo base hacia el jugador
        const baseAngle = Math.atan2(playerY - this.y, playerX - this.x);
        
        for (let i = 0; i < count; i++) {
            // Aplicar dispersión alrededor de la dirección del jugador
            const angle = baseAngle - spread/2 + (spread * i / (count - 1));
            const speed = 150;
            
            this.bullets.push({
                x: this.x,
                y: this.y + 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                width: 8,
                height: 8,
                damage: 20,
                color: '#FF6B6B'
            });
        }
    }

    createCircleShot() {
        const count = 8 + this.level * 2;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 120;
            
            this.bullets.push({
                x: this.x,
                y: this.y + 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                width: 10,
                height: 10,
                damage: 15,
                color: '#FF4444'
            });
        }
    }

    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx * deltaTime;
            bullet.y += bullet.vy * deltaTime;
            
            if (bullet.x < -50 || bullet.x > 850 || bullet.y < -50 || bullet.y > 650) {
                this.bullets.splice(i, 1);
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        
        if (this.particleSystem) {
            this.particleSystem.createExplosion(
                this.x + (Math.random() - 0.5) * this.width * 0.8,
                this.y + (Math.random() - 0.5) * this.height * 0.8,
                '#FF0000',
                5,
                80,
                0.5
            );
        }
        
        if (this.health <= 0) {
            this.health = 0;
            this.active = false;
            
            if (this.particleSystem) {
                this.particleSystem.createExplosion(this.x, this.y, '#FF6B6B', 100, 300, 3.0);
            }
            
            if (this.audioManager) {
                this.audioManager.playSound('boss_explosion', 1.0);
            }
            
            return true;
        }
        
        return false;
    }

    render(renderer) {
        if (!this.active) return;
        
        const spriteKey = `boss_${this.phase}`;
        // Usar drawSprite en lugar de drawAnimatedSprite para imagen completa
        renderer.drawSprite(spriteKey, this.x, this.y, this.width, this.height);
        
        const barWidth = 300;
        const barHeight = 20;
        const barX = 400 - barWidth / 2;
        const barY = 30;
        
        renderer.drawHealthBar(barX, barY, barWidth, barHeight, this.health, this.maxHealth);
        
        renderer.drawText(`BOSS LEVEL ${this.level}`, 400, 15, '#FF0000', 18, 'center');
        
        this.bullets.forEach(bullet => {
            renderer.context.fillStyle = bullet.color;
            renderer.context.beginPath();
            renderer.context.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
            renderer.context.fill();
        });
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
        return this.bullets || [];
    }

    isActive() {
        return this.active && this.health > 0;
    }

    getScoreValue() {
        return this.scoreValue;
    }
}