export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.pool = [];
        this.poolSize = 100;
        this.initPool();
    }

    initPool() {
        for (let i = 0; i < this.poolSize; i++) {
            this.pool.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            life: 0,
            maxLife: 0,
            color: '#FFFFFF',
            size: 2,
            active: false
        };
    }

    getParticle() {
        for (let particle of this.pool) {
            if (!particle.active) {
                return particle;
            }
        }
        const newParticle = this.createParticle();
        this.pool.push(newParticle);
        return newParticle;
    }

    createExplosion(x, y, color = '#FF6B6B', count = 15, speed = 100, life = 1.0) {
        for (let i = 0; i < count; i++) {
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = (Math.random() - 0.5) * speed * 2;
            particle.vy = (Math.random() - 0.5) * speed;
            particle.life = life;
            particle.maxLife = life;
            particle.color = color;
            particle.size = 2 + Math.random() * 4;
            particle.active = true;
            
            this.particles.push(particle);
        }
    }

    createSparkle(x, y, color = '#FFFF00', count = 8) {
        for (let i = 0; i < count; i++) {
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            const angle = (i / count) * Math.PI * 2;
            const speed = 50 + Math.random() * 50;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.life = 0.5 + Math.random() * 0.5;
            particle.maxLife = particle.life;
            particle.color = color;
            particle.size = 1 + Math.random() * 2;
            particle.active = true;
            
            this.particles.push(particle);
        }
    }

    createTrail(x, y, color = '#00FFFF') {
        const particle = this.getParticle();
        particle.x = x;
        particle.y = y;
        particle.vx = (Math.random() - 0.5) * 20;
        particle.vy = (Math.random() - 0.5) * 20;
        particle.life = 0.3;
        particle.maxLife = 0.3;
        particle.color = color;
        particle.size = 1 + Math.random();
        particle.active = true;
        
        this.particles.push(particle);
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += 100 * deltaTime;
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                particle.active = false;
                this.particles.splice(i, 1);
            }
        }
    }

    render(renderer) {
        this.particles.forEach(particle => {
            if (particle.active) {
                const alpha = particle.life / particle.maxLife;
                const size = particle.size * alpha;
                
                renderer.context.save();
                renderer.context.globalAlpha = alpha;
                renderer.context.fillStyle = particle.color;
                renderer.context.fillRect(
                    particle.x - size / 2,
                    particle.y - size / 2,
                    size,
                    size
                );
                renderer.context.restore();
            }
        });
    }

    clear() {
        this.particles.forEach(particle => {
            particle.active = false;
        });
        this.particles = [];
    }
}