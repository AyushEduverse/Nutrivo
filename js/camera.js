let stream;

export function initializeCamera(analyzeImage) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera is not supported in this browser.');
        const startCameraButton = document.getElementById('start-camera');
        if (startCameraButton) startCameraButton.disabled = true;
        return;
    }
    const startCameraButton = document.getElementById('start-camera');
    const captureImageButton = document.getElementById('capture-image');
    const uploadImageInput = document.getElementById('upload-image');
    const cameraFeed = document.getElementById('camera-feed');
    const capturedImage = document.getElementById('captured-image');
    const canvas = document.getElementById('canvas');

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

        // Show image in analysis preview with animation
        const analysisImage = document.getElementById('analysis-image');
        if (analysisImage) {
            analysisImage.src = imageDataURL;
            analysisImage.classList.remove('hidden');
            analysisImage.classList.add('visible');
        }

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

    // Add pulse animation to capture button on hover
    captureImageButton.addEventListener('mouseenter', () => {
        captureImageButton.classList.add('pulse-animation');
    });

    captureImageButton.addEventListener('mouseleave', () => {
        captureImageButton.classList.remove('pulse-animation');
    });
}