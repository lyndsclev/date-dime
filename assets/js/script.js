//good website for load more button:
//https://www.solodev.com/blog/web-design/adding-a-load-more-button-to-your-content.stml

let map;
let service;
let infowindow;

function initMap() {
var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '1000',
    type: ['restaurant'],
    minPriceLevel = 4,
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 1; i < 5; i++) {
    // console.log(results[i])
    $(`#${i}`).text(results[i].rating)
    $(`#${i}`).text(results[i].name)
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