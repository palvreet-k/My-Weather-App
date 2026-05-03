# Weather App

A simple React-based weather application that allows users to search for cities and view current weather conditions.

## Features

- Search for cities with autocomplete suggestions
- Display current weather including temperature, humidity, wind speed, and "feels like" temperature
- Switch Temperature units between °C and F
- Weather Forecast for next 5 days for same location
- Responsive design using Material-UI
- 

## Installation

1. Clone the repository
2. Navigate to the project directory: `cd my-weather-app`
3. Install dependencies: `npm install`

## Setup

1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env` file in the root directory and add your API key:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

## Usage

1. Start the development server: `npm run dev`
2. Open your browser and go to `http://localhost:5173` (or the port shown in the terminal)
3. Type a city name in the search field
4. Select a city from the suggestions to view the weather

## Technologies Used

- React
- Vite
- Material-UI
- OpenWeatherMap API
