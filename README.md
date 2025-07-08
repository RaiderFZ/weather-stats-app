# Weather Stats Dashboard

A Vue 3 application for visualizing weather data with Chart.js, TypeScript, and Pinia.

## Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd weather-stats-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## Features
- Fetches weather data from OpenWeatherMap API for a user-specified city.
- Supports switching between line, bar, and pie chart types using Pinia.
- Handles request cancellation with AbortController.
- Filters weather data by date range.
- Built with Vue 3, TypeScript, Pinia, and Chart.js.