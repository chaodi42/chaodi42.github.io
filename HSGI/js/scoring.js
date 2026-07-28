function calculateResults() {
    // Load answers
    const answers = JSON.parse(localStorage.getItem('spiritualGiftsAnswers') || '{}');
    
    // Initialize 20 scores
    const scores = new Array(20).fill(0);
    const scoreDetails = new Array(20).fill(null).map(() => []);
    
    // Calculate scores based on the formula
    Object.entries(answers).forEach(([questionId, answerValue]) => {
        const qNumber = parseInt(questionId.replace('Q', ''));
        const entryIndex = CONFIG.scoring.calculateGroup(qNumber);
        
        const value = parseInt(answerValue) || 0;
        scores[entryIndex] += value;
        scoreDetails[entryIndex].push({
            question: questionId,
            value: value
        });
    });
    
    // Define gift names (to be customized)
    const giftNames = [
        '恩賜 1', '恩賜 2', '恩賜 3', '恩賜 4', '恩賜 5',
        '恩賜 6', '恩賜 7', '恩賜 8', '恩賜 9', '恩賜 10',
        '恩賜 11', '恩賜 12', '恩賜 13', '恩賜 14', '恩賜 15',
        '恩賜 16', '恩賜 17', '恩賜 18', '恩賜 19', '恩賜 20'
    ];
    
    // Create result objects
    const results = scores.map((score, index) => ({
        name: giftNames[index],
        score: score,
        maxScore: 40, // 10 questions × 4 points
        percentage: ((score / 40) * 100).toFixed(1),
        details: scoreDetails[index]
    }));
    
    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    
    return {
        results: results,
        totalTime: new Date().toISOString()
    };
}
