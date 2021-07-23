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

	let selectWeekDay = document.querySelector("#week-day");
	selectWeekDay.innerHTML = `${day}`;
	let selectCurrentDate = document.querySelector("#date");
	selectCurrentDate.innerHTML = `${date}.${month}.${year}`;
	let selectCurrentTime = document.querySelector("#time");
	selectCurrentTime.innerHTML = `${hour}:${min}`;
}

// CHANGE Celsius - Fahrenheit
function changeToCelsius(event) {
	document.querySelector("#current-temperature").innerHTML =
		Math.round(celsiusTemp);
	document.querySelector("#celsius-fahrenheit").innerHTML = "°C";
	document.querySelector("#button-description").innerHTML =
		"Change to Fahrenheit";
}
function changeToFahrenheit(event) {
	document.querySelector("#current-temperature").innerHTML = Math.round(
		celsiusTemp * 1.8 + 32
	);
	document.querySelector("#celsius-fahrenheit").innerHTML = "°F";
	document.querySelector("#button-description").innerHTML = "Change to Celsius";
}

function changeTemperature(event) {
	event.preventDefault();

	if (buttonWords.innerHTML === "Change to Fahrenheit") {
		changeToFahrenheit();
	} else {
		changeToCelsius();
	}
}

//-----------------------------------------------------------------------

// API weather ----------------------------------------------------------
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
}

function search(city) {
	let apiKey = "3b478c1272c318ae84892336587ae67c";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
	axios.get(apiUrl).then(changeWeather);
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
	.addEventListener("click", changeTemperature);
document
	.querySelector("#city-search-form")
	.addEventListener("submit", changeCity);
document
	.querySelector("#button-current-location")
	.addEventListener("click", changeLocation);

setCurrentTime(today);
search("Bremen");
