// Get the battle code from the URL
const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');

// Add the battle code to the page
document.body.innerHTML += <p>Battle code: <strong>${battleCode}</strong></p>;