export class HighScoreManager {
    constructor() {
        this.storageKey = 'arcadeShooter_highScores';
        this.maxScores = 10;
        this.scores = this.loadScores();
        
        // Si no hay scores, inicializar con algunos por defecto
        if (this.scores.length === 0) {
            this.initializeDefaultScores();
        }
    }

    initializeDefaultScores() {
        this.scores = [
            { name: "Santiago", score: 50000, level: 5, date: new Date().toISOString() }
        ];
        this.saveScores();
    }

    loadScores() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Error loading high scores:', error);
            return [];
        }
    }

    saveScores() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
        } catch (error) {
            console.warn('Error saving high scores:', error);
        }
    }

    // SOLO UN método isHighScore
    isHighScore(score) {
        if (this.scores.length < this.maxScores) {
            // Si hay menos de 10 scores, solo es high score si es > 5000
            return score > 5000;
        }
        // Si hay 10 scores, debe ser mayor al último
        const sortedScores = [...this.scores].sort((a, b) => b.score - a.score);
        return score > sortedScores[this.maxScores - 1].score;
    }
    
    addScore(name, score, level) {
        const newScore = {
            name: name,
            score: score,
            level: level,
            date: new Date().toISOString()
        };
        
        this.scores.push(newScore);
        this.scores.sort((a, b) => b.score - a.score);
        
        // Mantener solo los top 10
        if (this.scores.length > this.maxScores) {
            this.scores = this.scores.slice(0, this.maxScores);
        }
        
        this.saveScores();
        
        const position = this.scores.findIndex(s => s === newScore) + 1;
        return position;
    }

    updateLastName(playerName) {
        if (this.scores.length > 0) {
            this.scores[this.scores.length - 1].name = playerName;
            this.saveScores();
        }
    }

    getTopScore() {
        const sorted = [...this.scores].sort((a, b) => b.score - a.score);
        return sorted[0]?.score || 0;
    }

    getScores() {
        return [...this.scores].sort((a, b) => b.score - a.score).slice(0, this.maxScores);
    }

    clearScores() {
        this.scores = [];
        this.saveScores();
    }
}