// Configuration
const CONFIG = {
    totalPages: 10,
    questionsPerPage: 20,
    totalQuestions: 200,
    googleSheetURL: 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv',
    scale: {
        4: '經常',
        3: '時常',
        2: '有時',
        1: '偶爾',
        0: '從不'
    },
    scoring: {
        entries: 20, // 20 scoring entries
        calculateGroup: function(questionNumber) {
            return (questionNumber - 1) % 20; // Group 0-19
        }
    }
};
