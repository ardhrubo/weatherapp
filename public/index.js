// Get references to the HTML elements that will display the weather data
const condition = document.getElementById('condition');
const city = document.getElementById('city');
const country = document.getElementById('country');
const mainText = document.getElementById('mainText');
const description = document.getElementById('description');
const temp = document.getElementById('temp');
const pressure = document.getElementById('pressure');
const humidity = document.getElementById('humidity');

// Get references to the HTML elements that will handle user input and display the history
const cityInput = document.getElementById('cityInput');
const historyElm = document.getElementById('history');
const masterHistory = document.getElementById('master-history');

// Define constants for the API key, base URL, icon URL, and default city
const API_KEY = '99aaa584377e96a97dee6770f5e52bf5';
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?id=2172797&appid=${API_KEY}`;
const ICON_URL = `http://openweathermap.org/img/wn/`;
const DEFAULT_CITY = 'Dhaka,BD';

// When the window loads, get the user's geolocation and fetch the weather data
window.onload = function() {
    // Get the user's geolocation
    navigator.geolocation.getCurrentPosition(s => {
        getWeatherData(null, s.coords);
    }, e => {
        getWeatherData();
    })

    // Fetch the history from the API
    axios.get('/api/history')
    .then( ({data}) => {
        if(data.length > 0) {
            updateHistory(data);
        } else {
            historyElm.innerHTML = 'No History Found';
            console.log(data)
        }
    })
    .catch(error => {
        alert('Error Occurred')
    })

    // Add an event listener to the city input field to handle the Enter key
    cityInput.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            if(e.target.value) {
                getWeatherData(e.target.value, null, weather => {
                    e.target.value = '';
                    axios.post('/api/history', weather)
                    .then(({data}) => {
                        updateHistory(data);
                    })
                    .catch(error => {
                        console.log(error);
                        alert('Error Occurred');
                    })
                });
            } else {
                alert('Please enter a city name');
            }
        }
    })
}

// Function to fetch the weather data from the API
function getWeatherData(city = DEFAULT_CITY, coords, cb) {
    let url = BASE_URL;
    city === null ? 
       url = `${url}&lat=${coords.latitude}&lon=${coords.longitude}` :
       url =`${url}&q=${city}`;
     
     axios.get(url)
        .then(({data}) => {
            let weather = {
                icon: data.weather[0].icon,
                name: data.name,
                country: data.sys.country,
                main: data.weather[0].main,
                description: data.weather[0].description,
                temp: (data.main.temp-273.15).toFixed(0), // Convert temperature from Kelvin to Celsius
                pressure: data.main.pressure,
                humidity: data.main.humidity,
            }
          
          setWeatherData(weather);
          if(cb) cb(weather);
        })
        .catch(error => {
            alert('City not found');
        })
}

// Function to display the weather data in the HTML
function setWeatherData(weather) {
    condition.src = `${ICON_URL}${weather.icon}.png`;
    city.innerHTML = weather.name;
    country.innerHTML = weather.country;
    mainText.innerHTML = weather.main;
    description.innerHTML = weather.description;
    temp.innerHTML = weather.temp;
    pressure.innerHTML = weather.pressure;
    humidity.innerHTML = weather.humidity;
}

// Function to update the history in the HTML
function updateHistory(history) {
    historyElm.innerHTML = '';
    history = history.reverse();
    history.forEach(h => {
        let tempHistory = masterHistory.cloneNode(true);
        tempHistory.id = '';
        tempHistory.getElementsByClassName('condition')[0].src = `${ICON_URL}${h.icon}.png`;
        tempHistory.getElementsByClassName('city')[0].innerHTML = h.name;
        tempHistory.getElementsByClassName('country')[0].innerHTML = h.country;
        tempHistory.getElementsByClassName('main')[0].innerHTML= h.main;
        tempHistory.getElementsByClassName('description')[0].innerHTML = h.description;
        tempHistory.getElementsByClassName('temp')[0].innerHTML = h.temp;
        tempHistory.getElementsByClassName('pressure')[0].innerHTML = h.pressure;
        tempHistory.getElementsByClassName('humidity')[0].innerHTML = h.humidity;
        historyElm.appendChild(tempHistory);
    })
}