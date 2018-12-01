
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get current location by IP Address -- Coarse
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getCoarseLocation (updateMapAPI, updateSearchAPI) {
  // This function will be called on init to get location based on IP address
  // Argument options for 'updateMapAPI': 'mapAPI' or 'null'
  // Argument options for 'updateSearchAPI': 'searchAPI' or 'null'
  console.log('getting coarse location...')
  let currentCoarseLocation = {}

  $.getJSON('http://api.db-ip.com/v2/free/self', function (json) {
    currentCoarseLocation = json
    console.log('coarse location: ', currentCoarseLocation.city, ', ', currentCoarseLocation.stateProv, 'full data: ', currentCoarseLocation)

    if (updateMapAPI = 'updateMapAPI') {
      // Set Map Properties
      updateCoarseMapAPI(currentCoarseLocation.city + ', ' + currentCoarseLocation.stateProv)
    }
    if (updateSearchAPI = 'updateSearchAPI') {
      // Set Search Properties
      updateCoarseSearchAPI(currentCoarseLocation.city + ', ' + currentCoarseLocation.stateProv)
    }
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
      window.currentLocation = currentLocationFine
      updateFineSearchAPI(currentLocationFine)
      updateFineMapAPI(currentLocationFine)
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
