import GameStateManager from "./ts/GameStateManager";

import "./scss/main.scss";

// time variables

const gameStateManager = new GameStateManager();

let secondsPassed = 0;
let prevTime = 0;

function gameLoop(time?: number) {
  requestAnimationFrame(gameLoop);

  // f = amount of frames (16.666... ms)
  if (typeof time === "undefined") secondsPassed = 0.016;
  else secondsPassed = (time - prevTime) / 1000;
  if (isNaN(secondsPassed)) secondsPassed = 0.016;
  prevTime = time || 0;

  // gameStateManager.loop(secondsPassed);
}

gameLoop();
