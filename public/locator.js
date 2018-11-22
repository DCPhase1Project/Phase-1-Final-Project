// window.MYAPP = window.MYAPP || {}

// ;(function () {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get current location by IP Address -- Coarse
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getCoarseLocation () {
  console.log('getting coarse location...')
  var geocoder = new google.maps.Geocoder()
  let currentLocationCoarse = {}

  $.getJSON('http://api.db-ip.com/v2/free/self', function (json) {
    currentLocationCoarse = json

    // Set Map Properties
    geocoder.geocode({ 'address': currentLocationCoarse.city + ', ' + currentLocationCoarse.stateProv }, function (results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location)
      } else {
        alert('Geocode was not successful for the following reason: ' + status)
      }
    })
    return currentLocationCoarse
    // Set Search Properties
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
