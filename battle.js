console.log("✅ battle.js loaded");
// Get the battle code from URL
const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');

console.log('battleCode:', battleCode); // Debug log

const displayElement = document.getElementById('battleCodeDisplay');

if (battleCode) {
  displayElement.innerHTML = `Battle code: <strong>${battleCode}</strong>`;

  const roomRef = firebase.database().ref('battles/' + battleCode);

  // Listen for room data once
  roomRef.once('value', (snapshot) => {
    const roomData = snapshot.val();

    if (!roomData) {
      // No room data — Player 1 joins
      roomRef.set({
        player1: true
      }).then(() => {
        displayElement.innerHTML += `<br>You are <strong>Player 1</strong>`;
        console.log("Player 1 has joined.");
      }).catch((error) => {
        console.error("Error setting Player 1:", error);
        displayElement.innerHTML += `<br><span style="color:red;">Error joining battle.</span>`;
      });
    } else if (!roomData.player2) {
      // Player 2 joins
      roomRef.update({
        player2: true
      }).then(() => {
        displayElement.innerHTML += `<br>You are <strong>Player 2</strong>`;
        console.log("Player 2 has joined.");
      }).catch((error) => {
        console.error("Error updating Player 2:", error);
        displayElement.innerHTML += `<br><span style="color:red;">Error joining battle.</span>`;
      });
    } else {
      // Room full
      displayElement.innerHTML += `<br><span style="color:red;">This battle already has 2 players.</span>`;
      console.log("Battle is full.");
    }
  });

} else {
  displayElement.innerHTML = `<span style="color: red;">No battle code found in URL.</span>`;
}