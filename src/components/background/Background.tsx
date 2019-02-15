import React, { Component } from "react";
import style from "./background.module.scss";
import FlyingThroughSpace from "./theme/FlyingThroughSpace/FlyingThroughSpace";

interface BackgroundProps {
  show?: boolean;
}

class Background extends Component<BackgroundProps> {
  canvas: React.RefObject<HTMLCanvasElement>;
  space: FlyingThroughSpace | null;

  constructor(props: BackgroundProps) {
    super(props);

    this.canvas = React.createRef();
    this.space = null;
  }

  componentDidMount = () => {
    if (this.canvas.current) {
      this.space = new FlyingThroughSpace(this.canvas.current);
      this.space.start();
    }
  };

  render() {
    return (
      <div className={style.background}>
        <canvas className={style.canvas} ref={this.canvas} />
      </div>
    );
  }
}

export default Background;
