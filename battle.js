const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');
const displayElement = document.getElementById('battleCodeDisplay');
const loadingMessage = document.getElementById('loadingMessage');
const dotsSpan = document.getElementById('dots');

console.log('battleCode:', battleCode);

if (!battleCode) {
  displayElement.innerHTML = '<span style="color: red;">No battle code found in URL.</span>';
} else {
  // Animate loading dots
  let dotCount = 0;
  const maxDots = 3;
  setInterval(() => {
    dotCount = (dotCount % maxDots) + 1;
    dotsSpan.textContent = '.'.repeat(dotCount);
  }, 500);

  // Add battle code line
  const codeLine = document.createElement('div');
  codeLine.innerHTML = `Battle code: <strong>${battleCode}</strong>`;
  displayElement.appendChild(codeLine);

  // Status message (e.g., Player 1, waiting, full room, etc.)
  const statusMessage = document.createElement('div');
  displayElement.appendChild(statusMessage);

  const connectedRef = db.ref(".info/connected");
  const roomRef = db.ref('battles/' + battleCode);

  // Monitor room state to show waiting/start messages
  roomRef.on("value", (snapshot) => {
    const data = snapshot.val() || {};
    const player1Exists = !!data.player1;
    const player2Exists = !!data.player2;

    if (player1Exists && player2Exists) {
      loadingMessage.innerHTML = '<span style="color: lightgreen;">Both players connected! Starting battle...</span>';
      setTimeout(() => {
        startBattle();
      }, 1000);
    } else {
      loadingMessage.innerHTML = '<span style="color: orange;">Waiting for opponent<span id="dots"></span></span>';
    }
  });

  // Assign player on connect
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

// Placeholder for future game logic
function startBattle() {
  const status = document.getElementById('loadingMessage');
  if (status) {
    status.innerHTML = '<strong>Battle started!</strong>';
  }
  console.log("Battle started!");
}