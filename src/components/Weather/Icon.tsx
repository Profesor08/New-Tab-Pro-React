import React, { Component } from "react";
import "./weather.scss";
import lottie from "lottie-web";

interface AnimationData {
  [key: string]: string | number | [] | {};
}

interface Props {
  animationData: AnimationData;
}

class Icon extends Component<Props> {
  icon: React.RefObject<HTMLDivElement>;
  animation: Lottie.AnimationItem | null;

  constructor(props: Props) {
    super(props);

    this.icon = React.createRef();
    this.animation = null;
  }

  componentDidMount = () => {
    this.animation = lottie.loadAnimation({
      wrapper: this.icon.current,
      loop: false,
      autoplay: true,
      renderer: "svg",
      animationData: this.props.animationData,
      rendererSettings: {
        LM: true,
        className: "yXJMw",
      },
    });
  };

  playAnimation = () => {
    if (this.animation) {
      this.animation.playSegments([0, this.animation.totalFrames], true);
    }
  };

  render() {
    return (
      <div className="icon" ref={this.icon} onMouseEnter={this.playAnimation} />
    );
  }
}

export default Icon;
