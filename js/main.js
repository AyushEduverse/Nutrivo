import { initializeUI, displayResults, showLoader, hideLoader, displayError } from './modules/ui.js';
import { initializeCamera } from './modules/camera.js';
import { analyzeImageApi } from './modules/api.js';

document.addEventListener('DOMContentLoaded', () => {
// Initialize UI components and event listeners
initializeUI();
    initializeCamera(handleImageAnalysis);
    loadHistory();

    // Handle image upload via the new upload box
    document.getElementById('upload-image').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    handleImageAnalysis(img);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

// Add accessibility attributes
addAccessibilityAttributes();

// Event listeners for new feature buttons
document.getElementById('daily-tracker-btn').addEventListener('click', () => {
    alert('Daily Nutrition Tracking feature coming soon!');
});

document.getElementById('scan-barcode-btn').addEventListener('click', () => {
    alert('Barcode Scanner feature coming soon!');
});

document.getElementById('recipe-suggestions-btn').addEventListener('click', () => {
    alert('AI-Powered Recipe Suggestions feature coming soon!');
});

document.getElementById('detailed-report-btn').addEventListener('click', () => {
    alert('Detailed Nutrition Reports feature coming soon!');
});

document.getElementById('search-ingredient-btn').addEventListener('click', () => {
    alert('Search by Ingredient feature coming soon!');
});

document.getElementById('share-btn').addEventListener('click', () => {
    shareAnalysisResult();
});

function shareAnalysisResult() {
    const resultText = document.getElementById('result-content').innerText;
    if (navigator.share) {
        navigator.share({
            title: 'Nutrition Analysis Result',
            text: resultText,
            url: window.location.href,
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        alert('Web Share API is not supported in your browser. You can manually copy the analysis result:\n\n' + resultText);
    }
}
});

async function handleImageAnalysis(imageDataURL) {
    const analysisResult = document.getElementById('analysis-result');
    analysisResult.classList.remove('hidden');
    showLoader();

    try {
        const data = await analyzeImageApi(imageDataURL);
        displayResults(data);
        saveToHistory(data, imageDataURL);
    } catch (error) {
        displayError(error.message);
    } finally {
        hideLoader();
    }
}

function saveToHistory(data, imageDataURL) {
    let history = JSON.parse(localStorage.getItem('analysisHistory')) || [];
    const historyItem = {
        ...data,
        imageDataURL,
        timestamp: new Date().toISOString()
    };
    history.unshift(historyItem); // Add to the beginning
    if (history.length > 10) { // Keep only the last 10 items
        history.pop();
    }
    localStorage.setItem('analysisHistory', JSON.stringify(history));
    loadHistory(); // Refresh history display
}

function loadHistory() {
    const historyContainer = document.getElementById('history-container');
    const history = JSON.parse(localStorage.getItem('analysisHistory')) || [];
    historyContainer.innerHTML = '<h3>Analysis History</h3>';

    if (history.length === 0) {
        historyContainer.innerHTML += '<p>No history yet.</p>';
        return;
    }

    const historyList = document.createElement('ul');
    history.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${item.imageDataURL}" alt="${item.dishName}" width="50" height="50">
            <div>
                <strong>${item.dishName}</strong>
                <small>${new Date(item.timestamp).toLocaleString()}</small>
            </div>
        `;
        listItem.addEventListener('click', () => {
            displayResults(item);
            document.getElementById('analysis-result').scrollIntoView({ behavior: 'smooth' });
        });
        historyList.appendChild(listItem);
    });
    historyContainer.appendChild(historyList);
}

function addAccessibilityAttributes() {
    // Add ARIA labels to buttons
    document.getElementById('start-camera').setAttribute('aria-label', 'Start Camera');
    document.getElementById('capture-image').setAttribute('aria-label', 'Capture Image');
    document.getElementById('upload-image-label').setAttribute('aria-label', 'Upload Image');

    // Add roles and labels to key areas
    document.getElementById('camera-feed').setAttribute('aria-label', 'Live camera feed');
    document.getElementById('analysis-result').setAttribute('aria-live', 'polite');
    document.getElementById('history-container').setAttribute('aria-live', 'polite');
}