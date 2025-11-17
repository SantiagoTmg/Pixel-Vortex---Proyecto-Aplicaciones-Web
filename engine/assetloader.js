export class AssetLoader {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.loaded = false;
    }

    async loadImage(key, url) {
        return new Promise((resolve, reject) => {
            this.totalAssets++;
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                this.loadedAssets++;
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    async loadSound(key, url) {
        return new Promise((resolve, reject) => {
            this.totalAssets++;
            const audio = new Audio();
            audio.addEventListener('canplaythrough', () => {
                this.sounds[key] = audio;
                this.loadedAssets++;
                resolve(audio);
            });
            audio.onerror = reject;
            audio.src = url;
        });
    }

    getImage(key) {
        return this.images[key];
    }

    getSound(key) {
        return this.sounds[key];
    }

    getProgress() {
        return this.totalAssets > 0 ? this.loadedAssets / this.totalAssets : 0;
    }

    isLoaded() {
        return this.loadedAssets === this.totalAssets && this.totalAssets > 0;
    }
}