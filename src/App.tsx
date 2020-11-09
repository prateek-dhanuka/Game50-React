import "./App.css";

import Circle from "./Circle";
import Game from "./Game";
import React from "react";

function App() {
  const elements = [
    <Circle x={100} y={100} maxR={100} color="black" />,
    <Circle x={200} y={200} maxR={100} color="blue" />,
    <Circle x={100} y={200} maxR={100} color="red" />,
    <Circle x={200} y={100} maxR={100} color="green" />,
  ];

  return (
    <div className="App">
      <Game elements={elements} />
    </div>
  );
}

export default App;
