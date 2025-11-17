export class Renderer {
    constructor(context, assetLoader) {
        this.context = context;
        this.canvas = context.canvas;
        this.assetLoader = assetLoader;
    }

    drawBackground() {

        // Fondo espacial con parallax
        this.context.fillStyle = '#0B0B0B';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Estrellas distantes
        this.context.fillStyle = '#fefefeff';
        for (let i = 0; i < 30; i++) {
            const x = (Math.random() * this.canvas.width + Date.now() * 0.01) % this.canvas.width;
            const y = (Math.random() * this.canvas.height + Date.now() * 0.02) % this.canvas.height;
            this.context.fillRect(x, y, 1, 1);
        }
        
        // Estrellas cercanas
        this.context.fillStyle = '#FFFFFF';
        for (let i = 0; i < 20; i++) {
            const x = (Math.random() * this.canvas.width + Date.now() * 0.02) % this.canvas.width;
            const y = (Math.random() * this.canvas.height + Date.now() * 0.03) % this.canvas.height;
            const size = Math.random() * 2;
            this.context.fillRect(x, y, size, size);
        }
    }

    drawSprite(spriteKey, x, y, width, height, angle = 0) {
        const sprite = this.assetLoader.getImage(spriteKey);
        
        this.context.save();
        this.context.translate(x, y);
        this.context.rotate(angle);
        
        if (sprite) {
            this.context.drawImage(sprite, -width/2, -height/2, width, height);
        } else {
            // Fallback
            this.context.fillStyle = '#FF0000';
            this.context.fillRect(-width/2, -height/2, width, height);
            
            this.context.strokeStyle = '#FFFF00';
            this.context.lineWidth = 2;
            this.context.strokeRect(-width/2, -height/2, width, height);
        }
        
        this.context.restore();
    }

    drawAnimatedSprite(spriteKey, frame, x, y, width, height, angle = 0) {
        const sprite = this.assetLoader.getImage(spriteKey);
        
        if (!sprite) {
            this.drawSprite(spriteKey, x, y, width, height, angle);
            return;
        }
        
        this.context.save();
        this.context.translate(x, y);
        this.context.rotate(angle);
        
        const frameWidth = sprite.width / 4;
        const sx = (frame % 4) * frameWidth;
        
        this.context.drawImage(
            sprite,
            sx, 0, frameWidth, sprite.height,
            -width/2, -height/2, width, height
        );
        
        this.context.restore();
    }

    drawText(text, x, y, color = '#FFFFFF', fontSize = 20, align = 'left') {
        this.context.fillStyle = color;
        this.context.font = `${fontSize}px Arial`;
        this.context.textAlign = align;
        this.context.fillText(text, x, y);
    }

    drawHealthBar(x, y, width, height, currentHealth, maxHealth) {
        const healthPercent = currentHealth / maxHealth;
        
        // Fondo
        this.context.fillStyle = '#333333';
        this.context.fillRect(x, y, width, height);
        
        // Salud
        this.context.fillStyle = healthPercent > 0.5 ? '#00FF00' : 
                                healthPercent > 0.2 ? '#FFFF00' : '#FF0000';
        this.context.fillRect(x, y, width * healthPercent, height);
        
        // Borde
        this.context.strokeStyle = '#FFFFFF';
        this.context.lineWidth = 2;
        this.context.strokeRect(x, y, width, height);
    }

    drawMenu() {
        // Fondo con patrón degradado simple
        const gradiente = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
        gradiente.addColorStop(0, '#000808');
        gradiente.addColorStop(1, '#060632ff');
        this.context.fillStyle = gradiente;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Marco decorativo alrededor de la pantalla
        this.context.strokeStyle = '#00FFFF';
        this.context.lineWidth = 4;
        this.context.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);

        // Título principal con doble color
        this.drawText('Pixel Vortex', this.canvas.width / 2 + 2, 152, '#00FFFF', 42, 'center'); // efecto sombra

        // Texto de instrucciones con estilo resaltado
        this.drawText('Presiona el botón "Start Game"', this.canvas.width / 2, 250, 'rgba(255, 255, 255, 1)', 22, 'center');
        this.drawText('para empezar', this.canvas.width / 2, 280, '#ffffffff', 20, 'center');

        // Texto decorativo inferior
        this.drawText('© 2025 Aplicaciones Web', this.canvas.width / 2, this.canvas.height - 50, '#888888', 16, 'center');
    }

    drawLoading() {
        this.context.fillStyle = '#003300';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawText('Loading...', this.canvas.width / 2, this.canvas.height / 2, '#FFFFFF', 24, 'center');
    }
}