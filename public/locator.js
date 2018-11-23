// window.MYAPP = window.MYAPP || {}

// ;(function () {

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get current location by IP Address -- Coarse
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getCoarseLocation (updateMapAPI,updateSearchAPI) {
  // This function will be called on init to get location based on IP address
  // Argument options for 'updateMapAPI': 'mapAPI' or 'null'
  // Argument options for 'updateSearchAPI': 'searchAPI' or 'null'
  console.log('getting coarse location...')
  let currentCoarseLocation = {}

  $.getJSON('http://api.db-ip.com/v2/free/self', function (json) {
    currentCoarseLocation = json
    console.log('coarse location: ', currentCoarseLocation.city,', ',currentCoarseLocation.stateProv, 'full data: ',currentCoarseLocation)
    console.log(updateMapAPI, updateSearchAPI)
    if (updateMapAPI = 'updateMapAPI') {
      console.log(updateMapAPI)
      // Set Map Properties
      updateCoarseMapAPI(currentCoarseLocation.city + ', ' + currentCoarseLocation.stateProv)
    }
    if (updateSearchAPI = 'updateSearchAPI') {
      // Set Search Properties
      console.log(updateSearchAPI)
      updateCoarseSearchAPI (currentCoarseLocation.city + ', ' + currentCoarseLocation.stateProv)
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
