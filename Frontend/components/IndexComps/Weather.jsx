import styles from '../../styles/Index.module.css';

import TranslateWeather from '../../modules/weatherAPI/translateWeather';
import FormatWeatherHours from '../../modules/weatherAPI/formatWeatherHours';
import FindWeatherImage from '../../modules/weatherAPI/findWeatherImage';

function Weather(props) {

    const weatherData = props.weatherData;
    const sunData = props.sunData;

    const weatherTextColor = weatherData && { color: `${FindWeatherImage(weatherData.main) == "Clouds" ? "#21274a" : "#fff"}` };

    return (
        weatherData &&
        <div className={styles.weatherWrapper} style={{ backgroundImage: `url("/images/${FindWeatherImage(weatherData.main)}.jpg")`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
            <h2 className={styles.weatherTitle} style={weatherTextColor}>Localisation : {weatherData.name}</h2>
            <div className={styles.weatherContainer}>
                <p className={styles.weatherInfos} style={weatherTextColor}>Temps : {TranslateWeather(weatherData.main)}</p>
                <p className={styles.weatherInfos} style={weatherTextColor}>Température : {weatherData.temp}°C</p>
                <p className={styles.weatherInfos} style={weatherTextColor}>Vent : {weatherData.speedWind}km/h</p>
                <p className={styles.weatherInfos} style={weatherTextColor}>Couverture nuageuse : {weatherData.clouds}%</p>
            </div>
            {sunData &&
                <>
                    <div className={styles.sunContainer}>
                        <p className={styles.weatherInfos} style={weatherTextColor}>Le soleil se lève à : {FormatWeatherHours(sunData.sunrise)} </p>
                        <p className={styles.weatherInfos} style={weatherTextColor}>Le soleil se couche à : {FormatWeatherHours(sunData.sunset)} </p>
                    </div>
                    <div className={styles.weatherContainer}>
                        <p className={styles.weatherInfos} style={weatherTextColor}>Crépuscule astronomique (matin) : {FormatWeatherHours(sunData.astronomicalTwilightBegin)} </p>
                        <p className={styles.weatherInfos} style={weatherTextColor}>Crépuscule astronomique (soir) : {FormatWeatherHours(sunData.astronomicalTwilightEnd)} </p>
                    </div>
                </>
            }
        </div>
    )
}

export default Weather 