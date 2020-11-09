import React, { CSSProperties } from "react";

import { BasicHandle } from "./RefTypes";

type Props = Readonly<{ x: number; y: number; maxR: number; color: string }>;
interface CircleRef extends BasicHandle {}

const speed = 2; // Speed to change radius at

const Circle = React.forwardRef<CircleRef, Props>((props, ref) => {
  // Location
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  // Radius, will be changed in update
  const [r, setR] = React.useState(10);

  // Max radius
  const maxR = props.maxR;

  // Color of circle
  const [color, setColor] = React.useState("black");

  React.useImperativeHandle(ref, () => ({
    update: (dt: number) => {
      // Increase radius at a constant speed
      const newR = r * (1 + (speed * dt) / 1000);
      setR(newR > maxR ? 0.1 : newR);
    },
  }));

  React.useEffect(() => {
    setX(props.x);
    setY(props.y);
    setColor(props.color);
  }, [props]);

  const style: CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    height: `${r}px`,
    width: `${r}px`,
    borderRadius: "50%",
    backgroundColor: color,
  };

  return <div style={style} />;
});

export default Circle;
