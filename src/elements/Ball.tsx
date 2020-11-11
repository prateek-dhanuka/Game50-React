import { BasicHandle } from "../Game/RefTypes";
import React from "react";

type Props = Readonly<{ x: number; y: number }>;
interface BallRef extends BasicHandle {}

const radius = 2;

const Circle = React.forwardRef<BallRef, Props>((props, ref) => {
  const x = React.useRef<number>();
  const y = React.useRef<number>();

  React.useImperativeHandle(ref, () => ({
    update(dt: number) {
      return;
    },
  }));

  React.useEffect(() => {
    x.current = props.x;
    y.current = props.y;
  }, [props]);

  const style: React.CSSProperties = {
    position: "absolute",
    left: x.current,
    top: y.current,
    width: radius,
    height: radius,
    borderRadius: "50%",
    backgroundColor: "white",
  };

  return <div style={style} />;
});

export default Circle;
