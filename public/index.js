window.MYAPP = window.MYAPP || {}

;(function () {

const token = 'Bearer aiGs24xZ8kMmDUOG_HpUhfizqZuFgS2bOUmTt-SudUenzhKIWxJsn6ooKpWBzy7KTE9qs90W4Tw15Jau3bbhgTCa2n3-AMBugVl6ChhBRpjxCv-OQNNyjXvlI9LsW3Yx'
const yelpSearchURL = 'https://api.yelp.com/v3/businesses/search'
const corsHelper = 'https://cors-anywhere.herokuapp.com'
let returnData = ''

const defaultSearch = 'food'
let searchTerm = defaultSearch // initial search term

let currentLocation = {
  lat: 29.752948,
  lng: -95.339069
} //default digitalcrafts location

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Event Listeners
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.addEventListener('DOMContentLoaded', function () {
  console.log('initializing index.js v3.0')
  requestResponseObject()
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
// Create Response Object
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function requestResponseObject () {
  // if there's no search value then default search value
  if (document.getElementById('search-bar').value) {
    searchTerm = document.getElementById('search-bar').value
  } else {
    searchTerm = defaultSearch
  }
  console.log('requesting',searchTerm,'data from the server...')

  // create requestObj
  let requestObj = {
    'url': corsHelper + '/' + yelpSearchURL,
    'data': { 
      term: searchTerm,
      latitude: currentLocation.lat,
      longitude: currentLocation.lng,
      categories: 'food'
    },
    headers: { 'Authorization': token },
    error: function (jqXHR, testStatus, errorThrown) {
      console.log('Ajax error, jqXHR = ', jqXHR, ', testStatus = ', testStatus, ', errorThrown = ', errorThrown)
    }
  }
  // ajax request the object
  $.ajax(requestObj)
    .then(function (response) {
      returnData = response
      return returnData
    })
    .then(renderRestaurant)
    .then(renderFinal)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Search Functionality
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function submitSearch () {
  let restaurantSearch = document.getElementById('search-bar').value
  console.log('searching for',restaurantSearch)
  requestResponseObject()
}// submit Search

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Rendering
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function renderRestaurant (restaurant) {
  renderMap(restaurant)
  console.log('creating cards innerHTML...')
  let restaurantHTML = restaurant.businesses.map(function (currentRestaurant) {
    // console.log(currentRestaurant)
    let restaurantHTMLString = `
            <div class="card bg-dark text-white">
                <img class="card-img-top" src="${currentRestaurant.image_url}" alt="${currentRestaurant.name}">
                <div class="card-body">
                    <div class="row">
                        <h5 class="card-title">${currentRestaurant.name}</h5>
                    </div>
                    <button onclick="saveToRestaurantList('${currentRestaurant.id}')" type="submit" class="btn btn-primary btn-lg btn-block">Add to Restaurant list</button>
                </div>
            </div>
        `
    return restaurantHTMLString
  })// map function

  return restaurantHTML.join('')
}// renderRestaurant

function renderFinal (htmlString) {
  console.log('rendering restaurant cards...')
  document.getElementById('restaurant-container').innerHTML = '<div class="card-columns">' + htmlString + '</div>'
}

function saveToRestaurantList () {
  console.log('saving restaurant to list...')
  // todo: save restaurants to list
}

function renderMap (responseData) {
  console.log('filtering restaurant data...')

  let filteredRestuarantData = responseData.businesses.map(function (filterData) {
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
  window.MYAPP.createMarkers(filteredRestuarantData)
  return responseData
}


})()