document.addEventListener('DOMContentLoaded', () => {
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

    // Camera and image upload logic
    const startCameraButton = document.getElementById('start-camera');
    const captureImageButton = document.getElementById('capture-image');
    const uploadImageInput = document.getElementById('upload-image');
    const cameraFeed = document.getElementById('camera-feed');
    const capturedImage = document.getElementById('captured-image');
    const canvas = document.getElementById('canvas');
    const analysisResult = document.getElementById('analysis-result');
    const loader = document.getElementById('loader');
    let stream;

    startCameraButton.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            cameraFeed.srcObject = stream;
            cameraFeed.classList.remove('hidden');
            startCameraButton.classList.add('hidden');
            captureImageButton.classList.remove('hidden');
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access the camera. Please check permissions and try again.');
        }
    });

    captureImageButton.addEventListener('click', () => {
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);
        
        const imageDataURL = canvas.toDataURL('image/jpeg');
        capturedImage.src = imageDataURL;
        capturedImage.classList.remove('hidden');
        cameraFeed.classList.add('hidden');
        captureImageButton.classList.add('hidden');

        // Stop camera stream
        stream.getTracks().forEach(track => track.stop());

        analyzeImage(imageDataURL);
    });

    uploadImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                capturedImage.src = e.target.result;
                capturedImage.classList.remove('hidden');
                if(stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                cameraFeed.classList.add('hidden');
                startCameraButton.classList.remove('hidden');
                captureImageButton.classList.add('hidden');
                analyzeImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    async function analyzeImage(imageDataURL) {
        analysisResult.classList.remove('hidden');
        loader.classList.remove('hidden');
        document.getElementById('result-content').classList.add('hidden');

        // Placeholder for Gemini API call
        const API_KEY = 'AIzaSyAi4nhwEwyyF_joUNgfrZv5VGDhUfCUDlg'; // IMPORTANT: Replace with your actual API key
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const base64ImageData = imageDataURL.split(',')[1];

        const requestBody = {
            "contents": [{
                "parts": [
                    { "text": "Analyze this food image. Provide the dish name, a short description, a list of estimated nutritional values (like Calories, Protein, Carbs, Fat, Fiber, Sugar) with quantities per 100g, and some AI-driven advice for someone eating this dish. Format the output as a JSON object with keys: 'dishName', 'description', 'nutrition', and 'advice'. The 'nutrition' value should be an array of objects, each with 'name' and 'value' keys." },
                    { "inline_data": { "mime_type": "image/jpeg", "data": base64ImageData } }
                ]
            }]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data?.error?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
                const reason = data.candidates?.[0]?.finishReason || 'Unknown reason';
                if (reason === 'SAFETY') {
                    throw new Error('Image was blocked for safety reasons.');
                }
                throw new Error(`No content generated. Finish reason: ${reason}`);
            }
            
            const content = data.candidates[0].content.parts[0].text;
            
            try {
                const cleanedJsonString = content.replace(/```json|```/g, '').trim();
                const parsedContent = JSON.parse(cleanedJsonString);
                displayResults(parsedContent);
            } catch (jsonError) {
                console.error('Failed to parse JSON response:', jsonError);
                throw new Error(`Could not process the AI's response. Raw response: ${content}`);
            }

        } catch (error) {
            console.error('Error analyzing image:', error);
            const resultDiv = document.getElementById('analysis-result');
            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error.message.includes('API key not valid')) {
                errorMessage = 'The provided API key is not valid. Please check your API key and try again.';
            } else if (error.message.includes('400')) {
                errorMessage = 'The request was malformed. Please check the data and try again.';
            } else if (error.message.includes('404')) {
                errorMessage = 'The requested resource was not found. Please check the API endpoint and try again.';
            } else if (error.message.includes('500')) {
                errorMessage = 'An internal server error occurred. Please try again later.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'A network error occurred. Please check your internet connection and try again.';
            }

            resultDiv.innerHTML = `<div class="box error-box"><h2>Error</h2><p style="color: red; text-align: center;">${errorMessage}</p></div>`;
        } finally {
            loader.classList.add('hidden');
            document.getElementById('result-content').classList.remove('hidden');
        }
    }

    function displayResults(data) {
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

    // Add pulse animation to capture button on hover
    captureImageButton.addEventListener('mouseenter', () => {
        captureImageButton.style.animation = 'pulse 1.5s infinite';
    });
    captureImageButton.addEventListener('mouseleave', () => {
        captureImageButton.style.animation = 'none';
    });
});