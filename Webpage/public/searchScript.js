document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
  document.getElementById('searchNameButton').addEventListener('click', function(event){
    console.log("search Pressed")
    var req = new XMLHttpRequest();
    /*
    var payload = {searchType:"Name", searchTerm:null};
    payload.searchTerm = document.getElementById('searchNameInput').value;



    req.open('POST', '/search/search', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function(){
      if(req.status >= 200 && req.status < 400){
        //DO STUFF HERE   
        window.location = req.responseURL;               
      }
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();  
  });
  */
    var payload = {searchType:"Name", searchTerm:null};
    payload.searchTerm = document.getElementById('searchNameInput').value;
    req.open('GET','/searchResult?searchType=' + payload.searchType + '&searchTerm=' + payload.searchTerm ,true)
    req.addEventListener('load', function(){
      if(req.status >= 200 && req.status < 400){
        //DO STUFF HERE                
        //console.log(JSON.parse(req.responseText));
        //var weather = JSON.parse(req.responseText)
        console.log("here");
        window.location.href = req.responseURL;
      };
    });
    req.send(null);
    event.preventDefault(); 

  });
}
      /*

      var req = new XMLHttpRequest();
      var cityCountry = document.getElementById('cityCountryInput').value;
      req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + cityCountry+  
        '&appid=' + apiKey, true);
      req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
          //DO STUFF HERE                
          console.log(JSON.parse(req.responseText));
          var weather = JSON.parse(req.responseText);
          document.getElementById('weatherDisplay1').textContent = 'Right now in ' + weather.name + ',' + weather.sys.country + ' the temperature is ' + weather.main.temp + 'K.';
          document.getElementById('weatherDisplay2').textContent = "The humidity is " + weather.main.humidity + '% and the wind is ' + weather.wind.speed + 'mph.';
        };
      });
      req.send(null);
      event.preventDefault();
    });
    document.getElementById('zipCountryButton').addEventListener('click', function(event){
      console.log('test')
      var req = new XMLHttpRequest();
      var zipCountry = document.getElementById('zipCountryInput').value;
      req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipCountry+  
        '&appid=' + apiKey, true);
      req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
          //DO STUFF HERE                
          console.log(JSON.parse(req.responseText));
          var weather = JSON.parse(req.responseText);
          document.getElementById('weatherDisplay1').textContent = 'Right now in ' + weather.name + ',' + weather.sys.country + ' the temperature is ' + weather.main.temp + 'K.';
          document.getElementById('weatherDisplay2').textContent = "The humidity is " + weather.main.humidity + '% and the wind is ' + weather.wind.speed + 'mph.';
        };
      });
      req.send(null);
      event.preventDefault();
    });

    document.getElementById('userIDButton').addEventListener('click', function(event){
      console.log('test');
      var req = new XMLHttpRequest();
      var payload = {userName:null, password:null};
      payload.userName = document.getElementById('usernameInput').value;
      payload.password = document.getElementById('passwordInput').value;
      req.open('POST', 'http://httpbin.org/post', true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
          //DO STUFF HERE                
          var response = JSON.parse(req.responseText);
          console.log(response);
          var data = JSON.parse(response.data);
          document.getElementById('usernameDisplay').textContent = data.userName;
          document.getElementById('passwordDisplay').textContent = data.password;  
        }
      });
      req.send(JSON.stringify(payload));
      event.preventDefault();
    });
*/      

