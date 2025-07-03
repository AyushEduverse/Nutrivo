# Nutrivo - AI-Powered Nutrition Analyzer

## Table of Contents
- [About Nutrivo](#about-nutrivo)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Customization](#customization)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## About Nutrivo
Nutrivo is an innovative web application designed to provide instant nutritional insights from food images. Leveraging advanced AI, it identifies dishes, estimates nutritional values, and offers personalized dietary advice. This application aims to empower users with quick, accessible information to make informed food choices.

## Features
- **Intelligent Image Analysis**: Upload food images or capture directly via webcam for AI-driven dish identification and description.
- **Comprehensive Nutritional Breakdown**: Receive estimated values for key nutrients such as Calories, Protein, Carbohydrates, and Fats.
- **Personalized AI Advice**: Get tailored dietary suggestions and tips based on the analyzed food.
- **Analysis History**: Automatically saves your last 10 analyses (including images and results) directly in your browser's local storage for easy review.
- **Dynamic Theme Switching**: Seamlessly toggle between light and dark modes for an optimized viewing experience in any environment.
- **Interactive Background**: Features a subtle, animated particle background for enhanced visual appeal.
- **Mobile Responsive Design**: Ensures a consistent and user-friendly experience across various devices and screen sizes.

## Technical Architecture
The Nutrivo application is built as a single-page application (SPA) with a clear separation of concerns, focusing on maintainability and scalability.

- **`index.html`**: The core HTML file serving as the entry point of the application, responsible for structuring the user interface and loading necessary CSS and JavaScript.
- **`styles.css`**: The main stylesheet, responsible for global styling and importing other specialized CSS files.
  - `css/animations.css`: Defines keyframe animations for dynamic UI elements.
  - `css/components.css`: Styles for reusable UI components (e.g., buttons, input fields, result cards).
  - `css/layout.css`: Manages the overall page layout and responsive design elements.
  - `css/theme.css`: Contains CSS variables and rules for managing light and dark themes.
- **`script.js`**: The primary JavaScript file, handling application logic, event listeners, and orchestrating interactions between different modules.
  - `js/api.js`: Manages communication with the external AI API for image analysis.
  - `js/camera.js`: Handles webcam access and image capture functionality.
  - `js/theme.js`: Contains logic for theme switching (light/dark mode).
  - `js/ui.js`: Manages user interface updates, displaying analysis results, and handling UI interactions.

## Getting Started

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
- An active internet connection to access the AI analysis API.
- (Optional) A webcam for real-time image capture.
- **Important**: You need to replace `AIzaSyAi4nhwEwyyF_joUNgfrZv5VGDhUfCUDlg` in `Nutrition/js/api.js` with your actual Google Generative AI API key for the analysis feature to work.

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR-USERNAME/AyushX.git
    cd AyushX/Nutrition
    ```
2.  **Configure API Key:**
    Open `Nutrition/js/api.js` and replace the placeholder `AIzaSyAi4nhwEwyyF_joUNgfrZv5VGDhUfCUDlg` with your actual API key.
    ```javascript
    const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE'; 
    ```

### Running the Application
To run the Nutrivo app, simply open the `index.html` file in your web browser:
-   Double-click `Nutrition/index.html` in your file explorer.
-   Alternatively, right-click `Nutrition/index.html` and choose "Open with" your preferred browser.

The application will load directly in your browser, ready for use.

## Usage
1.  **Upload Image**: Click the "Drag & Drop or Click to Upload Image" area to select a food image from your device.
2.  **Capture Image**: Click "Start Camera" to activate your webcam, then "Capture" to take a picture of your food.
3.  **View Analysis**: Once the image is processed, the "Analysis Result" section will display:
    -   The dish name and a brief description.
    -   Detailed nutritional information (e.g., Calories, Protein, Carbs, Fat).
    -   AI-generated dietary advice.
4.  **Review History**: Your past 10 analyses will be saved and accessible in the "Analysis History" section below the main analysis result. Click on any history item to re-display its results.
5.  **Toggle Theme**: Use the theme switcher (sun/moon icon) in the header to switch between light and dark modes.

## Customization
-   **Styling**: Modify `Nutrition/styles.css`, `Nutrition/css/layout.css`, `Nutrition/css/components.css`, `Nutrition/css/animations.css`, and `Nutrition/css/theme.css` to adjust the application's visual appearance.
-   **Functionality**: Extend or alter the app's behavior by editing `Nutrition/script.js` and the individual JavaScript modules in `Nutrition/js/`.

## Technologies Used
-   **HTML5**: For structuring the web content.
-   **CSS3**: For styling and responsive design.
-   **JavaScript (ES6+)**: For interactive functionality and application logic.
-   **Google Generative AI**: Powering the intelligent food image analysis.
-   **Font Awesome**: Providing a rich library of icons.
-   **particles.js**: Used for the interactive background animation.

## Contributing
Feel free to fork this repository, submit issues, or propose pull requests. Your contributions are welcome!

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
*(Note: You might need to create a LICENSE.md file in your project root if it doesn't exist.)*

## Author
-   [Ayush](https://github.com/your-github-profile) *(Replace `your-github-profile` with your actual GitHub profile link)*

---
*Thank you for exploring Nutrivo! We hope it assists you in your health and nutrition journey.*

