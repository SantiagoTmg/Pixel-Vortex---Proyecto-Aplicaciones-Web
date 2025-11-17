export class UIManager {
    constructor() {
        this.score = 0;
    }

    render(renderer) {
        renderer.drawText('PIXEL VORTEX', 400, 30, '#FFFFFF', 24, 'center');
    }

    addScore(points) {
        this.score += points;
    }
}