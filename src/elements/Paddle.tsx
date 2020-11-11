import { BasicHandle } from "../Game/RefTypes";
import React from "react";
import { VIRTUAL_HEIGHT } from "../constants";

type Props = Readonly<{
  x: number;
  y: number;
}>;
interface PaddleRef extends BasicHandle {
  setDy(dy: number): void;
}

const width = 5;
const height = 30;

const Circle = React.forwardRef<PaddleRef, Props>((props, ref) => {
  const x = React.useRef<number>(0);
  const y = React.useRef<number>(0);
  const dy = React.useRef<number>(0);

  React.useImperativeHandle(ref, () => ({
    update(dt: number) {
      y.current = Math.min(
        Math.max(y.current! + dy.current * dt, 0),
        VIRTUAL_HEIGHT
      );
      return;
    },
    setDy(newDy: number) {
      dy.current = newDy;
    },
  }));

  React.useEffect(() => {
    console.log(`Called effect`);
    x.current = props.x;
    y.current = props.y;
  }, [props.x, props.y]);

  const style: React.CSSProperties = {
    position: "absolute",
    left: x.current,
    top: y.current,
    width: width,
    height: height,
    backgroundColor: "white",
  };

  return <div style={style} />;
});

export default Circle;
