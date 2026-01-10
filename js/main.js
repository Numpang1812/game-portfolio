// Game variables
let scene, camera, renderer, controls;

let keyMoveForward = false;
let keyMoveBackward = false;
let keyMoveLeft = false;
let keyMoveRight = false;
let moveForward = false; // logic var, referencing key or touch
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let canJump = false;
let documents = [];
let collectedCount = 0;
const gravity = 0.005; // Gravity constant
let velocity = new THREE.Vector3(); // Player velocity
let terrain; // Terrain object
let cutscene; // Cutscene object
let selectedCharacter = "knight"; // Selected character
let touchControls; // Mobile controls
let backgroundMusic; // Background audio
let menuMusic; // Menu-only audio
const clouds = []; // Array to store cloud meshes


// Document Colors and Keys
const documentTypes = [
    { key: "intro", color: 0x3498db },
    { key: "objective", color: 0xffa500 },
    { key: "skills", color: 0xe74c3c },
    { key: "experience", color: 0x9b59b6 },
    { key: "hobbies", color: 0xf1c40f }
];
let collectedDocuments = [];

// Language Toggle
const langBtn = document.getElementById('lang-toggle');
if (langBtn) {
    langBtn.addEventListener('click', () => {
        const newLang = currentLanguage === 'jp' ? 'en' : 'jp';
        setLanguage(newLang);
        langBtn.textContent = `Language: ${newLang.toUpperCase()}`;
    });
}

// Entry Screen Logic (Handles Autoplay)
const entryScreen = document.getElementById('entry-screen');
const startScreen = document.getElementById('start-screen');

const handleEntry = () => {
    // Start menu music immediately on legal interaction
    if (!menuMusic) {
        menuMusic = new Audio('models/kousui.mp3');
        menuMusic.loop = true;
        menuMusic.volume = 0.4;
        menuMusic.play().catch(e => console.warn("Menu music blocked:", e));
    }

    // Hide entry screen and show start screen
    entryScreen.style.opacity = '0';
    setTimeout(() => {
        entryScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        startScreen.style.opacity = '0';
        // Fade in start screen
        setTimeout(() => startScreen.style.opacity = '1', 50);
    }, 1000);

    // Remove listeners
    document.removeEventListener('click', handleEntry);
    document.removeEventListener('keydown', handleEntry);
};

// Only add listeners if entry screen is present
if (entryScreen) {
    document.addEventListener('click', handleEntry);
    document.addEventListener('keydown', handleEntry);
}


// Start game when button is clicked
document.getElementById('start-button').addEventListener('click', function () {
    let playerName = "Traveler"; // Default temporary name
    document.getElementById('start-screen').style.display = 'none';

    // Update character image for cutscene
    const charImg = document.getElementById('character-image');
    charImg.src = `models/${selectedCharacter}.png`;

    // Start Cutscene
    cutscene = new Cutscene((name) => {
        // Callback when name is determined
        playerName = name;
    }, () => {
        // On Complete - Transitions the music and starts the game

        // Stop menu music
        if (menuMusic) {
            menuMusic.pause();
            menuMusic = null;
        }

        // Initialize and play background music
        if (!backgroundMusic) {
            backgroundMusic = new Audio('models/10 Minutes in a Peaceful Medieval Fantasy Village  4K Ambience  Magical Folk Music.mp3');
            backgroundMusic.loop = true;
            backgroundMusic.volume = 0.5; // Start at 50% volume
            backgroundMusic.play().catch(e => console.warn("Music playback failed:", e));
        }

        document.getElementById('crosshair').style.display = 'block';

        init();
        animate();

        // Directly request lock (preserved user gesture context from click)
        try {
            controls.lock();
        } catch (e) {
            console.warn("Pointer lock failed (expected on mobile)");
        }
    });

    cutscene.start();
});

// Set up keyboard controls
const onKeyDown = function (event) {
    switch (event.code) {
        case 'KeyW': keyMoveForward = true; break;
        case 'KeyA': keyMoveLeft = true; break;
        case 'KeyS': keyMoveBackward = true; break;
        case 'KeyD': keyMoveRight = true; break;
        case 'Space':
            if (canJump) {
                velocity.y += 0.15;
                canJump = false;
            }
            break;
        case 'KeyE':
            checkDocumentCollection();
            break;
    }
};

const onKeyUp = function (event) {
    switch (event.code) {
        case 'KeyW': keyMoveForward = false; break;
        case 'KeyA': keyMoveLeft = false; break;
        case 'KeyS': keyMoveBackward = false; break;
        case 'KeyD': keyMoveRight = false; break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Initialize the scene
function init() {
    // ✅ CREATE SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 20, 200);

    // ✅ CREATE CAMERA
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.rotation.order = 'YXZ';
    camera.position.set(0, 10, 0); // Start higher up

    // ✅ CREATE RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // ✅ SET UP CONTROLS
    controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    document.addEventListener('click', function () {
        // Don't lock if clicking on pause menu buttons or during other UI interactions
        if (document.getElementById('pause-menu').style.display === 'flex') return;
        controls.lock();
    });

    // Handle Pointer Lock Unlock (Esc key or system unlock)
    controls.addEventListener('unlock', () => {

        // Check if we are in a cutscene by checking the overlay visibility
        const isCutsceneActive = document.getElementById('cutscene-overlay').style.display !== 'none';

        if (window.isSystemUnlock) {
            window.isSystemUnlock = false; // Reset for next time
            return;
        }

        // Show Pause Menu
        document.getElementById('pause-menu').style.display = 'flex';
    });

    document.getElementById('resume-button').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('pause-menu').style.display = 'none';
        // Only lock if NOT in cutscene
        const isCutsceneActive = document.getElementById('cutscene-overlay').style.display !== 'none';
        if (!isCutsceneActive) {
            controls.lock();
        }
    });

    document.getElementById('home-button').addEventListener('click', () => {
        location.reload();
    });

    // ✅ GENERATE TERRAIN
    terrain = new Terrain(scene);
    terrain.generate();

    // Place player on terrain
    const startY = terrain.getHeightAt(0, 0);
    controls.getObject().position.y = startY + 2;

    // ✅ ADD LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    scene.add(dirLight);

    // Add documents
    createDocuments();

    // Add clouds
    createClouds();

    // ✅ HANDLE WINDOW RESIZE
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ✅ INIT TOUCH CONTROLS
    touchControls = new TouchControls(controls, () => {
        // Jump Action
        if (canJump === true) {
            velocity.y += 0.15;
            canJump = false;
        }
    }, () => {
        // Pickup Action (Check collection)
        checkDocumentCollection();
    });
}

function createClouds() {
    const cloudCount = 30;
    const range = 400;

    for (let i = 0; i < cloudCount; i++) {
        const clusterSize = 4 + Math.floor(Math.random() * 4);
        const clusterGroup = new THREE.Group();

        for (let j = 0; j < clusterSize; j++) {
            const w = 5 + Math.random() * 20;
            const h = 3 + Math.random() * 10;
            const d = 5 + Math.random() * 15;
            const geo = new THREE.BoxGeometry(w, h, d);
            const mat = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.8,
                flatShading: true
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 15
            );
            mesh.castShadow = true;
            clusterGroup.add(mesh);
        }

        const x = (Math.random() - 0.5) * range;
        const y = 80 + Math.random() * 40;
        const z = (Math.random() - 0.5) * range;

        clusterGroup.position.set(x, y, z);
        clusterGroup.userData = { speed: 0.02 + Math.random() * 0.05 };
        scene.add(clusterGroup);
        clouds.push(clusterGroup);
    }
}

function createDocuments() {
    const range = 170;
    const minDistance = 10;
    const placedPositions = [];
    let created = 0;

    let attempts = 0;
    while (created < 5 && attempts < 1000) {
        attempts++;
        const x = (Math.random() - 0.5) * range;
        const z = (Math.random() - 0.5) * range;
        const y = terrain.getHeightAt(x, z);

        // Only place if on land (above water level -2 with buffer)
        if (y > 0) {
            // Check minimum distance from other documents
            let tooClose = false;
            for (const pos of placedPositions) {
                const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(z - pos.z, 2));
                if (dist < minDistance) {
                    tooClose = true;
                    break;
                }
            }

            if (tooClose) continue;

            const documentGeometry = new THREE.BoxGeometry(0.15, 1.3, 0.9);
            const documentMaterial = new THREE.MeshPhongMaterial({
                color: documentTypes[created].color,
                emissive: 0x111111,
                emissiveIntensity: 0.2
            });

            const docMesh = new THREE.Mesh(documentGeometry, documentMaterial);
            docMesh.position.set(x, y + 1.5, z);
            docMesh.rotation.y = Math.random() * Math.PI;
            docMesh.userData = {
                index: created,
                collected: false,
                key: documentTypes[created].key
            };
            docMesh.castShadow = true;

            const markerGeo = new THREE.CylinderGeometry(1, 0, 4, 16);
            const markerMat = new THREE.MeshBasicMaterial({
                color: documentTypes[created].color,
                transparent: true,
                opacity: 0.8
            });
            const marker = new THREE.Mesh(markerGeo, markerMat);
            marker.position.y = 2.5;

            docMesh.add(marker);

            const light = new THREE.PointLight(documentTypes[created].color, 1, 10);
            light.position.y = 2;
            docMesh.add(light);

            scene.add(docMesh);
            documents.push(docMesh);
            placedPositions.push({ x, z });
            created++;
        }
    }
}

// Check if player is near a document to collect it
function checkDocumentCollection() {
    const playerPosition = controls.getObject().position;

    documents.forEach((doc, index) => {
        if (doc.userData.collected) return;

        const distance = playerPosition.distanceTo(doc.position);

        if (distance < 3.0) {
            // Collect the document
            doc.userData.collected = true;
            doc.visible = false;
            collectedCount++;

            const docNameKey = doc.userData.key;
            // Get localized name
            const docName = LANG[currentLanguage].documentNames[docNameKey] || docNameKey;

            collectedDocuments.push(docName);

            document.getElementById('document-count').textContent = collectedCount;
            updateCollectedDocumentsList();
            collectedDocuments[collectedDocuments.length - 1] = docNameKey;
            updateCollectedDocumentsList();

            // PAUSE GAME & PLAY CUTSCENE
            window.isSystemUnlock = true;
            try {
                controls.unlock();
            } catch (e) { }

            // Pull dialogue from Localization
            // We need to map key to dialogue properties
            // key: intro -> docIntro
            let dialogueKey = "";
            switch (docNameKey) {
                case "intro": dialogueKey = "docIntro"; break;
                case "objective": dialogueKey = "docObjective"; break;
                case "skills": dialogueKey = "docSkills"; break;
                case "experience": dialogueKey = "docExperience"; break;
                case "hobbies": dialogueKey = "docHobbies"; break;
            }

            let dialogue = LANG[currentLanguage].dialogues[dialogueKey];

            // Fallback
            if (!dialogue) dialogue = ["..."];

            // Define resume callback
            cutscene.onComplete = () => {
                try {
                    controls.lock();
                } catch (e) {
                    // Ignore on mobile
                }

                // Win condition check after resume
                if (collectedCount === documents.length) {
                    setTimeout(triggerEndingSequence, 1000);
                }
            };

            cutscene.start(dialogue);
        }
    });
}

// Update the collected documents list in UI
function updateCollectedDocumentsList() {
    const container = document.getElementById('collected-docs');
    container.innerHTML = '';

    collectedDocuments.forEach(docKey => {
        const docName = LANG[currentLanguage].documentNames[docKey] || docKey;
        const docElement = document.createElement('div');
        docElement.textContent = `✓ ${docName}`;
        container.appendChild(docElement);
    });
}


// Trigger Ending Sequence
function triggerEndingSequence() {
    // Unlock pointer for cutscene
    window.isSystemUnlock = true;
    try {
        controls.unlock();
    } catch (e) { }

    const endingDialogue = LANG[currentLanguage].dialogues.ending;

    cutscene.onComplete = () => {
        // Show Ending Menu
        document.getElementById('ending-menu').style.display = 'flex';

        // Attempt to open CV automatically (might be blocked on mobile, but fallback is the button)
        try {
            window.open('models/Piseth_Tyvirakpoung_CV.pdf', '_blank');
        } catch (e) {
            console.warn("Auto-opening PDF blocked or failed:", e);
        }
    };

    cutscene.start(endingDialogue);
}

// Ending Menu Buttons
document.getElementById('roam-button').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('ending-menu').style.display = 'none';
    controls.lock();
});

document.getElementById('ending-home-button').addEventListener('click', () => {
    location.reload();
});

document.getElementById('view-cv-button').addEventListener('click', () => {
    window.open('models/Piseth_Tyvirakpoung_CV.pdf', '_blank');
});

// Check if hint should be shown
function updatePickupHint() {
    if (!controls || !controls.getObject()) return;

    const playerPosition = controls.getObject().position;
    let nearDocument = false;

    documents.forEach(doc => {
        if (doc.userData.collected) return;
        const distance = playerPosition.distanceTo(doc.position);
        if (distance < 3.0) {
            nearDocument = true;
        }
    });

    const hintEl = document.getElementById('pickup-hint');
    const isCutsceneActive = document.getElementById('cutscene-overlay').style.display !== 'none';

    if (nearDocument && !isCutsceneActive) {
        hintEl.style.display = 'block';
        hintEl.textContent = LANG[currentLanguage].ui.pressE;
    } else {
        hintEl.style.display = 'none';
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const isLocked = controls.isLocked;
    const isTouch = touchControls && touchControls.isActive();
    const isGameActive = isLocked || isTouch || (touchControls && touchControls.joystickActive);

    // Let's check if start screen is hidden
    const isStarted = document.getElementById('start-screen').style.display === 'none';
    const isPaused = document.getElementById('pause-menu').style.display !== 'none';
    const isCutscene = document.getElementById('cutscene-overlay').style.display !== 'none';
    const isEnding = document.getElementById('ending-menu') && document.getElementById('ending-menu').style.display !== 'none';

    if (isStarted && !isPaused && !isEnding && !isCutscene) {
        // Reset move flags
        moveForward = keyMoveForward;
        moveBackward = keyMoveBackward;
        moveLeft = keyMoveLeft;
        moveRight = keyMoveRight;

        // Override/Merge with Touch Controls if active
        if (touchControls) {
            moveForward = moveForward || touchControls.moveForward;
            moveBackward = moveBackward || touchControls.moveBackward;
            moveLeft = moveLeft || touchControls.moveLeft;
            moveRight = moveRight || touchControls.moveRight;
        }

        // Apply gravity
        velocity.y -= gravity;

        // Calculate intended movement direction
        const delta = 0.2;
        let dx = 0;
        let dz = 0;

        if (moveForward) dz += delta;
        if (moveBackward) dz -= delta;
        if (moveLeft) dx -= delta;
        if (moveRight) dx += delta;

        // Store old position
        const currentPos = controls.getObject().position;
        const oldX = currentPos.x;
        const oldZ = currentPos.z;

        // Apply movement
        controls.moveRight(dx);
        controls.moveForward(dz);

        // Check new position
        const newPos = controls.getObject().position;
        const newHeight = terrain.getHeightAt(newPos.x, newPos.z);
        const waterBuffer = -1.5;

        // Rivers/Lakes closer to center (dist < 120) are safe to enter.
        const distFromCenter = Math.sqrt(newPos.x * newPos.x + newPos.z * newPos.z);

        if (newHeight < waterBuffer && distFromCenter > 120) {
            newPos.x = oldX;
            newPos.z = oldZ;
        }

        // 2. Tree Collision Check
        if (terrain.checkTreeCollision(newPos.x, newPos.z, 0.5)) {
            newPos.x = oldX;
            newPos.z = oldZ;
        }

        newPos.y += velocity.y;

        // Terrain collision (Ground)
        // Re-check height at finalized X/Z in case we reverted
        const terrainHeight = terrain.getHeightAt(newPos.x, newPos.z);

        if (newPos.y < terrainHeight + 1.6) {
            velocity.y = 0;
            newPos.y = terrainHeight + 1.6;
            canJump = true;
        }

        // Update Pickup Hint
        updatePickupHint();
    }

    documents.forEach(doc => {
        if (doc.visible) {
            doc.rotation.y += 0.01;
        }
    });

    // Update clouds
    clouds.forEach(cloud => {
        cloud.position.x += cloud.userData.speed;
        if (cloud.position.x > 250) cloud.position.x = -250;
    });

    renderer.render(scene, camera);
}