$(document).ready(function() {

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(locate, error);
  }
  else {
    error();
  }

  function locate(position){
    var lat = position.coords.latitude.toFixed(2);
    var lon = position.coords.longitude.toFixed(2);
    callAPI(lat,lon);
  }

  function error(error) {
    alert("Couldn't find your location. Error: " + error.message);
  }


  function callAPI(x,y,city) {
    var key="5485b391b286983dc7b50452adcb9c23";
    // if city is provided the url changes
    if (city) {
      var url = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid="+ key;
    }
    else {
      var url = "https://api.openweathermap.org/data/2.5/weather?lat="+ x +"&lon="+ y +"&appid="+ key;
    }

    $.ajax({
      url: url,
    })
    .done(function(json){
      jsonGlobal = json; //creating a global variable here for celsius/fahrenheit buttons to access that
      filler(json, false);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      alert(errorThrown);
      console.log(errorThrown);
    })
  }

  function filler(data, imperial) {
    $("#weather").empty();
    $("#loc").empty();

    var temperature = data.main.temp - 273.15;
    var fahrenheit = temperature*9/5 + 32;
    var speed = data.wind.speed;
    var speedImperial = speed/0.44704
    var tempUnit = "C";
    var speedUnit = "m/s"
    var time = new Date().getHours();

    if (imperial == true) {
      var temperature = fahrenheit;
      var tempUnit = "F";
      var speed = speedImperial.toFixed(2);
      var speedUnit = "MPH";
    }

    if (time >= 6 && time <= 22) {
      var icon = "wi-owm-day-"+ data.weather[0].id;
    }
    else {
      var icon = "wi-owm-night-"+ data.weather[0].id;
    }

    var backgroundSelect = {"2": "storm", "3": "rain", "5": "rain", "6": "snowing"};
    var background = backgroundSelect[data.weather[0].id.toString()[0]];
    var currentWeather = data.weather[0].description;

    $("#loc")
      .append("<li>Country: "+ data.sys.country +"</li>")
      .append("<li>City: "+ data.name +"</li>");
    $("#weather")
      .append("<li id=\"temp\">Temperature: "+ temperature.toFixed(2) +" &deg"+ tempUnit +"</li>")
      .append("<li>Wind: "+ speed +" "+ speedUnit +"</li>")
      .append("<li>Humidity: "+ data.main.humidity +" %</li>")
      .append("<li>Pressure: "+ data.main.pressure +" hPa</li>");
    $("#icon").attr("class", "wi "+ icon);
    $("#weatherName").html(currentWeather);

    if(background) {
      $(".container").css("background-image", "url(./images/"+ background +".jpg)");
    }
    else {
      $(".container").css("background-image", "url(./images/clouds.jpg)");
    }
  }

  $("#selectCelsius").click(function(){
      filler(jsonGlobal, false);
      $(this).parent().addClass("active");
      $("#selectFahrenheit").parent().removeClass("active");
  });

  $("#selectFahrenheit").click(function(){
      filler(jsonGlobal, true);
      $(this).parent().addClass("active");
      $("#selectCelsius").parent().removeClass("active");
  });

  $("#newQuery").click(function(){
    var query = $("#searchCity").val();
    if (query){
      callAPI(0,0,query);
    }
    $("#searchCity").val("");

  });
});
