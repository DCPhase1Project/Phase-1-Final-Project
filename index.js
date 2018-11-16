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
        .done(function (response) {
            console.log('response = ', response)
            console.log(response.businesses[0].name)
            returnData = response
            return returnData
        }) 
        returnData = response.businesses
        console.log(returnData)
}//submit Search




// function renderRestaurant (restaurant) {
//     let restaurantHTML = 

// }//renderRestaurant
