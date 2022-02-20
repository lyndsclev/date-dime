// define storage input array
var storeInputArr;

var savedSearchEl = document.querySelector("#savedSearchEl");

var priceInput = document.querySelector("#price-input");
var zipInput = document.querySelector("#zip-input");

// MovieGlu API Credentials
var settings = {
  url: "https://api-gate2.movieglu.com/filmsNowShowing/?n=4",
  method: "GET",
  timeout: 0,
  headers: {
    "api-version": "v200",
    Authorization: "Basic VU5JVl81N19YWDpaemlUUk80NHBqTjk=",
    client: "UNIV_57",
    "x-api-key": "NZfRsR00F94yFYq3kdQSl2pA38ywzFzGss4BaVye",
    "device-datetime": "2022-02-17T03:36:19Z",
    territory: "XX",
  },
};

// Variables used by Google Maps APIs
var map;
var geocoder;
var service;
var infowindow;
var response;
var marker;
var markersArray = [];
var index = 0;

// Sets desired price by giving a hidden input a value that can be used by Google Maps API.
// Adds colored border to buttons that stay when clicked to indicate what you have selected.
var priceLevelHandler = function (price) {
  if (price == 1) {
    priceInput.value = "";
    priceInput.value = 1;
    $("#dollarbtn2").removeClass("dollar-btn-clicked");
    $("#dollarbtn3").removeClass("dollar-btn-clicked");
    $("#dollarbtn4").removeClass("dollar-btn-clicked");
    $("#dollarbtn1").addClass("dollar-btn-clicked");
  } else if (price == 2) {
    priceInput.value = "";
    priceInput.value = 2;
    $("#dollarbtn1").removeClass("dollar-btn-clicked");
    $("#dollarbtn3").removeClass("dollar-btn-clicked");
    $("#dollarbtn4").removeClass("dollar-btn-clicked");
    $("#dollarbtn2").addClass("dollar-btn-clicked");
  } else if (price == 3) {
    priceInput.value = "";
    priceInput.value = 3;
    $("#dollarbtn1").removeClass("dollar-btn-clicked");
    $("#dollarbtn2").removeClass("dollar-btn-clicked");
    $("#dollarbtn4").removeClass("dollar-btn-clicked");
    $("#dollarbtn3").addClass("dollar-btn-clicked");
  } else if (price == 4) {
    priceInput.value = "";
    priceInput.value = 4;
    $("#dollarbtn1").removeClass("dollar-btn-clicked");
    $("#dollarbtn2").removeClass("dollar-btn-clicked");
    $("#dollarbtn3").removeClass("dollar-btn-clicked");
    $("#dollarbtn4").addClass("dollar-btn-clicked");
  };
};

// Handles input of form. Sets desired price level and sends inputed location to Google geocoder api
var formSubmitHandler = function (event) {
  event.preventDefault();
  var priceLevel = priceInput.value.trim();
  var zipcode = zipInput.value.trim();
  if (priceLevel && zipcode) {
    if (priceLevel == "1") {
      priceLevel = 1;
    } else if (priceLevel == "2") {
      priceLevel = 2;
    } else if (priceLevel == "3") {
      priceLevel = 3;
    } else if (priceLevel == "4") {
      priceLevel = 4;
    }
    $("#warning").remove();

    $("#eat-info-display").remove();

    // Displays map
    $("#map-display").removeClass("display-none");

    // sends inputed location to geocode function
    geocode({ address: zipcode });

    // Calls function to generate movies
    showtime();
  } else {
    $("#warning").remove();
    $("body").append(
      $("<div>")
        .addClass("notification is-danger has-text-white warning")
        .attr("id", "warning")
        .text("Please select price range and enter zipe code.")
    );

    $("#warning").append(
      $("<button>").addClass("delete").attr("onclick", "deleteWarning()")
    );
  };
};

// Function called when site it loaded by call back in the https  
function initMap() {
  geocoder = new google.maps.Geocoder();
  var location = new google.maps.LatLng(-34.397, 150.644);
  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 12,
  });
};

// Uses Google Maps places library to search nearby inputed location. Sends that info to callback function
function geocode(request) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;
      var priceLevel = document.getElementById("price-input").value;
      // variable used to indicate desired info
      var ask = {
        location: results[0].geometry.location,
        radius: "20000",
        type: ["restaurant"],
        minPriceLevel: priceLevel,
        maxPriceLevel: priceLevel + 0.5,
      };
      // centers map on inputed location
      map.setCenter(results[0].geometry.location);
      service = new google.maps.places.PlacesService(map);
      // used nearbySearch method to get places around inputed location based on desired info in 'ask' variable above
      service.nearbySearch(ask, callback);
      return results;
    })
    .catch((e) => {
      $("#warning").remove();
      $("body").append(
        $("<div>")
          .addClass("notification is-danger has-text-white warning")
          .attr("id", "warning")
          .text(`Failed because of this issue: ${e}`)
      );

      $("#warning").append(
        $("<button>").addClass("delete").attr("onclick", "deleteWarning()")
      );
      console.log("Geocode was not successful for the following reason: " + e);
    });
};

// Gets more details from nearby search of location. Sends that info to getDetails function
function callback(results, status) {
  var services2 = new google.maps.places.PlacesService(map);

  $("#eat-info-container").append(
    $("<div>").addClass("columns").attr("id", "eat-info-display")
  );

  $("#eat-title").text("EAT");

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 1; i < 5; i++) {
      // variable used to indicate desired info
      var placeDetails = {
        placeId: `${results[i].place_id}`,
        fields: [
          "name",
          "rating",
          "opening_hours",
          "utc_offset_minutes",
          "formatted_address",
          "website",
          "photos",
          "geometry",
          "price_level",
        ],
      };
      var services2 = new google.maps.places.PlacesService(map);
      // used getDetails method to get more info
      services2.getDetails(placeDetails, getDetails);
    }
  } else {
    $("#warning").remove();
    $("body").append(
      $("<div>")
        .addClass("notification is-danger has-text-white warning")
        .attr("id", "warning")
        .text(`Failed because of this issue: ${status}`)
    );

    $("#warning").append(
      $("<button>").addClass("delete").attr("onclick", "deleteWarning()")
    );
    console.log("failed: " + status);
  }
};

// Dynamically generates cards displaying data generated from Googles getDetails method
var getDetails = function (placeDetails) {
  index++;

  $("#eat-info-display").append(
    $("<div>").addClass("column").attr("id", `eat-column${index}`)
  );

  $(`#eat-column${index}`).append(
    $("<div>").addClass("card").attr("id", `eat-card${index}`)
  );

  $(`#eat-card${index}`).append(
    $(`<div>${placeDetails.name}</div>`).addClass("title is-3 is-spaced ")
  );

  $(`#eat-card${index}`).append(
    $(`<div>Rating: <br> ${placeDetails.rating}</div>`).addClass(
      "card-content subtitle is-4"
    )
  );

  if (placeDetails.opening_hours.isOpen()) {
    $(`#eat-card${index}`).append(
      $(`<div>Open</div>`).addClass("card-content subtitle is-4 open")
    );
  } else {
    $(`#eat-card${index}`).append(
      $(`<div>Closed</div>`).addClass("card-content subtitle is-4 closed")
    );
  }

  $(`#eat-card${index}`).append(
    $(`<div>Address: <br> ${placeDetails.formatted_address}</div>`).addClass(
      "card-content subtitle is-4 "
    )
  );

  createMarker(placeDetails);

  if (index == 4) {
    index = 0;
  };
};

// Places markers on map based on info generated from Googles getDetails method
function createMarker(place) {
  // Checks if markers are on map already. If they are, calls function below to remove them
  if (markersArray.length > 3) {
    setMapOnAll(null);
  }

  var contentString = `
    <div style="display: flex;">
    ${
      place?.photos
        ? `<img class="image is-128x128" src=${place.photos[0].getUrl()} alt=${
            place.name
          } />`
        : ""
    }
      <div><a href=${place.website} target="_blank">${place.name}</a></div>
    </div>`;

  if (!place.geometry || !place.geometry.location) return;

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  markersArray.push(marker);

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
};

// Removes markers from map and empties markers array when null is sent to this function
function setMapOnAll(map) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(map);
  }
  markersArray = [];
};

// Generates cards containing info on movies called from MovieGlu API
function showtime() {
  $.ajax(settings).done(function (response) {
    $("#watch-title").text("WATCH");
    $("#movie-info-display").empty();
    $("#movie-info-container").append(
      $("<div>")
        .addClass("columns", "is-centered")
        .attr("id", "movie-info-display")
    );
    for (let i = 0; i <= 3; i++) {
      $("#movie-info-display").append(
        $("<div>").addClass("column").attr("id", `column${i}`)
      );

      $(`#column${i}`).append(
        $("<div>").addClass("card").attr("id", `card${i}`)
      );

      $(`#card${i}`).append(
        $(`<h2>${response.films[i].film_name}</h2>`)
          .addClass("card-header-title title is-centered")
          .attr("id", `card-title${i}`)
      );

      $(`#card${i}`).append(
        $(
          `<img src=${response.films[i].images.poster[1].medium.film_image}></img>`
        )
          .addClass("card-image card-content")
          .attr("id", `card-img${i}`)
          .attr("alt", `Poster of ${response.films[i].film_name}`)
      );
    };
  });
};

// Deletes warning modal when button on it is pressed
var deleteWarning = function () {
  $("#warning").remove();
};

// Stores search info
function storeInput() {
  var dime = priceInput.value;
  var zip = zipInput.value;

  storeInputArr =
    JSON.parse(window.localStorage.getItem("storeInputArr")) || [];

  var newInput = {
    dime: dime,
    zip: zip,
  };

  storeInputArr.push(newInput);

  window.localStorage.setItem("storeInputArr", JSON.stringify(storeInputArr));
};

// launch saved search modal
function launchSavedModal() {
  $("li").remove();
  // activate modal
  $("#saveModal").addClass("is-active");

  // get existing stored
  storeInputArr = JSON.parse(window.localStorage.getItem("storeInputArr"));

  // populate modal with search
  for (var i = 0; i < storeInputArr.length; i++) {
    var savedSearchItem = document.createElement("li");
    savedSearchItem.textContent =
      "Your Dime Level: " +
      storeInputArr[i].dime +
      " You're Zip: " +
      storeInputArr[i].zip;
    savedSearchEl.appendChild(savedSearchItem);
  };
};

function closeSavedModal() {
  $("#saveModal").removeClass("is-active");
};

//clear search function and modal
function clearSearch() {
  localStorage.clear();
};

function showDeleteModal() {
  $("#deleteModal").addClass("is-active");
};

function closeDeleteModal() {
  $("#deleteModal").removeClass("is-active");
};

// run storeInput function
$("#search-form").on("submit", storeInput);

// launch modal
$("#showSaveBtn").on("click", launchSavedModal);

// remove modal
$("#sDelBtn").on("click", closeSavedModal);

$("#search-form").on("submit", formSubmitHandler);

//clear search and modals
$("#dltSrchBtn").on("click", showDeleteModal);

// closes search history deletion confirmation modal
$("#closeDelBtn").on("click", closeDeleteModal);

// clears local storage
$("#dltSrchBtn").on("click", clearSearch);
