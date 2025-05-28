const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');
const displayElement = document.getElementById('battleCodeDisplay');

console.log('battleCode:', battleCode);

if (!battleCode) {
  displayElement.innerHTML = '<span style="color: red;">No battle code found in URL.</span>';
  return;
}

displayElement.innerHTML = `Battle code: <strong>${battleCode}</strong>`;

// Firebase presence reference
const connectedRef = db.ref(".info/connected");
const roomRef = db.ref('battles/' + battleCode);

connectedRef.on("value", (snap) => {
  if (snap.val() === true) {
    roomRef.once("value").then((snapshot) => {
      const roomData = snapshot.val();

      if (!roomData || !roomData.player1) {
        // Assign Player 1
        roomRef.child("player1").set(true);
        roomRef.child("player1").onDisconnect().remove();
        displayElement.innerHTML += '<br>You are <strong>Player 1</strong>';
        console.log("Player 1 has joined.");
      } else if (!roomData.player2) {
        // Assign Player 2
        roomRef.child("player2").set(true);
        roomRef.child("player2").onDisconnect().remove();
        displayElement.innerHTML += '<br>You are <strong>Player 2</strong>';
        console.log("Player 2 has joined.");
      } else {
        // Room full
        displayElement.innerHTML += '<br><span style="color:red;">This battle already has 2 players.</span>';
        console.log("Battle is full.");
      }
    }).catch((error) => {
      console.error("Error reading room data:", error);
      displayElement.innerHTML += '<br><span style="color:red;">Error loading battle data.</span>';
    });
  }
});