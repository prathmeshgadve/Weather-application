// Select elements
const searchButton = document.getElementById("but");
const inputField = document.getElementById("city");
const currentTemp = document.getElementById("current-temp");
const currentIcon = document.getElementById("current-icon");
const currentCondition = document.getElementById("current-condition");
const loc = document.getElementById("location");
const Feelslike = document.getElementById("feelslike");
const pressure = document.getElementById("pressure");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const hour = document.getElementById("hour");
const now = document.getElementById("now");
const h_icon = document.getElementById("hour-icon");
const h_temp = document.getElementById("hour-temp");
const weather_details_time = document.getElementById("weather-details-time");
const c1 = document.getElementById("c-1");
const c2 = document.getElementById("c-2");
const c3 = document.getElementById("c-3");
const c4 = document.getElementById("c-4");
const c5 = document.getElementById("c-5");
const c6 = document.getElementById("c-6");
const day15 = document.getElementById("day15");

// Load default weather for Delhi
showWeatherDetails("Delhi");

// Prevent form submission on button click
searchButton.addEventListener("click", (event) => {
    const cityName = inputField.value.trim();
    if (!cityName) return alert("Please enter a city name!");
    showWeatherDetails(cityName);
});

// Allow pressing "Enter" to search
inputField.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const cityName = inputField.value.trim();
        if (cityName) {
            showWeatherDetails(cityName);
        }
    }
});

// Fetch weather data
async function showWeatherDetails(city) {
    const apikey = newLocal.apiKey; 
    const apiKey2 = newLocal.apiKey2;

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey2}&contentType=json`;

    try {
        const response = await axios.get(url);
        console.log("API Response:", response); // Debug API response
        if (!response.data || !response.data.currentConditions) {
            throw new Error("Invalid API response");
        }

        const { resolvedAddress, currentConditions, days } = response.data;

        // Update first row
        currentTemp.innerText = `${Math.floor(currentConditions.temp)}°C`;
        currentCondition.innerText = currentConditions.conditions;
        currentIcon.setAttribute("src", `svg/${currentConditions.icon}.svg`);
        loc.innerText = resolvedAddress;
        Feelslike.innerText = `${currentConditions.feelslike} °C`;
        pressure.innerText = `${currentConditions.pressure} mb`;
        wind.innerText = `${currentConditions.windspeed} kmph`;
        humidity.innerText = `${currentConditions.humidity}%`;

        // Update second row first fixed card
        now.innerText = "Now";
        h_icon.src = `svg/${currentConditions.icon}.svg`;
        h_temp.innerHTML = `${Math.floor(currentConditions.temp)}°C`;

        // Update the current-weather-details
        c1.innerText = `${Math.floor(currentConditions.feelslike)}°C`;
        c2.innerText = `${currentConditions.windspeed}`;
        c3.innerText = `${currentConditions.humidity}`;
        c4.innerText = `${currentConditions.uvindex}`;
        c5.innerText = `${currentConditions.visibility}`;
        c6.innerText = `${currentConditions.pressure}`;

        // Clear input field after search
        inputField.value = '';

        // Call other row to update
        processDataWhenIdle(() => {
            hourlyDetail(days[0].hours);
            day15Forcast(days);
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Helper function to break up long tasks
function processDataWhenIdle(callback) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback);
    } else {
        setTimeout(callback, 1);
    }
}

function hourlyDetail(response) {
    processDataWhenIdle(() => {
        while (hour.children.length > 1) {
            hour.removeChild(hour.lastChild);
        }

        response.slice(0, 23).forEach((hourData, index) => {
            setTimeout(() => {
                const contain = document.createElement("div");
                contain.className = "hour p-3 m-2 h-weather text-center";

                const timeElement = document.createElement("h6");
                timeElement.className = "time pb-2";
                timeElement.innerText = new Date(hourData.datetimeEpoch * 1000)
                    .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

                const hourIcon = document.createElement("img");
                hourIcon.className = "pb-3";
                hourIcon.src = `svg/${hourData.icon}.svg`;
                hourIcon.id = 'hour-icon';
                hourIcon.alt = "Weather Icon";

                const tempElement = document.createElement("h6");
                tempElement.id = "hour-temp";
                tempElement.innerText = `${Math.floor(hourData.temp)}°C`;

                contain.append(timeElement, hourIcon, tempElement);
                hour.appendChild(contain);
            }, index * 50); // Delay each item slightly to avoid blocking
        });
    });
}

function day15Forcast(days) {
    processDataWhenIdle(() => {
        while (day15.children.length > 1) {
            day15.removeChild(day15.lastChild);
        }

        days.slice(0, 15).forEach((day, index) => {
            setTimeout(() => {
                const rowWeather = document.createElement("div");
                rowWeather.className = "weather-row h-weather";

                rowWeather.innerHTML = `
                    <div class="weather-column">${day.datetime}</div>
                    <div class="weather-column">${Math.floor(day.temp)}°C</div>
                    <div class="weather-column">
                        <img class="weather-icon" src="svg/${day.icon}.svg" id="dayicon" alt="Weather Icon">
                    </div>
                    <div class="weather-column">${Math.floor(day.tempmax)}°C / ${Math.floor(day.tempmin)}°C</div>
                    <div class="weather-column">${Math.floor(day.windspeed)} km/h</div>
                `;

                day15.appendChild(rowWeather);
            }, index * 50); // Delay each row slightly
        });
    });
}

window.addEventListener('beforeunload', () => {
    socket.close();
});
