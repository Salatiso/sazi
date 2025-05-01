const beginnerQuestions = [
    { english: 'Hello', xhosa: 'Molo', source: 'vocabulary', id: 'molo' },
    { english: 'Dog', xhosa: 'Inja', source: 'vocabulary', id: 'inja' },
    { english: 'One', xhosa: 'Nye', source: 'numbers', id: 'nye' },
    { english: 'Two', xhosa: 'Mbini', source: 'numbers', id: 'mbini' },
    { english: 'Cat', xhosa: 'Ikati', source: 'vocabulary', id: 'ikati' },
];

const intermediateQuestions = [
    { english: 'I love you', xhosa: 'Ndiyakuthanda', source: 'phrases', id: 'ndiyakuthanda' },
    { english: 'How are you?', xhosa: 'Unjani?', source: 'phrases', id: 'unjani' },
    { english: 'I’m hungry', xhosa: 'Ndilambile', source: 'phrases', id: 'ndilambile' },
    { english: 'Goodbye', xhosa: 'Sala kakuhle', source: 'phrases', id: 'sala_kakuhle' },
    { english: 'Come', xhosa: 'Yiza', source: 'phrases', id: 'yiza' },
];

const expertQuestions = [
    { english: 'Telling Folk Tales', xhosa: 'Ukuxoxa Iintsomi', source: 'activities', id: 'ukuxoxa_iintsomi' },
    { english: 'Welcoming a Newborn', xhosa: 'Imbeleko', source: 'culture', id: 'imbeleko' },
    { english: 'Skipping Rope', xhosa: 'Umgusha', source: 'activities', id: 'umgusha' },
    { english: 'Respect', xhosa: 'Intlonipho', source: 'culture', id: 'intlonipho' },
    { english: 'Mourning', xhosa: 'Ukuzila', source: 'culture', id: 'ukuzila' },
];

let currentQuestions = [];
let translations = {};
let currentLanguage = localStorage.getItem('language') || 'xh';

// Gamification State (using sessionStorage to reset on page close)
let userPoints = parseInt(sessionStorage.getItem('userPoints')) || 0;
let userBadges = JSON.parse(sessionStorage.getItem('userBadges')) || [];
let quickTestAttempts = parseInt(sessionStorage.getItem('quickTestAttempts')) || 0;
let quickTestCorrect = parseInt(sessionStorage.getItem('quickTestCorrect')) || 0;
let timelineAttempts = parseInt(sessionStorage.getItem('timelineAttempts')) || 0;
let timelineCorrect = parseInt(sessionStorage.getItem('timelineCorrect')) || 0;
let sidebarQuizAttempts = parseInt(sessionStorage.getItem('sidebarQuizAttempts')) || 0;
let sidebarQuizCorrect = parseInt(sessionStorage.getItem('sidebarQuizCorrect')) || 0;

// Leaderboard State (using sessionStorage for daily reset)
let leaderboard = JSON.parse(sessionStorage.getItem('leaderboard')) || { nickname: null, score: 0 };

// Timeline Data
const timelineData = {
    january: {
        en: {
            name: "January",
            info: "It's summer! Tambuki grass grows tall, and families gather after New Year celebrations.",
            question: "What is the Xhosa name for January?",
            answer: "EyoMqungu"
        },
        xh: {
            name: "EyoMqungu",
            info: "Yihlobo! Ingca yeTambuki ikhula ibe nde, kwaye iintsapho ziyahlangana emva kwemibhiyozo yoNyaka oMtsha.",
            question: "Yintoni igama lesiXhosa leJanuary?",
            answer: "EyoMqungu"
        },
        season: "summer"
    },
    february: {
        en: {
            name: "February",
            info: "Still summer. Grains like maize swell, preparing for harvest festivals.",
            question: "What is the Xhosa name for February?",
            answer: "EyoMdumba"
        },
        xh: {
            name: "EyoMdumba",
            info: "Kuseyihlobo. Iinkozo ezifana nombona ziyadumba, zilungiselela imibhiyozo yokuvuna.",
            question: "Yintoni igama lesiXhosa leFebruary?",
            answer: "EyoMdumba"
        },
        season: "summer"
    },
    march: {
        en: {
            name: "March",
            info: "Autumn begins. First fruits like pumpkins are harvested, celebrated in the First Fruits Festival (Ukweshwama).",
            question: "What is the Xhosa name for March?",
            answer: "EyoKwindla"
        },
        xh: {
            name: "EyoKwindla",
            info: "Ukwindla kuqala. Iziqhamo zokuqala ezifana namathanga ziyavunwa, zibhiyozelwa kuMbhiyozo weZiqhamo zokuQala (Ukweshwama).",
            question: "Yintoni igama lesiXhosa leMarch?",
            answer: "EyoKwindla"
        },
        season: "autumn"
    },
    april: {
        en: {
            name: "April",
            info: "Autumn continues. Pumpkins start withering, and storytelling evenings become more common.",
            question: "What is the Xhosa name for April?",
            answer: "uTshaz'iimpuzi"
        },
        xh: {
            name: "uTshaz'iimpuzi",
            info: "Ukwindla kuyaqhubeka. Amathanga aqala ukubuna, kwaye iingokuhlwa zokuxoxa iintsomi ziba zixhaphakile.",
            question: "Yintoni igama lesiXhosa leApril?",
            answer: "uTshaz'iimpuzi"
        },
        season: "autumn"
    },
    may: {
        en: {
            name: "May",
            info: "Autumn. The Canopus star is visible, weather cools, and community meetings increase.",
            question: "What is the Xhosa name for May?",
            answer: "EyeCanzibe"
        },
        xh: {
            name: "EyeCanzibe",
            info: "Ukwindla. Inkwenkwezi yeCanopus iyabonakala, imozulu iyaphola, kwaye iintlanganiso zoluntu ziyanda.",
            question: "Yintoni igama lesiXhosa leMay?",
            answer: "EyeCanzibe"
        },
        season: "autumn"
    },
    june: {
        en: {
            name: "June",
            info: "Winter starts. The Pleiades star cluster is visible, and it's circumcision season (Ulwaluko) for boys.",
            question: "What is the Xhosa name for June?",
            answer: "EyeSilimela"
        },
        xh: {
            name: "EyeSilimela",
            info: "Ubusika buqala. Iqela leenkwenkwezi zePleiades liyabonakala, kwaye lixesha lolwaluko lwamakhwenkwe (Ulwaluko).",
            question: "Yintoni igama lesiXhosa leJune?",
            answer: "EyeSilimela"
        },
        season: "winter"
    },
    july: {
        en: {
            name: "July",
            info: "Winter. Aloes bloom, and traditional healing practices are at their peak.",
            question: "What is the Xhosa name for July?",
            answer: "EyeKhala"
        },
        xh: {
            name: "EyeKhala",
            info: "Ubusika. Iikhala ziyathetha, kwaye izenzo zonyango lwesintu zifikelela incopho yazo.",
            question: "Yintoni igama lesiXhosa leJuly?",
            answer: "EyeKhala"
        },
        season: "winter"
    },
    august: {
        en: {
            name: "August",
            info: "Winter. Buds appear on trees, signaling preparation for spring planting.",
            question: "What is the Xhosa name for August?",
            answer: "EyeThupha"
        },
        xh: {
            name: "EyeThupha",
            info: "Ubusika. Amagqabi amatsha ayavela emithini, ebonisa ukulungiselela ukutyala kwentwasahlobo.",
            question: "Yintoni igama lesiXhosa leAugust?",
            answer: "EyeThupha"
        },
        season: "winter"
    },
    september: {
        en: {
            name: "September",
            info: "Spring begins. Coast coral trees bloom, and renewal ceremonies take place.",
            question: "What is the Xhosa name for September?",
            answer: "EyoMsintsi"
        },
        xh: {
            name: "EyoMsintsi",
            info: "Intwasahlobo iqala. Imithi yasekhokhotheni iyatyityimba, kwaye imibhiyozo yohlaziyo iyenzeka.",
            question: "Yintoni igama lesiXhosa leSeptember?",
            answer: "EyoMsintsi"
        },
        season: "spring"
    },
    october: {
        en: {
            name: "October",
            info: "Spring. Tall yellow daisies bloom, and outdoor activities increase.",
            question: "What is the Xhosa name for October?",
            answer: "EyeDwarha"
        },
        xh: {
            name: "EyeDwarha",
            info: "Intwasahlobo. Iintyatyambo ezimthubi ezinde ziyatyityimba, kwaye imisebenzi yangaphandle iyanda.",
            question: "Yintoni igama lesiXhosa leOctober?",
            answer: "EyeDwarha"
        },
        season: "spring"
    },
    november: {
        en: {
            name: "November",
            info: "Spring. Small yellow daisies bloom, and community festivals are held.",
            question: "What is the Xhosa name for November?",
            answer: "EyeNkanga"
        },
        xh: {
            name: "EyeNkanga",
            info: "Intwasahlobo. Iintyatyambo ezincinci ezimthubi ziyatyityimba, kwaye imibhiyozo yoluntu iyabanjwa.",
            question: "Yintoni igama lesiXhosa leNovember?",
            answer: "EyeNkanga"
        },
        season: "spring"
    },
    december: {
        en: {
            name: "December",
            info: "Summer returns. Acacia thorn trees bloom, circumcision season continues, and families celebrate together.",
            question: "What is the Xhosa name for December?",
            answer: "EyoMnga"
        },
        xh: {
            name: "EyoMnga",
            info: "Ihlobo libuya. Imithi yeminga iyatyityimba, ixesha lolwaluko liyaqhubeka, kwaye iintsapho zibhiyozela kunye.",
            question: "Yintoni igama lesiXhosa leDecember?",
            answer: "EyoMnga"
        },
        season: "summer"
    }
};

// Expanded Fun Facts
const funFacts = [
    { en: "Xhosa beadwork uses colors to convey messages, like white for purity!", xh: "Ukuluka kwamaXhosa kusebenzisa imibala ukudlulisela imiyalezo, njengombala omhlophe wokucoceka!" },
    { en: "The Tokoloshe is a mischievous spirit in Xhosa folklore, often blamed for small mishaps!", xh: "I-Tokoloshe ngumoya okhohlakeleyo kwintsomi zamaXhosa, odla ngokutyholwa ngeengozi ezincinci!" },
    { en: "Umngqusho is a traditional Xhosa dish made of samp and beans, often shared at gatherings!", xh: "Umngqusho sisidlo sesintu samaXhosa esenziwe ngesamp kunye neembotyi, esidla ngokwabiwa kwiindibano!" },
    { en: "Xhosa people use click sounds in their language, like the 'c' in 'Molo'!", xh: "AmaXhosa asebenzisa izandi zokucofa olwimini lwawo, njengo 'c' ku 'Molo'!" },
    { en: "The Xhosa word 'Ubuntu' means humanity and kindness towards others!", xh: "Igama lesiXhosa elithi 'Ubuntu' lithetha ubuntu nobubele kwabanye!" },
    { en: "Xhosa traditional healers, called Inyanga, use herbs to heal people!", xh: "Amagqirha amaXhosa, abizwa ngokuba yi-Inyanga, asebenzisa imifuno ukuphilisisa abantu!" },
    { en: "The Xhosa initiation ceremony, Ulwaluko, teaches boys respect and responsibility!", xh: "Umkhosi wolwaluko wamaXhosa, uLwaluko, ufundisa amakhwenkwe intlonipho noxanduva!" },
    { en: "Xhosa storytelling often happens around the fire, sharing tales of ancestors!", xh: "Ukubaliswa kweentsomi zamaXhosa kuhlala kwenzeka ngaseziko, kwabelwana ngamabali ookhokho!" },
    { en: "The Xhosa word 'Enkosi' means thank you, a sign of gratitude!", xh: "Igama lesiXhosa elithi 'Enkosi' lithetha enkosi, uphawu lombulelo!" },
    { en: "Xhosa dances, like the umxhentso, celebrate community and joy!", xh: "Imidaniso yamaXhosa, njengomxhentso, ibhiyozela uluntu kunye novuyo!" }
];

// Time in Words (Xhosa)
const numbersInXhosa = [
    "Zero", "Nye", "Mbini", "Thathu", "Ne", "Hlanu", "Thandathu", "Xhenxe", "Sibozo", "Lithoba",
    "Shumi", "Shumi elinanye", "Shumi elinesibini", "Shumi elinesithathu", "Shumi elinesine",
    "Shumi elinesihlanu", "Shumi elinesithandathu", "Shumi elinesixhenxe", "Shumi elinesibhozo",
    "Shumi elinesithoba", "Amashumi amabini"
];

// Combined Quiz Questions for Sidebar
const allQuizQuestions = [...beginnerQuestions, ...intermediateQuestions, ...expertQuestions];

let timelineIndex = 0;
let currentTimelineMonth = null;
let currentTimelineAnswer = '';
let currentSidebarQuestion = null;
let booksCarouselIndex = 0;

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/sazi/resources/translations/${lang}.json`);
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        let text = translations[key] || key;
        if (element.dataset.translateParams) {
            const params = JSON.parse(element.dataset.translateParams);
            for (const [param, value] of Object.entries(params)) {
                text = text.replace(`{{${param}}}`, value);
            }
        }
        element.textContent = text;
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translations[key] || key;
    });

    document.querySelectorAll('[data-translate-value]').forEach(element => {
        const key = element.getAttribute('data-translate-value');
        element.value = translations[key] || key;
    });

    updateGamificationDisplay();
    updateTimelineDetails();
    updateClockText();
    // Re-render sidebar quiz question in the new language
    if (currentSidebarQuestion) {
        const questionElement = document.getElementById('sidebar-quiz-question');
        if (questionElement) {
            questionElement.textContent = currentLanguage === 'xh' ? 
                `Yintoni ethi "${currentSidebarQuestion.english}" ngesiXhosa?` : 
                `What is "${currentSidebarQuestion.english}" in Xhosa?`;
        }
    }
}

function updateGamificationDisplay() {
    const pointsElement = document.querySelector('#user-points');
    if (pointsElement) {
        pointsElement.textContent = `Points: ${userPoints}`;
    }
    const progressBar = document.querySelector('.points-progress-bar');
    if (progressBar) {
        const progress = (userPoints % 50) / 50 * 100; // Next badge at 50 points
        progressBar.style.width = `${progress}%`;
    }
    const badgesElement = document.querySelector('#user-badges');
    if (badgesElement) {
        badgesElement.innerHTML = userBadges.map(badge => `<span class="badge">${badge}</span>`).join('');
    }
    const leaderboardText = document.getElementById('leaderboard-text');
    if (leaderboardText) {
        leaderboardText.textContent = leaderboard.nickname ? `${leaderboard.nickname} is the Xhosa Brain of the Day with ${leaderboard.score} points!` : "No scores yet! Take a quiz to become the top brain!";
    }
}

function awardPoints(points, quizType) {
    userPoints += points;
    sessionStorage.setItem('userPoints', userPoints);
    if (userPoints >= 50 && !userBadges.includes('Points Master')) {
        awardBadge('Points Master');
    }
    if (quizType === 'quickTest') {
        quickTestAttempts++;
        if (points > 0) {
            quickTestCorrect += points / 10; // 10 points per correct answer
        }
        sessionStorage.setItem('quickTestAttempts', quickTestAttempts);
        sessionStorage.setItem('quickTestCorrect', quickTestCorrect);
    } else if (quizType === 'timeline') {
        timelineAttempts++;
        if (points > 0) {
            timelineCorrect += points / 10;
        }
        sessionStorage.setItem('timelineAttempts', timelineAttempts);
        sessionStorage.setItem('timelineCorrect', timelineCorrect);
    } else if (quizType === 'sidebarQuiz') {
        sidebarQuizAttempts++;
        if (points > 0) {
            sidebarQuizCorrect += points / 10;
        }
        sessionStorage.setItem('sidebarQuizAttempts', sidebarQuizAttempts);
        sessionStorage.setItem('sidebarQuizCorrect', sidebarQuizCorrect);
    }
    updateGamificationDisplay();
}

function awardBadge(badge) {
    if (!userBadges.includes(badge)) {
        userBadges.push(badge);
        sessionStorage.setItem('userBadges', JSON.stringify(userBadges));
        alert(`You've earned a new badge: ${badge}! Register to save your progress!`);
        updateGamificationDisplay();
    }
}

function showNicknamePopup() {
    document.getElementById('nickname-popup').style.display = 'block';
}

function closeNicknamePopup() {
    document.getElementById('nickname-popup').style.display = 'none';
}

function submitNickname() {
    const nickname = document.getElementById('nickname-input').value.trim();
    if (nickname) {
        if (userPoints > leaderboard.score) {
            leaderboard = { nickname, score: userPoints };
            sessionStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            updateGamificationDisplay();
        }
    }
    closeNicknamePopup();
}

function showFunFact() {
    // Use timestamp and random offset to improve randomization
    const timestamp = Date.now();
    const randomOffset = Math.floor(Math.random() * 1000);
    const index = (timestamp + randomOffset) % funFacts.length;
    const funFact = funFacts[index];
    const funFactText = document.getElementById('fun-fact-text');
    funFactText.textContent = currentLanguage === 'xh' ? funFact.xh : funFact.en;
    document.getElementById('fun-fact-popup').style.display = 'block';
}

function closeFunFact() {
    document.getElementById('fun-fact-popup').style.display = 'none';
}

function openQuickTestPopup() {
    document.getElementById('quick-test-popup').style.display = 'block';
    displayQuickTestScore();
}

function closeQuickTestPopup() {
    document.getElementById('quick-test-popup').style.display = 'none';
    if (quickTestAttempts > 0) {
        showNicknamePopup();
    }
}

function moveTimeline(direction) {
    timelineIndex += direction;
    const items = document.querySelectorAll('.timeline-item');
    const totalItems = items.length;

    if (timelineIndex < 0) {
        timelineIndex = totalItems - 3;
    } else if (timelineIndex > totalItems - 3) {
        timelineIndex = 0;
    }

    const offset = -timelineIndex * (100 / 3);
    document.querySelector('.timeline').style.transform = `translateX(${offset}%)`;
    updateTimelineDetails();
}

function moveBooksCarousel(direction) {
    const items = document.querySelectorAll('#books-carousel .carousel-item');
    const totalItems = items.length;

    booksCarouselIndex += direction;
    if (booksCarouselIndex < 0) {
        booksCarouselIndex = totalItems - 3; // Adjust for 3 items displayed
    } else if (booksCarouselIndex > totalItems - 3) {
        booksCarouselIndex = 0;
    }
    const offset = -booksCarouselIndex * (100 / 3);
    document.querySelector('#books-carousel .carousel').style.transform = `translateX(${offset}%)`;
}

function updateTimelineDetails() {
    const month = document.querySelectorAll('.timeline-item')[timelineIndex].dataset.month;
    const monthData = timelineData[month];
    if (monthData) {
        document.getElementById('timeline-month').textContent = `${monthData.en.name} (${monthData.xh.name})`;
        document.getElementById('timeline-info').textContent = currentLanguage === 'en' ? monthData.en.info : monthData.xh.info;
        document.getElementById('timeline-details').style.display = 'block';
    }
}

function openTimelinePopup(month) {
    console.log('Opening timeline popup for month:', month); // Debug log
    currentTimelineMonth = month;
    const monthData = timelineData[month];
    document.getElementById('timeline-month').textContent = `${monthData.en.name} (${monthData.xh.name})`;
    document.getElementById('timeline-info').textContent = currentLanguage === 'en' ? monthData.en.info : monthData.xh.info;
    document.getElementById('timeline-question').textContent = currentLanguage === 'en' ? monthData.en.question : monthData.xh.question;
    currentTimelineAnswer = monthData[currentLanguage].answer;
    document.getElementById('timeline-answer').value = '';
    document.getElementById('timeline-feedback').textContent = '';
    document.getElementById('timeline-feedback').style.display = 'none';
    document.getElementById('timeline-score').style.display = 'none';
    document.getElementById('timeline-popup').style.display = 'block';
}

function closeTimelinePopup() {
    document.getElementById('timeline-popup').style.display = 'none';
    if (timelineAttempts > 0) {
        showNicknamePopup();
    }
}

function checkTimelineAnswer() {
    const input = document.getElementById('timeline-answer').value.trim();
    const feedback = document.getElementById('timeline-feedback');
    const scoreDisplay = document.getElementById('timeline-score');
    const scoreText = document.getElementById('timeline-score-text');
    const messageText = document.getElementById('timeline-message');

    if (input.toLowerCase() === currentTimelineAnswer.toLowerCase()) {
        feedback.textContent = translations['congratulations'] || 'Congratulations!';
        feedback.style.color = "green";
        awardPoints(10, 'timeline');
    } else {
        feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', currentTimelineAnswer);
        feedback.style.color = "red";
        awardPoints(0, 'timeline');
    }
    feedback.style.display = 'block';
    displayTimelineScore();
}

function revealTimelineAnswer() {
    const feedback = document.getElementById('timeline-feedback');
    feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', currentTimelineAnswer);
    feedback.style.color = "blue";
    feedback.style.display = 'block';
    displayTimelineScore();
}

function displayTimelineScore() {
    const scoreDisplay = document.getElementById('timeline-score');
    const scoreText = document.getElementById('timeline-score-text');
    const messageText = document.getElementById('timeline-message');
    const totalAttempts = timelineAttempts;
    const correct = timelineCorrect;
    scoreText.textContent = `Score: ${correct}/${totalAttempts}`;
    if (totalAttempts === 0) {
        messageText.textContent = "Let's get started! Every answer helps you learn!";
    } else if (correct / totalAttempts >= 0.75 && totalAttempts >= 3) {
        messageText.textContent = "You’re excellent! Keep going to become a Xhosa master!";
    } else {
        messageText.textContent = "Nice try! Each attempt brings you closer to the right answer!";
    }
    scoreDisplay.style.display = 'block';
}

function openClockPopup() {
    document.getElementById('clock-popup').style.display = 'block';
}

function closeClockPopup() {
    document.getElementById('clock-popup').style.display = 'none';
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Analogue Clock (Main and Preview)
    const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;
    const minuteDeg = minutes * 6 + (seconds / 60) * 6;
    const secondDeg = seconds * 6;

    // Main Clock
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    if (hourHand && minuteHand && secondHand) {
        hourHand.style.transform = `rotate(${hourDeg}deg)`;
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        secondHand.style.transform = `rotate(${secondDeg}deg)`;
    }

    // Preview Clock
    const hourHandPreview = document.getElementById('hour-hand-preview');
    const minuteHandPreview = document.getElementById('minute-hand-preview');
    const secondHandPreview = document.getElementById('second-hand-preview');
    if (hourHandPreview && minuteHandPreview && secondHandPreview) {
        hourHandPreview.style.transform = `rotate(${hourDeg}deg)`;
        minuteHandPreview.style.transform = `rotate(${minuteDeg}deg)`;
        secondHandPreview.style.transform = `rotate(${secondDeg}deg)`;
    }

    // Digital Clock
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const digitalClock = document.getElementById('clock-digital');
    if (digitalClock) {
        digitalClock.textContent = timeString;
    }

    // Time in Words (always in Xhosa)
    let timeInWords = '';
    if (minutes === 0) {
        timeInWords = `intsimbi ye${numbersInXhosa[hours % 12]}`.toLowerCase();
    } else {
        timeInWords = `${numbersInXhosa[hours % 12]} namashumi ${numbersInXhosa[Math.floor(minutes / 10)]}${minutes % 10 !== 0 ? ' ne' + numbersInXhosa[minutes % 10] : ''}`.toLowerCase();
    }
    const clockText = document.getElementById('clock-text');
    if (clockText) {
        clockText.dataset.translateParams = JSON.stringify({ time: timeInWords });
        clockText.textContent = (translations['time_is'] || 'The time is {{time}}').replace('{{time}}', timeInWords);
    }
}

function updateClockText() {
    const clockText = document.getElementById('clock-text');
    if (clockText && clockText.dataset.translateParams) {
        const params = JSON.parse(clockText.dataset.translateParams);
        clockText.textContent = (translations['time_is'] || 'The time is {{time}}').replace('{{time}}', params.time);
    }
}

function toggleContent() {
    const intro = document.querySelector('.intro-content');
    const full = document.querySelector('.full-content');
    const button = document.querySelector('.read-more');
    if (full.style.display === 'none' || full.style.display === '') {
        intro.style.display = 'none';
        full.style.display = 'block';
        button.textContent = translations['read_less'] || 'Read Less';
    } else {
        intro.style.display = 'block';
        full.style.display = 'none';
        button.textContent = translations['read_more'] || 'Read More';
    }
}

function startQuickTest() {
    const level = document.getElementById('knowledge-level').value;
    if (!level) {
        alert(translations['select_your_xhosa_level'] || 'Please select your Xhosa level!');
        return;
    }

    const testSection = document.getElementById('testSection');
    const testQuestions = document.getElementById('testQuestions');
    testSection.style.display = 'block';
    testQuestions.innerHTML = '';

    const questionPool = level === 'beginner' ? beginnerQuestions :
                        level === 'intermediate' ? intermediateQuestions :
                        expertQuestions;

    currentQuestions = questionPool.sort(() => 0.5 - Math.random()).slice(0, 5);

    currentQuestions.forEach((question, index) => {
        const div = document.createElement('div');
        div.className = 'test-question';
        div.innerHTML = `
            <span data-translate="what_is_in_xhosa" data-translate-params='{"english":"${question.english}"}'>What is "${question.english}" in Xhosa?</span>
            <input type="text" id="test-input-${index}" data-translate-placeholder="type_xhosa_answer">
            <button onclick="checkTestAnswer(${index}, '${question.xhosa}')">${translations['check'] || 'Check'}</button>
            <button onclick="revealTestAnswer(${index}, '${question.xhosa}')">${translations['reveal'] || 'Reveal'}</button>
            <div id="test-feedback-${index}" class="test-feedback"></div>
            <audio controls style="display:none;" id="test-audio-${index}">
                <source src="/sazi/audio/${question.source}/all/${question.id}.mp3" type="audio/mp3">
                Your browser does not support the audio element.
            </audio>
        `;
        testQuestions.appendChild(div);
    });

    document.getElementById('startLearning').classList.remove('visible');
    displayQuickTestScore();
}

function checkTestAnswer(index, correctAnswer) {
    const input = document.getElementById(`test-input-${index}`).value.trim();
    const feedback = document.getElementById(`test-feedback-${index}`);
    const audio = document.getElementById(`test-audio-${index}`);

    if (input.toLowerCase() === correctAnswer.toLowerCase()) {
        feedback.textContent = translations['congratulations'] || 'Congratulations!';
        feedback.style.color = "green";
        awardPoints(10, 'quickTest');
    } else {
        feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', correctAnswer);
        feedback.style.color = "red";
        awardPoints(0, 'quickTest');
    }
    feedback.style.display = 'block';
    audio.style.display = 'block';

    checkAllAnswered();
    displayQuickTestScore();
}

function revealTestAnswer(index, correctAnswer) {
    const feedback = document.getElementById(`test-feedback-${index}`);
    const audio = document.getElementById(`test-audio-${index}`);
    feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', correctAnswer);
    feedback.style.color = "blue";
    feedback.style.display = 'block';
    audio.style.display = 'block';

    checkAllAnswered();
    displayQuickTestScore();
}

function revealAllAnswers() {
    currentQuestions.forEach((question, index) => {
        const input = document.getElementById(`test-input-${index}`);
        const feedback = document.getElementById(`test-feedback-${index}`);
        const audio = document.getElementById(`test-audio-${index}`);
        input.value = question.xhosa;
        feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', question.xhosa);
        feedback.style.color = "blue";
        feedback.style.display = 'block';
        audio.style.display = 'block';
    });
    document.getElementById('startLearning').classList.add('visible');
    awardBadge('Quick Test Star');
    displayQuickTestScore();
}

function checkAllAnswered() {
    const allAnswered = currentQuestions.every((_, index) => {
        const feedback = document.getElementById(`test-feedback-${index}`);
        return feedback.classList.contains('visible');
    });
    if (allAnswered) {
        document.getElementById('startLearning').classList.add('visible');
    }
}

function displayQuickTestScore() {
    const scoreDisplay = document.getElementById('quick-test-score');
    const scoreText = document.getElementById('quick-test-score-text');
    const messageText = document.getElementById('quick-test-message');
    const totalAttempts = quickTestAttempts;
    const correct = quickTestCorrect;
    scoreText.textContent = `Score: ${correct}/${totalAttempts}`;
    if (totalAttempts === 0) {
        messageText.textContent = "Let's get started! Every answer helps you learn!";
    } else if (correct / totalAttempts >= 0.75 && totalAttempts >= 3) {
        messageText.textContent = "You’re excellent! Keep going to become a Xhosa master!";
    } else {
        messageText.textContent = "Nice try! Each attempt brings you closer to the right answer!";
    }
    scoreDisplay.style.display = 'block';
}

function initializeSidebarQuiz() {
    // Randomly select a question
    const randomIndex = Math.floor(Math.random() * allQuizQuestions.length);
    currentSidebarQuestion = allQuizQuestions[randomIndex];
    const questionElement = document.getElementById('sidebar-quiz-question');
    if (questionElement) {
        questionElement.textContent = currentLanguage === 'xh' ? 
            `Yintoni ethi "${currentSidebarQuestion.english}" ngesiXhosa?` : 
            `What is "${currentSidebarQuestion.english}" in Xhosa?`;
    }
}

function checkSidebarQuizAnswer() {
    const input = document.getElementById('sidebar-quiz-answer').value.trim();
    const feedback = document.getElementById('sidebar-quiz-feedback');
    if (input.toLowerCase() === currentSidebarQuestion.xhosa.toLowerCase()) {
        feedback.textContent = translations['congratulations'] || 'Congratulations!';
        feedback.style.color = "green";
        awardPoints(10, 'sidebarQuiz');
    } else {
        feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', currentSidebarQuestion.xhosa);
        feedback.style.color = "red";
        awardPoints(0, 'sidebarQuiz');
    }
    feedback.style.display = 'block';
}

function revealSidebarQuizAnswer() {
    const feedback = document.getElementById('sidebar-quiz-feedback');
    feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', currentSidebarQuestion.xhosa);
    feedback.style.color = "blue";
    feedback.style.display = 'block';
}

function highlightCategory(category) {
    const items = document.querySelectorAll('.carousel-item');
    items.forEach(item => {
        item.style.background = '';
        if (item.dataset.category === category) {
            item.style.background = 'rgba(255, 204, 128, 0.5)';
        }
    });
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => {
        tab.style.display = 'none';
        if (tab.id === tabId) {
            tab.style.display = 'block';
        }
    });

    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.onclick.toString().includes(tabId)) {
            button.classList.add('active');
        }
    });
}

function loginParentTeacher() {
    const email = document.getElementById('parent-teacher-email').value.trim();
    const password = document.getElementById('parent-teacher-password').value;
    const errorElement = document.getElementById('parent-teacher-login-error');

    if (!email || !password) {
        errorElement.textContent = 'Please fill in all fields.';
        errorElement.style.display = 'block';
        return;
    }

    // Mock successful login response
    const mockToken = 'mock-jwt-token-parent-teacher';
    localStorage.setItem('token', mockToken);
    window.location.href = 'dashboard.html';
}

function registerParentTeacher() {
    const email = document.getElementById('parent-teacher-register-email').value.trim();
    const password = document.getElementById('parent-teacher-register-password').value;
    const errorElement = document.getElementById('parent-teacher-register-error');

    if (!email || !password) {
        errorElement.textContent = 'Please fill in all fields.';
        errorElement.style.display = 'block';
        return;
    }

    if (password.length < 8) {
        errorElement.textContent = 'Password must be at least 8 characters long.';
        errorElement.style.display = 'block';
        return;
    }

    // Mock successful registration response
    const mockToken = 'mock-jwt-token-parent-teacher';
    localStorage.setItem('token', mockToken);
    window.location.href = 'dashboard.html';
}

function loginStudent() {
    const classCode = document.getElementById('student-class-code').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const errorElement = document.getElementById('student-login-error');

    if (!classCode || !studentId) {
        errorElement.textContent = 'Please fill in all fields.';
        errorElement.style.display = 'block';
        return;
    }

    // Mock successful login response
    const mockToken = 'mock-jwt-token-student';
    localStorage.setItem('token', mockToken);
    window.location.href = 'dashboard.html';
}

function registerStudent() {
    const email = document.getElementById('student-register-email').value.trim();
    const password = document.getElementById('student-register-password').value;
    const errorElement = document.getElementById('student-register-error');

    if (!email || !password) {
        errorElement.textContent = 'Please fill in all fields.';
        errorElement.style.display = 'block';
        return;
    }

    if (password.length < 8) {
        errorElement.textContent = 'Password must be at least 8 characters long.';
        errorElement.style.display = 'block';
        return;
    }

    // Mock successful registration response
    const mockToken = 'mock-jwt-token-student';
    localStorage.setItem('token', mockToken);
    window.location.href = 'dashboard.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadTranslations(currentLanguage);

    const languageToggle = document.querySelector('.language-toggle');
    languageToggle.value = currentLanguage;
    languageToggle.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        loadTranslations(currentLanguage);
    });

    // Show Fun Fact on Page Load (only on index.html)
    if (document.querySelector('.content.index')) {
        showFunFact();
    }

    // Timeline Carousel (only on index.html)
    if (document.querySelector('.content.index')) {
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', () => {
                const month = item.dataset.month;
                timelineIndex = Array.from(document.querySelectorAll('.timeline-item')).indexOf(item);
                openTimelinePopup(month);
            });
        });
    }

    // Update Clock Every Second (only on index.html)
    if (document.querySelector('.content.index')) {
        updateClock();
        setInterval(updateClock, 1000);
    }

    // Books Carousel (only on about.html)
    if (document.querySelector('#books-carousel')) {
        setInterval(() => moveBooksCarousel(1), 5000);
    }

    // Initialize Sidebar Quiz (on all pages)
    initializeSidebarQuiz();

    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const avatar = option.dataset.avatar;
            const token = localStorage.getItem('token');
            // Mock response for avatar update
            alert('Avatar updated successfully (mock response)!');
        });
    });

    const dashboard = document.querySelector('.dashboard');
    if (dashboard) {
        fetchDashboardData();
    }

    const profile = document.querySelector('.profile');
    if (profile) {
        fetchProfileData();
    }

    const classManagement = document.querySelector('.class-management');
    if (classManagement) {
        fetchClassData();
    }

    const lessons = document.querySelector('.lessons');
    if (lessons) {
        fetchLessonsData();
    }

    const chat = document.querySelector('.chat');
    if (chat) {
        initializeChat();
    }

    const liveClass = document.querySelector('.live-class');
    if (liveClass) {
        initializeLiveClass();
    }
});

async function fetchDashboardData() {
    // Mock response for dashboard data
    alert('Dashboard data loaded (mock response)!');
}

async function fetchProfileData() {
    // Mock response for profile data
    alert('Profile data loaded (mock response)!');
}

async function fetchClassData() {
    // Mock response for class data
    alert('Class data loaded (mock response)!');
}

async function fetchLessonsData() {
    // Mock response for lessons data
    alert('Lessons data loaded (mock response)!');
}

function initializeChat() {
    // Mock chat initialization
    alert('Chat initialized (mock response)!');
}

function initializeLiveClass() {
    // Mock live class initialization
    alert('Live class initialized (mock response)!');
}
