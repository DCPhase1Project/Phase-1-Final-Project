class ZOMATO {
constructor(){
    this.api = "d1c5182b1e2146edf16ef116bf09383b"
    this.header = {
        method:'GET',
        headers:{
            'user_key':this.api,
            'Content-Type':'application/json'
        },
        credentials:'same-origin'
    }
}
async searchAPI(){
    // category url
    const categoryURL = `https://developers.zomato.com/api/v2.1/categories`
    const cors_helper = 'https://cors-anywhere.herokuapp.com'
    // category data
    const categoryInfo = await fetch(cors_helper + '/' + categoryURL,this.header)
    const categoryJSON = await categoryInfo.json()
    const categories = await categoryJSON.categories

    return {
        categories
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
zomato.searchAPI().then(data => console.log(data.categories))
})

// submit form
searchForm.addEventListener('submit',event =>{
    event.preventDefault()

    const city = searchCity.value.toLowerCase()
    const categoryID = parseInt(searchCategory.value)
    ui.showFeedback(city + ' ' + categoryID)
})



})();


