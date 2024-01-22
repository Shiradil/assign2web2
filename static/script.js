let map;
let marker;

document.getElementById("weatherForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = document.getElementById("cityInput").value;
    const response = await fetch(`/weather?city=${city}`);
    const resultData = await response.json();

    // Update the HTML to display additional weather data
    const resultHtml = `
        <h1>Temperature: ${resultData.temperature}C</h1>
        <h2>Weather is: ${resultData.description}</h2>
        <p>Feels Like: ${resultData.feelsLike}C</p>
        <p>Humidity: ${resultData.humidity}%</p>
        <p>Pressure: ${resultData.pressure} hPa</p>
        <p>Wind Speed: ${resultData.windSpeed} m/s</p>
        <p>Country Code: ${resultData.countryCode}</p>
        <p>Rain Volume (last 3 hours): ${resultData.rainVolumeLast3Hours} mm</p>
        <img src="https://openweathermap.org/img/wn/${resultData.icon}@2x.png" alt="weather icon">
        <p>Interesting point: ${resultData.pointsOfInterest}</p>
    `;

    document.getElementById("weatherResult").innerHTML = resultHtml;

    if (!map) {
        const coordinates = resultData.coordinates;
        map = L.map('map').setView([coordinates.latitude, coordinates.longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    const newCoordinates = resultData.coordinates;
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([newCoordinates.latitude, newCoordinates.longitude]).addTo(map);

    map.panTo([newCoordinates.latitude, newCoordinates.longitude]);

    createRainChart(resultData.rainVolumeLast3Hours);

});

function createRainChart(rainVolume) {
    const ctx = document.getElementById('rainChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Rain Volume (last 3 hours)'],
            datasets: [{
                label: 'Rain Volume',
                data: [rainVolume],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function getCoordinates(city) {
    const response = await fetch(`/coordinates?city=${city}`);
    const data = await response.json();
    return data.coordinates;
}
