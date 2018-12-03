// As I've had trouble with tooltips.js / popper.js,
// I'm now trying the tippy.js JavaScript library for tooltips.


tippy (document.getElementById('login-button'), {
    content: "Log in to see your favorite restaurants and the restaurants you want to visit!",
    delay: 100,
    arrow: true,
    arrowType: 'round',
    size: 'large',
    animation: 'scale',
})

tippy (document.getElementById('new-acct-button'), {
    content: "Sign up to access additional features, like saving your favorite restaurants!",
    delay: 100,
    arrow: true,
    arrowType: 'round',
    size: 'large',
    animation: 'scale',
})

tippy (document.getElementById('mapSection'), {
    content: "Click the markers for more information on each restaurant",
    delay: 100,
    arrow: true,
    arrowType: 'round',
    size: 'large',
    animation: 'scale',
})

tippy (document.getElementById('search-bar'), {
    content: "You can search by restaurant name or cuisine type",
    delay: 100,
    arrow: true,
    arrowType: 'round',
    size: 'large',
    animation: 'scale',
})