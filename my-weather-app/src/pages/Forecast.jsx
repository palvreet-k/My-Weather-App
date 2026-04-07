import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);
const [forecast, setForecast] = useState('');

const FORECAST_URL = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"

export default function DisplayForecast() {
    useEffect(() => {
        async function forecast() {
            try {
                const response = await fetch(FORECAST_URL)
                if (!response.ok) {
                    throw new Error("Weather Forecast not available at this time, Try again in an hour")
                }
                const data = await response.json()
                setForecast(data);
            }

            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        }
        forecast();

    }, []);

    return(

    );

}

