import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useLocation } from "react-router-dom";
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const FORECAST_URL = (city) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`

export default function DisplayForecast() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const location = useLocation();
  const city = location.state?.city; // get city from state passed from Home.jsx
  useEffect(() => {
    async function forecast() {
      try {
        setLoading(true);
        const response = await fetch(FORECAST_URL(city))
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

  }, [city]);
  if (!city) return <p>No city provided</p>;
  if (loading) return <Box><CircularProgress /></Box>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        5-Day Forecast: {city}
      </Typography>

      <Grid container spacing={2}>
        {forecast?.list?.filter(item => item.dt_txt.includes("12:00:00"))
          .slice(0, 5)
          .map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography>
                    {new Date(item.dt * 1000).toLocaleDateString()}
                  </Typography>

                  <Typography>
                    🌡 Temp: {item.main.temp} °C
                  </Typography>

                  <Typography>
                    💧 Humidity: {item.main.humidity}%
                  </Typography>

                  <Typography>
                    🌬 Wind: {item.wind.speed}
                  </Typography>

                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="weather"
                  />

                  <Typography>
                    {item.weather[0].description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}


