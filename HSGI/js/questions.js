// Questions data - This will be replaced by Google Sheets data
// Structure: { id: "Q1", text: "問題內容", category: 1 }
let QUESTIONS = [];

// For demonstration, generating 200 placeholder questions
// In production, these will be loaded from Google Sheets
function generatePlaceholderQuestions() {
    const questions = [];
    for (let i = 1; i <= 200; i++) {
        questions.push({
            id: `Q${i}`,
            text: `第 ${i} 題：這是我生活的實況 - 問題內容 ${i}`,
            category: (i - 1) % 20 + 1
        });
    }
    return questions;
}

// Load questions from Google Sheets or fallback
async function loadQuestions() {
    try {
        const response = await fetch(CONFIG.googleSheetURL);
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true });
        
        QUESTIONS = parsed.data
            .filter(row => row.Question_ID)
            .map(row => ({
                id: row.Question_ID,
                text: row.Question_Text,
                category: parseInt(row.Category)
            }));
    } catch (error) {
        console.log('Using placeholder questions (Google Sheets not configured)');
        QUESTIONS = generatePlaceholderQuestions();
    }
    
    return QUESTIONS;
}
