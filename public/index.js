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
}
let currentLat = currentLocation.lat// values from map
let currentLong = currentLocation.lng// values from map

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Event Listeners
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.addEventListener('DOMContentLoaded', function () {
  console.log('initializing index.js v2.0')
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
  // create requestObj
  let requestObj = {
    'url': corsHelper + '/' + yelpSearchURL,
    'data': { term: searchTerm, latitude: currentLat, longitude: currentLong, categories: 'food' },
    headers: { 'Authorization': token },
    error: function (jqXHR, testStatus, errorThrown) {
      console.log('Ajax error, jqXHR = ', jqXHR, ', testStatus = ', testStatus, ', errorThrown = ', errorThrown)
    }
  }
  // ajax request the object
  $.ajax(requestObj)
    .then(function (response) {
      // console.log('response = ', response)
      // console.log(response.businesses[0].name)
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
  console.log(restaurantSearch)
  requestResponseObject()
}// submit Search

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Rendering
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function renderRestaurant (restaurant) {
  renderMap(restaurant)
  // console.log('this is my Restaurant Data', restaurant)
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
  document.getElementById('restaurant-container').innerHTML = '<div class="card-columns">' + htmlString + '</div>'
}

function saveToRestaurantList () {
  // todo: save restaurants to list
}

function renderMap (responseData) {
// console.log(responseData.businesses.name)
// console.log(responseData.businesses[i].coordinates)

  let filteredRestuarantData = responseData.businesses.map(function (filterData) {
    let filterDataObject = {
      'restaurantName': filterData.name,
      'coords': {
        'lat': filterData.coordinates.latitude,
        'long': filterData.coordinates.longitude
      },
      'categories': filterData.categories
    }
    return filterDataObject
  })
  console.log('filteredRestuarantData')
  console.log(filteredRestuarantData)
  window.MYAPP.createMarkers(filteredRestuarantData)
  return responseData
}



})()
