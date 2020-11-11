import "./Game.css";

import Ref, { BasicHandle } from "./RefTypes";

import React from "react";
import { StateMachineRef } from "../StateMachine";

interface BasicProps {
  renderFPS?: boolean;
  backgroundColor?: string;
  virtualSize?: {
    width: number;
    height: number;
  };
}

interface BasicPropsWithElements extends BasicProps {
  elements: JSX.Element[];
  stateMachine?: never;
}

interface BasicPropsWithStateMachine extends BasicProps {
  elements?: never;
  stateMachine: StateMachineRef;
}

type Props = BasicPropsWithElements | BasicPropsWithStateMachine;

interface GameRefInterface {
  isKeyDown(key: string): boolean;
  getRefs(): Map<number, any>;
}

export type GameRef = React.RefObject<GameRefInterface>;

interface backgroundViewType {
  margin: number;
  scale: number;
}

interface keyMap {
  [key: string]: boolean;
}

const Game = React.forwardRef<GameRefInterface, Props>((props, ref) => {
  // Use this to store references to all the elements to update and render
  const setRefs = React.useRef(new Map()).current;

  // Basic details of the animation
  const [fps, setFPS] = React.useState(0);

  // Get key presses
  const keysDown = React.useRef<keyMap>();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (keysDown.current === undefined) {
      keysDown.current = {};
    }
    keysDown.current[event.key] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (keysDown.current === undefined) {
      keysDown.current = {};
    }
    keysDown.current[event.key] = false;
  };

  React.useImperativeHandle(ref, () => ({
    isKeyDown: (key: string) => {
      return keysDown.current ? keysDown.current[key] : false;
    },
    getRefs: () => {
      console.log(`Passing refs = `, setRefs);
      return setRefs;
    },
  }));

  // Register the keypress handler
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Required for animation loop
  const requestRef = React.useRef<DOMHighResTimeStamp>();
  const previousTimeRef = React.useRef<number>();

  // Main update loop
  const update = (dt: number) => {
    setFPS(1 / dt);

    // Update the state machine and then the elements
    if (props.stateMachine) {
      props.stateMachine.current!.update(dt);
    }
    setRefs.forEach((ref) => ref.update(dt));
  };

  // the main callback function called by requestAnimationFrame
  // This does the calculations and other required stuff before calling update
  const animate = (time: DOMHighResTimeStamp) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000; // give it in ms

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

  // Set the virtual width and height

  const backgroundView = React.useRef<backgroundViewType>();
  const handleResize = () => {
    if (props.virtualSize) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const scale = windowHeight / props.virtualSize.height;
      const requiredWidth = props.virtualSize.width * scale;

      const margin = (windowWidth - requiredWidth) / (2 * scale);

      backgroundView.current = {
        margin: margin,
        scale: scale,
      };
    } else {
      backgroundView.current = {
        margin: 0,
        scale: 1,
      };
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const elements = React.useRef<JSX.Element[]>([]);
  if (props.elements === undefined) {
    // If no elements provided, a stateMachine ref was provided
    if (props.stateMachine.current) {
      elements.current = props.stateMachine.current.elementsToRender();
      // console.log(elements.current);
    }
  } else {
    // Elements were provided not stateMachine
    elements.current = props.elements;
  }

  // Set Background
  const backgroundStyle: React.CSSProperties = {
    left: backgroundView.current?.margin,
    right: backgroundView.current?.margin,
    zoom: backgroundView.current?.scale,
    background: props.backgroundColor ? props.backgroundColor : "white",
  };

  return (
    <div style={backgroundStyle} className="background">
      {/* Render the FPS if specified */}
      {props.renderFPS ? (
        <div className="fps">FPS: {Math.round(fps)}</div>
      ) : null}

      {/* Render all the elements */}
      {React.Children.map(elements.current, (element, index) => {
        // console.log(`Element is`, element);
        return React.cloneElement(element, {
          ref: (node: Ref) => {
            return !node
              ? setRefs.delete(element.key)
              : setRefs.set(element.key, node);
          },
        });
      })}
    </div>
  );
});

export default Game;
