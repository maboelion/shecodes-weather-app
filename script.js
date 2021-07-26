function setCurrentTime(event) {
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	let months = [
		"01",
		"02",
		"03",
		"04",
		"05",
		"06",
		"07",
		"08",
		"09",
		"10",
		"11",
		"12",
	];
	let day = days[today.getDay()];
	let month = months[today.getMonth()];
	let date = today.getDate();
	let year = today.getFullYear();
	let hour = today.getHours();
	if (hour < 10) {
		hour = `0${hour}`;
	}
	let min = today.getMinutes();
	if (min < 10) {
		min = `0${min}`;
	}

	document.querySelector("#week-day").innerHTML = `${day}`;
	document.querySelector("#date").innerHTML = `${date}.${month}.${year}`;
	document.querySelector("#time").innerHTML = `${hour}:${min}`;
}

function alertFahrenheit(event) {
	event.preventDefault();
	let fahrenheitTemp = Math.round(celsiusTemp * 1.8 + 32);
	alert(
		`Hello there! The current temperatue in Fahrenheit is ${fahrenheitTemp}°. 
Please be aware that I am based in Europe where we use the only legit system: 
The metric system. 😁`
	);
}

function setSunset(time) {
	let date = new Date(time * 1000);
	let hour = date.getHours();
	if (hour < 10) {
		hour = `0${hour}`;
	}
	let min = date.getMinutes();
	if (min < 10) {
		min = `0${min}`;
	}
	document.querySelector("#sunset").innerHTML = `${hour}:${min}`;
}
function setSunrise(time) {
	let date = new Date(time * 1000);
	let hour = date.getHours();
	if (hour < 10) {
		hour = `0${hour}`;
	}
	let min = date.getMinutes();
	if (min < 10) {
		min = `0${min}`;
	}
	document.querySelector("#sunrise").innerHTML = `${hour}:${min}`;
}

function setForecastDay(time) {
	let date = new Date(time * 1000);
	let day = date.getDay();
	let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return days[day];
}

function setForecastWeek(forecast) {
	let dateStart = new Date(forecast[1].dt * 1000);
	let dateEnd = new Date(forecast[5].dt * 1000);
	let dayStart = dateStart.getDay();
	let dayEnd = dateEnd.getDay();
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	let months = [
		"01",
		"02",
		"03",
		"04",
		"05",
		"06",
		"07",
		"08",
		"09",
		"10",
		"11",
		"12",
	];
	let monthStart = months[dateStart.getMonth()];
	let monthEnd = months[dateEnd.getMonth()];
	let numberStart = dateStart.getDate();
	let numberEnd = dateEnd.getDate();
	let yearStart = dateStart.getFullYear();
	let yearEnd = dateEnd.getFullYear();

	return `${days[dayStart]} (${numberStart}.${monthStart}.${yearStart}) - ${days[dayEnd]} (${numberEnd}.${monthEnd}.${yearEnd})`;
}

function changeForecast(response) {
	let weatherData = response.data.daily;
	console.log(response.data);
	let forecastString = `<div class="row">`;
	let forecastWeek = setForecastWeek(weatherData);

	weatherData.forEach(function (forecastDay, index) {
		if (index > 0 && index < 6) {
			forecastString =
				forecastString +
				`
						<div class="col-2 bottom-col">
							<div class="forecast-day">${setForecastDay(forecastDay.dt)}</div>
							<img src="http://openweathermap.org/img/wn/${
								forecastDay.weather[0].icon
							}@2x.png"
							alt="${forecastDay.weather[0].main}" class="forecast-icon" />
							<div class="forecast-temps">
							${Math.round(forecastDay.temp.min)}°C | <span>${Math.round(
					forecastDay.temp.max
				)}°C</span>
							</div>
						</div>`;
		}
	});
	forecastString = forecastString + `</div>`;

	document.querySelector("#weather-forecast").innerHTML = forecastString;
	document.querySelector("#forecast-text").innerHTML = forecastWeek;
}

function getForecast(coordinates) {
	let apiKey = "3b478c1272c318ae84892336587ae67c";
	let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=alerts&units=metric&appid=${apiKey}`;
	axios.get(apiUrl).then(changeForecast);
}

function changeWeather(response) {
	console.log(response);

	celsiusTemp = response.data.main.temp;
	let sunset = response.data.sys.sunset;
	let sunrise = response.data.sys.sunrise;
	setSunset(sunset);
	setSunrise(sunrise);

	document.querySelector("h2").innerHTML = response.data.name;
	document.querySelector("#current-temperature").innerHTML =
		Math.round(celsiusTemp);
	document.querySelector("#weather-description").innerHTML =
		response.data.weather[0].description;
	document.querySelector("#humidity").innerHTML = response.data.main.humidity;
	document.querySelector("#wind-speed").innerHTML = Math.round(
		response.data.wind.speed * 3.6
	);

	document
		.querySelector("#weather-icon")
		.setAttribute(
			"src",
			`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
		);
	document
		.querySelector("#weather-icon")
		.setAttribute("alt", response.data.weather[0].main);

	getForecast(response.data.coord);
}

function search(city) {
	let apiKey = "3b478c1272c318ae84892336587ae67c";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
	axios.get(apiUrl).then(changeWeather);
	setCurrentTime(today);
}

function changeCity(event) {
	event.preventDefault();
	let inputCity = document.querySelector("#city-name").value;
	search(inputCity);
}

function displayCoords(position) {
	let lat = position.coords.latitude;
	let lon = position.coords.longitude;
	let apiKey = "3b478c1272c318ae84892336587ae67c";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
	axios.get(apiUrl).then(changeWeather);
}

function changeLocation(event) {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(displayCoords);
}

let today = new Date();
let celsiusTemp = null;
let buttonWords = document.querySelector("#button-description");

document
	.querySelector("#temperature-button")
	.addEventListener("click", alertFahrenheit);
document
	.querySelector("#city-search-form")
	.addEventListener("submit", changeCity);
document
	.querySelector("#button-current-location")
	.addEventListener("click", changeLocation);

search("Bremen");
