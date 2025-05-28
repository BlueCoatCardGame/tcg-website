// auth.js

// Initialize Firebase App (only if not initialized yet)
const firebaseConfig = {
  apiKey: "AIzaSyANtfKFonwEu6ewUS6yNYM8qZBkf2aFcIo",
  authDomain: "card-game-51dd7.firebaseapp.com",
  projectId: "card-game-51dd7",
  storageBucket: "card-game-51dd7.appspot.com",
  messagingSenderId: "1059333480213",
  appId: "1:1059333480213:web:9787cdf5da0242aebf531c",
  databaseURL: "https://card-game-51dd7-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// Helper to convert username to fake email (you can tweak domain)
function usernameToEmail(username) {
  return username.trim().toLowerCase() + "@yourgame.com";
}

// Signup function
async function signup(username, password) {
  try {
    const email = usernameToEmail(username);
    await auth.createUserWithEmailAndPassword(email, password);
    alert("Signup successful! You can now log in.");
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
}

// Login function
async function login(username, password) {
  try {
    const email = usernameToEmail(username);
    await auth.signInWithEmailAndPassword(email, password);
    alert("Login successful!");
    // Redirect to your game hub or reload page, e.g.:
    window.location.href = "hub.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
}

// Logout function
function logout() {
  auth.signOut().then(() => {
    alert("Logged out.");
    window.location.href = "index.html";
  });
}

// Export functions if using modules (optional)
// window.signup = signup;
// window.login = login;
// window.logout = logout;