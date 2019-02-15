import React, { Component } from "react";
import style from "./options.module.scss";

interface OptionsButtonProps {
  iconStyle?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

type Props = OptionsButtonProps;

class OptionsButton extends Component<Props> {
  render() {
    return (
      <div className={style["option-button"]} onClick={this.props.onClick}>
        <i className={style.icon} style={this.props.iconStyle}>
          {this.props.children}
        </i>
      </div>
    );
  }
}

export default OptionsButton;
