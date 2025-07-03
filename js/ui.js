const nutrientIcons = {
    'Calories': 'fa-fire',
    'Protein': 'fa-drumstick-bite',
    'Carbs': 'fa-bread-slice',
    'Fat': 'fa-bacon',
    'Fiber': 'fa-leaf',
    'Sugar': 'fa-cube',
    'Sodium': 'fa-salt-shaker',
    'Cholesterol': 'fa-egg',
    // Add more mappings as needed
};

export function initializeUI() {
    // Splash screen logic
    const splashScreen = document.getElementById('splash-screen');
    const app = document.getElementById('app');
    if (!splashScreen || !app) return;

    setTimeout(() => {
        splashScreen.style.opacity = '0';
        app.classList.remove('hidden');
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500); // Match this with fadeOut animation duration
    }, 2000); // Splash screen duration

    // Theme toggler logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    // Remember previous theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.checked = false;
    }
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Initialize Particles.js for desktop
    if (window.innerWidth > 768) {
        const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": themeColor
                },
                "shape": {
                    "type": "circle"
                },
                "opacity": {
                    "value": 0.5,
                    "random": true
                },
                "size": {
                    "value": 3,
                    "random": true
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": themeColor,
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }
}

export function showResultPlaceholder() {
    // This function is no longer needed as per new UI logic, keeping it for now if other parts rely on it
    // document.getElementById('result-placeholder').style.display = 'block';
    // document.getElementById('loader').classList.add('hidden');
    // document.getElementById('dish-info').style.display = 'none';
    // document.getElementById('nutrition-info').style.display = 'none';
    // document.getElementById('advice-info').style.display = 'none';
    // document.getElementById('analysis-image').classList.add('hidden');
}

export function displayResults(data) {
    // Show result content
    const resultContent = document.getElementById('analysis-result').querySelector('.result-content');
    if (resultContent) {
        resultContent.classList.remove('hidden');
    }

    document.getElementById('dish-info').style.display = '';
    document.getElementById('nutrition-info').style.display = '';
    document.getElementById('advice-info').style.display = '';
    // Dish info
    const dishName = document.getElementById('dish-name');
    const dishDescription = document.getElementById('dish-description');
    if (dishName) dishName.textContent = data.dishName || 'Unknown Dish';
    if (dishDescription) dishDescription.textContent = data.description || '';
    // Nutrition info
    const nutritionList = document.getElementById('nutrition-list');
    if (nutritionList) {
        nutritionList.innerHTML = '';
        if (Array.isArray(data.nutrition)) {
            data.nutrition.slice(0, 6).forEach((item, idx) => {
                const iconClass = nutrientIcons[item.name] || 'fa-utensils';
                const li = document.createElement('li');
                li.innerHTML = `<span class=\"nutrient-icon\"><i class=\"fas ${iconClass}\"></i></span><span class=\"nutrient-text\">${item.name}: ${item.value}</span>`;
                li.style.animationDelay = (idx * 0.07) + 's';
                nutritionList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No nutrition data available.';
            nutritionList.appendChild(li);
        }
    }
    // AI advice
    const aiAdvice = document.getElementById('ai-advice');
    if (aiAdvice) {
        aiAdvice.textContent = data.advice || '';
        aiAdvice.parentElement.classList.add('fade-in-advice');
    }
    // Show image with animation and update alt text
    const analysisImage = document.getElementById('analysis-image');
    if (analysisImage) {
        analysisImage.classList.remove('hidden');
        analysisImage.classList.add('visible');
        analysisImage.alt = data.dishName || 'Analyzed Image';
    }
}

export function showLoader() {
    // Hide any previous error messages
    const errorBox = document.querySelector('.error-box');
    if (errorBox) {
        errorBox.remove();
    }

    // Ensure the analysis result box is visible
    const analysisResult = document.getElementById('analysis-result');
    if (analysisResult) {
        analysisResult.classList.remove('hidden');
    }

    // Show the loader-bar and hide result content
    const resultContent = document.getElementById('analysis-result').querySelector('.result-content');
    if (resultContent) {
        resultContent.classList.add('hidden');
    }
    const loaderBar = document.getElementById('analysis-result').querySelector('.loader-bar');
    if (loaderBar) {
        loaderBar.classList.remove('hidden');
    }

    // Also hide all individual info sections within result content while loading
    document.getElementById('dish-info').style.display = 'none';
    document.getElementById('nutrition-info').style.display = 'none';
    document.getElementById('advice-info').style.display = 'none';
    
    // Hide image while loading
    const analysisImage = document.getElementById('analysis-image');
    if (analysisImage) {
        analysisImage.classList.remove('visible');
        analysisImage.classList.add('hidden');
    }
}

export function hideLoader() {
    // Hide the loader-bar and show result content
    const resultContent = document.getElementById('analysis-result').querySelector('.result-content');
    if (resultContent) {
        resultContent.classList.remove('hidden');
    }
    const loaderBar = document.getElementById('analysis-result').querySelector('.loader-bar');
    if (loaderBar) {
        loaderBar.classList.add('hidden');
    }
}

export function displayError(errorMessage) {
    // Ensure loader is hidden when an error occurs
    hideLoader();

    const analysisResult = document.getElementById('analysis-result');
    if (!analysisResult) return;

    // Clear previous content and display error message
    analysisResult.innerHTML = `<h3>Analysis Result</h3><div class="box error-box"><h2>Error</h2><p style="color: red; text-align: center;">${errorMessage}</p></div>`;
}