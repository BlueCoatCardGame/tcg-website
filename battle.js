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

        // Clean up any ghost players
        const updates = {};
        if (roomData.player1 && typeof roomData.player1 !== "boolean") updates.player1 = null;
        if (roomData.player2 && typeof roomData.player2 !== "boolean") updates.player2 = null;

        if (Object.keys(updates).length > 0) {
          roomRef.update(updates);
        }

        // Wait a bit, then check again to assign players
        setTimeout(() => {
          roomRef.once("value").then((cleanSnap) => {
            const cleanData = cleanSnap.val() || {};

            if (!cleanData.player1) {
              const playerRef = roomRef.child("player1");
              playerRef.onDisconnect().remove().then(() => {
                playerRef.set(true).then(() => {
                  displayElement.innerHTML += '<br>You are <strong>Player 1</strong>';
                  console.log("Player 1 has joined.");
                });
              });
            } else if (!cleanData.player2) {
              const playerRef = roomRef.child("player2");
              playerRef.onDisconnect().remove().then(() => {
                playerRef.set(true).then(() => {
                  displayElement.innerHTML += '<br>You are <strong>Player 2</strong>';
                  console.log("Player 2 has joined.");
                });
              });
            } else {
              displayElement.innerHTML += '<br><span style="color:red;">This battle already has 2 players.</span>';
              console.log("Battle is full.");
            }
          });
        }, 500);
      }).catch((error) => {
        console.error("Error reading room data:", error);
        displayElement.innerHTML += '<br><span style="color:red;">Error loading battle data.</span>';
      });
    }
  });
}