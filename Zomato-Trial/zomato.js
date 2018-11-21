class ZOMATO {
constructor(){
    this.api = "70db30dd6160b64999fac505ac4a0074"
    this.header = {
        method:'GET',
        headers:{
            'user_key':this.api,
            'Content-Type':'application/json'
        },
        credentials:'same-origin'
    }
}
async searchAPI(city,categoryID){
    // split this function into one for city, one for category, then combine for restaurant
    const cors_helper = 'https://cors-anywhere.herokuapp.com'
    // category url
    const categoryURL = `https://developers.zomato.com/api/v2.1/categories`
    // city url
    const cityURL = `https://developers.zomato.com/api/v2.1/cities?q=${city}`
    console.log(cityURL)
    // restaurant url
    const restaurantURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${city}&entity_type=city&category=${categoryID}&sort=rating`

    // category data
    const categoryInfo = await fetch(cors_helper + '/' + categoryURL,this.header)
    const categoryJSON = await categoryInfo.json()
    const categories = await categoryJSON.categories

    // search city
    const cityInfo = await fetch(cors_helper + '/' + cityURL,this.header)
    const cityJSON = await cityInfo.json()
    const cityLocation = await cityJSON.location_suggestions
    
    let cityID = 0

    if(cityLocation.length>0){
        cityID = await cityLocation[0].id
        console.log(cityLocation[0])
    }

    // search restaurant
    const restaurantInfo = await fetch(cors_helper + '/' + restaurantURL,this.header)
    const restaurantJSON = await restaurantInfo.json()
    const restaurants = await restaurantJSON.restaurants

    return {
        categories,
        cityID,
        restaurants
    }
}
}
class UI {
    constructor(){
        this.loader = document.querySelector('.loader')
        this.restaurantList = document.getElementById('restaurant-list')
    }
    addSelectOptions(categories){
        const search = document.getElementById('searchCategory')
        let output = `<option value='0' selected>select category</option>`
        categories.forEach(category => {
            output += `<option value="${category.categories.id}">${category.categories.name}</option>`
        })
        search.innerHTML = output
    }
    showFeedback(text){
        const feedback = document.querySelector('.feedback')
        feedback.classList.add('showItem')
        feedback.innerHTML = `<p>${text}</p>`
        setTimeout(()=>{
            feedback.classList.remove('showItem')
        },3000)
    }
    showLoader(){
        this.loader.classList.add('showItem')
    }
    hideLoader(){
        this.loader.classList.add('hideItem')
    }
    getRestaurants(restaurants){
        this.hideLoader()
        if(restaurants.length === 0){
            this.showFeedback('no such categories in the selected city')
        } else {
            this.restaurantList.innerHTML=''
            restaurants.forEach((restaurant) =>{
                console.log(restaurant.restaurant.name)
                const {thumb:img,name,location:{address},user_rating:{aggregate_rating},cousines,average_cost_for_two:cost,menu_url,url} = restaurant.restaurant
                if(img === ''){
                    this.showRestaurant(img,name,address,aggregate_rating,cousines,cost,menu_url,url)
                }
            })
        }
    }
    showRestaurant(img,name,address,aggregate_rating,cousines,cost,menu_url,url){
        const div = document.createElement('div')
        div.classList.add('col-11','mx-auto','my-3','col-md-4')
        div.innerHTML=`<div class="col-11 mx-auto my-3">
        <div class="card">
         <div class="card">
          <div class="row p-3">
           <div class="col-5">
            <img src="${img}" class="img-fluid img-thumbnail" alt="${name}">
           </div>
           <div class="col-5 text-capitalize">
            <h6 class="text-uppercase pt-2 redText">${name}</h6>
            <p>${address}</p>
           </div>
           <div class="col-1">
            <div class="badge badge-success">
             ${aggregate_rating}
            </div>
           </div>
          </div>
          <hr>
          <div class="row py-3 ml-1">
           <div class="col-5 text-uppercase ">
            <p>cousines :</p>
            <p>cost for two :</p>
           </div>
           <div class="col-7 text-uppercase">
            <p>${cousines}</p>
            <p>${cost}</p>
           </div>
          </div>
          <hr>
          <div class="row text-center no-gutters pb-3">
           <div class="col-6">
            <a href="${menu_url}" target="_blank" class="btn redBtn  text-uppercase"><i class="fas fa-book"></i> menu</a>
           </div>
           <div class="col-6">
            <a href="${url}" target="_blank" class="btn redBtn  text-uppercase"><i class="fas fa-book"></i> website</a>
           </div>
          </div>
         </div>
        </div>`
        this.restaurantList.appendChild(div)
    }
}

(function(){
    const searchForm = document.getElementById('searchForm')
    const searchCity = document.getElementById('searchCity')
    const searchCategory = document.getElementById('searchCategory')

    const zomato = new ZOMATO()
    const ui = new UI()

    // add select options
    document.addEventListener('DOMContentLoaded',()=>{
    // logic goes here
    zomato.searchAPI().then(data => ui.addSelectOptions(data.categories))
    // zomato.searchAPI().then(data => console.log(data.categories))
    })

    // submit form
    searchForm.addEventListener('submit',event =>{
        event.preventDefault()

        const city = searchCity.value.toLowerCase()
        const categoryID = parseInt(searchCategory.value)
        ui.showFeedback(city + ' ' + categoryID)

        zomato.searchAPI(city).then(cityData =>{
            if (cityData.cityID ===0){
                ui.showFeedback("please enter a valid city")
            } else {
                ui.showLoader()
                zomato.searchAPI(city,categoryID).then(data => {
                ui.getRestaurants(data.restaurants)
                })
            }
        })
    })
})();


