// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDZOaVFZL8mufS3bMoyoFZGUJK6Nob5bpw',
  authDomain: 'phase-1-final-project.firebaseapp.com',
  databaseURL: 'https://phase-1-final-project.firebaseio.com',
  projectId: 'phase-1-final-project',
  storageBucket: '',
  messagingSenderId: '835794979231'
}
firebase.initializeApp(config)

// Get elements from DOM
const loginEmail = document.getElementById('login-email')
const loginPassword = document.getElementById('login-password')
const newAcctEmail = document.getElementById('new-acct-email')
const newAcctPassword = document.getElementById('new-acct-password')
const btnLogin = document.getElementById('modal-login')
const btnNewAcct = document.getElementById('modal-new-acct')
const btnLogout = document.getElementById('logout-button')
const loginBtn = document.getElementById('login-button')
const newAcctBtn = document.getElementById('new-acct-button')
const userGreeting = document.getElementById('user-greeting')

// Login event
btnLogin.addEventListener('click', e => {
  const email = loginEmail.value
  const pass = loginPassword.value
  const auth = firebase.auth()

  const promise = auth.signInWithEmailAndPassword(email, pass)
  promise.catch(e => alert(e.message, ' Please try again!'))
})

// Signup event
btnNewAcct.addEventListener('click', e => {
  const email = newAcctEmail.value
  const pass = newAcctPassword.value
  const auth = firebase.auth()

  const promise = auth.createUserWithEmailAndPassword(email, pass)
  promise.catch(e => console.log(e.message))
})

// Logout event
btnLogout.addEventListener('click', e => {
  firebase.auth().signOut()
})

// Check for login state change
// Manage visibility of elements based on login state
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser)
    // setting User to local storeage
    localStorage.setItem('userID', firebaseUser.uid)
    loginBtn.classList.add('d-none')
    newAcctBtn.classList.add('d-none')
    btnLogout.classList.remove('d-none')
    userGreeting.classList.remove('d-none')
  } else {
    console.log('not logged in')
    loginBtn.classList.remove('d-none')
    newAcctBtn.classList.remove('d-none')
    btnLogout.classList.add('d-none')
    userGreeting.classList.add('d-none')
  }
})

function isUserLoggedIn () {
  var user = firebase.auth().currentUser
  console.log('ENTERED LOG IN STATUS')
  console.log(user)
  if (user) {
    console.log(user, 'is signed in')
    return true
  } else {
    console.log('No one is signed in')
    return false
  }
}// userLogInStatus
