const express = require("express");
const app = express();
const { getWeather, getPointsOfInterest, getExchangeRates } = require("./logic");
const path = require("path");

app.use(express.static(path.join(__dirname, "static"))); 

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.get("/weather", async (req, res) => {
    try {
        const city = req.query.city || "Astana";
        const [weatherData, poiData, exchangeRates] = await Promise.all([
            getWeather(city),
            getPointsOfInterest(city),
            getExchangeRates()
        ]);

        res.json({
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            coordinates: {
                latitude: weatherData.coord.lat,
                longitude: weatherData.coord.lon
            },
            feelsLike: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            windSpeed: weatherData.wind.speed,
            countryCode: weatherData.sys.country,
            rainVolumeLast3Hours: weatherData.rain ? weatherData.rain["3h"] : 0,
            pointsOfInterest: poiData.all,
            exchange: exchangeRates.conversion_rates.KZT, 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data");
    }
});

app.get("/coordinates", async (req, res) => {
    try {
        const city = req.query.city || "Astana";
        const coordinates = await getCoordinates(city);
        res.json({ coordinates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching coordinates" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
