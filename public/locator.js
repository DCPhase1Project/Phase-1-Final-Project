// window.MYAPP = window.MYAPP || {}

// ;(function () {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get current location by IP Address -- Coarse
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getCoarseLocation (mapAPI,searchAPI) {
  // This function will be called on init to get location based on IP address
  // Argument options for 'mapAPI': 'mapAPI' or 'null'
  // Argument options for 'searchAPI': 'searchAPI' or 'null'
  console.log('getting coarse location...')
  var geocoder = new google.maps.Geocoder()
  let currentLocationCoarse = {}

  $.getJSON('http://api.db-ip.com/v2/free/self', function (json) {
    currentLocationCoarse = json
    console.log('coarse location: ', currentLocationCoarse.city,', ',currentLocationCoarse.stateProv, 'full data: ',currentLocationCoarse)

    // Set Map Properties

    // TODO:   Add function in map.js to set center based on the argument sent to it
    geocoder.geocode({ 'address': currentLocationCoarse.city + ', ' + currentLocationCoarse.stateProv }, function (results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location)
      } else {
        alert('Geocode was not successful for the following reason: ' + status)
      }
    })

    // Set Search Properties

    // TODO:    Add function in index.js to set search location based on the argument sent to it



  })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get current location by Geolocation -- Fine
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getCurrentLocation () {
  console.log('getting current location...')

  // Use HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var currentLocationFine = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      return currentLocationFine
    })
  } else {
    // Browser doesn't support Geolocation
    console.alert('Browser does not support Geolocation')
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get current location by Watch Geolocation -- Ultra Fine
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function watchCurrentLocation () {
  console.log('getting current location...')

  // Use HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function (position) {
      var currentLocationFinest = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      return currentLocationFinest
    })
  } else {
    // Browser doesn't support Geolocation
    console.alert('Browser does not support Geolocation')
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Export functions so they may be called outside of this module
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//   window.MYAPP.getCoarseLocation = getCoarseLocation
//   window.MYAPP.getCurrentLocation = getCurrentLocation
//   window.MYAPP.watchCurrentLocation = watchCurrentLocation
// })()
