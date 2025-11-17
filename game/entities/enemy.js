export class Enemy {
    constructor(x, y, type = 'basic', audioManager) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.audioManager = audioManager;
        
        switch(type) {
            case 'basic':
                this.width = 40;
                this.height = 40;
                this.speed = 100;
                this.health = 50;
                this.maxHealth = 50;
                this.scoreValue = 100;
                this.damage = 20;
                this.spriteKey = 'enemy_basic';
                break;
            case 'fast':
                this.width = 30;
                this.height = 30;
                this.speed = 200;
                this.health = 25;
                this.maxHealth = 25;
                this.scoreValue = 150;
                this.damage = 10;
                this.spriteKey = 'enemy_fast';
                break;
            case 'tank':
                this.width = 60;
                this.height = 60;
                this.speed = 50;
                this.health = 150;
                this.maxHealth = 150;
                this.scoreValue = 300;
                this.damage = 40;
                this.spriteKey = 'enemy_tank';
                break;
        }
        
        this.active = true;
    }

    update(deltaTime) {
        this.y += this.speed * deltaTime;

        if (this.y > 600 + this.height) {
            this.active = false;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        
        if (this.audioManager && amount > 0) {
            this.audioManager.playSound('hit', 0.4);
        }
        
        if (this.health <= 0) {
            this.health = 0;
            this.active = false;
            
            if (this.audioManager) {
                this.audioManager.playSound('explosion', 0.6);
            }
            return true;
        }
        return false;
    }

    render(renderer) {
        renderer.drawSprite(this.spriteKey, this.x, this.y, this.width, this.height);
    
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 8;
        
        renderer.drawHealthBar(barX, barY, barWidth, barHeight, this.health, this.maxHealth);

    }

    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    isActive() {
        return this.active;
    }

    getScoreValue() {
        return this.scoreValue;
    }

    getDamage() {
        return this.damage;
    }
}