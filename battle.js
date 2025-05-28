const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');

console.log('battleCode:', battleCode); // Debug log

const displayElement = document.getElementById('battleCodeDisplay');

if (battleCode) {
  displayElement.innerHTML = `Battle code: <strong>${battleCode}</strong>`;

  // Use the db variable you defined in your HTML Firebase init instead of firebase.database()
  const roomRef = db.ref('battles/' + battleCode);

  roomRef.once('value')
    .then((snapshot) => {
      const roomData = snapshot.val();

      if (!roomData) {
        // No room yet — this is Player 1
        roomRef.set({
          player1: true
        }).then(() => {
          displayElement.innerHTML += `<br>You are <strong>Player 1</strong>`;
          console.log("Player 1 has joined.");
        });
      } else if (!roomData.player2) {
        // Room exists but player2 slot is free — this is Player 2
        roomRef.update({
          player2: true
        }).then(() => {
          displayElement.innerHTML += `<br>You are <strong>Player 2</strong>`;
          console.log("Player 2 has joined.");
        });
      } else {
        // Both players already joined
        displayElement.innerHTML += `<br><span style="color:red;">This battle already has 2 players.</span>`;
        console.log("Battle is full.");
      }
    })
    .catch((error) => {
      console.error("Error reading room data:", error);
      displayElement.innerHTML += `<br><span style="color:red;">Error loading battle data.</span>`;
    });

} else {
  displayElement.innerHTML = `<span style="color: red;">No battle code found in URL.</span>`;
}