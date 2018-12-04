
const token = 'Bearer aiGs24xZ8kMmDUOG_HpUhfizqZuFgS2bOUmTt-SudUenzhKIWxJsn6ooKpWBzy7KTE9qs90W4Tw15Jau3bbhgTCa2n3-AMBugVl6ChhBRpjxCv-OQNNyjXvlI9LsW3Yx'
const yelpSearchURL = 'https://api.yelp.com/v3/businesses/search'
const corsHelper = 'https://cors-anywhere.herokuapp.com'
var restaurantData = []
const defaultSearch = 'restaurant'
let searchTerm = defaultSearch // initial search term

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Event Listeners
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.addEventListener('DOMContentLoaded', function () {
  console.log('initializing index.js v4.0')
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
  // SEARCH VALUE
  // if there's no search value then default search value
  if (document.getElementById('search-bar').value) {
    searchTerm = document.getElementById('search-bar').value
  } else {
    searchTerm = defaultSearch
  }

  // initialize requestObj
  let requestObj = {
    'url': corsHelper + '/' + yelpSearchURL,
    'data': {
      term: searchTerm,
      categories: 'food'
    },
    headers: { 'Authorization': token },
    error: function (jqXHR, testStatus, errorThrown) {
      console.log('Ajax error, jqXHR = ', jqXHR, ', testStatus = ', testStatus, ', errorThrown = ', errorThrown)
    }
  }

  console.log('requestObj: ', requestObj)
  // LOCATION VALUE
  // check if center contains cityState or latlng
  if (center.lat === undefined) {
    requestObj.data.location = center.cityState
    console.log('adding cityState to requestObj', requestObj)
  } else {
    requestObj.data.latitude = center.lat
    requestObj.data.longitude = center.lng
    console.log('adding lat lng to requestObj', requestObj)
  }

  console.log('requesting', requestObj.data.term, 'data from the server...')
  // ajax request the object
  $.ajax(requestObj)
    .then(function (response) {
      restaurantData = response.businesses
      console.log(restaurantData)
      // setting object in local storage
      localStorage.setItem('restaurantData', JSON.stringify(response.businesses))
      return response.businesses
    })
    .then(renderRestaurant)
    .then(renderFinal)
}// requestResponseObject

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Search Functionality
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function submitSearch () {
  let restaurantSearch = document.getElementById('search-bar').value
  console.log('searching for', restaurantSearch)
  requestResponseObject(currentLocation)
}// submit Search

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Search Updating Functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function updateSearchAPI (location) {
  // accepts 'City, State','city', or 'latlng'
  console.log('Updating SearchAPI location data...', location)
  requestResponseObject(location)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Rendering -- General
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function renderRestaurant (restaurant) {
  renderMap(restaurant)
  console.log(restaurant)

  console.log('creating cards innerHTML...')
  let restaurantHTML = restaurant.map(function (currentRestaurant) {
    let restaurantHTMLString = `
            <div class="card bg-dark text-white hover-card">
                <img class="card-img-top" src="${currentRestaurant.image_url}" alt="${currentRestaurant.name}">
                <h5 class="top">${currentRestaurant.name}</h5>
                <div class="top-right">
                  <button onclick="saveToFavoriteRestaurant('${currentRestaurant.id}')" type="submit" class="btn button-topright"><i class="fas fa-plus"></i><i class="fas fa-heart"></i></button>
                  <button onclick="saveToRestaurantToVisitList('${currentRestaurant.id}')" type="submit" class="btn button-topright"><i class="fas fa-plus"></i><i class="fas fa-star"></i></button>
                </div>
            </div>
        `
    return restaurantHTMLString
  })// map function
  return restaurantHTML.join('')
}// renderRestaurant

function renderFinal (htmlString) {
  console.log('hiding restaurant container')
  $('#restaurant-container').hide()
  console.log('rendering restaurant cards...')
  document.getElementById('restaurant-container').innerHTML = '<div class="card-columns">' + htmlString + '</div>'
  console.log('showing restaurant container')
  $('#restaurant-container').fadeIn(500)
}// renderFinal

function renderMap (response, center) {
  console.log('filtering restaurant data...')

  let filteredRestuarantData = response.map(function (filterData) {
    let filterDataObject = {
      'restaurantName': filterData.name,
      'restaurantCord': {
        'lat': filterData.coordinates.latitude,
        'lng': filterData.coordinates.longitude
      },
      'categories': filterData.categories
    }
    return filterDataObject
  })
  console.log('sending filtered data to render map...')
  createMarkers(filteredRestuarantData, center)
  return response
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Rendering -- Lists
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function renderNearByRestaurants () {
  let data = JSON.parse(localStorage.getItem('restaurantData'))
  console.log(data)
  renderMap(data, 'onCenter')
}// rerender nearby favorites


function renderNearByHTML () {
  let data = JSON.parse(localStorage.getItem('restaurantData'))

  document.getElementById('restaurant-container').innerHTML = '<div class="card-columns">' + renderRestaurant(data) + '</div>'
}// renderNearByHTML


function renderList (listName) {
  let list = []

  console.log(`render ${listName} list on map`)
  if (userLogInStatus() === true) {
  // read data from firebase
    firebase.database().ref(`${listName}/` + localStorage.getItem('userID')).on('value', function (snapshot) {
      let myData = snapshot.val()
      // setting firebaseList to localStorage
      if (myData) {
        list = Object.values(myData)
        console.log(list)
        renderMap(list, 'onBounds')
      } else {
        renderMap([], 'onCenter')
      }// if
    }, function (error) {
      console.log('Error: ' + error.code)
    })// read Data
  } else {
    renderMap([], 'onCenter')
  }// if userLogInStatus
}

function renderListHTML (listName) {
  console.log(`render ${listName} list cards`)

  if (userLogInStatus() === true) {
    // read data from firebase
    firebase.database().ref(`${listName}/` + localStorage.getItem('userID')).on('value', function (snapshot) {
      let myData = snapshot.val()
      // setting firebaseList to localStorage
      if (myData) {
        list = Object.values(myData)
        document.getElementById('restaurant-container').innerHTML = '<div class="card-columns">' + renderRestaurant(list) + '</div>'
      } else {
        console.log('entered')
      } // if
    }, function (error) {
      console.log('Error: ' + error.code)
    })// read Data
  } else {
    document.getElementById('restaurant-container').innerHTML = `<div class="jumbotron">
                                                                  <h1 class="display-4">Hello, Please Sign In</h1>
                                                                  <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                                                                  <hr class="my-4">
                                                                  <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                                                                  <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
                                                                </div>`
  }// else statement
}// renderListHTML

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Saving to lists
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function saveToFavoriteRestaurant (restaurantID) {
  // check to see if user is signed

  console.log('saving restaurant to favorite list...')
  // console.log(JSON.parse(restaurant))
  console.log(restaurantID)

  if (userLogInStatus() === true) {
  // calling restaurant objects in local storage
    let data = JSON.parse(localStorage.getItem('restaurantData'))

    let clickedRestaurantData = data.find(function (currentRestaurant) {
      return currentRestaurant.id === restaurantID
    })// restaurant
    console.log(clickedRestaurantData)

    // printing information to firebase
    const update = {}
    // const newFavoritesKey = firebase.database().ref().child('favorites').push().key
    const userID = localStorage.getItem('userID')
    if (userID) {
      update['/favorites/' + userID + '/' + clickedRestaurantData.id] = clickedRestaurantData
      firebase.database().ref().update(update)
    }// if
  } else {
    console.log('call login modal') // CALL LOG IN MODAL
    // return document.getElementById('myModal').innerHTML = ``
  }// else
}// saveToRestaurantList

function saveToRestaurantToVisitList (restaurantID) {
  console.log('saving restaurant to visit list...')

  if (userLogInStatus() === true) {
    let data = JSON.parse(localStorage.getItem('restaurantData'))

    let clickedRestaurantData = data.find(function (currentRestaurant) {
      return currentRestaurant.id === restaurantID
    })
    console.log(clickedRestaurantData)

    // setting information to Firebase
    const update = {}
    // const newVisitKey = firebase.database().ref().child('toVisit').push().key
    const userID = localStorage.getItem('userID')
    if (userID) {
      update['/RestaurantsToVisit/' + userID + '/' + clickedRestaurantData.id] = clickedRestaurantData
      firebase.database().ref().update(update)
    }// if
  } else {
    console.log('call login modal') // CALL LOG IN MODAL
  }// else
}// Visit List

function renderToVisitListHTML () {
  console.log('render to visit cards')

  if (userLogInStatus() === true) {
  // read data from firebase
    firebase.database().ref('RestaurantsToVisit/' + localStorage.getItem('userID')).on('value', function (snapshot) {
      let myData = snapshot.val()
      // setting firebaseFavoritesList to localStorage
      if (myData) {
        toVisit = Object.values(myData)
        document.getElementById('restaurant-container').innerHTML = '<div class="card-columns">' + renderRestaurant(toVisit) + '</div>'
      } else {
        console.log('entered')
      } // if
    }, function (error) {
      console.log('Error: ' + error.code)
    })// read Data
  } else {
    document.getElementById('restaurant-container').innerHTML = `<div class="jumbotron">
                                                                  <h1 class="display-4">Hello, Please Sign In</h1>
                                                                  <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                                                                  <hr class="my-4">
                                                                  <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                                                                  <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
                                                                </div>`
  }
}// renderToVisitList


