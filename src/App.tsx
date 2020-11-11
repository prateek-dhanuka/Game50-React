import "./App.css";

import Game, { GameRef } from "./Game/Game";
import StateMachine, { StateMachineRef } from "./StateMachine";
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "./constants";

import React from "react";

function App() {
  const gameRef: GameRef = React.useRef(null);
  const stateMachineRef: StateMachineRef = React.useRef(null);

  return (
    <div className="App">
      <StateMachine gameRef={gameRef} ref={stateMachineRef} />
      <Game
        stateMachine={stateMachineRef}
        backgroundColor="rgb(40,45,52)"
        virtualSize={{ width: VIRTUAL_WIDTH, height: VIRTUAL_HEIGHT }}
        ref={gameRef}
        renderFPS
      />
    </div>
  );
}

export default App;
