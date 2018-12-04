var map, infoWindow
var markers = []
const defaultZoom = 13
var mapZoom

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Init Map
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function initMap () {
  console.log('initializing map...')
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 0, lng: 0
    },
    zoom: defaultZoom,
    styles: mapStyleDark,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
  },
  })
  infoWindow = new google.maps.InfoWindow({
    maxWidth: 250
  })

  // loop until location variable is updated
  var locationLoop = setInterval(searchForLocation, 1000)
  var locationTimeout = setTimeout(backupLocation, 4000) // if geolocation doesnt kick in, get coarse location

  function searchForLocation () {
    if (window.currentLocation == undefined) {
      console.log('searching for location...', window.currentLocation)
    } else {
      clearInterval(locationLoop)
      clearTimeout(locationTimeout)
      console.log('location found...', window.currentLocation)
      updateMapCenter(window.currentLocation)
      updateSearchAPI(window.currentLocation)
      var image = {
        url: 'data:image/svg+xml;charset=UTF-8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%20width%3D%2246%22%20height%3D%2246%22%3E%0A%20%20%20%20%20%20%20%20%3Cg%20opacity%3D%220.5%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20fill%3D%22%23A5D8F5%22%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2216.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%3Ccircle%20fill%3D%22%230073bb%22%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%226%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M18%2C25a7%2C7%2C0%2C1%2C1%2C7-7A7%2C7%2C0%2C0%2C1%2C18%2C25Zm0-12a5%2C5%2C0%2C1%2C0%2C5%2C5A5%2C5%2C0%2C0%2C0%2C18%2C13Z%22%2F%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(46, 46),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(23, 23)
      }
      var iconMaker = new google.maps.Marker({
        position: { lat: window.currentLocation.lat, lng: window.currentLocation.lng },
        map: map,
        icon: image
      })
      console.log(window.currentLocation)
      console.log(iconMaker)
    }
  }
  function backupLocation () {
    if (window.currentLocation == undefined) {
      getCoarseLocation()
    }
  }
  // var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'img/burger-icon.png' })
  
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Add & Remove Markers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function createMarkers (locationsForMap, center) {
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

  if (center == 'onBounds') {
    console.log('centering', center)
    map.fitBounds(bounds)
    map.panToBounds(bounds)
    // set max zoom as 15
    google.maps.event.addListenerOnce(map, 'zoom_changed', function () {
      var oldZoom = map.getZoom()
      if (oldZoom > 15) { map.setZoom(oldZoom - 1) }
    })
  } else if (center == 'onCenter') {
    console.log('centering', center)
    updateMapCenter(window.currentLocation)
    map.setZoom(defaultZoom)
  }
  return markers
}

function addMarker (props, bounds) {
  var marker = new google.maps.Marker({
    position: props.restaurantCord,
    // content: props.restaurantName,
    map: map
  })
  var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng())
  bounds.extend(loc)

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent('<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h3 id="firstHeading" class="firstHeading">' + props.restaurantName + '</h3> <div id="bodyContent">' +
    '<div style=\'float:left\'><img src=\'' + props.image + '\' style= "max-width: 90px"></div><div style=\'float:middle; padding-left: 100px;\'>' +
    '<b>Address: </b>' + props.address + '<br/>' + props.cityState + '<br/><b>Rating: </b>' + props.rating +
    '/5<br/><b>No. of Reviews: </b>' + props.reviewCount + '<br/>' + '</div>')
    infoWindow.open(map, marker)
  })

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

function updateMapCenter (location) {
  console.log('Updating MapAPI location data...', location)
  if (location.lat === undefined) {
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
