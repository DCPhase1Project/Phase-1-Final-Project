const restaurant = {alias:'the-pit-room-houston'}

getFoodImgs(restaurant)

function getFoodImgs(restaurant){
    // Rule: restaurant object must have an 'alias' key

    const restAlias = restaurant.alias
    const request = require('request')
    const cheerio = require('cheerio')

    request(`https://www.yelp.com/biz_photos/${restAlias}?tab=food`, (error,response,html) =>{
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html)

            // '(arg) => {}' is equivalent to 'function (arg) {}'
            const foodImgs = []
            $('.photo-box img').each(function (i,el) {
                const imgSRC = $(el).attr('src')
                if(i!=0){foodImgs.push(imgSRC)}
            })
            console.log(foodImgs)        
        }
    })
}
