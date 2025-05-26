const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');

console.log('battleCode:', battleCode); // Debug log

if (battleCode) {
  document.body.innerHTML += <p>Battle code: <strong>${battleCode}</strong></p>;
} else {
  document.body.innerHTML += <p style="color: red;">No battle code found in URL.</p>;
}