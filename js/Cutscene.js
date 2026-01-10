class Cutscene {
    constructor(onNameSet, onComplete) {
        this.onNameSet = onNameSet;
        this.onComplete = onComplete;
        this.playerName = ""; // Will be set later
        this.overlay = document.getElementById('cutscene-overlay');
        this.dialogueBox = document.getElementById('dialogue-box');
        this.characterContainer = document.getElementById('character-container'); // Add reference
        this.dialogueText = document.getElementById('dialogue-text');
        this.nameTag = document.getElementById('character-name');

        // Input elements
        this.inputContainer = document.getElementById('cutscene-input-container');
        this.nameInput = document.getElementById('cutscene-name-input');

        // Update name tag in UI
        this.nameTag.textContent = 'パン';

        this.dialogues = []; // Will be populated after name is set

        this.currentIndex = 0;
        this.isTyping = false;
        this.isWaitingForInput = false;
        this.typeSpeed = 30;
        this.activeDialogues = [];
        this.autoAdvanceTimer = null;

        // Bind click to advance
        this.overlay.addEventListener('click', (e) => {
            // Don't advance if clicking on input
            if (e.target === this.nameInput) return;
            this.advance();
        });

        // Bind key to advance
        this.handleKey = this.handleKey.bind(this);
        document.addEventListener('keydown', this.handleKey);

        // Bind input enter key
        this.nameInput.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                this.submitName();
                e.stopPropagation(); // Prevent bubbling to document handler
            }
        });

        // Add skip hint
        const hint = document.createElement('div');
        hint.className = 'cutscene-hint';
        hint.textContent = 'Click or Press Enter to continue...';
        this.overlay.appendChild(hint);
    }

    handleKey(e) {
        if (this.overlay.style.display !== 'none' && e.code === 'Enter') {
            if (!this.isWaitingForInput) {
                this.advance();
            }
        }
    }

    start(customDialogues = null) {
        this.overlay.style.display = 'flex';
        this.overlay.style.opacity = '1';

        if (customDialogues) {
            // Playing a document cutscene (name already known)
            this.activeDialogues = customDialogues;
            this.inputContainer.style.display = 'none';
            this.dialogueBox.style.display = 'block';
            this.characterContainer.style.display = 'flex'; // Ensure visible
            setTimeout(() => this.showDialogue(0), 100);
        } else {
            // Playing Intro - Need to ask for name first
            // First show the question as a dialogue
            this.nameTag.textContent = '???';
            this.activeDialogues = [LANG[currentLanguage].dialogues.askName];
            this.needNameInput = true;
            this.inputContainer.style.display = 'none';
            this.dialogueBox.style.display = 'block';
            this.characterContainer.style.display = 'flex'; // Ensure visible
            setTimeout(() => this.showDialogue(0), 100);
        }
    }

    showNameInput() {
        this.isWaitingForInput = true;
        this.dialogueBox.style.display = 'none'; // Hide dialogue box
        this.characterContainer.style.display = 'none'; // Hide character
        this.inputContainer.style.display = 'block';
        this.nameInput.value = '';
        this.nameInput.focus();
        // Dialogue text remains from previous step ("名前を教えてください...")
        this.nameTag.textContent = '???';
    }

    submitName() {
        const name = this.nameInput.value.trim();
        if (!name) return; // Don't accept empty names

        this.playerName = name;
        if (this.onNameSet) this.onNameSet(name);

        this.isWaitingForInput = false;
        this.inputContainer.style.display = 'none';
        this.dialogueBox.style.display = 'block'; // Show dialogue box again
        this.characterContainer.style.display = 'flex'; // Show character again
        this.needNameInput = false;

        // Initialize dialogues with the new name
        const t = LANG[currentLanguage].dialogues;
        this.dialogues = [
            t.greeting(this.playerName),
            t.introSelf,
            t.introContext,
            t.introMission
        ];

        this.activeDialogues = this.dialogues;
        this.nameTag.textContent = LANG[currentLanguage].ui.characterName; // Localized Name

        // Proceed to first dialogue
        this.showDialogue(0);
    }

    showDialogue(index) {
        if (!this.activeDialogues) return; // Safety check

        if (index >= this.activeDialogues.length) {
            if (this.needNameInput) {
                this.showNameInput();
                this.needNameInput = false; // Prevent loop, although we switch activeDialogues in submitName
                return;
            }
            this.end();
            return;
        }

        this.currentIndex = index;
        this.dialogueText.textContent = '';
        this.isTyping = true;
        clearTimeout(this.autoAdvanceTimer);

        const text = this.activeDialogues[index];
        let charIndex = 0;

        const typeLoop = () => {
            if (!this.isTyping) return; // Stopped typing (e.g. skipped)

            if (charIndex < text.length) {
                this.dialogueText.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeLoop, this.typeSpeed);
            } else {
                this.isTyping = false;
                // Auto-advance after 5 seconds
                this.autoAdvanceTimer = setTimeout(() => this.advance(), 15000);
            }
        };

        typeLoop();
    }

    advance() {
        if (this.isWaitingForInput) return; // Cannot advance while waiting for input

        clearTimeout(this.autoAdvanceTimer);

        if (this.isTyping) {
            // Instant finish
            this.isTyping = false;
            if (this.activeDialogues) {
                this.dialogueText.textContent = this.activeDialogues[this.currentIndex];
                // Even if instant, we should set the auto-timer for the next advance
                this.autoAdvanceTimer = setTimeout(() => this.advance(), 15000);
            }
        } else {
            // Next line
            this.showDialogue(this.currentIndex + 1);
        }
    }

    end() {
        clearTimeout(this.autoAdvanceTimer);

        // Trigger onComplete IMMEDIATELY to preserve user gesture context (for PointerLock)
        if (this.onComplete) this.onComplete();

        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.style.display = 'none';
        }, 1000); // Fade out duration
    }
}
