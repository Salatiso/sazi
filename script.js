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

// Gamification State
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;
let userBadges = JSON.parse(localStorage.getItem('userBadges')) || [];

// Timeline Data
const timelineData = {
    january: {
        en: {
            name: "January",
            info: "It's summer! Tambuki grass grows tall, and families gather after New Year celebrations."
        },
        xh: {
            name: "EyoMqungu",
            info: "Yihlobo! Ingca yeTambuki ikhula ibe nde, kwaye iintsapho ziyahlangana emva kwemibhiyozo yoNyaka oMtsha."
        },
        season: "summer"
    },
    february: {
        en: {
            name: "February",
            info: "Still summer. Grains like maize swell, preparing for harvest festivals."
        },
        xh: {
            name: "EyoMdumba",
            info: "Kuseyihlobo. Iinkozo ezifana nombona ziyadumba, zilungiselela imibhiyozo yokuvuna."
        },
        season: "summer"
    },
    march: {
        en: {
            name: "March",
            info: "Autumn begins. First fruits like pumpkins are harvested, celebrated in the First Fruits Festival (Ukweshwama)."
        },
        xh: {
            name: "EyoKwindla",
            info: "Ukwindla kuqala. Iziqhamo zokuqala ezifana namathanga ziyavunwa, zibhiyozelwa kuMbhiyozo weZiqhamo zokuQala (Ukweshwama)."
        },
        season: "autumn"
    },
    april: {
        en: {
            name: "April",
            info: "Autumn continues. Pumpkins start withering, and storytelling evenings become more common."
        },
        xh: {
            name: "uTshaz'iimpuzi",
            info: "Ukwindla kuyaqhubeka. Amathanga aqala ukubuna, kwaye iingokuhlwa zokuxoxa iintsomi ziba zixhaphakile."
        },
        season: "autumn"
    },
    may: {
        en: {
            name: "May",
            info: "Autumn. The Canopus star is visible, weather cools, and community meetings increase."
        },
        xh: {
            name: "EyeCanzibe",
            info: "Ukwindla. Inkwenkwezi yeCanopus iyabonakala, imozulu iyaphola, kwaye iintlanganiso zoluntu ziyanda."
        },
        season: "autumn"
    },
    june: {
        en: {
            name: "June",
            info: "Winter starts. The Pleiades star cluster is visible, and it's circumcision season (Ulwaluko) for boys."
        },
        xh: {
            name: "EyeSilimela",
            info: "Ubusika buqala. Iqela leenkwenkwezi zePleiades liyabonakala, kwaye lixesha lolwaluko lwamakhwenkwe (Ulwaluko)."
        },
        season: "winter"
    },
    july: {
        en: {
            name: "July",
            info: "Winter. Aloes bloom, and traditional healing practices are at their peak."
        },
        xh: {
            name: "EyeKhala",
            info: "Ubusika. Iikhala ziyathetha, kwaye izenzo zonyango lwesintu zifikelela incopho yazo."
        },
        season: "winter"
    },
    august: {
        en: {
            name: "August",
            info: "Winter. Buds appear on trees, signaling preparation for spring planting."
        },
        xh: {
            name: "EyeThupha",
            info: "Ubusika. Amagqabi amatsha ayavela emithini, ebonisa ukulungiselela ukutyala kwentwasahlobo."
        },
        season: "winter"
    },
    september: {
        en: {
            name: "September",
            info: "Spring begins. Coast coral trees bloom, and renewal ceremonies take place."
        },
        xh: {
            name: "EyoMsintsi",
            info: "Intwasahlobo iqala. Imithi yasekhokhotheni iyatyityimba, kwaye imibhiyozo yohlaziyo iyenzeka."
        },
        season: "spring"
    },
    october: {
        en: {
            name: "October",
            info: "Spring. Tall yellow daisies bloom, and outdoor activities increase."
        },
        xh: {
            name: "EyeDwarha",
            info: "Intwasahlobo. Iintyatyambo ezimthubi ezinde ziyatyityimba, kwaye imisebenzi yangaphandle iyanda."
        },
        season: "spring"
    },
    november: {
        en: {
            name: "November",
            info: "Spring. Small yellow daisies bloom, and community festivals are held."
        },
        xh: {
            name: "EyeNkanga",
            info: "Intwasahlobo. Iintyatyambo ezincinci ezimthubi ziyatyityimba, kwaye imibhiyozo yoluntu iyabanjwa."
        },
        season: "spring"
    },
    december: {
        en: {
            name: "December",
            info: "Summer returns. Acacia thorn trees bloom, circumcision season continues, and families celebrate together."
        },
        xh: {
            name: "EyoMnga",
            info: "Ihlobo libuya. Imithi yeminga iyatyityimba, ixesha lolwaluko liyaqhubeka, kwaye iintsapho zibhiyozela kunye."
        },
        season: "summer"
    }
};

// Fun Facts
const funFacts = [
    { en: "Xhosa beadwork uses colors to convey messages, like white for purity!", xh: "Ukuluka kwamaXhosa kusebenzisa imibala ukudlulisela imiyalezo, njengombala omhlophe wokucoceka!" },
    { en: "The Tokoloshe is a mischievous spirit in Xhosa folklore, often blamed for small mishaps!", xh: "I-Tokoloshe ngumoya okhohlakeleyo kwintsomi zamaXhosa, odla ngokutyholwa ngeengozi ezincinci!" },
    { en: "Umngqusho is a traditional Xhosa dish made of samp and beans, often shared at gatherings!", xh: "Umngqusho sisidlo sesintu samaXhosa esenziwe ngesamp kunye neembotyi, esidla ngokwabiwa kwiindibano!" }
];

// Time in Words (Xhosa)
const numbersInXhosa = [
    "Zero", "Nye", "Mbini", "Thathu", "Ne", "Hlanu", "Thandathu", "Xhenxe", "Sibozo", "Lithoba",
    "Shumi", "Shumi elinanye", "Shumi elinesibini", "Shumi elinesithathu", "Shumi elinesine",
    "Shumi elinesihlanu", "Shumi elinesithandathu", "Shumi elinesixhenxe", "Shumi elinesibhozo",
    "Shumi elinesithoba", "Amashumi amabini"
];

let timelineIndex = 0;

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
}

function awardPoints(points) {
    userPoints += points;
    localStorage.setItem('userPoints', userPoints);
    if (userPoints >= 50 && !userBadges.includes('Points Master')) {
        awardBadge('Points Master');
    }
    updateGamificationDisplay();
}

function awardBadge(badge) {
    if (!userBadges.includes(badge)) {
        userBadges.push(badge);
        localStorage.setItem('userBadges', JSON.stringify(userBadges));
        alert(`You've earned a new badge: ${badge}!`);
        updateGamificationDisplay();
    }
}

function showFunFact() {
    const funFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    const funFactText = document.getElementById('fun-fact-text');
    funFactText.textContent = currentLanguage === 'en' ? funFact.en : funFact.xh;
    document.getElementById('fun-fact-popup').style.display = 'block';
}

function closeFunFact() {
    document.getElementById('fun-fact-popup').style.display = 'none';
}

function expandDashboard(section) {
    document.getElementById(`${section}-card`).style.display = 'none';
    document.getElementById(`${section}-expanded`).style.display = 'block';
}

function collapseDashboard(section) {
    document.getElementById(`${section}-card`).style.display = 'flex';
    document.getElementById(`${section}-expanded`).style.display = 'none';
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

function updateTimelineDetails() {
    const month = document.querySelectorAll('.timeline-item')[timelineIndex].dataset.month;
    const monthData = timelineData[month];
    if (monthData) {
        document.getElementById('timeline-month').textContent = `${monthData.en.name} (${monthData.xh.name})`;
        document.getElementById('timeline-info').textContent = currentLanguage === 'en' ? monthData.en.info : monthData.xh.info;
        document.getElementById('timeline-details').style.display = 'block';
    }
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

    // Time in Words
    let timeInWords = '';
    if (currentLanguage === 'xh') {
        if (minutes === 0) {
            timeInWords = `intsimbi ye${numbersInXhosa[hours]}`.toLowerCase();
        } else {
            timeInWords = `${numbersInXhosa[hours]} ${minutes < 10 ? 'namashumi amabini anesithathu' : 'namashumi amabini anesithandathu'}`.toLowerCase();
        }
    } else {
        if (minutes === 0) {
            timeInWords = `${hours} o'clock`;
        } else {
            timeInWords = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        }
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
}

function checkTestAnswer(index, correctAnswer) {
    const input = document.getElementById(`test-input-${index}`).value.trim();
    const feedback = document.getElementById(`test-feedback-${index}`);
    const audio = document.getElementById(`test-audio-${index}`);

    if (input.toLowerCase() === correctAnswer.toLowerCase()) {
        feedback.textContent = translations['congratulations'] || 'Congratulations!';
        feedback.style.color = "green";
        awardPoints(10);
    } else {
        feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', correctAnswer);
        feedback.style.color = "red";
    }
    feedback.classList.add('visible');
    audio.style.display = 'block';

    checkAllAnswered();
}

function revealTestAnswer(index, correctAnswer) {
    const feedback = document.getElementById(`test-feedback-${index}`);
    const audio = document.getElementById(`test-audio-${index}`);
    feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', correctAnswer);
    feedback.style.color = "blue";
    feedback.classList.add('visible');
    audio.style.display = 'block';

    checkAllAnswered();
}

function revealAllAnswers() {
    currentQuestions.forEach((question, index) => {
        const input = document.getElementById(`test-input-${index}`);
        const feedback = document.getElementById(`test-feedback-${index}`);
        const audio = document.getElementById(`test-audio-${index}`);
        input.value = question.xhosa;
        feedback.textContent = (translations['nice_try_correct_answer'] || 'Nice try! The correct answer is {{answer}}').replace('{{answer}}', question.xhosa);
        feedback.style.color = "blue";
        feedback.classList.add('visible');
        audio.style.display = 'block';
    });
    document.getElementById('startLearning').classList.add('visible');
    awardBadge('Quick Test Star');
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

document.addEventListener('DOMContentLoaded', () => {
    loadTranslations(currentLanguage);

    const languageToggle = document.querySelector('.language-toggle');
    languageToggle.value = currentLanguage;
    languageToggle.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        loadTranslations(currentLanguage);
    });

    // Show Fun Fact on Page Load
    showFunFact();

    // Timeline Carousel
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', () => {
            timelineIndex = Array.from(document.querySelectorAll('.timeline-item')).indexOf(item);
            updateTimelineDetails();
        });
    });

    // Update Clock Every Second
    updateClock();
    setInterval(updateClock, 1000);

    const studentForm = document.getElementById('student-login-form');
    const userForm = document.getElementById('user-login-form');

    if (studentForm) {
        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('student-username').value.trim();
            const code = document.getElementById('student-code').value.trim();
            const errorElement = document.getElementById('student-error');

            try {
                const response = await fetch('https://sazi.life/api/auth/login/student', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, code })
                });
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    errorElement.textContent = data.message || 'Invalid username or code';
                    errorElement.style.display = 'block';
                }
            } catch (error) {
                errorElement.textContent = 'An error occurred. Please try again.';
                errorElement.style.display = 'block';
            }
        });
    }

    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('user-email').value.trim();
            const password = document.getElementById('user-password').value;
            const errorElement = document.getElementById('user-error');

            try {
                const response = await fetch('https://sazi.life/api/auth/login/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    errorElement.textContent = data.message || 'Invalid email or password';
                    errorElement.style.display = 'block';
                }
            } catch (error) {
                errorElement.textContent = 'An error occurred. Please try again.';
                errorElement.style.display = 'block';
            }
        });
    }

    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const avatar = option.dataset.avatar;
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('https://sazi.life/api/profiles/update-avatar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ avatar })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Avatar updated successfully!');
                    fetchProfileData();
                } else {
                    alert(data.message || 'Failed to update avatar');
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
            }
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
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('https://sazi.life/api/classes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const classes = await response.json();
        if (response.ok) {
            const userRoleResponse = await fetch('https://sazi.life/api/profiles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const user = await userRoleResponse.json();
            if (!userRoleResponse.ok) throw new Error(user.message);

            document.getElementById(`${user.role}-dashboard`).style.display = 'block';

            if (user.role === 'student') {
                const leaderboard = classes.length > 0 ? classes[0].students : [];
            } else if (user.role === 'parent') {
            }
        } else {
            alert(classes.message || 'Failed to load dashboard data');
        }
    } catch (error) {
        alert('An error occurred while loading dashboard data.');
    }
}

async function fetchProfileData() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('https://sazi.life/api/profiles', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await response.json();
        if (response.ok) {
            document.getElementById(`${user.role}-profile`).style.display = 'block';
            const profileDetails = document.querySelector(`#${user.role}-profile .profile-details`);
            if (user.role === 'student') {
                profileDetails.querySelector('.avatar-img').src = `/sazi/img/avatars/${user.avatar || 'goat.jpg'}`;
                profileDetails.querySelectorAll('p')[0].textContent = `${translations['name'] || 'Name'}: ${user.username}`;
                profileDetails.querySelectorAll('p')[1].textContent = `${translations['hobbies'] || 'Hobbies'}: ${user.profile?.hobbies || 'Not set'}`;
                profileDetails.querySelectorAll('p')[2].textContent = `${translations['favorite_animal'] || 'Favorite Animal'}: ${user.profile?.favoriteAnimal || 'Not set'}`;
                profileDetails.querySelectorAll('p')[3].textContent = `${translations['favorite_color'] || 'Favorite Color'}: ${user.profile?.favoriteColor || 'Not set'}`;
                profileDetails.querySelectorAll('p')[4].textContent = `${translations['fun_fact'] || 'Fun Fact'}: ${user.profile?.funFact || 'Not set'}`;
            } else if (user.role === 'teacher') {
                profileDetails.querySelectorAll('p')[0].textContent = `${translations['name'] || 'Name'}: ${user.profile?.name || 'Not set'}`;
                profileDetails.querySelectorAll('p')[1].textContent = `${translations['subjects_taught'] || 'Subjects Taught'}: ${user.profile?.subjectsTaught || 'Not set'}`;
                profileDetails.querySelectorAll('p')[2].textContent = `${translations['teaching_philosophy'] || 'Teaching Philosophy'}: ${user.profile?.teachingPhilosophy || 'Not set'}`;
                profileDetails.querySelectorAll('p')[3].textContent = `${translations['aspirations'] || 'Aspirations'}: ${user.profile?.aspirations || 'Not set'}`;
                profileDetails.querySelectorAll('p')[4].textContent = `${translations['fun_fact'] || 'Fun Fact'}: ${user.profile?.funFact || 'Not set'}`;
            }
        } else {
            alert(user.message || 'Failed to load profile data');
        }
    } catch (error) {
        alert('An error occurred while loading profile data.');
    }
}

async function fetchClassData() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('https://sazi.life/api/classes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const classes = await response.json();
        if (response.ok) {
            const classList = document.querySelector('.class-list');
            classList.innerHTML = `<h3 data-translate="my_classes">My Classes</h3>`;
            classes.forEach(cls => {
                const p = document.createElement('p');
                p.textContent = `${cls.name} (Students: ${cls.students.length})`;
                classList.appendChild(p);
            });

            if (classes.length > 0) {
                const studentResponse = await fetch(`https://sazi.life/api/classes/${classes[0]._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const classData = await studentResponse.json();
                const studentList = document.querySelector('.student-list');
                studentList.innerHTML = `<h3 data-translate="students_in_class">Students in ${classes[0].name}</h3>`;
                classData.students.forEach(student => {
                    const p = document.createElement('p');
                    p.textContent = `${student.username} (Code: ${student.code})`;
                    studentList.appendChild(p);
                });
            }
        } else {
            alert(classes.message || 'Failed to load class data');
        }
    } catch (error) {
        alert('An error occurred while loading class data.');
    }
}

async function fetchLessonsData() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('https://sazi.life/api/lessons', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const lessons = await response.json();
        if (response.ok) {
            const lessonsContainer = document.querySelector('.lessons');
            lessonsContainer.innerHTML = '<h2 data-translate="my_lessons">My Lessons</h2>';
            lessons.forEach(lesson => {
                const div = document.createElement('div');
                div.className = 'lesson';
                div.innerHTML = `
                    <h3>${lesson.title}</h3>
                    <p>${lesson.content?.description || 'No description available'}</p>
                    <p><strong data-translate="progress">Progress:</strong> ${lesson.progress.completion}%</p>
                    <p><strong data-translate="points">Points:</strong> ${lesson.progress.score}</p>
                    <a href="${lesson.content?.url || '#'}" class="start-learning" data-translate="${lesson.progress.completion === 0 ? 'start' : 'continue'}_lesson">${lesson.progress.completion === 0 ? 'Start' : 'Continue'} Lesson</a>
                `;
                lessonsContainer.appendChild(div);
            });
        } else {
            alert(lessons.message || 'Failed to load lessons');
        }
    } catch (error) {
        alert('An error occurred while loading lessons.');
    }
}

function initializeChat() {
    const socket = io('https://sazi.life');
    const classId = 'example-class-id';
    socket.emit('joinClass', classId);

    fetch(`https://sazi.life/api/chat/${classId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(messages => {
        const messagesDiv = document.querySelector('.chat-messages');
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message';
            messageDiv.textContent = `${msg.senderId}: ${msg.message}`;
            messagesDiv.appendChild(messageDiv);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    socket.on('message', (data) => {
        const messages = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.textContent = `${data.senderId}: ${data.message}`;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    });

    const chatForm = document.querySelector('.chat-input');
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = chatForm.querySelector('input');
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('chatMessage', { classId, senderId: 'user-id', message });
            messageInput.value = '';
        }
    });
}

function initializeLiveClass() {
    const classId = 'example-class-id';
    fetch(`https://sazi.life/api/live/${classId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(data => {
        if (response.ok) {
            const domain = 'meet.jit.si';
            const options = {
                roomName: data.jitsiRoomId,
                width: '100%',
                height: '100%',
                parentNode: document.querySelector('#jitsi-container'),
                userInfo: {
                    displayName: 'Sazi User'
                }
            };
            const api = new JitsiMeetExternalAPI(domain, options);
        } else {
            alert(data.message || 'No active live session');
        }
    })
    .catch(error => {
        alert('An error occurred while joining the live class.');
    });
}
