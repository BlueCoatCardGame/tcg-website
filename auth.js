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
const db = firebase.database(); // Include Firebase Database

// Helper to convert username to fake email
function usernameToEmail(username) {
  return username.trim().toLowerCase() + "@yourgame.com";
}

// Signup function
async function signup(username, password) {
  try {
    const email = usernameToEmail(username);
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;

    // Initialize user data
    await db.ref(`users/${userId}`).set({
      username: username,
      coins: 0,
      deck: [],
      unlockedCards: []
    });

    alert("Signup successful! You can now log in.");
    // Optionally redirect: window.location.href = "index.html";
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
}

// Login function
async function login(username, password) {
  try {
    const email = usernameToEmail(username);
    await auth.signInWithEmailAndPassword(email, password);
    // Redirect handled by onAuthStateChanged or UI logic elsewhere
    // Optionally: window.location.href = "hub.html";
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

// Optional exports if using ES modules
// window.signup = signup;
// window.login = login;
// window.logout = logout;