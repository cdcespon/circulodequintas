# 🎡 Círculo de Quintas Pro | Suite Interactiva para Músicos

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5 / CSS3](https://img.shields.io/badge/Frontend-Vanilla_HTML5_&_CSS3-orange.svg)](#)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-emerald.svg)](#)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25_Standalone-success.svg)](#)
[![Open Source](https://img.shields.io/badge/Open_Source-Community-purple.svg)](#)

> Una suite web interactiva, moderna y 100% autónoma diseñada para músicos, compositores, docentes y estudiantes. Explora la armonía tonal, practica intervalos, visualiza acordes en piano y guitarra, y desbloquea tu creatividad con progresiones por estilos y generación aleatoria de ideas.

---

## 🚀 Características Principales

### 🎡 1. Rueda Armónica Interactiva (SVG Vectorial)
- **Tonalidades Mayores y Menores Relativas**: Navegación intuitiva en 360° con armaduras de clave exactas (# y ♭) y nombres enarmónicos.
- **Grados Diatónicos en Tiempo Real**: Resaltado automático de la **Tónica (I / i)**, **Dominante (V)**, **Subdominante (IV)** y acordes diatónicos vecinos (**ii, iii, vi, vii°**).
- **Hub Táctil Central**: Muestra la tonalidad activa, su relativa y botón táctil para reproducir el acorde de tónica.
- **Explorador Geométrico de Intervalos y Modos**: Rayos vectoriales y polígonos sobre el círculo para comprender visualmente la tensión del tritono (TT), cuartas justas (P4), quintas justas (P5), terceras y modos diatónicos (Jónico, Dórico, Frigio, Lidio, Mixolidio, etc.).

### 🎹 2. Motor de Síntesis Polifónico (Web Audio API)
- Síntesis de sonido en tiempo real sin requerir archivos de audio externos ni conexión a internet.
- **4 Timbres de Sintetizador**:
  - 🎹 *Warm Rhodes* (Piano eléctrico aterciopelado con armónicos cálidos).
  - 🎹 *Piano Acústico* (Sonido percusivo brillante con ataque de macillo).
  - ✨ *Ambient Pad* (Ataque envolvente y sustain cinematográfico).
  - 🎸 *Acústico / Pluck* (Punteo limpio y articulado).
- Control de **BPM (40 a 240)** y **Volumen Maestro**.

### 🎸 3. Visualizadores de Instrumentos Sincronizados
- **Teclado de Piano Virtual (2 Octavas)**: Resalta las notas de cualquier escala o acorde seleccionado. Totalmente tocable con el ratón.
- **Diapasón de Guitarra (Fretboard de 12 Trastes)**: 6 cuerdas con afinación estándar (`E-A-D-G-B-E`), marcadores de trastes (3, 5, 7, 9 y 12) y digitaciones clicables con sonido individual.

### 🎶 4. Biblioteca de Progresiones por Estilos Musicales
Presets emblemáticos listos para escuchar y practicar, transpuestos en tiempo real a la clave seleccionada:
- **Pop & Éxitos**: Progresión de 4 acordes (`I - V - vi - IV`), Doo-Wop de los 50s (`I - vi - IV - V`), Progresión Sensible (`vi - IV - I - V`).
- **Jazz & Bossa Nova**: `ii7 - V7 - Imaj7` mayor estándar, `iiø7 - V7 - i` menor, Sustitución Tritonal (`ii7 - ♭II7 - Imaj7`), Bossa Nova (`Imaj7 - II7 - ii7 - V7`).
- **Blues & Rock**: 12-Bar Blues tradicional (`I7 - IV7 - V7`), Himno de Rock clásico (`I - ♭VII - IV`).
- **Flamenco & Latino**: Cadencia Andaluza (`i - ♭VII - ♭VI - V`).
- **Neo-Soul & R&B**: Acordes extendidos (`ii9 - V13 - Imaj9 - vi9`).
- **Cinematográfico / Épico**: Viaje del Héroe (`I - ♭VI - ♭III - ♭VII`).

### 🎲 5. Generador de Inspiración & Arena de Práctica
- **Generador de Progresiones**: Crea secuencias de acordes con complejidad armónica configurable (*Diatónica pura*, *Extendida con 7mas y 9nas*, o *Intercambio Modal con acordes prestados*) y permite fijarlas al círculo.
- **Retos & Quiz de Entrenamiento**: Ejercicios de oído y teoría (relativas menores, quintas/cuartas, alteraciones e intervalos) con contador de puntuación, racha y explicaciones didácticas.

### 🛡️ 6. Arquitectura 100% Offline & Portable (Single-File)
- Todo el código CSS, HTML y JavaScript está embebido en [index.html](index.html).
- **Cero dependencias externas**: Sin peticiones a CDNs, sin frameworks pesados, sin fuentes remotas. Funciona en cualquier navegador de escritorio o móvil incluso en modo avión.

---

## 📂 Estructura del Proyecto

```text
CirculoDequintas/
│
├── index.html                  # Aplicación completa 100% portable y offline
├── Circulo_de_Quintas_Demo.mp4 # Video demo en 1080p con locución en castellano
├── SGS.mp3                     # Pista de audio de fondo
├── README.md                   # Documentación principal del repositorio
│
├── css/
│   └── styles.css              # Hoja de estilos Cyber-Acoustic Dark Mode
│
└── js/
    ├── musicTheory.js          # Motor de teoría musical, escalas, acordes y presets
    ├── audio.js                # Síntesis polifónica Web Audio API y secuenciador
    ├── circle.js               # Renderizador SVG interactivo del Círculo de Quintas
    ├── instruments.js          # Visualizadores de Piano Virtual y Mástil de Guitarra
    └── app.js                  # Orquestador y controlador principal de eventos
```

---

## 💻 Instalación y Uso Rápido

No se requiere ningún paso de compilación ni instalación de paquetes (`npm`, `yarn`, etc.).

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/cdcespon/circulodequintas.git
   ```
2. **Abre la aplicación**:
   - Haz doble clic en `index.html` en tu explorador de archivos para abrirlo en tu navegador favorito (Chrome, Firefox, Edge, Safari, Brave).
   - O sirve los archivos localmente:
     ```bash
     python -m http.server 8080
     ```
     y navega a `http://localhost:8080`.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico** y **SVG Dinámico** para renderizado vectorial de alta nitidez.
- **CSS3 Moderno**: Variables CSS personalizadas, Grid, Flexbox, efectos *Glassmorphism* y animaciones de brillo neón.
- **JavaScript Moderno (ES6+)**: Lógica modular orientada a eventos.
- **Web Audio API**: Generación de ondas (seno, sierra, triángulo), envolventes ADSR, filtros pasa-bajos, delays de reverberación y compresores dinámicos.

---

## 🤝 Contribuciones y Comunidad

Este es un proyecto **Open Source** abierto y gratuito para la comunidad. Si deseas agregar nuevos estilos musicales, escalas exóticas, afinaciones alternativas de guitarra u otras mejoras:

1. Haz un **Fork** del proyecto.
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`.
3. Haz commit de tus cambios: `git commit -m 'feat: agrega nueva funcionalidad'`.
4. Haz push a tu rama: `git push origin feature/nueva-funcionalidad`.
5. Abre un **Pull Request**.

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.
