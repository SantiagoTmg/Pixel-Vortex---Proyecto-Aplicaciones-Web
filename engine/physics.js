export class Physics {
    constructor() {
        this.gravity = 0;
        this.collisions = [];
    }

    update(deltaTime) {
        this.collisions = [];
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    checkBulletEnemyCollision(bullet, enemy) {
        const bulletRect = {
            x: bullet.x - bullet.width / 2,
            y: bullet.y - bullet.height / 2,
            width: bullet.width,
            height: bullet.height
        };
        
        const enemyRect = enemy.getBounds();
        return this.checkCollision(bulletRect, enemyRect);
    }

    checkPlayerEnemyCollision(player, enemy) {
        const playerRect = player.getBounds();
        const enemyRect = enemy.getBounds();
        return this.checkCollision(playerRect, enemyRect);
    }

    checkPlayerPowerUpCollision(player, powerUp) {
        const playerRect = player.getBounds();
        const powerUpRect = powerUp.getBounds();
        return this.checkCollision(playerRect, powerUpRect);
    }

    checkBossBulletPlayerCollision(bossBullet, player) {
        const bulletRect = {
            x: bossBullet.x - bossBullet.width / 2,
            y: bossBullet.y - bossBullet.height / 2,
            width: bossBullet.width,
            height: bossBullet.height
        };
        
        const playerRect = player.getBounds();
        return this.checkCollision(bulletRect, playerRect);
    }

    resolvePlayerEnemyCollision(player, enemy) {
        if (this.checkPlayerEnemyCollision(player, enemy)) {
            const playerDead = player.takeDamage(enemy.getDamage());
            enemy.active = false;
            
            return {
                type: 'player_enemy',
                playerDead: playerDead,
                enemyDestroyed: true,
                damage: enemy.getDamage()
            };
        }
        return null;
    }

    resolveBulletEnemyCollision(bullet, enemy, bulletIndex) {
        if (this.checkBulletEnemyCollision(bullet, enemy)) {
            const enemyDestroyed = enemy.takeDamage(bullet.damage);
            
            return {
                type: 'bullet_enemy',
                bulletIndex: bulletIndex,
                enemyDestroyed: enemyDestroyed,
                scoreValue: enemy.getScoreValue(),
                damage: bullet.damage
            };
        }
        return null;
    }

    resolvePlayerPowerUpCollision(player, powerUp) {
        if (this.checkPlayerPowerUpCollision(player, powerUp)) {
            const powerUpEffect = player.applyPowerUp(powerUp);
            return {
                type: 'player_powerup',
                powerUpEffect: powerUpEffect
            };
        }
        return null;
    }

    resolveBossBulletPlayerCollision(bossBullet, bulletIndex, player) {
        if (this.checkBossBulletPlayerCollision(bossBullet, player)) {
            const playerDead = player.takeDamage(bossBullet.damage);
            return {
                type: 'boss_bullet_player',
                bulletIndex: bulletIndex,
                playerDead: playerDead,
                damage: bossBullet.damage
            };
        }
        return null;
    }

    checkAllCollisions(player, enemies, powerUps, boss) {
        const collisions = [];
        
        // Colisiones jugador-enemigo
        enemies.forEach((enemy, enemyIndex) => {
            if (enemy.isActive()) {
                const collision = this.resolvePlayerEnemyCollision(player, enemy);
                if (collision) {
                    collision.enemyIndex = enemyIndex;
                    collisions.push(collision);
                }
            }
        });
        
        // Colisiones bala-enemigo
        const playerBullets = player.getBullets();
        for (let i = playerBullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (enemies[j].isActive()) {
                    const collision = this.resolveBulletEnemyCollision(playerBullets[i], enemies[j], i);
                    if (collision) {
                        collision.enemyIndex = j;
                        collisions.push(collision);
                        break;
                    }
                }
            }
            
            // Colisiones bala-jefe
            if (boss && boss.isActive()) {
                const collision = this.resolveBulletEnemyCollision(playerBullets[i], boss, i);
                if (collision) {
                    collision.enemyIndex = -1;  // ← Usar -1 para indicar que es el boss
                    collision.isBoss = true;    // ← Agregar flag para identificar que es el boss
                    collisions.push(collision);
                    break;
                }
            }
        }
        
        // Colisiones bala-jefe-jugador
        if (boss && boss.isActive()) {
            const bossBullets = boss.getBullets();
            for (let i = bossBullets.length - 1; i >= 0; i--) {
                const collision = this.resolveBossBulletPlayerCollision(bossBullets[i], i, player);
                if (collision) {
                    collisions.push(collision);
                }
            }
        }
        
        // Colisiones jugador-powerup
        powerUps.forEach((powerUp, powerUpIndex) => {
            if (powerUp.isActive()) {
                const collision = this.resolvePlayerPowerUpCollision(player, powerUp);
                if (collision) {
                    collision.powerUpIndex = powerUpIndex;
                    collisions.push(collision);
                }
            }
        });
        
        return collisions;
    }
}