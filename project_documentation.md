# Portfolio Project Documentation

---

## Technology Stack

This project is built using vanilla web technologies and the Three.js library for 3D rendering.

*   **HTML5**: Structure and UI overlays.
*   **CSS3**: UI Styling, responsive layout, and animations (pulsing entry text, breathing character portraits).
*   **JavaScript (ES6+)**: Core engine, state management, and asset handling.
*   **Three.js (r132)**: WebGL 3D rendering, camera/lighting management, and physics math.
*   **HTML5 Audio**: Specialized management of menu and background tracks.
*   **PointerLockControls**: FPS-style mouse interaction for desktop.
*   **ImprovedNoise.js**: Procedural generation for the 300x300 terrain heightmap.

---

## File Overview

### 1. `index.html`
The main entry point. Orchestrates the loading of several UI layers:
*   **`#entry-screen`**: Initial "Click to Enter" splash screen to safely trigger audio.
*   **`#start-screen`**: Game introduction, language toggle, and start button.
*   **`#ui-container`**: Live-updated collection HUD.
*   **`#mobile-ui`**: Virtual joystick and touch buttons for mobile users.
*   **`#cutscene-overlay`**: RPG-style dialogue system with names and interactive input.

### 2. `css/`
*   **`styles.css`**: Base visual design, premium typography (Zen Old Mincho), and core animations.
*   **`mobile_responsive.css`**: Dedicated overrides for screens < 768px or tablets up to 1366px. Handles container scaling, smaller font sizes, and UI positioning.

### 3. `js/main.js`
The central brain of the game.
*   **Audio Logic**: Manages the transition from `menuMusic` (Kousui) to the atmospheric `backgroundMusic` exactly when roaming begins.
*   **Spawning**: Scatters 5 documents across a wide range with a minimum distance check to ensure even distribution.
*   **Cloud System**: Manages 30 voxel-style cloud clusters with randomized sizes and drifting behavior.
*   **Physics & Animation**: Handles player gravity, collision detection (terrain, trees, sea borders), and the main 60fps render loop.
*   **Interaction Flow**: Removed intrusive "Click to Resume" blockers for a more seamless gameplay flow.

### 4. `js/Terrain.js`
Generates the procedural island.
*   Places 500+ trees (Pine, Oak, Bush) based on terrain height.
*   Provides height-checking and collision logic for all other entities.
*   Includes a vast, transparent water plane for the surrounding ocean.

### 5. `js/Cutscene.js`
The story engine.
*   Handles typewriter text effects and auto-advancing dialogues.
*   Integrates the player-defined name into the story.
*   Synchronous completion callbacks to allow seamless PointerLock re-acquisition.

### 6. `js/TouchControls.js`
Enables premium mobile play.
*   **Virtual Joystick**: Smooth movement translation.
*   **Touch Look**: Rotational camera control specifically tuned for touch inertia.
*   **Action Buttons**: Large, accessible targets for Jumping and Interaction.

### 7. `js/Localization.js`
Multi-language support for:
*   UI elements and instruction labels.
*   Document category names (Intro, Skills, Objective, Experience, Hobbies).
*   Full character dialogue scripts.

---

## Key Game Elements

### Audio Experience
*   **Entry Splash**: Required by browser autoplay policies; captures initial gesture to start music.
*   **Music Transition**: `menuMusic` persists through name input/intro dialogue for a cinematic feel, switching to medieval acoustic vibes only when the player takes control.

### Exploration & Objective
*   **Document Colors**: Purposefully colored for visibility (e.g., Orange for "Objective" to contrast with green forest).
*   **Point Lights & Markers**: Each document has a vertical arrow marker and a colored glow to assist discovery.
*   **Winning**: Collecting all 5 documents triggers a final sequence that offers a direct button to **"View CV"** (designed specifically to bypass mobile popup blockers).

### Environmental Detail
*   **Voxel Clouds**: Procedurally grouped blocks at varying altitudes that drift slowly, adding depth to the sky.
*   **Terrain Biomes**: Color transitions from sandy beaches up to snowy mountain peaks.

---

## Controls

| Action | PC (Keyboard/Mouse) | Mobile (Touch) |
| :--- | :--- | :--- |
| **Move** | WASD | Virtual Joystick (Left) |
| **Look** | Mouse Move | Drag Right Screen |
| **Jump** | SPACE | Jump Button |
| **Interact/Pick** | E | Interaction Button |
| **View CV** | Automatic/Button | "View CV" Button |
| **Pause** | ESC | Back/Home Buttons |
