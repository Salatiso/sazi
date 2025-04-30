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

function toggleContent() {
    const intro = document.querySelector('.intro-content');
    const full = document.querySelector('.full-content');
    const button = document.querySelector('.read-more');
    if (full.style.display === 'none' || full.style.display === '') {
        intro.style.display = 'none';
        full.style.display = 'block';
        button.textContent = 'Read Less';
    } else {
        intro.style.display = 'block';
        full.style.display = 'none';
        button.textContent = 'Read More';
    }
}

function startQuickTest() {
    const level = document.getElementById('knowledge-level').value;
    if (!level) {
        alert('Please select your Xhosa level!');
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
            <span>What is "${question.english}" in Xhosa?</span>
            <input type="text" id="test-input-${index}" placeholder="Type Xhosa answer">
            <button onclick="checkTestAnswer(${index}, '${question.xhosa}')">Check</button>
            <button onclick="revealTestAnswer(${index}, '${question.xhosa}')">Reveal</button>
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
        feedback.textContent = "Congratulations!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = `Nice try! The correct answer is ${correctAnswer}.`;
        feedback.style.color = "red";
    }
    feedback.classList.add('visible');
    audio.style.display = 'block';

    checkAllAnswered();
}

function revealTestAnswer(index, correctAnswer) {
    const feedback = document.getElementById(`test-feedback-${index}`);
    const audio = document.getElementById(`test-audio-${index}`);
    feedback.textContent = `The correct answer is ${correctAnswer}.`;
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
        feedback.textContent = `The correct answer is ${question.xhosa}.`;
        feedback.style.color = "blue";
        feedback.classList.add('visible');
        audio.style.display = 'block';
    });
    document.getElementById('startLearning').classList.add('visible');
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

// Login Form Handling
document.addEventListener('DOMContentLoaded', () => {
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

    // Avatar Selection
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
                    window.location.reload();
                } else {
                    alert(data.message || 'Failed to update avatar');
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
            }
        });
    });

    // Dashboard Data
    const dashboard = document.querySelector('.dashboard');
    if (dashboard) {
        fetchDashboardData();
    }

    // Profile Data
    const profile = document.querySelector('.profile');
    if (profile) {
        fetchProfileData();
    }

    // Chat Initialization
    const chat = document.querySelector('.chat');
    if (chat) {
        initializeChat();
    }

    // Live Class Initialization
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
        const data = await response.json();
        if (response.ok) {
            // Placeholder: Display dashboard data
            console.log('Dashboard data:', data);
        } else {
            alert(data.message || 'Failed to load dashboard data');
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
        const data = await response.json();
        if (response.ok) {
            // Placeholder: Display profile data
            console.log('Profile data:', data);
        } else {
            alert(data.message || 'Failed to load profile data');
        }
    } catch (error) {
        alert('An error occurred while loading profile data.');
    }
}

function initializeChat() {
    const socket = io('https://sazi.life');
    const classId = 'example-class-id'; // Replace with actual class ID
    socket.emit('joinClass', classId);

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
            socket.emit('chatMessage', { classId, senderId: 'user-id', message }); // Replace 'user-id'
            messageInput.value = '';
        }
    });
}

function initializeLiveClass() {
    const domain = 'meet.jit.si';
    const options = {
        roomName: 'SaziClassRoom', // Replace with dynamic room name
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-container'),
        userInfo: {
            displayName: 'Sazi User' // Replace with user name
        }
    };
    const api = new JitsiMeetExternalAPI(domain, options);
}
