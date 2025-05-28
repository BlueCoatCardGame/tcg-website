const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');
const displayElement = document.getElementById('battleCodeDisplay');

console.log('battleCode:', battleCode);

if (!battleCode) {
  displayElement.innerHTML = '<span style="color: red;">No battle code found in URL.</span>';
} else {
  displayElement.innerHTML = `Battle code: <strong>${battleCode}</strong>`;

  const connectedRef = db.ref(".info/connected");
  const roomRef = db.ref('battles/' + battleCode);

  // DEBUG: Listen to room state changes
  roomRef.on("value", (snapshot) => {
    console.log("Room state changed:", snapshot.val());
  });

  connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
      roomRef.once("value").then((snapshot) => {
        const roomData = snapshot.val() || {};

        // Clean up any ghost players if found (still do this but don't wait for it to finish)
        const updates = {};
        if (roomData.player1 && typeof roomData.player1 !== "boolean") updates.player1 = null;
        if (roomData.player2 && typeof roomData.player2 !== "boolean") updates.player2 = null;
        if (Object.keys(updates).length > 0) {
          roomRef.update(updates);
        }

        // Immediately assign player and show message
        if (!roomData.player1) {
          displayElement.innerHTML += '<br>You are <strong>Player 1</strong>';
          console.log("Player 1 has joined.");

          const playerRef = roomRef.child("player1");
          playerRef.onDisconnect().remove();
          playerRef.set(true);

        } else if (!roomData.player2) {
          displayElement.innerHTML += '<br>You are <strong>Player 2</strong>';
          console.log("Player 2 has joined.");

          const playerRef = roomRef.child("player2");
          playerRef.onDisconnect().remove();
          playerRef.set(true);

        } else {
          displayElement.innerHTML += '<br><span style="color:red;">This battle already has 2 players.</span>';
          console.log("Battle is full.");
        }
      }).catch((error) => {
        console.error("Error reading room data:", error);
        displayElement.innerHTML += '<br><span style="color:red;">Error loading battle data.</span>';
      });
    }
  });
}