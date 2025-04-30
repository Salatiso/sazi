function checkAnswer(id, correctAnswer) {
    const input = document.getElementById(`input-${id}`).value.trim();
    const feedback = document.getElementById(`feedback-${id}`);
    const xhosaCell = document.querySelector(`#input-${id}`).parentElement.querySelector('.xhosa-cell');
    const audio = document.getElementById(`audio-${id}`);

    if (input.toLowerCase() === correctAnswer.toLowerCase()) {
        feedback.textContent = "Congratulations!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = `Nice try! The correct word is ${correctAnswer}.`;
        feedback.style.color = "red";
    }
    feedback.classList.add('visible');
    xhosaCell.classList.add('visible');
    audio.style.display = 'block';
}

function revealAnswer(id) {
    const xhosaCell = document.querySelector(`#input-${id}`).parentElement.querySelector('.xhosa-cell');
    const audio = document.getElementById(`audio-${id}`);
    xhosaCell.classList.add('visible');
    audio.style.display = 'block';
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

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

let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;

function moveCarousel(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = totalItems - 3; // Adjust for 3 items displayed
    } else if (currentIndex > totalItems - 3) {
        currentIndex = 0;
    }
    const offset = -currentIndex * (100 / 3);
    document.querySelector('.carousel').style.transform = `translateX(${offset}%)`;
}

setInterval(() => moveCarousel(1), 5000);

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
                const response = await fetch('/api/login/student', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, code })
                });
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html'; // Redirect to homepage after login
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
                const response = await fetch('/api/login/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body ⎕
