import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "./constants";

import Ball from "./elements/Ball";
import { GameRef } from "./Game/Game";
import Paddle from "./elements/Paddle";
import React from "react";

interface Props {
  gameRef: GameRef;
}

interface StateMachineRefInterface {
  update(dt: number): void;
  elementsToRender(): JSX.Element[];
}

export type StateMachineRef = React.RefObject<StateMachineRefInterface>;

const paddle_speed = 200;
const paddle_width = 5;
const paddle_height = 30;

const StateMachine = React.forwardRef<StateMachineRefInterface, Props>(
  (props, ref) => {
    type paddleRef = React.ElementRef<typeof Paddle>;

    // Map of all refs
    const refs = React.useRef(new Map());
    const paddle1Ref = React.useRef<paddleRef>(null!);
    const paddle2Ref = React.useRef<paddleRef>(null!);

    React.useImperativeHandle(ref, () => ({
      update: (dt: number) => {
        refs.current = props.gameRef.current!.getRefs();
        paddle1Ref.current = refs.current.get("paddle1");
        paddle2Ref.current = refs.current.get("paddle2");

        if (paddle1Ref.current) {
          if (props.gameRef.current?.isKeyDown("w")) {
            paddle1Ref.current.setDy(-paddle_speed);
          } else if (props.gameRef.current?.isKeyDown("s")) {
            paddle1Ref.current.setDy(paddle_speed);
          } else {
            paddle1Ref.current.setDy(0);
          }
        }

        if (paddle2Ref.current) {
          if (props.gameRef.current?.isKeyDown("ArrowUp")) {
            paddle2Ref.current.setDy(-paddle_speed);
          } else if (props.gameRef.current?.isKeyDown("ArrowDown")) {
            paddle2Ref.current.setDy(paddle_speed);
          } else {
            paddle2Ref.current.setDy(0);
          }
        }

        return;
      },
      elementsToRender: () => {
        return [
          <Paddle
            x={10}
            y={30}
            width={paddle_width}
            height={paddle_height}
            key="paddle1"
          />,
          <Paddle
            x={VIRTUAL_WIDTH - 10}
            y={VIRTUAL_HEIGHT - paddle_height - 30}
            width={paddle_width}
            height={paddle_height}
            key="paddle2"
          />,
          <Ball x={VIRTUAL_WIDTH / 2} y={VIRTUAL_HEIGHT / 2} key="ball" />,
        ];
      },
    }));

    return <div />;
  }
);

export default StateMachine;
