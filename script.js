import { initializeUI, displayResults, showLoader, hideLoader, displayError, showResultPlaceholder } from './js/ui.js';
import { initializeCamera } from './js/camera.js';
import { analyzeImageApi } from './js/api.js';
// import { initializeTheme } from './modules/theme.js';
// import { initializeHistory } from './modules/history.js';
// import { initializeAccessibility } from './modules/accessibility.js';

// Main entry point

document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    initializeCamera(handleImageAnalysis);
    loadHistory();
    addAccessibilityAttributes();
    // showResultPlaceholder(); // Removed as per new UI logic
    // initializeTheme();
    // initializeHistory();
    // initializeAccessibility();

    // Handle image upload
    const uploadImageInput = document.getElementById('upload-image');
    if (uploadImageInput) {
        uploadImageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const analysisImage = document.getElementById('analysis-image');
                    if (analysisImage) {
                        analysisImage.src = e.target.result;
                        analysisImage.classList.remove('hidden');
                        analysisImage.classList.add('visible');
                    }
                    // Show the analysis result card immediately
                    const analysisResult = document.getElementById('analysis-result');
                    if (analysisResult) {
                        analysisResult.classList.remove('hidden');
                    }
                    handleImageAnalysis(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareAnalysisResult();
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});

// The following functions should be imported from their respective modules in the future split
async function handleImageAnalysis(imageDataURL) {
    const analysisResult = document.getElementById('analysis-result');
    if (!analysisResult) return;
    showLoader();
    try {
        const data = await analyzeImageApi(imageDataURL);
        displayResults(data);
        saveToHistory(data, imageDataURL);
        const analysisImage = document.getElementById('analysis-image');
        if (analysisImage) {
            analysisImage.classList.remove('hidden');
            analysisImage.classList.add('visible');
        }
        const uploadBox = document.getElementById('upload-box');
        if (uploadBox) {
            uploadBox.classList.add('hidden');
        }
    } catch (error) {
        displayError(error.message);
    } finally {
        hideLoader();
    }
}

function shareAnalysisResult() {
    const resultContent = document.getElementById('result-content');
    if (!resultContent) return;
    const resultText = resultContent.innerText;
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

function saveToHistory(data, imageDataURL) {
    let history = JSON.parse(localStorage.getItem('analysisHistory')) || [];
    const historyItem = {
        ...data,
        imageDataURL,
        timestamp: new Date().toISOString()
    };
    history.unshift(historyItem);
    if (history.length > 10) {
        history.pop();
    }
    localStorage.setItem('analysisHistory', JSON.stringify(history));
    loadHistory();
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
    document.getElementById('start-camera')?.setAttribute('aria-label', 'Start Camera');
    document.getElementById('capture-image')?.setAttribute('aria-label', 'Capture Image');
    document.getElementById('upload-image-label')?.setAttribute('aria-label', 'Upload Image');
    document.getElementById('camera-feed')?.setAttribute('aria-label', 'Live camera feed');
    document.getElementById('analysis-result')?.setAttribute('aria-live', 'polite');
    document.getElementById('history-container')?.setAttribute('aria-live', 'polite');
} 