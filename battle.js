const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');
const displayElement = document.getElementById('battleCodeDisplay');

console.log('battleCode:', battleCode);

if (!battleCode) {
  displayElement.innerHTML = '<span style="color: red;">No battle code found in URL.</span>';
} else {
  // Set up loading message with animated dots
  const loadingText = document.createElement('div');
  const loadingPrefix = document.createElement('span');
  const loadingDots = document.createElement('span');

  loadingPrefix.textContent = 'Loading match';
  loadingText.appendChild(loadingPrefix);
  loadingText.appendChild(loadingDots);

  displayElement.innerHTML = `Battle code: <strong>${battleCode}</strong><br>`;
  displayElement.appendChild(loadingText);

  // Add container for status message (e.g., Player 1, full match)
  const statusMessage = document.createElement('div');
  displayElement.appendChild(statusMessage);

  // Animate loading dots
  let dotCount = 0;
  const maxDots = 3;
  setInterval(() => {
    dotCount = (dotCount % maxDots) + 1;
    loadingDots.textContent = '.'.repeat(dotCount);
  }, 500);

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

        // Clean up ghost players
        const updates = {};
        if (roomData.player1 && typeof roomData.player1 !== "boolean") updates.player1 = null;
        if (roomData.player2 && typeof roomData.player2 !== "boolean") updates.player2 = null;
        if (Object.keys(updates).length > 0) {
          roomRef.update(updates);
        }

        // Assign a player
        if (!roomData.player1) {
          const playerRef = roomRef.child("player1");
          playerRef.onDisconnect().remove();
          playerRef.set(true);
          statusMessage.innerHTML = 'You are <strong>Player 1</strong>';
          console.log("Player 1 has joined.");
        } else if (!roomData.player2) {
          const playerRef = roomRef.child("player2");
          playerRef.onDisconnect().remove();
          playerRef.set(true);
          statusMessage.innerHTML = 'You are <strong>Player 2</strong>';
          console.log("Player 2 has joined.");
        } else {
          statusMessage.innerHTML = '<span style="color:red;">This battle already has 2 players.</span>';
          console.log("Battle is full.");
        }
      }).catch((error) => {
        console.error("Error reading room data:", error);
        statusMessage.innerHTML = '<span style="color:red;">Error loading battle data.</span>';
      });
    }
  });
}