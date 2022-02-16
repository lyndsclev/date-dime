var priceInput = document.querySelector("#price-input");
var zipInput = document.querySelector("#zip-input");
var index = 0;
// var settings = {
//     "url": "https://api-gate2.movieglu.com/filmsNowShowing/?n=4",
//     "method": "GET",
//     "timeout": 0,
//     "headers": {
//     "api-version": "v200",
//     "Authorization": "Basic VU5JVl81Nzo0R0p0YUJKb1daZUs=",
//     "client": "UNIV_57",
//     "x-api-key": "8Po0OSsuF36k4dmk9bwS25zj9wMdprcy1Ts2fUx8",
//     "device-datetime": "2022-02-16T00:27:48Z",
//     "territory": "US",
//     },
//     };
 
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
        $("#dollarbtn2").removeClass("dollar-btn-clicked");
        $("#dollarbtn3").removeClass("dollar-btn-clicked");
        $("#dollarbtn4").removeClass("dollar-btn-clicked");
        $("#dollarbtn1").addClass("dollar-btn-clicked");
    }
    else if (price == 2) {
        priceInput.value = "";
        priceInput.value = 2;
        $("#dollarbtn1").removeClass("dollar-btn-clicked");
        $("#dollarbtn3").removeClass("dollar-btn-clicked");
        $("#dollarbtn4").removeClass("dollar-btn-clicked");
        $("#dollarbtn2").addClass("dollar-btn-clicked");
    }
    else if (price == 3) {
        priceInput.value = "";
        priceInput.value = 3;
        $("#dollarbtn1").removeClass("dollar-btn-clicked");
        $("#dollarbtn2").removeClass("dollar-btn-clicked");
        $("#dollarbtn4").removeClass("dollar-btn-clicked");
        $("#dollarbtn3").addClass("dollar-btn-clicked");
    }
    else if (price == 4) {
        priceInput.value = "";
        priceInput.value = 4;
        $("#dollarbtn1").removeClass("dollar-btn-clicked");
        $("#dollarbtn2").removeClass("dollar-btn-clicked");
        $("#dollarbtn3").removeClass("dollar-btn-clicked");
        $("#dollarbtn4").addClass("dollar-btn-clicked");
    };
};
 
var formSubmitHandler = function(event){
    event.preventDefault();
    var priceLevel = priceInput.value.trim();
    var zipcode = zipInput.value.trim();
    if (priceLevel && zipcode) {
        if (priceLevel == '1'){
            priceLevel = 1;
        }
        else if (priceLevel == '2') {
            priceLevel = 2;
        }
        else if (priceLevel == '3') {
            priceLevel = 3;
        }
        else if (priceLevel == '4') {
            priceLevel = 4;
        }
        $('#warning').remove();
 
        $("#eat-info-display").remove();
 
        $("#map-display").removeClass("display-none");
 
        geocode({ address: zipcode });
    }
    else {
        $('#warning').remove();
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
        $('#warning').remove()
        $("body").append($('<div>')
        .addClass('notification is-danger has-text-white warning')
        .attr('id', 'warning')
        .text(`Failed because of this issue: ${e}`));
 
        $("#warning").append($('<button>')
        .addClass('delete')
        .attr('onclick', 'deleteWarning()'));
        console.log("Geocode was not successful for the following reason: " + e);
      });
  };
function callback(results, status) {
    var services2 = new google.maps.places.PlacesService(map);
    $("#eat-info-container").append($("<div>").addClass("columns").attr("id", "eat-info-display"));
    $("#eat-title").text("EAT");
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 1; i < 5; i++) {
           
            $("#eat-info-display").append($("<div>").addClass('column').attr("id", `eat-column${i}`));
 
            $(`#eat-column${i}`).append($("<div>").addClass('card').attr("id", `eat-card${i}`));
 
            var placeDetails = {
                placeId: `${results[i].place_id}`,
                fields: ['name', 'rating', 'opening_hours','utc_offset_minutes', 'formatted_address', 'website', 'photos', 'geometry']
            };
 
            var services2 = new google.maps.places.PlacesService(map);
            services2.getDetails(placeDetails, getDetails);
 
            console.log(results[i])
        };  
      }
      else {
        $('#warning').remove()
        $("body").append($('<div>')
        .addClass('notification is-danger has-text-white warning')
        .attr('id', 'warning')
        .text(`Failed because of this issue: ${status}`));
 
        $("#warning").append($('<button>')
        .addClass('delete')
        .attr('onclick', 'deleteWarning()'));  
        console.log('failed: ' + status)
      };
  };
 
var getDetails = function(placeDetails) {
    index++
    console.log(index)
    console.log(placeDetails)
    $(`#eat-card${index}`).append($(`<div>${placeDetails.name}</div>`).addClass('title is-3 is-spaced '));
           
    $(`#eat-card${index}`).append($(`<div>Rating: <br> ${placeDetails.rating}</div>`).addClass('card-content subtitle is-4'));
   
    if (placeDetails.opening_hours.isOpen()) {
        $(`#eat-card${index}`).append($(`<div>Open</div>`).addClass('card-content subtitle is-4 open'));
    }
    else {
        $(`#eat-card${index}`).append($(`<div>Closed</div>`).addClass('card-content subtitle is-4 closed'));
    };
 
    $(`#eat-card${index}`).append($(`<div>Address: <br> ${placeDetails.formatted_address}</div>`).addClass('card-content subtitle is-4 '));
 
    createMarker(placeDetails)
 
    if (index == 4) {
        index = 0
    };
};
 
function createMarker(place) {
    var contentString = `
    <div style="display: flex;">
    ${place?.photos? `<img class="image is-128x128" src=${place.photos[0].getUrl()} alt=${place.name} />`: ''}
      <div><a href=${place.url} target="_blank" rel="noreferrer">${place.name}</a></div>
    </div>`;
    
    if (!place.geometry || !place.geometry.location) return;
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
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
};
 
// $.ajax(settings).done(function (response) {
//     console.log(response);
// });
 
var deleteWarning = function() {
    $('#warning').remove()
}
 
$("#search-form").on("submit", formSubmitHandler);