let token = 'Bearer aiGs24xZ8kMmDUOG_HpUhfizqZuFgS2bOUmTt-SudUenzhKIWxJsn6ooKpWBzy7KTE9qs90W4Tw15Jau3bbhgTCa2n3-AMBugVl6ChhBRpjxCv-OQNNyjXvlI9LsW3Yx'
let yelpSearchURL = 'https://api.yelp.com/v3/businesses/search'
let corsHelper = 'https://cors-anywhere.herokuapp.com'
let returnData = ''

let currentLat = 29.752948 // values from Derrick
let currentLong = -95.339069 // values from Derrick

console.log('in index.js')

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Event Listeners
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.addEventListener('DOMContentLoaded', function () {
  let requestObj = {
    'url': corsHelper + '/' + yelpSearchURL,
    'data': { term: 'food', latitude: currentLat, longitude: currentLong },
    headers: { 'Authorization': token },
    error: function (jqXHR, testStatus, errorThrown) {
      console.log('Ajax error, jqXHR = ', jqXHR, ', testStatus = ', testStatus, ', errorThrown = ', errorThrown)
    }
  }// request obj

  $.ajax(requestObj)
    .then(function (response) {
      console.log('response = ', response)
      console.log(response.businesses[0].name)
      returnData = response
      return returnData
    })
    .then(giveDerrickObject)
})// DOMContentLoaded

document.getElementById('searchButton').addEventListener('click', function (evt) {
  evt.preventDefault()
  submitSearch()
})

document.getElementById('search-form').addEventListener('submit', function (evt) {
  evt.preventDefault()
  submitSearch()
})

function submitSearch () {
  let restaurantSearch = document.getElementById('search-bar').value
  console.log(restaurantSearch)

  let requestObj = {
    'url': corsHelper + '/' + yelpSearchURL,
    'data': { term: restaurantSearch, location: '77006' },
    headers: { 'Authorization': token },
    error: function (jqXHR, testStatus, errorThrown) {
      console.log('Ajax error, jqXHR = ', jqXHR, ', testStatus = ', testStatus, ', errorThrown = ', errorThrown)
    }
  }

  $.ajax(requestObj)
    .then(function (response) {
      console.log('response = ', response)
      console.log(response.businesses[0].name)
      returnData = response
      return returnData
    })
    .then(renderRestaurant)
    .then(renderFinal)
}// submit Search

function renderRestaurant (restaurant) {
  console.log('this is my Restaurant Data', restaurant)
  let restaurantHTML = restaurant.businesses.map(function (currentRestaurant) {
    console.log(currentRestaurant)
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
  console.log(restaurantHTML.join(''))
  return restaurantHTML.join('')
}// renderRestaurant

function renderFinal (htmlString) {
  $('.renderingContainer').append('<div class="card-columns">' + htmlString + '</div>')
}

function saveToRestaurantList () {

} // saveToRestaurantList

function giveDerrickObject (responseData) {
// console.log(responseData.businesses.name)
// console.log(responseData.businesses[i].coordinates)

  let filteredRestuarantData = responseData.businesses.map(function (filterData) {
    let filterDataObject = {
      'Restaurantname': filterData.name,
      'restaurantCord': {
        'lat': filterData.coordinates.latitude,
        'long': filterData.coordinates.longitude
      },
      'categories': filterData.categories
    }
    console.log(filterDataObject)
  })

  return filteredRestuarantData
}
