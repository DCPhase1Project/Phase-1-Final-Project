// This script file uses the JavaScript libraries for
// popper.js and tooltip.js to create and position
// tooltips in the web app.


document.addEventListener('DOMContentLoaded', function () {
    var index = 0
    var popper;
    new Tooltip (document.getElementById("login-button"), {
        placement: "left",
        title: "Log in to see your favorite and saved restaurants!",
    })
})

document.addEventListener('DOMContentLoaded', function () {
    var index = 0
    var popper;
    new Tooltip (document.getElementById("mapSection"), {
        placement: "top",
        title: "See the restaurant locations on your map",
    })
})

document.addEventListener('DOMContentLoaded', function () {
    var index = 0
    var popper;
    new Tooltip (document.getElementById("search-bar"), {
        placement: "bottom",
        title: "You can search by name or cuisine type",
    })
})