// SET Date / Time  ------------------------------------------------------

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
let today = new Date();
setCurrentTime(today);
//-----------------------------------------------------------------------

// CHANGE Celsius - Fahrenheit
function changeToCelsius(event) {
	event.preventDefault();
	let currentTemp = document.querySelector("#current-temperature");
	let celsiusFahrenheit = document.querySelector("#celsius-fahrenheit");
	currentTemp.innerHTML = "19";
	celsiusFahrenheit.innerHTML = "°C";
}
function changeToFahrenheit(event) {
	event.preventDefault();
	let currentTemp = document.querySelector("#current-temperature");
	let temp = currentTemp.innerHTML;
	temp = Number(temp);
	let celsiusFahrenheit = document.querySelector("#celsius-fahrenheit");
	currentTemp.innerHTML = Math.round(temp * 1.8 + 32);
	celsiusFahrenheit.innerHTML = "°F";
}
let celsiusClick = document.querySelector("#celsius-click");
celsiusClick.addEventListener("click", changeToCelsius);
let fahrenheitClick = document.querySelector("#fahrenheit-click");
fahrenheitClick.addEventListener("click", changeToFahrenheit);
//-----------------------------------------------------------------------

// API weather ----------------------------------------------------------
function changeWeather(response) {
	console.log(response);
	let sunset = response.data.sys.sunset;
	let date = new Date(sunset * 1000);
	let timestr = date.toLocaleTimeString();
	let hour = date.getHours();
	if (hour < 10) {
		hour = `0${hour}`;
	}
	let min = date.getMinutes();
	if (min < 10) {
		min = `0${min}`;
	}
	document.querySelector("h2").innerHTML = response.data.name;
	document.querySelector("#current-temperature").innerHTML = Math.round(
		response.data.main.temp
	);
	document.querySelector("#weather-description").innerHTML =
		response.data.weather[0].description;
	document.querySelector("#humidity").innerHTML = response.data.main.humidity;
	document.querySelector("#wind-speed").innerHTML = Math.round(
		response.data.wind.speed * 3.6
	);
	document.querySelector("#sunset").innerHTML = `${hour}:${min}`;
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

let citySearch = document.querySelector("#city-search-form");
citySearch.addEventListener("submit", changeCity);

let currentLocation = document.querySelector("#button-current-location");
currentLocation.addEventListener("click", changeLocation);

search("Bremen");
//-----------------------------------------------------------------------
