var map, infoWindow
var markers = []

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Init Map
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function initMap () {
  console.log('initializing map...')
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 0, lng: 0
    },
    zoom: 13,
    styles: mapStyle
  })
  infoWindow = new google.maps.InfoWindow()

  // loop until location variable is updated
  var locationLoop = setInterval(searchForLocation, 1000)
  var locationTimeout = setTimeout(backupLocation, 4000); // if geolocation doesnt kick in, get coarse location

  function searchForLocation () {
    if (window.currentLocation == undefined) {
      console.log('searching for location...', window.currentLocation)
    } else {
      clearInterval(locationLoop)
      clearTimeout(locationTimeout)
      console.log('location found...', window.currentLocation)
      updateMapAPI(window.currentLocation)
      updateSearchAPI(window.currentLocation)
    }
  }
  function backupLocation () {
    if (window.currentLocation == undefined) {
      getCoarseLocation()
    }
  }

} // initMap

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add & Remove Markers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function createMarkers (locationsForMap, Center) {
  // 'locationsForMap' accepts array of objects with name, lat, & long
  // 'Center' accepts the strings: 'onCenter' or 'onBounds'
  // If 'Center' is not defined it will not move.
  setMapOnAll(null)

  console.log('creating new markers...')
  var bounds = new google.maps.LatLngBounds()
  // Loop through markers array
  for (var i = 0; i < locationsForMap.length; i++) {
    markers.push(addMarker(locationsForMap[i], bounds))
  }
  // map.fitBounds(bounds)
  // map.panToBounds(bounds)
  return markers
}

function addMarker (props, bounds) {
  var marker = new google.maps.Marker({
    position: props.restaurantCord,
    content: props.restaurantName,
    map: map
    // icon: props.iconImage
  })
  var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng())
  bounds.extend(loc)
  //  Check for customIcon
  if (props.iconImage) {
    // Set icon image
    marker.setIcon(props.iconImage)
  }
  // Check for content
  if (props.restaurantName) {
    var infoWindow = new google.maps.InfoWindow({
      content: props.restaurantName
    })
    marker.addListener('click', function () {
      infoWindow.open(map, marker)
    })
  }
  return marker
}

function setMapOnAll (map) {
  if (map == null) { console.log('clearing old markers...') }
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map)
    //   markers[i].setIcon(image)
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Map Updating Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function updateMapAPI (location) {
  console.log('Updating MapAPI location data...', location)
  if (location.lat === undefined){
    geocodeAndCenter(location.cityState)
  } else {
    map.setCenter(location)
  }
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Geocoder functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function geocodeAndCenter (cityState) {
  // cityState as 'City, State'. Also accepts 'city'
  var geocoder = new google.maps.Geocoder()
  console.log('geocoding cityState...')
  geocoder.geocode({ 'address': cityState }, function (results, status) {
    if (status === 'OK') {
      console.log('centering on cityState...')
      map.setCenter(results[0].geometry.location)
    } else {
      alert('Geocode was not successful for the following reason: ' + status)
    }
  })
}
