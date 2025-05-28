// Assume Firebase has been initialized in the HTML
const db = firebase.database();

const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');
const displayElement = document.getElementById('battleCodeDisplay');
console.log('battleCode:', battleCode);

if (!battleCode) {
  displayElement.innerHTML = '<span style="color: red;">No battle code found in URL.</span>';
} else {
  displayElement.innerHTML = '';

  // Battle code line
  const codeLine = document.createElement('div');
  codeLine.innerHTML = `Battle code: <strong>${battleCode}</strong>`;
  displayElement.appendChild(codeLine);

  // Player status message
  const statusMessage = document.createElement('div');
  displayElement.appendChild(statusMessage);

  // Waiting for opponent message with animated dots
  const waitingMessage = document.createElement('div');
  waitingMessage.innerHTML = '<span id="waitingText" style="color: orange;">Waiting for opponent</span><span id="dots" style="margin-left: 4px;">.</span>';
  displayElement.appendChild(waitingMessage);

  const waitingText = document.getElementById('waitingText');
  const dotsSpan = document.getElementById('dots');

  // Animate dots
  let dotCount = 1;
  const dotInterval = setInterval(() => {
    dotCount = (dotCount % 3) + 1;
    dotsSpan.textContent = '.'.repeat(dotCount);
  }, 500);

  const connectedRef = db.ref(".info/connected");
  const roomRef = db.ref('battles/' + battleCode);

  // Watch room for both players
  roomRef.on("value", (snapshot) => {
    const roomData = snapshot.val() || {};
    const p1 = roomData.player1;
    const p2 = roomData.player2;

    if (p1 && p2) {
      // Both players joined
      waitingMessage.innerHTML = '<span style="color: orange;">Both players connected! Starting battle</span><span id="dots">...</span>';
      clearInterval(dotInterval);

      setTimeout(() => {
        waitingMessage.innerHTML = <strong style="color: lightgreen;">Battle started!</strong>;
      }, 3000);
    }
  });

  // Player connection and assignment
  connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
      roomRef.once("value").then((snapshot) => {
        const roomData = snapshot.val() || {};

        // Clean up any ghost player entries
        const updates = {};
        if (roomData.player1 && typeof roomData.player1 !== "boolean") updates.player1 = null;
        if (roomData.player2 && typeof roomData.player2 !== "boolean") updates.player2 = null;
        if (Object.keys(updates).length > 0) roomRef.update(updates);

        // Assign this player
        if (!roomData.player1) {
          const playerRef = roomRef.child("player1");
          playerRef.onDisconnect().remove();
          playerRef.set(true);
          statusMessage.innerHTML = 'You are <strong>Player 1</strong>';
        } else if (!roomData.player2) {
          const playerRef = roomRef.child("player2");
          playerRef.onDisconnect().remove();
          playerRef.set(true);
          statusMessage.innerHTML = 'You are <strong>Player 2</strong>';
        } else {
          statusMessage.innerHTML = '<span style="color:red;">This battle already has 2 players.</span>';
        }
      }).catch((error) => {
        console.error("Error reading room data:", error);
        statusMessage.innerHTML = '<span style="color:red;">Error loading battle data.</span>';
      });
    }
  });
}