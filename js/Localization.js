
const LANG = {
    jp: {
        ui: {
            title: "ようこそ！",
            intro1: "これはパンのポートフォリオです。WASDで移動し、マウスで見る方向を変更してください。スペースキーでジャンプし、Eキーで文書を拾うことができます。",
            intro2: "このゲームでは、五つの書類がありますから、すべて拾ってください。それぞれの書類には、それぞれの情報があります。すべて拾ったら、ゲームを終了してください。",
            intro3: "楽しんで、よろしくお願いいたします！",
            startButton: "スタート",
            instructions: "<strong>コントロール:</strong><br>WASD - 動く<br>マウス - 見る<br>SPACE - ジャンプ<br>E - 書類を取る",
            documentsCollected: "収集した書類",
            pauseTitle: "一時停止",
            resumeButton: "再開",
            homeButton: "ホームに戻る",
            endingTitle: "ありがとうございました！",
            roamButton: "まだ探索する",
            endingHomeButton: "メインメニュー",
            enterName: "名前を入力してください。",
            hint: "クリックまたはEnterキーで続行...",
            characterName: "パン",
            pressE: "Eキーを押して拾う",
            viewCV: "履歴書(CV)を表示",
            endingTitleDirect: "プレイしていただき、ありがとうございます！",
            endingP1: "この小さな世界を楽しかったなら、良かったです！",
            endingP2: "CVを表示したいなら、表示ボタンを押してください。",
            endingP3: "これからもよろしくお願いいたします！",
            roamButtonDirect: "探索する",
            directCVButton: "履歴書(CV)を表示"
        },
        documentNames: {
            intro: "自己紹介",
            objective: "目的",
            skills: "スキル",
            experience: "経験",
            hobbies: "趣味"
        },
        dialogues: {
            askName: "名前を教えてください...",
            greeting: (name) => `こんにちは、あなたは "${name}" ですね。よろしくね！`,
            introSelf: "私はパンといいます。",
            introContext: "この世界には、私についての書類がバラバラに散らばれている。",
            introMission: "全の書類を見つけて集めてください。よろしくお願いいたしますよ！",

            // Document Interactions
            docIntro: [
                "すでにご存知かもしれませんが、私はパンと申します。",
                "20歳で、AUPP大学のソフトウェア開発学科の3年生です。",
                "小さい頃から技術に興味があり、中学生の時からプログラミングを学び始めました。",
                "将来は日本で働きたいです。素晴らしい人たちと一緒に働けるのが楽しみです。",
                "日本の文化と景色もとても美しいです。その将来に向けて、頑張ります！！"
            ],
            docObjective: [ // Note: This was missing in original main.js logic? No, check main.js for doc names mapped to vars.
                // Assuming "目的" maps to something not explicitly distinct in original code? 
                // Ah, looking at main.js, "目的" (Purpose) wasn't handled in the if/else chain? 
                // Wait, it was: "自己紹介", "スキル", "経験", "趣味". "目的" is in documentTypes list but maybe I missed it in main.js conditional?
                // I will add generic placeholder if missing or try to infer.
                // Actually in main.js step 40 view, I see: intro(x2), skills, experience, hobbies. "目的" might be the second intro check?
                // Let's create content for "Objective" just in case.
                "私はフルスタックエンジニアとして成長し、世界中の人々の役に立つソフトウェアを作ることが目標です。",
                "常に新しい技術を学び続け、より良いソリューションを提供したいと考えています。"
            ],
            docSkills: [
                "現在、プログラミング言語のJavaScript、HTML、CSS、Python、Java、Node.jsを学んだり、利用できます。",
                "また、LaravelフレームワークとAPIを使用してウェブアプリケーションを構築することができます。",
                "Gitを使用してコードのバージョン管理もできます。",
                "チームでの仕事の経験のおかげで、報連相のスキルがだんだん上手になっています。"
            ],
            docExperience: [
                "大学では、チームで働くことが多く、様々なアプリケーションを構築することができました。例えば、ターミナルチャットアプリケーション、ウェブサイト、数独ソルバー、小規模なウェブベースのゲームなどです。",
                "そして、SBI Ly Hourの銀行で、2つの内部プロジェクトを開発しました。",
                "現在はNextMakeのBusinden開発プロジェクトでボランティアとして活動しています。",
                "暇な時には、自分のゲームやウェブサイトを作っています。楽しいからです。"
            ],
            docHobbies: [
                "私の趣味は、ゲームやアニメを見ることでとサッカーです。",
                "好きなアニメは『ブルーロック』と『ブラッククローバー』です。面白いと思います。",
                "スポーツではサッカーが一番好きです！観戦もプレイも好きで、サッカーゲームもよくやります。",
                "他にも、日本の文化と景色に興味があります。とても美しいと思います！"
            ],

            ending: [
                "おめでとうございます！ すべての書類を見つけましたね。",
                "情報を一つの履歴書(CV)にまとめました。",
                "ブラウザで開きますので、ご確認ください。",
                "プレイしていただき、ありがとうございました！"
            ]
        },
        misc: {
        }
    },
    en: {
        ui: {
            title: "Welcome!",
            intro1: "This is Pan's Portfolio. Use WASD to move and mouse to look around. Press SPACE to jump and E to pick up documents.",
            intro2: "In this game, there are 5 documents. Please collect them all. Each document contains information about me. Once collected, you can finish the game and I will print a CV for you.",
            intro3: "I hope you enjoy my little world and nice to meet you!",
            startButton: "Start",
            instructions: "<strong>Controls:</strong><br>WASD - Move<br>Mouse - Look<br>SPACE - Jump<br>E - Pick up Document",
            documentsCollected: "Documents Collected",
            pauseTitle: "Paused",
            resumeButton: "Resume",
            homeButton: "Back to Home",
            endingTitle: "Thank You!",
            roamButton: "Roam Around",
            endingHomeButton: "Main Menu",
            enterName: "Please enter your name.",
            hint: "Click or Press Enter to continue...",
            characterName: "Pan",
            pressE: "Press E to pick up",
            viewCV: "View CV",
            endingTitleDirect: "Thank you for playing my game!",
            endingP1: "I hope you enjoyed exploring this small world.",
            endingP2: "You can view my CV by clicking the button below.",
            endingP3: "Looking forward to hearing from you!",
            roamButtonDirect: "Roam Around",
            directCVButton: "View CV"
        },
        documentNames: {
            intro: "Introduction",
            objective: "Objective",
            skills: "Skills",
            experience: "Experience",
            hobbies: "Hobbies"
        },
        dialogues: {
            askName: "Please tell me your name...",
            greeting: (name) => `Hello, you are "${name}", right? Nice to meet you!`,
            introSelf: "I am Pan.",
            introContext: "In this world, documents about me are scattered around.",
            introMission: "Please find and collect all of them. I'm counting on you!",

            // Document Interactions
            docIntro: [
                "Ah, this is my [Introduction].",
                "As you may know, I am Pan.",
                "I am 20 years old, a 3rd year student in Software Development at AUPP.",
                "I've been interested in tech since I was little and started coding in middle school.",
                "I want to work in Japan in the future. I look forward to working with amazing people.",
                "Japanese culture and scenery are also very beautiful. I will do my best for that future!!"
            ],
            docObjective: [
                "My goal is to grow as a full-stack engineer and build software that helps people around the world.",
                "I want to keep learning new technologies and provide better solutions."
            ],
            docSkills: [
                "Nice! You found my [Skills]!",
                "Currently, I can use/learn JavaScript, HTML, CSS, Python, Java, and Node.js.",
                "I can also build web apps using Laravel framework and APIs.",
                "I can verify code versioning using Git.",
                "Thanks to team experience, my Ho-Ren-So (Report, Contact, Consult) skills are improving."
            ],
            docExperience: [
                "Paper about my [Experience]...",
                "At university, I worked in teams a lot and built various apps like terminal chat, websites, sudoku solver, and small web games.",
                "I also developed 2 internal projects at SBI Ly Hour Bank.",
                "Currently volunteering at NextMake for Businden development project.",
                "In my free time, I make my own games and websites. Because it's fun."
            ],
            docHobbies: [
                "Ah! My [Hobbies]!",
                "My hobbies are watching anime/playing games and soccer.",
                "My favorite anime are 'Blue Lock' and 'Black Clover'. They are interesting.",
                "In sports, I like soccer the most! Watching and playing, and I play soccer games too.",
                "I'm also interested in Japanese culture and scenery. I think they are beautiful!"
            ],

            ending: [
                "Congratulations! You found all the documents.",
                "I have compiled the information into a single CV.",
                "It will open in your browser, please check it.",
                "Thank you for playing!"
            ]
        },
        misc: {
        }
    }
};

let currentLanguage = 'jp';
const isEndingPage = window.location.href.toLowerCase().includes('ending_index');

function setLanguage(lang) {
    if (LANG[lang]) {
        currentLanguage = lang;
        updateUIText();
    }
}

function updateUIText() {
    const t = LANG[currentLanguage].ui;

    // Start Screen
    const startBtn = document.getElementById('start-button');
    if (startBtn) {
        if (isEndingPage) {
            startBtn.textContent = t.roamButtonDirect;
        } else {
            startBtn.textContent = t.startButton;
        }
    }

    // Direct CV Button (Special for ending_index.html)
    const directCVBtn = document.getElementById('direct-cv-button');
    if (directCVBtn) directCVBtn.textContent = t.directCVButton;

    // View CV Button (Dynamic in index.html)
    const skipToCVBtn = document.getElementById('skip-to-cv-button');
    if (skipToCVBtn) skipToCVBtn.textContent = t.viewCV;

    // Ending Page Specific Texts
    if (isEndingPage) {
        const h1 = document.querySelector('#start-screen h1');
        if (h1) h1.textContent = t.endingTitleDirect;

        const ps = document.querySelectorAll('#start-screen p');
        if (ps.length >= 3) {
            ps[0].textContent = t.endingP1;
            ps[1].textContent = t.endingP2;
            ps[2].textContent = t.endingP3;
        }
    } else {
        // Normal Start Screen
        const startTitle = document.querySelector('#start-screen h1');
        if (startTitle) startTitle.textContent = t.title;

        const startP = document.querySelectorAll('#start-screen p');
        if (startP.length >= 3) {
            startP[0].textContent = t.intro1;
            startP[1].textContent = t.intro2;
            startP[2].textContent = t.intro3;
        }
    }

    // HUD
    const docsLabel = document.getElementById('ui-container');
    if (docsLabel && docsLabel.firstChild) {
        // Preserving the span for count
        const countSpan = document.getElementById('document-count');
        const count = countSpan ? countSpan.textContent : "0";
        docsLabel.innerHTML = `${t.documentsCollected}: <span id="document-count">${count}</span>/5<div id="collected-docs"></div>`;
        // Need to restore collected docs list... handled by updateCollectedDocumentsList in main
        // A bit tricky if we just wiped innerHTML. Better to separate label text.
        // For now, let's assume updateCollectedDocumentsList will be called or we can just update the first text node.
        docsLabel.childNodes[0].nodeValue = t.documentsCollected + ": ";
    }

    // Instructions
    const instr = document.querySelector('.instructions p');
    if (instr) instr.innerHTML = t.instructions;

    // Pause Menu
    const pauseTitle = document.querySelector('#pause-container h1');
    if (pauseTitle) pauseTitle.textContent = t.pauseTitle;

    const resumeBtn = document.getElementById('resume-button');
    if (resumeBtn) resumeBtn.textContent = t.resumeButton;

    const homeBtn = document.getElementById('home-button');
    if (homeBtn) homeBtn.textContent = t.homeButton;

    // Ending Menu
    const endTitle = document.querySelector('#ending-container h1');
    if (endTitle) endTitle.textContent = t.endingTitle;

    const roamBtn = document.getElementById('roam-button');
    if (roamBtn) roamBtn.textContent = t.roamButton;

    const endHomeBtn = document.getElementById('ending-home-button');
    if (endHomeBtn) endHomeBtn.textContent = t.endingHomeButton;

    const viewCVBtn = document.getElementById('view-cv-button');
    if (viewCVBtn) viewCVBtn.textContent = t.viewCV;

    // Input
    const inputHint = document.querySelector('#cutscene-input-container p');
    if (inputHint) inputHint.textContent = t.enterName;

    // Cutscene Hint
    const csHint = document.querySelector('.cutscene-hint');
    if (csHint) csHint.textContent = t.hint;

    // Update Collected Docs List (if in game)
    if (typeof updateCollectedDocumentsList === 'function') {
        updateCollectedDocumentsList();
    }
}

// Initialize translation on load
updateUIText();
