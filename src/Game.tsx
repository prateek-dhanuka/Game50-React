import React from "react";
import Ref from "./RefTypes";

interface Props {
  elements: JSX.Element[];
  renderFPS?: boolean;
}

const Game = ({ elements, renderFPS }: Props) => {
  // Use this to store references to all the elements to update and render
  const setRefs = React.useRef(new Map()).current;

  // Basic details of the animation
  const [fps, setFPS] = React.useState(0);

  // Required for animation loop
  const requestRef = React.useRef<DOMHighResTimeStamp>();
  const previousTimeRef = React.useRef<number>();

  // Main update loop
  const update = (dt: number) => {
    setFPS(1000 / dt);

    setRefs.forEach((ref) => ref.update(dt));
  };

  // the main callback function called by requestAnimationFrame
  // This does the calculations and other required stuff before calling update
  const animate = (time: DOMHighResTimeStamp) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;

      update(deltaTime);
    }
    previousTimeRef.current = time;

    // Do it in a loop
    requestRef.current = requestAnimationFrame(animate);
  };

  // Start the animation loop
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Render the FPS if specified */}
      {renderFPS ? <div className="fps">FPS: {Math.round(fps)}</div> : null}
      {/* Render all the elements */}
      {React.Children.map(elements, (element, index) => {
        // console.log(`Element is`, element);
        return React.cloneElement(element, {
          ref: (node: Ref) => {
            return !node ? setRefs.delete(index) : setRefs.set(index, node);
          },
        });
      })}
    </>
  );
};

export default Game;
