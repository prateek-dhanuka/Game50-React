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

const StateMachine = React.forwardRef<StateMachineRefInterface, Props>(
  (props, ref) => {
    type paddleRef = React.ElementRef<typeof Paddle>;

    const paddle1Ref = React.useRef<paddleRef>(null!);
    const paddle2Ref = React.useRef<paddleRef>(null!);

    React.useImperativeHandle(ref, () => ({
      update: (dt: number) => {
        return;
      },
      elementsToRender: () => {
        return [
          <Paddle x={10} y={30} ref={paddle1Ref} />,
          <Paddle
            x={VIRTUAL_WIDTH - 10}
            y={VIRTUAL_HEIGHT - 30}
            ref={paddle2Ref}
          />,
          <Ball x={VIRTUAL_WIDTH / 2} y={VIRTUAL_HEIGHT / 2} />,
        ];
      },
    }));

    return <div />;
  }
);

export default StateMachine;
