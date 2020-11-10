import React, { CSSProperties } from "react";

import { BasicHandle } from "../RefTypes";

type Props = Readonly<{ x: number; y: number; maxR: number; color: string }>;
interface CircleRef extends BasicHandle {}

const speed = 5; // Speed to change radius at

const Circle = React.forwardRef<CircleRef, Props>((props, ref) => {
  // Circle parameters
  const x = React.useRef<number>();
  const y = React.useRef<number>();
  const r = React.useRef<number>();
  const color = React.useRef<string>();

  const maxR = props.maxR; // Max radius

  // Keep track of elapsed time
  const timeElapsed = React.useRef<number>();

  React.useImperativeHandle(ref, () => ({
    update: (dt: number) => {
      if (timeElapsed.current === undefined) {
        timeElapsed.current = 0;
      }
      timeElapsed.current += dt / 1000;

      if (r.current === undefined) {
        r.current = 0;
      }
      r.current = maxR * Math.sin(timeElapsed.current * speed);
    },
  }));

  React.useEffect(() => {
    x.current = props.x;
    y.current = props.y;
    color.current = props.color;
  }, [props]);

  const actual_x = x.current! - r.current!;
  const actual_y = y.current! - r.current!;

  const style: CSSProperties = {
    position: "absolute",
    left: `${actual_x}px`,
    top: `${actual_y}px`,
    height: `${2 * r.current!}px`,
    width: `${2 * r.current!}px`,
    borderRadius: "50%",
    backgroundColor: color.current,
  };

  return <div style={style} />;
});

export default Circle;
