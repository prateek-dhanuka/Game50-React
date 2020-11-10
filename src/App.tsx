import "./App.css";

import Circle from "./elements/Circle";
import Game from "./Game";
import React from "react";

function App() {
  const elements: JSX.Element[] = [
    <Circle x={100} y={100} maxR={10} color="black" />,
    <Circle x={200} y={200} maxR={20} color="blue" />,
    <Circle x={100} y={200} maxR={30} color="red" />,
    <Circle x={200} y={100} maxR={40} color="green" />,
  ];

  return (
    <div className="App">
      <Game elements={elements} renderFPS />
    </div>
  );
}

export default App;
