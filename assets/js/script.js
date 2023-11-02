const WEATHER_API_KEY="8d7ce158af399b5e504438876a01a4f4"

var cityPane = $("#cityListPane");
var weatherPane = $("#weatherPane");

function getCityList() {

    var userInput = $("#city").val()
    console.log(userInput)
    var locationQuery = `http://api.openweathermap.org/geo/1.0/direct?q=${userInput.replace(" ", "_")}&limit=5&appid=${WEATHER_API_KEY}`
    //locationQuery = "http://api.openweathermap.org/geo/1.0/direct?q=Los_Angeles&limit=5&appid=" + WEATHER_API_KEY
    console.log(locationQuery)
    fetch(locationQuery) 
        .then(function(cityResponse) {
            return cityResponse.json()
        })
        .then(function(cityData){
            displayCityList(cityData)        
        })
    

}

function displayCityList(cityChoices) {
    console.log(cityChoices)

    weatherPane.hide();
    cityPane.empty();
    cityPane.show();

    if (cityChoices.length === 1) {
        displayWeather(cityChoices.lat, cityChoices.lon, cityChoices.name)
    } else {
        cityChoices.forEach((city) => {
            cityPane.append(`<button class="cityButton" data-lat=${cityChoice.lat} data-lon=${cityChoice.lon} data-name=${cityChoice.name}>${city.name}, ${city.state}</button>`)
            
        })
    }

}

function displayWeather(cityLat, cityLong, cityName) {
    $("#cityListPane").hide();
    $("#weatherPane").show()
}

$(function() {
    var cityBtnEl = $("#citySubmit")

    cityBtnEl.on("click", function(eventData){
        eventData.preventDefault()
        getCityList();
    })
});