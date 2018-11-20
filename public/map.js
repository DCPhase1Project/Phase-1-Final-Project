window.MYAPP = window.MYAPP || {}

;(function () {
  var map
  // var InfoWindow
  var markers = []

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Init Map
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function initMap () {
    console.log('initializing map...')
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      styles: mapStyle
    })
    userMarker = new google.maps.Marker();
    getUserLocation()
  } // initMap

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Get User Location & Update Marker
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function getUserLocation () {
    console.log('getting current location...')

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(updatePosition);
    } else {
      console.alert ('Geolocation is not supported by this browser')
    }
    return null
  }

  function updatePosition (position) {
    var userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    
    if (typeof getUserLocation.userMarker == 'undefined') {
      getUserLocation.userMarker = new google.maps.Marker({
        position:userPos,
        map:map,
        icon:'img/locationMarker.svg',
        clickable: false
      });
    }
    getUserLocation.userMarker.setPosition(userPos);
  }
  

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Add & Remove Markers
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function createMarkers (locationsForMap) {
    // Function accepts array of objects with name, lat, & long
    setMapOnAll(null)

    console.log('creating new markers...')
    var bounds = new google.maps.LatLngBounds()
    // Loop through markers array
    for (var i = 0; i < locationsForMap.length; i++) {
      markers.push(addMarker(locationsForMap[i], bounds))
    }
    map.fitBounds(bounds)
    map.panToBounds(bounds)
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
    if (map = null) { console.log('clearing old markers...') }
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map)
    //   markers[i].setIcon(image)
    }
  }

  // export the initMap function so it may be called outside of this module
  window.MYAPP.initMap = initMap
  window.MYAPP.createMarkers = createMarkers
  window.MYAPP.setMapOnAll = setMapOnAll
  window.MYAPP.getUserLocation = getUserLocation
})()
