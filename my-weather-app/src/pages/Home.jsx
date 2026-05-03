import { useState, useEffect } from 'react';
import { CircularProgress, Box, Card, CardActions, CardContent, CardMedia, Button, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, TextField, CssBaseline, Switch, FormControlLabel } from '@mui/material';
import { CardHeader, Container } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WindPowerOutlinedIcon from '@mui/icons-material/WindPowerOutlined';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MoodIcon from '@mui/icons-material/Mood';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const CITY_URL = (city) => `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
const WEATHER_URL = (lat, lon, units) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`

export default function DisplayWeather() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [suggestion, setSuggestion] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ignoreEffect, setIgnoreEffect] = useState(false);
    const [isCelsius, setIsCelsius] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        // This effect triggers whenever the 'city' state changes at >3 characters.
        // ignoreEffect is used to prevent the suggestion fetching to keep running after we select the city from list
        if (ignoreEffect) {
            setIgnoreEffect(false);
            return;
        }
        if (city.length < 3) {
            setSuggestion([]);
            return;
        }

        // Fetch city suggestions once user inputs more than 3 chars in search
        async function autofillCity() {
            try {
                setLoading(true);
                const response = await fetch(CITY_URL(city))
                if (!response.ok) {
                    throw new Error("There was a problem with loading city with this name, try again")
                }
                const data = await response.json()
                setSuggestion(data);
            }

            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        }
        autofillCity();

    }, [city]);

    // Fetch weather after user selects a city name from suggestion list

    async function fetchWeatherOnCitySelect(city) {

        try {
            setSuggestion([]);
            setIgnoreEffect(true);
            setLoading(true);
            setWeather(null);
            const units = isCelsius ? 'metric' : 'imperial';
            const response = await fetch(WEATHER_URL(city.lat, city.lon, units));
            if (!response.ok) {
                throw new Error("There was a problem fetching weather, Try again")
            }
            const data = await response.json();
            setWeather(data);
            setCity(data.name);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    // Fetch weather again when user toggles between Celsius and Fahrenheit

    async function fetchWeather({ lat, lon }) {
        try {
            const units = isCelsius ? 'metric' : 'imperial';
            const response = await fetch(WEATHER_URL(lat, lon, units));
            if (!response.ok) {
                throw new Error("There was a problem fetching weather, Try again");
            }
            const data = await response.json();
            setWeather(data);
        } catch (err) {
            setError(err.message);
        }
    }
    useEffect(() => {
        if (weather) {
            fetchWeather(weather.coord);
        }
    }, [isCelsius]);


    if (error) {
        return <p>{error}</p>
    }



    return (
        <>
            <CssBaseline />
            <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 2 }}>Weather App</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <SearchIcon fontSize='large' />
                <TextField id="filled-basic" label="Search for a city" variant="filled" size="" fullWidth value={city}
                    onChange={(e) => setCity(e.target.value)} />
            </Box>

            {suggestion.length > 0 && (
                <List >
                    {suggestion.map((selectCity) => (
                        <ListItem key={selectCity.lat + selectCity.lon}>
                            <ListItemButton onClick={() => fetchWeatherOnCitySelect(selectCity)}>
                                <ListItemText
                                    primary={` ${selectCity.name} ${selectCity.state ? `, ${selectCity.state}` : ""} , ${selectCity.country}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                    )}
                </List>
            )}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && weather && (
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            bgcolor: '#b7daf7',
                            minHeight: '100vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2
                        }}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardHeader
                                title={`${weather?.name} ${weather?.sys?.country ? `, ${weather.sys.country}` : ""}`}
                            />
                            <CardMedia
                                sx={{ height: 140 }}
                                image={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                title="weather"
                            />
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <FormControlLabel
                                        control={<Switch checked={isCelsius} onChange={(e) => setIsCelsius(e.target.checked)} />}
                                        label={`${isCelsius ? '°C' : '°F'}`}
                                    />
                                </Box>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <ThermostatIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Temperature : ${weather?.main?.temp} ${isCelsius ? '°C' : '°F'}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <WaterDropIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Humidity: ${weather?.main?.humidity} %`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <WindPowerOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Wind Speed: ${weather?.wind?.speed} ${isCelsius ? 'm/s' : 'mph'}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MoodIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Feels Like: ${weather?.main?.feels_like} ${isCelsius ? '°C' : '°F'}`}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                            <CardActions>
                                <Button size="small"
                                    onClick={() => navigate('/forecast', { state: { city: weather?.name } })} // pass city to forecast page
                                >
                                    See next 5 Days Forecast
                                </Button>
                            </CardActions>
                        </Card>

                    </Box>

                </Container>
            )}
        </>


    );
}