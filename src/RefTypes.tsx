import React from "react";

export interface BasicHandle {
  update(dt: number): void;
}

interface BasicProps {}

const BasicElement = React.forwardRef<BasicHandle, BasicProps>((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    update: (dt: number) => {
      return;
    },
  }));

  return <div />;
});

type Ref = React.RefObject<React.ElementRef<typeof BasicElement>>;
export default Ref;