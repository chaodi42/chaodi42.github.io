let currentPage = 1;
let answers = {};

// Initialize quiz
document.addEventListener('DOMContentLoaded', async function() {
    await loadQuestions();
    
    // Get current page from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentPage = parseInt(urlParams.get('page')) || 1;
    
    // Load saved answers from localStorage
    loadSavedAnswers();
    
    // Render current page
    renderPage(currentPage);
    renderPageIndicators();
    updateNavigation();
    
    // Update URL without reload
    updateURL(currentPage);
});

function loadSavedAnswers() {
    const saved = localStorage.getItem('spiritualGiftsAnswers');
    if (saved) {
        answers = JSON.parse(saved);
    }
}

function saveAnswers() {
    localStorage.setItem('spiritualGiftsAnswers', JSON.stringify(answers));
}

function renderPage(page) {
    const startIndex = (page - 1) * CONFIG.questionsPerPage;
    const endIndex = startIndex + CONFIG.questionsPerPage;
    const pageQuestions = QUESTIONS.slice(startIndex, endIndex);
    
    const container = document.getElementById('questionsContainer');
    let html = '<ul class="questions-list">';
    
    pageQuestions.forEach((question, index) => {
        const qNumber = startIndex + index + 1;
        const savedAnswer = answers[question.id];
        const answeredClass = savedAnswer !== undefined ? 'answered' : '';
        
        html += `
            <li class="question-item ${answeredClass}" id="question-${question.id}">
                <div class="question-number">問題 ${qNumber} / 200</div>
                <div class="question-text">${question.text}</div>
                <div class="options">
                    ${[4, 3, 2, 1, 0].map(value => `
                        <label class="option-label ${savedAnswer == value ? 'selected' : ''}" 
                               onclick="selectAnswer('${question.id}', ${value})">
                            <input type="radio" name="${question.id}" value="${value}" 
                                   ${savedAnswer == value ? 'checked' : ''}>
                            ${value} - ${CONFIG.scale[value]}
                        </label>
                    `).join('')}
                </div>
            </li>
        `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
    
    // Update page display
    document.getElementById('currentPage').textContent = page;
    document.getElementById('progressBar').style.width = `${(page / CONFIG.totalPages) * 100}%`;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function selectAnswer(questionId, value) {
    answers[questionId] = value;
    saveAnswers();
    
    // Update UI
    const questionItem = document.getElementById(`question-${questionId}`);
    if (questionItem) {
        questionItem.classList.add('answered');
        const labels = questionItem.querySelectorAll('.option-label');
        labels.forEach(label => {
            const input = label.querySelector('input');
            if (input.value == value) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }
    
    renderPageIndicators();
}

function navigatePage(direction) {
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= CONFIG.totalPages) {
        if (newPage === CONFIG.totalPages + 1) {
            // Submit
            submitQuestionnaire();
            return;
        }
        
        currentPage = newPage;
        renderPage(currentPage);
        renderPageIndicators();
        updateNavigation();
        updateURL(currentPage);
    }
}

function updateNavigation() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    if (currentPage === 1) {
        prevButton.disabled = true;
        prevButton.style.opacity = '0.5';
    } else {
        prevButton.disabled = false;
        prevButton.style.opacity = '1';
    }
    
    if (currentPage === CONFIG.totalPages) {
        nextButton.textContent = '提交問卷 ✓';
        nextButton.className = 'nav-button submit-button';
    } else {
        nextButton.textContent = '下一頁 →';
        nextButton.className = 'nav-button next-button';
    }
}

function renderPageIndicators() {
    const container = document.getElementById('pageIndicators');
    let html = '';
    
    for (let i = 1; i <= CONFIG.totalPages; i++) {
        const startIndex = (i - 1) * CONFIG.questionsPerPage;
        const endIndex = startIndex + CONFIG.questionsPerPage;
        const pageQuestions = QUESTIONS.slice(startIndex, endIndex);
        
        // Check if all questions on this page are answered
        const allAnswered = pageQuestions.every(q => answers[q.id] !== undefined);
        let dotClass = '';
        
        if (i === currentPage) {
            dotClass = 'active';
        } else if (allAnswered) {
            dotClass = 'completed';
        }
        
        html += `<div class="page-dot ${dotClass}" onclick="goToPage(${i})">${i}</div>`;
    }
    
    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderPage(currentPage);
    renderPageIndicators();
    updateNavigation();
    updateURL(currentPage);
    window.scrollTo(0, 0);
}

function updateURL(page) {
    const newURL = `${window.location.pathname}?page=${page}`;
    window.history.replaceState({}, '', newURL);
}

function submitQuestionnaire() {
    // Check if all questions are answered
    const unanswered = QUESTIONS.filter(q => answers[q.id] === undefined);
    
    if (unanswered.length > 0) {
        const proceed = confirm(`您還有 ${unanswered.length} 題未回答。確定要提交嗎？\n\n未回答的題目將被計為 0 分（從不）。`);
        if (!proceed) return;
        
        // Set unanswered to 0
        unanswered.forEach(q => {
            answers[q.id] = 0;
        });
    }
    
    // Save final answers
    saveAnswers();
    
    // Redirect to results page
    window.location.href = 'results.html';
}
