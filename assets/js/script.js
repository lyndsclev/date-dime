var zipcodeAPI = "3c0ffffa2f1e899bf98403431f25c752";

var priceInput = document.querySelector("#price-input");
var zipInput = document.querySelector("#zip-input");

let map;
let service;
let infowindow;

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
    }
}

var formSubmitHandler = function(event){
    event.preventDefault();
    var priceLevel = priceInput.value.trim();
    var zipcode = zipInput.value.trim();
    if (priceLevel && zipcode) {
        if (priceLevel == '1'){
            priceLevel = 1;
            getCoords(priceLevel, zipcode);
        }
        else if (priceLevel == '2') {
            priceLevel = 2;
            getCoords(priceLevel, zipcode);
        }
        else if (priceLevel == '3') {
            priceLevel = 3;
            getCoords(priceLevel, zipcode);
        }
        else if (priceLevel == '4') {
            priceLevel = 4;
            getCoords(priceLevel, zipcode);
        }
    }
    else {
        $("body").append($('<div>')
        .addClass('notification is-danger has-text-white warning')
        .attr('id', 'warning')
        .text("Please select price range and enter zipe code."));

        $("#warning").append($('<button>')
        .addClass('delete')
        .attr('onclick', 'deleteWarning()'));
    }
}

var getCoords = function(priceLevel, zipcode) {
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
            dataConverter(data, priceLevel);
            zipInput.value = "";
            priceInput.value = "";
            };
        });
    });
};

var dataConverter = function(data, priceLevel) {
    var lat = data.lat
    var lon = data.lon
    initMap(lat, lon, priceLevel)
    
}

var initMap = function(lat, lon, priceLevel) {
    console.log(lat, lon, priceLevel)
    var location = new google.maps.LatLng(lat, lon);
    console.log(location)
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15
        });
    var request = {
        location: location,
        radius: '1000',
        type: ['restaurant'],
        minPriceLevel: priceLevel,
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
    }
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 1; i < 5; i++) {
            console.log(results[i])
            // $(`#${i}`).text(results[i].rating)
            // $(`#${i}`).text(results[i].name)
                //   createMarker(results[i]);
            }
        }
    }
// function createMarker(place) {
//   if (!place.geometry || !place.geometry.location) return;

//   const marker = new google.maps.Marker({
//     map,
//     position: place.geometry.location,
//   });

//   google.maps.event.addListener(marker, "click", () => {
//     infowindow.setContent(place.name || "");
//     infowindow.open(map);
//   });
// }

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
    }
}

var deleteWarning = function() {
    $('#warning').remove()
}

$("#search-form").on("submit", formSubmitHandler);
