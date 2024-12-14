document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        participant: {
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            playsVideoGames: document.getElementById('videoGames').value === '1',
            physicalActivityLevel: document.getElementById('physicalActivity').value
        },
        test: {
            type: document.getElementById('testType').value,
            reactionTime: document.getElementById('reactionTime').value
        }
    };
    
    saveResult(data);
});

function saveResult(data) {
    fetch('/api/save-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Result saved successfully!');
        document.getElementById('dataForm').reset();
        loadResults();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving result');
    });
}

function loadResults() {
    fetch('/api/results')
        .then(response => response.json())
        .then(data => {
            const resultsList = document.getElementById('resultsList');
            resultsList.innerHTML = data.map(result => `
                <div class="result-item">
                    <p>Age: ${result.age} | Gender: ${result.gender} | 
                       Video Games: ${result.plays_video_games ? 'Yes' : 'No'} | 
                       Physical Activity: ${result.physical_activity ? 'Yes' : 'No'}</p>
                    <p>Test Type: ${result.test_type} | 
                       Reaction Time: ${result.reaction_time_ms}ms</p>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error:', error));
}

// Load results when page loads
loadResults(); 