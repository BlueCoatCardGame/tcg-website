const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');
const displayElement = document.getElementById('battleCodeDisplay');

if (!battleCode) {
  displayElement.innerHTML = '<span style="color: red;">No battle code found in URL.</span>';
} else {
  displayElement.innerHTML = '';

  // Show battle code
  const codeLine = document.createElement('div');
  codeLine.innerHTML = `Battle code: <strong>${battleCode}</strong>`;
  displayElement.appendChild(codeLine);

  // Status line (e.g., Player 1 or Player 2)
  const statusMessage = document.createElement('div');
  displayElement.appendChild(statusMessage);

  // Create waiting message with animated dots
  const waitingMessage = document.createElement('div');
  const waitingText = document.createElement('span');
  const dotsSpan = document.createElement('span');

  waitingText.textContent = 'Waiting for opponent';
  waitingText.style.color = 'orange';
  dotsSpan.textContent = '.';
  dotsSpan.style.color = 'orange';

  waitingMessage.appendChild(waitingText);
  waitingMessage.appendChild(dotsSpan);
  displayElement.appendChild(waitingMessage);

  // Animate dots
  let dotCount = 1;
  const dotInterval = setInterval(() => {
    dotCount = (dotCount % 3) + 1;
    dotsSpan.textContent = '.'.repeat(dotCount);
  }, 500);

  const connectedRef = db.ref(".info/connected");
  const roomRef = db.ref('battles/' + battleCode);

  roomRef.on("value", (snapshot) => {
    const roomData = snapshot.val() || {};
    const p1 = roomData.player1;
    const p2 = roomData.player2;

    if (p1 && p2) {
      waitingText.textContent = 'Both players connected! Starting battle';
      dotsSpan.textContent = '...';
      dotsSpan.style.color = 'orange';

      clearInterval(dotInterval);

      setTimeout(() => {
        waitingText.textContent = 'Battle started!';
        dotsSpan.textContent = '';
        waitingText.style.color = 'lightgreen';
      }, 3000);
    }
  });

  connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
      roomRef.once("value").then((snapshot) => {
        const roomData = snapshot.val() || {};

        const updates = {};
        if (roomData.player1 && typeof roomData.player1 !== "boolean") updates.player1 = null;
        if (roomData.player2 && typeof roomData.player2 !== "boolean") updates.player2 = null;
        if (Object.keys(updates).length > 0) roomRef.update(updates);

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