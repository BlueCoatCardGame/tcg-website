const urlParams = new URLSearchParams(window.location.search);
const battleCode = urlParams.get('code');

console.log('battleCode:', battleCode); // Debug log

const displayElement = document.getElementById('battleCodeDisplay');

if (battleCode) {
  displayElement.innerHTML = `Battle code: <strong>${battleCode}</strong>`;

  const roomRef = firebase.database().ref('battles/' + battleCode);

  roomRef.once('value', (snapshot) => {
    const roomData = snapshot.val();

    if (!roomData) {
      // No room yet — this is Player 1
      roomRef.set({
        player1: true
      });
      displayElement.innerHTML += `<br>You are <strong>Player 1</strong>`;
      console.log("Player 1 has joined.");
    } else if (!roomData.player2) {
      // Room exists — this is Player 2
      roomRef.update({
        player2: true
      });
      displayElement.innerHTML += `<br>You are <strong>Player 2</strong>`;
      console.log("Player 2 has joined.");
    } else {
      // Room full
      displayElement.innerHTML += `<br><span style="color:red;">This battle already has 2 players.</span>`;
      console.log("Battle is full.");
    }
  });

} else {
  displayElement.innerHTML = `<span style="color: red;">No battle code found in URL.</span>`;
}