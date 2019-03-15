import React, { Component } from "react";
import { connect } from "react-redux";
import style from "./background.module.scss";
import FlyingThroughSpace from "./theme/FlyingThroughSpace/FlyingThroughSpace";
import { OptionsAppInitialState } from "../../store/reducers/optionsApp";

interface BackgroundDispatchProps {}

interface BackgroundStateProps {
  show: boolean;
}

type Props = BackgroundDispatchProps & BackgroundStateProps;

class Background extends Component<Props> {
  canvas: React.RefObject<HTMLCanvasElement>;
  space: FlyingThroughSpace | null;

  constructor(props: Props) {
    super(props);

    this.canvas = React.createRef();
    this.space = null;
  }

  componentDidMount = () => {
    if (this.canvas.current) {
      this.space = new FlyingThroughSpace(this.canvas.current);
      if (this.props.show) {
        this.space.start();
      }
    }
  };

  render() {
    if (this.space) {
      if (this.props.show) {
        this.space.start();
      } else {
        this.space.stop();
      }
    }

    return (
      <div className={style.background}>
        <canvas className={style.canvas} ref={this.canvas} />
      </div>
    );
  }
}

interface State {
  optionsApp: OptionsAppInitialState;
}

const mapStateToProps = (state: State): BackgroundStateProps => {
  return {
    show: state.optionsApp.backgroundStarSpaceAnimation,
  };
};

const mapDispatchToProps = (): BackgroundDispatchProps => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Background);
