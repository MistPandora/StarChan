{/* Applique les image appropriées en fonction de la météo actuelle */ }
export const findWeatherImage = (weather) => {
    if (weather) {
        const arr = ['Mist', 'Fog', 'Smoke', 'Haze', 'Clouds'];

        for (const el of arr) {
            if (weather.includes(el)) {
                return "Clouds"
            }
        }

        if (weather == "Drizzle") {
            return "Rain";
        }

        return weather;
    }


}