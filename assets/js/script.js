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
            cityPane.append(`<button class="cityButton" data-lat=${city.lat} data-lon=${city.lon} data-name=${city.name}>${city.name}, ${city.state}</button>`)
            
        })
        $(".cityButton").on("click", function(eventData){
            eventData.preventDefault()
            displayWeather($(this).data("lat"), $(this).data("lon"), $(this).data("name"));
   
        })
    }

}

function displayWeather(cityLat, cityLon, cityName) {
    $("#cityListPane").hide();
    $("#weatherPane").show()
    let currentQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=${WEATHER_API_KEY}`
    fetch(currentQuery)
        .then(currentResponse => currentResponse.json())
        .then(todaysData => {
            $("#icon0").attr("src", "https://openweathermap.org/img/wn/" + todaysData.weather[0].icon + ".png")
            $("#icon0").attr("alt", todaysData.weather[0].main)
            $("#temp0").text(Math.round(todaysData.main.temp))
            $("#humidity0").text(todaysData.main.humidity + "%")
            $("#wind0").text(Math.round(todaysData.wind.speed)+ " mph")
        })
    let weatherQuery = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${cityLat}&lon=${cityLon}&cnt=6&units=imperial&appid=${WEATHER_API_KEY}`
    fetch(weatherQuery)
        .then( weatherResponse => weatherResponse.json())
        .then(weatherData => {
            console.log(weatherData)
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

$(function() {
    var cityBtnEl = $("#citySubmit")

    cityBtnEl.on("click", function(eventData){
        eventData.preventDefault()
        getCityList();
    })
});