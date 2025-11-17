# Pixel Vortex 🎮

![HTML5](https://img.shields.io/badge/HTML5-Game-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Canvas](https://img.shields.io/badge/HTML5-Canvas-blue) ![No
Dependencies](https://img.shields.io/badge/Dependencies-None-green)

**Pixel Vortex** es un shooter vertical arcade desarrollado con
tecnologías web nativas (HTML5 Canvas + JavaScript vanilla) que combina
la estética retro clásica con mecánicas de juego modernas. Un tributo a
los grandes shoot'em up de los 90 con un motor de juego completamente
desarrollado desde cero.

## 🚀 Características Principales

### 🎯 Gameplay

-   **Sistema progresivo de niveles**: Cada 3 niveles enfrentas jefes
    épicos
-   **Múltiples tipos de enemigos**: Básico, rápido y tanque con
    comportamientos únicos
-   **Sistema de power-ups**: Salud, escudo, disparo rápido y bonus de
    puntuación
-   **Combates contra jefes**: Enemigos finales con múltiples fases y
    patrones de ataque

### 🛠️ Tecnología

-   **Motor de juego completo**: Desarrollado 100% en JavaScript vanilla
-   **Renderizado optimizado**: Canvas HTML5 con double buffering
-   **Sistema de audio avanzado**: Web Audio API con gestión de canales
-   **Físicas eficientes**: Detección de colisiones con bounding boxes
-   **Partículas y efectos**: Sistema visual avanzado para explosiones y
    power-ups

### 🎮 Experiencia

-   **Controles responsive**: Movimiento suave y disparos precisos
-   **Dificultad escalable**: Aumento progresivo según el nivel
-   **Persistencia de datos**: High scores y configuración guardados
-   **Interfaz pulida**: Menús profesionales y HUD informativo

## 📁 Estructura del Proyecto

    pixel-vortex/
    ├── 📄 index.html                 # Punto de entrada principal
    ├── 📄 main.js                    # Archivo principal del juego
    │
    ├── 📁 assets/                    # Recursos del juego
    │   ├── 📁 audio/                 # Archivos de audio
    │   │   ├── 🎵 background.mp3     # Música de fondo
    │   │   ├── 🎵 boss_explosion.mp3 # Sonido explosión de jefe
    │   │   ├── 🎵 boss_phase.mp3     # Sonido cambio de fase jefe
    │   │   ├── 🎵 boss_shoot.mp3     # Sonido disparo jefe
    │   │   ├── 🎵 boss_spawn.mp3     # Sonido aparición jefe
    │   │   ├── 🎵 damage.mp3         # Sonido daño al jugador
    │   │   ├── 🎵 explosion.mp3      # Sonido explosión general
    │   │   ├── 🎵 hit.mp3            # Sonido impacto
    │   │   ├── 🎵 level_complete.mp3 # Sonido nivel completado
    │   │   ├── 🎵 powerup.mp3        # Sonido power-up
    │   │   └── 🎵 shoot.mp3          # Sonido disparo
    │   │
    │   └── 📁 sprites/               # Imágenes y gráficos
    │       ├── 🖼️ boss_1.png         # Sprite primer jefe
    │       ├── 🖼️ boss_2.png         # Sprite segundo jefe
    │       ├── 🖼️ bullet.png         # Sprite balas
    │       ├── 🖼️ enemy_basic.png    # Enemigo básico
    │       ├── 🖼️ enemy_fast.png     # Enemigo rápido
    │       ├── 🖼️ enemy_tank.png     # Enemigo tanque
    │       ├── 🖼️ favicon.ico        # Icono del juego
    │       ├── 🖼️ player.png         # Sprite del jugador
    │       ├── 🖼️ powerup_health.png # Power-up de salud
    │       ├── 🖼️ powerup_rapidfire.png # Power-up disparo rápido
    │       ├── 🖼️ powerup_score.png  # Power-up de puntuación
    │       └── 🖼️ powerup_shield.png # Power-up de escudo
    │
    ├── 📁 engine/                    # Motor del juego
    │   ├── 🔧 assetloader.js         # Cargador de recursos
    │   ├── 🔊 audiomanager.js        # Gestor de audio
    │   ├── 🎮 input.js               # Sistema de entrada
    │   ├── ✨ particlesystem.js      # Sistema de partículas
    │   ├── ⚡ physics.js             # Motor físico
    │   └── 🎨 renderer.js            # Renderizador
    │
    ├── 📁 game/                      # Lógica principal del juego
    │   └── 📁 entities/              # Entidades del juego
    │       ├── 👾 bossenemy.js       # Lógica de jefes
    │       ├── 👾 enemy.js           # Enemigos base
    │       ├── 🚀 player.js          # Jugador
    │       └── 💫 powerup.js         # Power-ups
    │
    ├── 📁 levels/                    # Sistema de niveles
    │   └── 🎯 levelmanager.js        # Gestor de niveles
    │
    └── 📁 ui/                        # Interfaz de usuario
        ├── 🏆 highscoremanager.js    # Gestor de puntuaciones
        └── 🖥️ uimanager.js           # Gestor de interfaz

(Contenido abreviado para la generación del archivo)
