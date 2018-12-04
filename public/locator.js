// Declare global location variable
var currentLocation

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get current location by Geolocation -- Main -- Fine
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getCurrentLocation () {
  console.log('getting current location...')

  // Use HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, showError)
  } else {
    // Browser doesn't support Geolocation
    console.alert('Browser does not support Geolocation')
    console.log('using IP location...')
    getCoarseLocation()
  }

  function getPosition (position) {
    console.log(position)
    var currentLocationFine = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      acc: position.coords.accuracy
    }
  
    // Set global location
    window.currentLocation = {}
    window.currentLocation = currentLocationFine
    console.log('Setting global current location to: ', window.currentLocation)
  }

  function showError (error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.')
        getCoarseLocation()
        break
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.')
        getCoarseLocation()
        break
      case error.TIMEOUT:
        console.log('The request to get user location timed out.')
        getCoarseLocation()
        break
      case error.UNKNOWN_ERROR:
        console.log('An unknown error occurred.')
        getCoarseLocation()
        break
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get current location by IP Address -- Backup -- Coarse
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getCoarseLocation () {
  // This function gets location based on IP address
  console.log('getting coarse location...')
  let currentCoarseLocation = {}

  $.getJSON('https://api.db-ip.com/v2/free/self', function (json) {
    currentCoarseLocation = json
    console.log('coarse location: ', currentCoarseLocation.city, ', ', currentCoarseLocation.stateProv, 'full data: ', currentCoarseLocation)

    window.currentLocation = {}
    window.currentLocation.cityState = currentCoarseLocation.city + ', ' + currentCoarseLocation.stateProv
    console.log(window.currentLocation)
  })
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
