const API_KEY = 'AIzaSyAi4nhwEwyyF_joUNgfrZv5VGDhUfCUDlg'; // IMPORTANT: Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export async function analyzeImageApi(imageDataURL) {
    const base64ImageData = imageDataURL.split(',')[1];

    const requestBody = {
        "contents": [{
            "parts": [
                { "text": "Analyze this food image. Provide the dish name, a short description, a list of estimated nutritional values (like Calories, Protein, Carbs, Fat, Fiber, Sugar) with quantities per 100g, and some AI-driven advice for someone eating this dish. Format the output as a JSON object with keys: 'dishName', 'description', 'nutrition', and 'advice'. The 'nutrition' value should be an array of objects, each with 'name' and 'value' keys." },
                { "inline_data": { "mime_type": "image/jpeg", "data": base64ImageData } }
            ]
        }]
    };

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
        return JSON.parse(cleanedJsonString);
    } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error(`Could not process the AI's response. Raw response: ${content}`);
    }
}