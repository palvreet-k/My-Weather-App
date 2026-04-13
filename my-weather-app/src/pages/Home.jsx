import { useState, useEffect } from 'react';
import { CircularProgress, Box, Card, CardActions, CardContent, CardMedia, Button, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, TextField, CssBaseline } from '@mui/material';
import { CardHeader, Container } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WindPowerOutlinedIcon from '@mui/icons-material/WindPowerOutlined';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MoodIcon from '@mui/icons-material/Mood';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const CITY_URL = (city) => `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
const WEATHER_URL = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`

export default function DisplayWeather() {
    const [city, setCity] = useState("Toronto");
    const [weather, setWeather] = useState(null);
    const [suggestion, setSuggestion] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ignoreEffect, setIgnoreEffect] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (ignoreEffect) {
            setIgnoreEffect(false);
            return;
        }
        if (city.length < 3) {
            setSuggestion([]);
            return;
        }
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


    async function handleSearch(city) {

        try {
            setSuggestion([]);
            setIgnoreEffect(true);
            setLoading(true);
            setWeather(null);
            const response = await fetch(WEATHER_URL(city.lat, city.lon));
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
                            <ListItemButton onClick={() => handleSearch(selectCity)}>
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
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <ThermostatIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Temperature : ${weather?.main?.temp} °C`}
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
                                            primary={`Wind Speed: ${weather?.wind?.speed}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MoodIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Feels Like: ${weather?.main?.feels_like} °C`}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                            {/* <CardActions>
                                <Button size="small"
                                >See next 5 Days Forecast
                                </Button>
                            </CardActions> */}
                        </Card>

                    </Box>

                </Container>
            )}
        </>


    );
}