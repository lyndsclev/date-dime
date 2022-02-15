var priceInput = document.querySelector("#price-input");
var zipInput = document.querySelector("#zip-input");
 
var map;
var geocoder;
var service;
var infowindow;
let response;
let marker;
 
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
            console.log(priceLevel);
        }
        else if (priceLevel == '2') {
            priceLevel = 2;
            console.log(priceLevel);
        }
        else if (priceLevel == '3') {
            priceLevel = 3;
            console.log(priceLevel);
        }
        else if (priceLevel == '4') {
            priceLevel = 4;
            console.log(priceLevel);
        }
        $("#eat-info-display").remove();
        $("#map-display").removeClass("display-none");
        geocode({ address: zipcode })
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
 
function initMap() {
    geocoder = new google.maps.Geocoder();
    var location = new google.maps.LatLng(-34.397, 150.644);
    map = new google.maps.Map(document.getElementById("map"), {
      center: location,
      zoom: 12
    });
};
function geocode(request) {
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        var priceLevel = document.getElementById("price-input").value;
        var ask = {
                location: results[0].geometry.location,
                radius: '5000',
                type: ['restaurant'],
                minPriceLevel: priceLevel,
                maxPriceLevel: priceLevel+.5
              }
              map.setCenter(results[0].geometry.location);
              service = new google.maps.places.PlacesService(map);
              service.nearbySearch(ask, callback);
        return results;
      })
      .catch((e) => {
       
        console.log("Geocode was not successful for the following reason: " + e);
      });
  }
function callback(results, status) {
       
    $("#eat-info-container").append($("<div>").addClass("columns").attr("id", "eat-info-display"));
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 1; i < 5; i++) {
            $("#eat-info-display").append($("<div>").addClass('column').attr("id", `column${i}`));
 
            $(`#column${i}`).append($("<div>").addClass('card').attr("id", `card${i}`));
            $(`#card${i}`).append($(`<h1>${results[i].name}</h1>`).addClass('card-header-title title').attr("id", `card-title${i}`));
            $(`#card${i}`).append($("<div>").addClass('card-content').attr("id", `card-content${i}`));
 
            $(`#card-content${i}`).append($("<div>").addClass('').attr("id", `map-info${i}`));
            console.log(results[i])
            createMarker(results[i])
        }      
      }
      else {
          console.log('failed ' +status)
      }
  }
function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;
    const infowindow = new google.maps.InfoWindow({
        content: place.name,
      });
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });
    marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });
  }
var deleteWarning = function() {
    $('#warning').remove()
}
 
$("#search-form").on("submit", formSubmitHandler);
