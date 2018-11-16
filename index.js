let token = 'Bearer aiGs24xZ8kMmDUOG_HpUhfizqZuFgS2bOUmTt-SudUenzhKIWxJsn6ooKpWBzy7KTE9qs90W4Tw15Jau3bbhgTCa2n3-AMBugVl6ChhBRpjxCv-OQNNyjXvlI9LsW3Yx'
let yelp_search_url = 'https://api.yelp.com/v3/businesses/search'
let cors_helper = 'https://cors-anywhere.herokuapp.com'
let returnData = ''

function submitSearch () {
    let restaurantSearch = document.getElementById('search').value
    console.log(restaurantSearch)

    let requestObj = {
        'url': cors_helper + '/' + yelp_search_url,
        'data': {term: restaurantSearch, location: '77006'},
        headers: {'Authorization': token},
        error: function(jqXHR, testStatus, errorThrown) {
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
        console.log(returnData)


}//submit Search

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
                    <button onclick="saveToRestaurantList('${currentRestaurant.id}')" type="button" class="btn btn-primary btn-lg btn-block">Add to Restaurant list</button>
                </div>
            </div>
        `
        return restaurantHTMLString
    })//map function
    console.log(restaurantHTML.join(''))
    return restaurantHTML.join('')
}//renderRestaurant

function renderFinal (htmlString) {
    $('.container').html('<div class="card-columns">' + htmlString + '</div>')

}

function saveToRestaurantList () {

} //saveToRestaurantList