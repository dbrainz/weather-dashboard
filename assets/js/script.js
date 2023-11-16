// openweather api key
const WEATHER_API_KEY="8d7ce158af399b5e504438876a01a4f4"

var cityPane = $("#cityListPane");
var weatherPane = $("#weatherPane");

// city search history - ten most recent searches saved to local storage
var searchHistory = [];

// takes user input from the page when the search button is clicked and uses it to look up matching cities from the openweather geolocation api
// if user doesn't inout anything, exit without doing anything
// 
function getCityList() {

    var userInput = $("#city").val()
    if (userInput.length===0) return
    var locationQuery = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput.replace(" ", "_")}&limit=5&appid=${WEATHER_API_KEY}`

    fetch(locationQuery) 
        .then(function(cityResponse) {
            return cityResponse.json()
        })
        .then(function(cityData){
            displayCityList(cityData)        
        })
}

// if geolocation api call returned more tha one possible city, this displays those choices as buttons
// when the user clicks one of the buttons, the forecast for that city is displayed
function displayCityList(cityChoices) {
    console.log(cityChoices)

    weatherPane.hide();
    cityPane.empty();
    cityPane.show();

    if (cityChoices.length === 1) {
        displayWeather(cityChoices[0].lat, cityChoices[0].lon, cityChoices[0].name)
    } else {
        cityChoices.forEach((city) => {
            cityPane.append(`<button class="cityButton" data-lat=${city.lat} data-lon=${city.lon} data-name=${city.name}>${city.name}, ${city.state}</button>`)
            
        })
        $(".cityButton").on("click", function(eventData){
            eventData.preventDefault()
            displayWeather($(this).data("lat"), $(this).data("lon"), $(this).data("name"));
   
        })
    }

}

// display weaather for the selected city
function displayWeather(cityLat, cityLon, cityName) {
    $("#cityListPane").hide();
    $("#weatherPane").show()
    $("#city").val("")
    // add city to the search history 
    addToHistory(cityLat, cityLon, cityName);
    // call openweather current weather api
    let currentQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=${WEATHER_API_KEY}`
    fetch(currentQuery)
        .then(currentResponse => currentResponse.json())
        // display current weather
        .then(todaysData => {
            $("#icon0").attr("src", "https://openweathermap.org/img/wn/" + todaysData.weather[0].icon + ".png")
            $("#icon0").attr("alt", todaysData.weather[0].main)
            $("#temp0").text(Math.round(todaysData.main.temp))
            $("#humidity0").text(todaysData.main.humidity + "%")
            $("#wind0").text(Math.round(todaysData.wind.speed)+ " mph")
        })
    // call openweather forecast api
    let weatherQuery = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${cityLat}&lon=${cityLon}&cnt=6&units=imperial&appid=${WEATHER_API_KEY}`
    fetch(weatherQuery)
        .then( weatherResponse => weatherResponse.json())
        // display forecast for the next 5 days
        .then(weatherData => {
            $("#cityName").text(weatherData.city.name + "   (" + dayjs(weatherData.list[0].dt*1000).format("MM/DD/YYYY") + ")")
            for (i=1; i<6; i++){
                $("#date" + i).text(dayjs(weatherData.list[i].dt*1000).format("MM/DD/YYYY"))
                $("#icon" + i).attr("src", "https://openweathermap.org/img/wn/" + weatherData.list[i].weather[0].icon + ".png")
                $("#icon" + i).attr("alt", weatherData.list[i].weather[0].main)
                $("#temp" + i).text(Math.round(weatherData.list[i].temp.max) + " / " + Math.round(weatherData.list[i].temp.min))
                $("#humidity" + i).text(weatherData.list[i].humidity + "%")
                $("#wind" + i).text(Math.round(weatherData.list[i].speed)+ " mph")
            }


        })
}

// add city to the search history
// if it currently exists in the history list, move it to the top
function addToHistory(saveLat, saveLon, saveName) {
    if (saveLat==undefined || saveLon==undefined || saveName==undefined) return
    newSearch = {
        lat : saveLat,
        lon : saveLon,
        name : saveName
    }
    searchHistory.unshift(newSearch)
    searchHistory = searchHistory.filter( (city, i) => {
        if (i===0) {
            return true
        } else { 
            if (city.lat===saveLat && city.lon===saveLon) {
                return false
            }
        }
        return true
    })
    if (searchHistory.length>10) {
        searchHistory.splice(10)
    }
    localStorage.setItem("weather-dashboard-history", JSON.stringify(searchHistory))
    displayHistory()
    
}


// display search history as a button list
// show weather for that city if user clicks one of the history buttons
function displayHistory() {
    searchListEl = $("#prevSearch")
    searchListEl.empty();
    if (searchHistory.length === 0) {
        return
    } else {
        searchHistory.forEach((city) => {
            searchListEl.append(`<button class="historyBtn" data-lat=${city.lat} data-lon=${city.lon} data-name=${city.name}>${city.name}</button>`)
            
        })
        $(".historyBtn").on("click", function(eventData){
            eventData.preventDefault()
            displayWeather($(this).data("lat"), $(this).data("lon"), $(this).data("name"));
   
        })
    }

}

// main function
$(function() {
    var cityBtnEl = $("#citySubmit")
    // load search history from local storage
    let retrieveHistory=localStorage.getItem("weather-dashboard-history")
    if (retrieveHistory===null) {
        searchHistory=[]
    } else {
        searchHistory = JSON.parse(retrieveHistory)
    }
    displayHistory();

    cityBtnEl.on("click", function(eventData){
        eventData.preventDefault()
        getCityList();
    })
});