# Portfolio Project Documentation

## Hosting on GitHub

**Yes, this project is fully hostable on GitHub Pages.**

Because this project uses only client-side technologies (HTML, CSS, JavaScript) and no backend server (like Node.js, PHP, or Python), you can host it directly on GitHub Pages for free.

### How to Host:
1.  Push all these files to a GitHub repository.
2.  Go to repository **Settings** -> **Pages**.
3.  Select the `main` branch and `/ (root)` folder.
4.  Save. GitHub will provide a URL where your game is live.

---

## Technology Stack

This project is built using vanilla web technologies and the Three.js library for 3D rendering.

*   **HTML5**: Provides the structure of the page (UI overlays, canvas container).
*   **CSS3**: Handles styling for the user interface (menus, hints, dialogs), animations (flicker, breathe), and responsive design for mobile devices.
*   **JavaScript (ES6+)**: Handles all game logic, 3D rendering, and interactivity.
*   **Three.js (r132)**: A powerful 3D library used for:
    *   Rendering the 3D scene (WebGL).
    *   Handling the camera and lighting.
    *   Loading 3D geometries (Box, Cylinder, Plane).
    *   Managing materials and shadows.
*   **PointerLockControls**: A Three.js add-on that allows the mouse to control the camera view (FPS style) on desktop.
*   **ImprovedNoise.js**: A Perlin noise algorithm used to procedurally generate the terrain heightmap.

---

## File Overview

### 1. `index.html`
The entry point of the application.
*   **Head**: Loads stylesheets, fonts (Zen Old Mincho), and Three.js libraries (CDN).
*   **Body**: Contains the UI elements:
    *   `#start-screen`: The initial welcome screen with language toggle and "Start" button.
    *   `#ui-container`: Displays collection count and list.
    *   `#mobile-ui`: The virtual joystick and buttons (visible only on mobile).
    *   `#cutscene-overlay`: The container for dialogue sequences and character portraits.
    *   `#pickup-hint`: The "Press E" prompt.
*   **Scripts**: Loads all game scripts in order (`Localization.js`, `TouchControls.js`, `ImprovedNoise.js`, `Terrain.js`, `Cutscene.js`, `main.js`).

### 2. `css/styles.css`
Contains all visual styling.
*   **Typography**: Sets fonts and text shadows.
*   **UI Layout**: Positions the start screen, pause menu, and ending menu.
*   **Animations**: Defines `@keyframes` for the pickup hint flicker and character "breathing" effect.
*   **Responsive Design**: Contains a `@media` query to show `#mobile-ui` and adjust sizes on screens smaller than 1366px or with coarse pointers.

### 3. `js/main.js`
The core game engine.
*   **`init()`**: Sets up the Three.js scene (Camera, Renderer, Lights, Fog). Initializes the Terrain, Controls, and Documents.
*   **`animate()`**: The main game loop running 60 times per second. Handles:
    *   Physics (Gravity, Velocity).
    *   Movement (Keyboard + Touch integration).
    *   Collisions (Terrain, Trees, Water borders).
    *   Document spinning animation.
    *   Rendering the scene.
*   **`createDocuments()`**: Scatters 5 collectible documents randomly across the terrain.
*   **`checkDocumentCollection()`**: Detects proximity to documents, handles collection, triggering cutscenes, and unlocking controls (with mobile safety checks).
*   **`triggerEndingSequence()`**: Handles the win state, opens the CV pdf, and shows the final menu.
*   **`updatePickupHint()`**: Checks logic to show/hide the "Press E" hint.

### 4. `js/Terrain.js`
Procedurally generates the island world.
*   **`generate()`**: Creates a 300x300 plane.
*   **Heightmap Logic**: Uses `ImprovedNoise` to modify vertex heights, creating mountains, hills, and flattening the edges into the sea.
*   **Vertex Coloring**: Colors the terrain based on height (Deep Ocean -> Sand -> Forest -> Stone -> Snow).
*   **`addVegetation()`**: Randomly places trees (Pine, Oak, Bush) on land areas.
*   **`getHeightAt(x, z)`**: Utility to find the ground height at any coordinate (used for player gravity).
*   **`checkTreeCollision()`**: Prevents the player from walking through trees.

### 5. `js/Cutscene.js`
Manages the dialogue sequences.
*   **`start(dialogue)`**: Begins a cutscene, showing the overlay and the first line of text.
*   **`advance()`**: Moves to the next line. Handles special cases like `{PLAYER_NAME}` replacement.
*   **Name Input**: Handles the initial flow where the player types their name.

### 6. `js/TouchControls.js`
Provides mobile input support.
*   **Joystick**: Tracks touch movement on the left screen to act as WASD input.
*   **Look**: Tracks touch drag on the right screen to rotate the camera (Yaw/Pitch) using correct `YXZ` order for FPS feel.
*   **Buttons**: Handles "Jump" and "Pick" touch events.

### 7. `js/Localization.js`
Stores all text content strings.
*   **`LANG` Object**: Contains `en` (English) and `jp` (Japanese) versions of:
    *   UI text (Start, Resume, Collected).
    *   Document names (Intro, Skills, etc.).
    *   Dialogues (Intro conversation, Document reactions, Ending).

### 8. `js/ImprovedNoise.js`
A mathematical utility class.
*   Implements Ken Perlin's Improved Noise algorithm to creating smooth, natural-looking random values for terrain generation.

---

## Key Game Elements

### The Player
*   Represented by a camera at eye level (`y + 1.6`).
*   Uses a `velocity` vector for jumping and gravity.
*   Controls are locked to the center (PointerLock) on PC, and use a Virtual Joystick on mobile.

### The Terrain
*   Generated on the fly, so it's slightly different (or same seed if noise is fixed) every time.
*   Includes "invisible walls" logic to prevent walking into deep water.

### Documents
*   The main objective. There are 5 documents colored by category.
*   Collecting one pauses the game and plays a cutscene explaining the portfolio section (e.g., "This is my skills document").
*   Collecting all 5 triggers the ending.

### Lighting
*   **AmbientLight**: General softness.
*   **DirectionalLight**: The "Sun", casting shadows.
*   **PointLights**: Attached to documents to make them glow and easier to find.

---

## How to Play

*   **PC**:
    *   **WASD**: Move.
    *   **Mouse**: Look.
    *   **Space**: Jump.
    *   **E**: Pick up document.
    *   **Esc**: Pause.
*   **Mobile**:
    *   **Left Stick**: Move.
    *   **Right Screen Drag**: Look.
    *   **Jump Button**: Jump.
    *   **Pick Button**: Pick up document.
