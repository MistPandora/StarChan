{/* Traduit les résultats de weather en français parce que personne parle anglais dans c'te pays */ }
const translateWeather = (weather) => {

    if (weather) {
        const weatherObj = {
            Clear: "Ensoleillé",
            Clouds: "Nuageux",
            Mist: "Brumeux",
            Fog: "Brouillard",
            Smoke: "Brouillard",
            Haze: "Brouillard",
            Drizzle: "Pluvieux",
            Rain: "Pluvieux",
            Thunderstorm: "Orageux",
            Snow: 'Enneigé'
        }

        return weatherObj[weather]
    }
}

module.exports = translateWeather;