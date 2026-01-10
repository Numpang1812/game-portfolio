
class TouchControls {
    constructor(controls, onJump, onPickup) {
        this.controls = controls;
        this.onJump = onJump;
        this.onPickup = onPickup;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.joystickActive = false;
        this.touchLookActive = false;

        this.joystickOrigin = { x: 0, y: 0 };
        this.joystickPointerId = null;
        this.lookPointerId = null;
        this.lookLastPosition = { x: 0, y: 0 };

        this.lookSpeed = 0.005;

        // UI Elements
        this.joystickZone = document.getElementById('joystick-zone');
        this.joystickKnob = document.getElementById('joystick-knob');
        this.btnJump = document.getElementById('btn-jump');
        this.btnPickup = document.getElementById('btn-pickup');

        this.init();
    }

    init() {
        if (!this.joystickZone) return;

        // Joystick Events
        this.joystickZone.addEventListener('touchstart', (e) => this.handleJoystickStart(e), { passive: false });
        this.joystickZone.addEventListener('touchmove', (e) => this.handleJoystickMove(e), { passive: false });
        this.joystickZone.addEventListener('touchend', (e) => this.handleJoystickEnd(e));

        // Look Events (Right side of screen)
        document.addEventListener('touchstart', (e) => this.handleLookStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleLookMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleLookEnd(e));

        // Button Events
        this.btnJump.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.onJump) this.onJump();
        });

        this.btnPickup.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.onPickup) this.onPickup();
        });
    }

    handleJoystickStart(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.joystickPointerId = touch.identifier;
        this.joystickActive = true;

        const rect = this.joystickZone.getBoundingClientRect();
        this.joystickOrigin = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        this.updateJoystick(touch.clientX, touch.clientY);
    }

    handleJoystickMove(e) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.joystickPointerId) {
                const touch = e.changedTouches[i];
                this.updateJoystick(touch.clientX, touch.clientY);
                break;
            }
        }
    }

    handleJoystickEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.joystickPointerId) {
                this.joystickActive = false;
                this.joystickPointerId = null;
                this.resetJoystick();
                break;
            }
        }
    }

    updateJoystick(clientX, clientY) {
        const radius = 50; // Max distance for knob
        let dx = clientX - this.joystickOrigin.x;
        let dy = clientY - this.joystickOrigin.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > radius) {
            const angle = Math.atan2(dy, dx);
            dx = Math.cos(angle) * radius;
            dy = Math.sin(angle) * radius;
        }

        // Update knob visual
        this.joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;

        // Update movement flags
        // Normalize input -1 to 1
        const inputX = dx / radius;
        const inputY = dy / radius;

        // Deadzone
        const deadzone = 0.2;

        this.moveRight = inputX > deadzone;
        this.moveLeft = inputX < -deadzone;
        this.moveBackward = inputY > deadzone;
        this.moveForward = inputY < -deadzone;
    }

    resetJoystick() {
        this.joystickKnob.style.transform = `translate(0px, 0px)`;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
    }

    handleLookStart(e) {
        // Only trigger look if NOT on joystick or buttons
        // This is tricky with multitouch. 
        // Simple heuristic: If start x > window.innerWidth / 2, it's look
        // (Assuming buttons are handled by their own listeners stopping propagation)
        // Actually, we attached listener to document. 

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];

            // Ignore if it's the joystick touch
            if (touch.identifier === this.joystickPointerId) continue;

            // Ignore if touching buttons (check target)
            if (touch.target === this.btnJump || touch.target === this.btnPickup) continue;

            // Only right side of screen for look
            if (touch.clientX > window.innerWidth / 2) {
                this.lookPointerId = touch.identifier;
                this.lookLastPosition = { x: touch.clientX, y: touch.clientY };
                break;
            }
        }
    }

    handleLookMove(e) {
        // Prevent default scrolling
        // e.preventDefault(); // Don't prevent default globally on document yet, interfere with UI? 
        // For game, preventing default on touchmove is usually good.

        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.lookPointerId) {
                const touch = e.changedTouches[i];
                const dx = touch.clientX - this.lookLastPosition.x;
                const dy = touch.clientY - this.lookLastPosition.y;

                this.rotateCamera(dx, dy);

                this.lookLastPosition = { x: touch.clientX, y: touch.clientY };
                break;
            }
        }
    }

    handleLookEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.lookPointerId) {
                this.lookPointerId = null;
                break;
            }
        }
    }

    rotateCamera(dx, dy) {
        const object = this.controls.getObject();
        object.rotation.y -= dx * this.lookSpeed;

        // Pitch (Up/Down) - PointerLockControls usually handles this via private API or helper
        // Standard PointerLockControls structure: 
        // this.getObject() returns the Yaw object (Player)
        // this.getObject().children[0] (or similar) is the Pitch object (Camera)
        // Let's try to access camera directly if controls doesn't expose it nicely

        if (camera) { // Global camera variable from main.js
            camera.rotation.x -= dy * this.lookSpeed;

            // Clamp pitch
            camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
        }
    }

    // Helper to sync with main.js movement variables
    isActive() {
        return this.joystickActive || this.lookPointerId !== null;
    }
}
