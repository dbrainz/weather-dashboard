const WEATHER_API_KEY="8d7ce158af399b5e504438876a01a4f4"

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

    $("weatherPane").hide();
    $("cityListPane").show();

}


$(function() {
    var cityBtnEl = $("#citySubmit")

    cityBtnEl.on("click", function(eventData){
        eventData.preventDefault()
        //console.log($("#city"))
        console.log("foo")
        getCityList();
    })
});