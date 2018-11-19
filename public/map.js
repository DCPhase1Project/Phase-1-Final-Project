window.MYAPP = window.MYAPP || {}

;(function () {

var map, infoWindow
var markers = []

function initMap() {
    console.log('initializing map...')
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        styles: mapStyle,
    });
    infoWindow = new google.maps.InfoWindow;
    getCurrentLocation()
} // initMap

function createMarkers (locationsForMap){
    // Function accepts array of objects with name, lat, & long
    setMapOnAll(null)
    
    console.log('creating new markers...')
    var bounds  = new google.maps.LatLngBounds();
    //Loop through markers array
    for (var i = 0;i < locationsForMap.length; i++){
        markers.push(addMarker(locationsForMap[i],bounds))
    }
    map.fitBounds(bounds);
    map.panToBounds(bounds);
    return markers
}

function addMarker (props,bounds){
    var marker = new google.maps.Marker({
        position: props.restaurantCord,
        content: props.restaurantName,
        map: map
        //icon: props.iconImage
    })
    var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
    bounds.extend(loc);
    //  Check for customIcon
    if (props.iconImage){
        //Set icon image
        marker.setIcon(props.iconImage);
    }
    //Check for content
    if (props.restaurantName){
        var infoWindow = new google.maps.InfoWindow({
            content: props.restaurantName
        });
        marker.addListener('click', function(){
            infoWindow.open(map, marker);
        });
    }
    return marker
}

function setMapOnAll (map) {
    // Adds markers to the map.
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    var image = {
        url: 'https://s3-media1.fl.yelpcdn.com/bphoto/h9S_LHEK0Ua6WfTLAdB1DA/o.jpg',
        // // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(60, 120),
        // // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 24),
        scaledSize: new google.maps.Size(120, 120)
    }

    if (map=null){console.log('clearing old markers...')}
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map)
      markers[i].setIcon(image)
    }
}

function getCurrentLocation () {
    console.log('getting current location...')
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found')
        infoWindow.open(map)
        map.setCenter(pos)
        return pos
        }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    }
}

// export the initMap function so it may be called outside of this module
window.MYAPP.initMap = initMap
window.MYAPP.createMarkers = createMarkers
window.MYAPP.setMapOnAll = setMapOnAll
window.MYAPP.getCurrentLocation = getCurrentLocation

})()