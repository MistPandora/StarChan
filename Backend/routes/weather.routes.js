const express = require('express');
const router = express.Router();

const weatherKey = process.env.WEATHER_API_KEY

router.get('/', async (_, res) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=bordeaux&appid=${weatherKey}&units=metric&lang=fr`)
        const apiWeatherData = await response.json();
        res.json({
            result: true,
            main: apiWeatherData.weather[0].main,
            icon: apiWeatherData.weather[0].icon,
            temp: Math.round(apiWeatherData.main.temp),
            speedWind: apiWeatherData.wind.speed,
            clouds: apiWeatherData.clouds.all,
            name: apiWeatherData.name
        });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})

router.get('/sun', async (_, res) => {
    try {
        const response = await fetch('https://api.sunrise-sunset.org/json?lat=44.8333&lng=-0.57918')
        const apiSunData = await response.json();
        res.json({
            result: true,
            sunrise: apiSunData.results.sunrise,
            sunset: apiSunData.results.sunset,
            astronomicalTwilightBegin: apiSunData.results.astronomical_twilight_begin,
            astronomicalTwilightEnd: apiSunData.results.astronomical_twilight_end
        });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})


module.exports = router;