
const token = 'Bearer aiGs24xZ8kMmDUOG_HpUhfizqZuFgS2bOUmTt-SudUenzhKIWxJsn6ooKpWBzy7KTE9qs90W4Tw15Jau3bbhgTCa2n3-AMBugVl6ChhBRpjxCv-OQNNyjXvlI9LsW3Yx'
const yelpSearchURL = 'https://api.yelp.com/v3/businesses/search'
const corsHelper = 'https://cors-anywhere.herokuapp.com'
var restaurantData = []
const defaultSearch = 'restaurant'
let searchTerm = defaultSearch // initial search term
localStorage.setItem('currentListName', 'restaurantData')


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Event Listeners
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.addEventListener('DOMContentLoaded', function () {
  console.log('initializing index.js v5.0')
  getCurrentLocation()
  loadPageAnimations()
})// DOMContentLoaded

document.getElementById('searchButton').addEventListener('click', function (evt) {
  evt.preventDefault()
  submitSearch()
})

document.getElementById('search-form').addEventListener('submit', function (evt) {
  evt.preventDefault()
  submitSearch()
})


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Splash Screen Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function loadPageAnimations () {
  window.setTimeout(function () { $('#jumbotron-section').hide() })
  window.setTimeout(function () { $('#search-section').hide() })
  window.setTimeout(function () { $('#splashLogo').fadeOut(2000) }, 1500)
  window.setTimeout(function () { $('#splashScreen').fadeOut(1000) }, 2500)
  window.setTimeout(function () { $('#jumbotron-section').fadeIn(1000) }, 3500)
  window.setTimeout(function () { $('#search-section').fadeIn(1000) }, 4000)
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Create Response Object
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function requestResponseObject (center, radius) {
  // 'Center' accepts 'City, State','city', or 'latlng'
  // SEARCH VALUE -- if there's no search value then default search value
  if (document.getElementById('search-bar').value) {
    searchTerm = document.getElementById('search-bar').value
  } else {
    searchTerm = defaultSearch
  }

  // INIT requestObj
  let requestObj = {
    'url': corsHelper + '/' + yelpSearchURL,
    'data': {
      term: searchTerm,
      categories: 'restuarant'
    },
    headers: { 'Authorization': token },
    error: function (jqXHR, testStatus, errorThrown) {
      console.log('Ajax error, jqXHR = ', jqXHR, ', testStatus = ', testStatus, ', errorThrown = ', errorThrown)
    }
  }

  // LOCATION VALUE -- check if center contains cityState or latlng
  if (center.lat === undefined) {
    requestObj.data.location = center.cityState
  } else {
    requestObj.data.latitude = center.lat
    requestObj.data.longitude = center.lng
  }

  // AJAX REQUEST OBJECT
  console.log('requesting', searchTerm, 'data from the server...')
  $.ajax(requestObj)
    .then(function (response) {
      restaurantData = response.businesses
      // setting object in local storage
      localStorage.setItem('restaurantData', JSON.stringify(restaurantData))
      return restaurantData
    })
    .then(renderRestaurant)
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Search Functionality
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function submitSearch () {
  console.log('submitsearch')
  requestResponseObject(currentLocation)
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Create Map Object
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function renderMap (response, center) {
  console.log('filtering restaurant data...')

  let filteredRestuarantData = response.map(function (filterData) {
    let filterDataObject = {
      'restaurantName': filterData.name,
      'restaurantCord': {
        'lat': filterData.coordinates.latitude,
        'lng': filterData.coordinates.longitude
      },
      'categories': filterData.categories,
      'image': filterData.image_url,	
      'address': filterData.location.display_address[0],	
      'cityState': filterData.location.display_address[1],	
      'rating': filterData.rating,	
      'reviewCount': filterData.review_count
    }
    return filterDataObject
  })
  console.log('sending filtered data to render map...')
  createMarkers(filteredRestuarantData, center)
  return response
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Rendering -- General
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function renderRestaurant (restaurant) {
  renderMap(restaurant)

  var listName = localStorage.getItem('currentListName')

  var buttonSign = {
    fav:'plus',
    visit:'plus'
  }

  console.log('creating cards innerHTML...')
  let restaurantHTML = restaurant.map(function (currentRestaurant, index) {
    var buttonFunctionName = {
      fav:`saveToList('${currentRestaurant.id}','favorites')`,
      visit:`saveToList('${currentRestaurant.id}','RestaurantsToVisit')`
    }
    if (listName === 'favorites'){
      console.log('listname:',listName)
      buttonFunctionName.fav = `removeFromList('${currentRestaurant.id}','${listName}')`
      buttonSign.fav = 'minus'
    } else if (listName === 'RestaurantsToVisit'){
      console.log('listname:',listName)
      buttonFunctionName.visit = `removeFromList('${currentRestaurant.id}','${listName}')`
      buttonSign.visit = 'minus'
    }
    let restaurantHTMLString = `
            <div class="card bg-dark text-white hover-card" onclick="clickOpenInfoWindow(${index});">
                <img class="card-img-top" src="${currentRestaurant.image_url}" alt="${currentRestaurant.name}">
                <h5 class="top">${currentRestaurant.name}</h5>
                <div class="top-right">
                  <button onclick="${buttonFunctionName.fav};" type="submit" class="btn button-topright" data-tippy-content="Add to Favorite Restaurants"><i class="fas fa-${buttonSign.fav}"></i><i class="fas fa-heart"></i></button>
                  <button onclick="${buttonFunctionName.visit};" type="submit" class="btn button-topright" data-tippy-content="Add to Restaurants to Visit"><i class="fas fa-${buttonSign.visit}"></i><i class="fas fa-star" data-tippy-content="Add to Restaurants to Visit"></i></button>
                </div>
            </div>
        `
    return restaurantHTMLString
  })
  renderFinal(restaurantHTML.join(''))
}

function renderFinal (htmlString){
  $('#restaurant-container').hide()
  document.getElementById('restaurant-container').innerHTML = '<div class="card-columns">' + htmlString + '</div>'
  $('#restaurant-container').fadeIn(500)
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Rendering -- Lists
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function renderNearByRestaurants () {
  let data = JSON.parse(localStorage.getItem('restaurantData'))
  localStorage.setItem('currentListName', 'restaurantData')
  renderMap(data, 'onCenter')
  renderRestaurant(data)
}

function renderList (listName) {
  let list = []
  localStorage.setItem('currentListName', listName)

  console.log(`render ${listName} list on map & cards`)
  if (userLogInStatus() === true) {
  // read data from firebase
    firebase.database().ref(`${listName}/` + localStorage.getItem('userID')).on('value', function (snapshot) {
      let myData = snapshot.val()
      // setting firebaseList to localStorage
      if (myData) {
        list = Object.values(myData)
        localStorage.setItem(`${listName}`, JSON.stringify(list))
        renderMap(list, 'onBounds')
        renderRestaurant(list)
      } else {
        renderMap([], 'onCenter')
      }
    }, function (error) {
      console.log('Error: ' + error.code)
    })
  } else {
    renderMap([], 'onCenter')
    notSignedInHTML()
  }
}

function notSignedInHTML () {
  document.getElementById('restaurant-container').innerHTML = `<div class="jumbotron">
                                                              <h1 class="display-4">Hello, Please Sign In</h1>
                                                              <p class="lead">You are not currently signed into your Munchies account. Please sign in using the buttons on the top right corner to access your Favorite Restaurants and Restaurants to Visit.</p>
                                                              <hr class="my-4">
                                                              </div>`
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Saving lists
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function saveToList (restaurantID, listName) {
  console.log(`saving ${restaurantID} to ${listName}...`)
  var currentListName = localStorage.getItem('currentListName')

  if (userLogInStatus() === true) {
    let data = JSON.parse(localStorage.getItem(`${currentListName}`))
    let clickedRestaurantData = data.find(function (currentRestaurant) {
      return currentRestaurant.id === restaurantID
    })
      // setting information to Firebase
      const update = {}
      const userID = localStorage.getItem('userID')
      if (userID) {
        update[`/${listName}/` + userID + '/' + clickedRestaurantData.id] = clickedRestaurantData
        firebase.database().ref().update(update)
      }
  } else {
    console.log('call login modal') // CALL LOG IN MODAL
  }
}


function removeFromList (restaurantID, listName) {
  console.log(`removing ${restaurantID} from ${listName}...`)

  if (userLogInStatus() === true) {
    // setting information to Firebase
    const update = {}
    const userID = localStorage.getItem('userID')
    if (userID) {
      update[`/${listName}/` + userID + '/' + restaurantID] = null
      firebase.database().ref().update(update)
    }
  } else {
    console.log('call login modal') // CALL LOG IN MODAL
  }
}

