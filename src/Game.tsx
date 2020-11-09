import React from "react";
import Ref from "./RefTypes";

type Props = { elements: JSX.Element[] };

const Game = ({ elements }: Props) => {
  const length = elements.length;
  const [refs, setRefs] = React.useState<Ref[]>([]); // Array of all references

  // Array of references
  React.useEffect(() => {
    setRefs((refs) =>
      Array(length)
        .fill(null)
        .map((_, i) => refs[i] || React.createRef())
    );
  }, [length]);

  // Animation loop
  const previousTime = React.useRef() as React.MutableRefObject<
    DOMHighResTimeStamp
  >;
  const animationID = React.useRef() as React.MutableRefObject<number>;
  const [fps, setFps] = React.useState<number>(0);

  const update = (dt: number) => {
    // calculate the fps
    setFps(Math.round(1000 / dt));

    refs.map((ref) => ref.current?.update(dt));
  };
  // console.log(`FPS: ${fps}`);

  const callback = (timestamp: DOMHighResTimeStamp) => {
    // Calculate change in time
    const dt = timestamp - previousTime.current;
    previousTime.current = timestamp;

    // Call the update function
    update(dt);

    // console.log(`Calling animate at ${performance.now()}`);
    // Loop back to continuously animate
    animationID.current = requestAnimationFrame(callback);
  };

  React.useEffect(() => {
    console.log(`Effect was called`);
    animationID.current = requestAnimationFrame(callback);

    return () => cancelAnimationFrame(animationID.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {elements.map((element, i) => {
        return React.cloneElement(element, { ref: refs[i], key: i });
      })}
      <p style={{ position: "absolute", left: 10, top: 10 }}>{`FPS: ${fps}`}</p>
    </>
  );
};

export default Game;
