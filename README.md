# Pixel Vortex 🎮

![HTML5](https://img.shields.io/badge/HTML5-Game-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Canvas](https://img.shields.io/badge/HTML5-Canvas-blue)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-green)

**Pixel Vortex** es un shooter vertical arcade desarrollado con tecnologías web nativas (HTML5 Canvas + JavaScript vanilla) que combina la estética retro clásica con mecánicas de juego modernas. Un tributo a los grandes shoot'em up de los 90 con un motor de juego completamente desarrollado desde cero.

## 🚀 Características Principales

### 🎯 Gameplay

* **Sistema progresivo de niveles**: Cada 3 niveles enfrentas jefes épicos
* **Múltiples tipos de enemigos**: Básico, rápido y tanque con comportamientos únicos
* **Sistema de power-ups**: Salud, escudo, disparo rápido y bonus de puntuación
* **Combates contra jefes**: Enemigos finales con múltiples fases y patrones de ataque

### 🛠️ Tecnología

* **Motor de juego completo**: Desarrollado 100% en JavaScript vanilla
* **Renderizado optimizado**: Canvas HTML5 con double buffering
* **Sistema de audio avanzado**: Web Audio API con gestión de canales
* **Físicas eficientes**: Detección de colisiones con bounding boxes
* **Partículas y efectos**: Sistema visual avanzado para explosiones y power-ups

### 🎮 Experiencia

* **Controles responsive**: Movimiento suave y disparos precisos
* **Dificultad escalable**: Aumento progresivo según el nivel
* **Persistencia de datos**: High scores y configuración guardados
* **Interfaz pulida**: Menús profesionales y HUD informativo

## 📁 Estructura del Proyecto

```
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
```

## 🎯 Módulos Principales

### `main.js` - Núcleo del Juego

* **Gestor de Estados**: Controla transiciones entre pantallas
* **Coordinador de Módulos**: Orquesta la interacción entre sistemas
* **Bucle Principal**: Game loop a 60 FPS con delta time
* **Gestión de Assets**: Carga asíncrona de recursos

### `levelmanager.js` - Sistema de Niveles

```javascript
// Progresión de dificultad
this.enemiesPerWave = 8 + (levelNumber * 2);
this.spawnInterval = Math.max(0.8, 2.0 - (levelNumber * 0.1));
this.powerUpChance = 0.15 + (levelNumber * 0.02);
```

### `player.js` - Control del Jugador

* Movimiento 8-direccional suave
* Sistema de disparo con diferentes patrones
* Gestión de power-ups temporales
* Efectos visuales de escudo y trail

### `physics.js` - Motor de Físicas

* Detección eficiente de colisiones
* Múltiples tipos de interacciones
* Optimizado para alto rendimiento

## 🎮 Controles

| Tecla                 | Acción                 |
| --------------------- | ---------------------- |
| **← → ↑ ↓**           | Movimiento de la nave  |
| **W A S D**           | Movimiento alternativo |
| **Barra Espaciadora** | Disparar               |
| **ESC**               | Pausar/Reanudar        |
| **Enter**             | Confirmar en menús     |

## ⚡ Ejecución del Juego

### 🚨 Requisito Importante

El juego **debe ejecutarse desde un servidor web** debido a las políticas CORS para carga de recursos.

### Método 1: Live Server (Recomendado)

1. **Instalar extensión en VS Code:**

   * Buscar "Live Server" en extensions
   * Instalar la extensión de Ritwick Dey

2. **Ejecutar:**

   * Abrir `index.html` en VS Code
   * Click derecho → "Open with Live Server"
   * O usar el botón "Go Live" en la barra inferior

### Método 2: Servidor Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego abrir: `http://localhost:8000`

### Método 3: Servidor Node.js

```bash
# Instalar serve globalmente
npm install -g serve

# Ejecutar
serve .
```

### Método 4: Servidor PHP

```bash
php -S localhost:8000
```

## 🎯 Sistema de Juego

### Power-ups Disponibles

| Tipo                 | Efecto         | Duración/Valor |
| -------------------- | -------------- | -------------- |
| **❤️ Salud**         | +25 HP         | Instantáneo    |
| **🛡️ Escudo**       | Inmunidad      | 5 segundos     |
| **⚡ Disparo Rápido** | Triple disparo | 10 segundos    |
| **⭐ Bonus Puntos**   | +500 puntos    | Instantáneo    |

### Progresión de Niveles

* **Niveles 1-2**: Enemigos básicos, aprendizaje
* **Nivel 3**: Primer jefe con 2 fases
* **Niveles 4-5**: Mayor dificultad, nuevos patrones
* **Nivel 6**: Segundo jefe mejorado
* **Y así sucesivamente...**

### Sistema de Puntuación

* **Enemigo básico**: 100 puntos
* **Enemigo rápido**: 150 puntos
* **Enemigo tanque**: 250 puntos
* **Jefe**: 2000 puntos + bonus por fases
* **Bonus nivel**: 500 × nivel
* **Power-up score**: 500 puntos

## 🔧 Desarrollo y Personalización

### Agregar Nuevos Enemigos

```javascript
// En levelmanager.js
spawnEnemy() {
    const types = ['basic', 'fast', 'tank', 'nuevo_tipo'];
    const weights = [0.5, 0.25, 0.15, 0.1];
    // ... implementar nuevo tipo en enemy.js
}
```

### Modificar Dificultad

```javascript
// Ajustar en levelmanager.js
this.spawnInterval = Math.max(0.5, 2.0 - (levelNumber * 0.15));
this.enemiesPerWave = 10 + (levelNumber * 3);
```

### Agregar Nuevos Power-ups

```javascript
// En powerup.js
case 'nuevo_powerup':
    this.color = '#COLOR_HEX';
    this.spriteKey = 'sprite_key';
    this.effect = 'efecto';
    this.value = valor;
    break;
```

## 🐛 Solución de Problemas

### Error: "CORS policy" al cargar recursos

**Solución:** Ejecutar desde un servidor web, no abriendo el HTML directamente.

### Error: Sonidos no se reproducen

**Solución:** Hacer click en la pantalla para activar el Audio Context del navegador.

### Error: Sprites no se cargan

**Solución:** Verificar que la ruta de la carpeta `assets/` sea correcta.

### Rendimiento bajo

**Solución:** Cerrar otras pestañas, verificar que el navegador esté actualizado.

## 🎨 Personalización

### Modificar Colores y Estilo

Editar el archivo `index.html` en la sección `<style>` para cambiar:

* Colores de interfaz
* Fuentes y tamaños
* Efectos visuales del HUD

### Agregar Nuevos Sonidos

1. Colocar archivo en `assets/audio/`
2. Registrar en `main.js` en la función `loadAssets()`
3. Usar con `audioManager.playSound('nombre')`

## 📊 Métricas Técnicas

* **Frame Rate**: 60 FPS objetivo
* **Tiempo de Carga**: < 3 segundos
* **Uso de Memoria**: < 100 MB
* **Compatibilidad**: Chrome, Firefox, Safari, Edge
* **Resolución**: 800×600 (responsive)

## 🚀 Roadmap Futuro

* [ ] Modo survival infinito
* [ ] Nuevos tipos de jefes
* [ ] Sistema de logros
* [ ] Online leaderboards
* [ ] Modo dos jugadores
* [ ] Nuevas armas y power-ups

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como demostración de las capacidades de las tecnologías web modernas para crear experiencias de juego completas sin dependencias externas.

**Tecnologías utilizadas:**

* HTML5 Canvas
* JavaScript ES6+
* Web Audio API
* CSS3 Animations
* Local Storage API

---

**¿Listo para jugar?** 🎯 ¡Recuerda ejecutar desde un servidor web y prepárate para la acción arcade!

*Desarrollado con pasión por el gaming y la tecnología web.* 🚀
