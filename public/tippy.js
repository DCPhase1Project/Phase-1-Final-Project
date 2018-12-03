// As I've had trouble with tooltips.js / popper.js,
// I'm now trying the tippy.js JavaScript library for tooltips.


tippy (document.getElementById('login-button'), {
    content: "I'm a tooltip!",
    delay: 100,
    arrow: true,
    arrowType: 'round',
    animation: 'scale',
})