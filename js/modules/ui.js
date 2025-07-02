export function initializeUI() {
    // Splash screen logic
    const splashScreen = document.getElementById('splash-screen');
    const app = document.getElementById('app');

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

    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
    });

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

export function displayResults(data) {
    document.getElementById('dish-name').textContent = data.dishName;
    document.getElementById('dish-description').textContent = data.description;
    
    const nutritionList = document.getElementById('nutrition-list');
    nutritionList.innerHTML = '';
    data.nutrition.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name}: ${item.value}`;
        nutritionList.appendChild(li);
    });

    document.getElementById('ai-advice').textContent = data.advice;
}

export function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('result-content').classList.add('hidden');
    document.getElementById('analysis-result').classList.remove('hidden');
}

export function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('result-content').classList.remove('hidden');
}

export function displayError(errorMessage) {
    const resultDiv = document.getElementById('analysis-result');
    resultDiv.innerHTML = `<div class="box error-box"><h2>Error</h2><p style="color: red; text-align: center;">${errorMessage}</p></div>`;
}