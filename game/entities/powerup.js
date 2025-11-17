export class PowerUp {
    constructor(x, y, type = 'health') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.speed = 50;
        this.active = true;
        this.collected = false;
        this.animationTimer = 0;
        this.bobOffset = 0;
        
        switch(type) {
            case 'health':
                this.color = '#00FF00';
                this.spriteKey = 'powerup_health';
                this.effect = 'heal';
                this.value = 25;
                break;
            case 'shield':
                this.color = '#00FFFF';
                this.spriteKey = 'powerup_shield';
                this.effect = 'shield';
                this.value = 5;
                break;
            case 'rapidfire':
                this.color = '#FFFF00';
                this.spriteKey = 'powerup_rapidfire';
                this.effect = 'rapidfire';
                this.value = 10;
                break;
            case 'score':
                this.color = '#FF00FF';
                this.spriteKey = 'powerup_score';
                this.effect = 'score';
                this.value = 500;
                break;
        }
    }

    update(deltaTime) {
        if (!this.active) return;
        
        this.y += this.speed * deltaTime;
        this.animationTimer += deltaTime;
        this.bobOffset = Math.sin(this.animationTimer * 3) * 3;
        this.rotation = this.animationTimer * 2;
        
        if (this.y > 600 + this.height) {
            this.active = false;
        }
    }

    render(renderer) {
        if (!this.active || this.collected) return;
        
        const y = this.y + this.bobOffset;
        
        // Solo dibujar el sprite, sin círculo de color
        renderer.drawSprite(this.spriteKey, this.x, y, this.width, this.height, this.rotation);
        
        // Opcional: agregar un efecto de parpadeo o brillo si quieres
        if (Math.sin(this.animationTimer * 5) > 0) {
            renderer.context.save();
            renderer.context.globalAlpha = 0.2;
            renderer.context.fillStyle = this.color;
            renderer.context.beginPath();
            renderer.context.arc(this.x, y, this.width / 2 + 3, 0, Math.PI * 2);
            renderer.context.fill();
            renderer.context.restore();
        }
    }

    collect() {
        this.collected = true;
        this.active = false;
        return {
            type: this.type,
            effect: this.effect,
            value: this.value
        };
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
        return this.active && !this.collected;
    }
}