var zipcodeAPI = "3c0ffffa2f1e899bf98403431f25c752";
 
var priceInput = document.querySelector("#price-input");
var zipInput = document.querySelector("#zip-input");
var latInput = document.querySelector("#lat-input");
var lngInput = document.querySelector("#lng-input"); 

var map;
var geocoder;
var service;
var infowindow;
 
var priceLevelHandler = function(price) {
    if (price == 1) {
        priceInput.value = "";
        priceInput.value = 1;
        console.log(priceInput.value)
    }
    else if (price == 2) {
        priceInput.value = "";
        priceInput.value = 2;
        console.log(priceInput.value)
    }
    else if (price == 3) {
        priceInput.value = "";
        priceInput.value = 3;
        console.log(priceInput.value)
    }
    else if (price == 4) {
        priceInput.value = "";
        priceInput.value = 4;
        console.log(priceInput.value)
    };
};
 
var formSubmitHandler = function(event){
    event.preventDefault();
    var priceLevel = priceInput.value.trim();
    var zipcode = zipInput.value.trim();
    if (priceLevel && zipcode) {
        if (priceLevel == '1'){
            priceLevel = 1;
            getCoords(zipcode);
            console.log(priceLevel);
        }
        else if (priceLevel == '2') {
            priceLevel = 2;
            getCoords(zipcode);
            console.log(priceLevel);
        }
        else if (priceLevel == '3') {
            priceLevel = 3;
            getCoords(zipcode);
            console.log(priceLevel);
        }
        else if (priceLevel == '4') {
            priceLevel = 4;
            getCoords(zipcode);
            console.log(priceLevel);
        }
        initMap();
    }
    else {
        $("body").append($('<div>')
        .addClass('notification is-danger has-text-white warning')
        .attr('id', 'warning')
        .text("Please select price range and enter zipe code."));
 
        $("#warning").append($('<button>')
        .addClass('delete')
        .attr('onclick', 'deleteWarning()'));
    };
};
 
var getCoords = function(zipcode) {
    fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},US&appid=${zipcodeAPI}`)
    .then(function(response){
        response.json().then(function(data){
            if (data.length === 0){
                zipInput.value = "";
                priceInput.value = "";
 
                $("body").append($('<div>')
                .addClass('notification is-danger has-text-white warning')
                .attr('id', 'warning')
                .text("Please a valid zipcode."));
 
                $("#warning").append($('<button>')
                .addClass('delete')
                .attr('onclick', 'deleteWarning()'));
            }
            else {
            latInput.value = data.lat;
            lngInput.value = data.lon;
            zipInput.value = "";
            priceInput.value = "";
            };
        });
    });
};
 
function initMap() {
    lat = document.getElementById("lat-input").value;
    lng = document.getElementById("lng-input").value;
    var location = new google.maps.LatLng(lat,lng);
    var priceLevel = document.getElementById("price-input").value;
    geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById(`map1`), {
      center: location,
      zoom: 10
    });
  var request = {
    location: location,
    radius: '5000',
    type: ['restaurant'],
    minPriceLevel: priceLevel,
    maxPriceLevel: priceLevel+.5,
  }
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    //   for (var i = 1; i < 5; i++) {
          console.log(results)
        //   createMarker(results);
        //  }
      }
      else {
          console.log('failed' +status)
      }
  }
// function createMarker(place) {
//     if (!place.geometry || !place.geometry.location) return;
 
//     const marker = new google.maps.Marker({
//       map,
//       position: place.geometry.location,
//     });
 
//     google.maps.event.addListener(marker, "click", () => {
//       infowindow.setContent(place.name || "");
//       infowindow.open(map);
//     });
//   }

var deleteWarning = function() {
    $('#warning').remove()
}
 
$("#search-form").on("submit", formSubmitHandler);