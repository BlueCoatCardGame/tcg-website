const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');

console.log('battleCode:', battleCode); // Debug log

const displayElement = document.getElementById('battleCodeDisplay');

if (battleCode) {
  displayElement.innerHTML = `Battle code: <strong>${battleCode}</strong>`;
} else {
  displayElement.innerHTML = <span style="color: red;">No battle code found in URL.</span>;
}