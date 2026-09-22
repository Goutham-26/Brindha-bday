const photos = window.BIRTHDAY_PHOTOS || [];
const tabs = document.querySelectorAll('.nav-tab');
const panels = document.querySelectorAll('.tab-panel');

function openTab(tabName) {
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabName));
    panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === tabName));
    const selectedPanel = document.querySelector(`[data-panel="${tabName}"]`);
    selectedPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

tabs.forEach((tab) => tab.addEventListener('click', () => openTab(tab.dataset.tab)));
document.querySelectorAll('[data-go], [data-tab-target]').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        openTab(button.dataset.go || button.dataset.tabTarget);
    });
});

let currentSlide = 0;
let slideshowTimer;
const slideImage = document.getElementById('slide-image');
const slideLabel = document.getElementById('slide-label');
const slideCount = document.getElementById('slide-count');
const progressBar = document.getElementById('progress-bar');
const playButton = document.getElementById('play-slideshow');

function showSlide(index) {
    if (!photos.length) return;
    currentSlide = (index + photos.length) % photos.length;
    const photo = photos[currentSlide];
    slideImage.style.opacity = '0';
    setTimeout(() => {
        slideImage.src = photo.src;
        slideLabel.textContent = photo.name || 'memory';
        slideCount.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
        progressBar.style.width = `${((currentSlide + 1) / photos.length) * 100}%`;
        slideImage.style.opacity = '1';
    }, 180);
}
function startSlideshow() { slideshowTimer = setInterval(() => showSlide(currentSlide + 1), 4300); }
function stopSlideshow() { clearInterval(slideshowTimer); }

document.getElementById('previous-slide').addEventListener('click', () => { showSlide(currentSlide - 1); stopSlideshow(); });
document.getElementById('next-slide').addEventListener('click', () => { showSlide(currentSlide + 1); stopSlideshow(); });
playButton.addEventListener('click', () => {
    if (slideshowTimer) { stopSlideshow(); slideshowTimer = null; playButton.innerHTML = 'Play slideshow <span>▶</span>'; }
    else { startSlideshow(); playButton.innerHTML = 'Pause slideshow <span>Ⅱ</span>'; }
});
showSlide(0);
startSlideshow();

const questions = [
    { text: 'What is Brindha most likely to say after a completely chaotic day?', answers: ['I planned this.', 'I need snacks.', 'Let us do it again.', 'Everything is under control.'], correct: 1, fun: 'Correct. Snacks are a love language.' },
    { text: 'Which superpower best describes this friendship?', answers: ['Finding food anywhere', 'Reading each other\'s minds', 'Turning tiny moments into stories', 'All of the above, obviously'], correct: 3, fun: 'The only scientifically valid answer.' },
    { text: 'What should every birthday girl receive today?', answers: ['A crown', 'A day off from being responsible', 'Cake bigger than her face', 'Yes.'], correct: 3, fun: 'Exactly. No notes.' },
    { text: 'The official friendship emergency kit contains...', answers: ['Tea and gossip', 'A very long voice note', 'Unsolicited advice', 'All three, plus backup snacks'], correct: 3, fun: 'You understand the assignment.' },
    { text: 'How long is this friendship contract valid?', answers: ['One year', 'Until the cake is gone', 'Forever, with annual renewals', 'Until one of us forgets a birthday'], correct: 2, fun: 'Forever it is. Signed, sealed, celebrated.' },
];
let questionIndex = 0;
let score = 0;
const questionText = document.getElementById('question-text');
const answerList = document.getElementById('answer-list');
const feedback = document.getElementById('game-feedback');
const nextQuestion = document.getElementById('next-question');
const scoreText = document.getElementById('game-score');
const questionNumber = document.getElementById('question-number');
const questionProgress = document.getElementById('question-progress-bar');

function loadQuestion() {
    const question = questions[questionIndex];
    questionText.textContent = question.text;
    questionNumber.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    questionProgress.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
    feedback.textContent = '';
    nextQuestion.classList.add('hidden');
    answerList.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.textContent = answer;
        button.addEventListener('click', () => answerQuestion(index, button));
        answerList.appendChild(button);
    });
}
function answerQuestion(answerIndex, selectedButton) {
    const question = questions[questionIndex];
    document.querySelectorAll('.answer-button').forEach((button, index) => { button.disabled = true; if (index === question.correct) button.classList.add('correct'); });
    if (answerIndex === question.correct) { score += 10; selectedButton.classList.add('correct'); feedback.textContent = question.fun; }
    else { selectedButton.classList.add('wrong'); feedback.textContent = 'A bold answer. The friendship jury will allow it.'; }
    scoreText.textContent = `${score} points`;
    nextQuestion.textContent = questionIndex === questions.length - 1 ? 'See your result →' : 'Next question →';
    nextQuestion.classList.remove('hidden');
}
nextQuestion.addEventListener('click', () => {
    if (questionIndex === questions.length - 1) { questionText.textContent = `Friendship score: ${score} / ${questions.length * 10}`; answerList.innerHTML = ''; feedback.textContent = score >= 40 ? 'Official verdict: best-friend certified.' : 'Official verdict: more cake and more memories required.'; nextQuestion.classList.add('hidden'); return; }
    questionIndex += 1; loadQuestion();
});
loadQuestion();

document.getElementById('yes-button').addEventListener('click', () => {
    const zone = document.getElementById('confetti-zone');
    zone.innerHTML = '';
    const colors = ['#df755a', '#24201e', '#edb9aa', '#d9a441', '#8eaa83'];
    for (let i = 0; i < 42; i += 1) {
        const piece = document.createElement('i');
        piece.className = 'confetti';
        piece.style.left = `${45 + (Math.random() - 0.5) * 20}%`;
        piece.style.top = '30%';
        piece.style.background = colors[i % colors.length];
        piece.style.setProperty('--x', `${(Math.random() - 0.5) * 500}px`);
        piece.style.animationDelay = `${Math.random() * .45}s`;
        zone.appendChild(piece);
    }
});

const noButton = document.getElementById('no-button');
const yesButton = document.getElementById('yes-button');
const actionArea = document.querySelector('.question-actions');

function dodgeNoButton() {
    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;
    const areaBounds = actionArea.getBoundingClientRect();
    const yesBounds = yesButton.getBoundingClientRect();
    const angle = Math.random() * Math.PI * 2;
    const radius = 78;
    const yesCenterX = yesBounds.left - areaBounds.left + yesBounds.width / 2;
    const yesCenterY = yesBounds.top - areaBounds.top + yesBounds.height / 2;
    const maxLeft = Math.max(0, areaBounds.width - buttonWidth);
    const maxTop = Math.max(0, areaBounds.height - buttonHeight);
    const targetLeft = yesCenterX + Math.cos(angle) * radius - buttonWidth / 2;
    const targetTop = yesCenterY + Math.sin(angle) * radius - buttonHeight / 2;
    noButton.style.position = 'absolute';
    noButton.style.left = `${Math.min(maxLeft, Math.max(0, targetLeft))}px`;
    noButton.style.top = `${Math.min(maxTop, Math.max(0, targetTop))}px`;
    noButton.style.transform = `rotate(${(Math.random() - 0.5) * 12}deg)`;
}

noButton.addEventListener('pointerenter', dodgeNoButton);

document.getElementById('yes-button').addEventListener('click', () => {
    const overlay = document.getElementById('congratulations-overlay');
    const moreSurprise = document.getElementById('more-surprise');
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
        moreSurprise.classList.add('revealed');
        moreSurprise.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1800);
});

document.getElementById('more-yes-button').addEventListener('click', () => {
    const videoPanel = document.getElementById('video-surprise');
    videoPanel.classList.add('revealed');
    videoPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
