import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const [error, setError] = useState(null);
const [city, setCity] = useState('');
const [loading, setLoading] = useState(true);
const [weather, setWeather] = useState('');

const CITY_URL = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}"
const WEATHER_URL = "https://openweathermap.org/api/one-call-3?collection=one_call_api_3.0#current"

export default function DisplayWeather() {
    useEffect(() => {
        async function autofillCity() {
            try {
                const response = await fetch(CITY_URL)
                if (!response.ok) {
                    throw new Error("There was a problem with fetching the requested API, Try again in an hour")
                }
                const data = await response.json()
                setCity(data);
            }

            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        }
        autofillCity();

    }, []);


    useEffect(() => {
        async function handleSearch() {

            try {
                const response = await fetch(WEATHER_URL);
                if(!response.ok){
                    throw new Error("There was a problem fetching this API, Try again")
                }
                const data = response.json();
                setWeather(data);
            }
            catch(err){
                setError(err.message);
            }

        }
    });



    return (

    );
}