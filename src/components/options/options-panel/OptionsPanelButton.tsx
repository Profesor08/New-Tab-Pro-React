import React, { Component } from "react";
import "./options-panel.scss";

interface Props {
  active: boolean;
  children: React.ReactNode;
  onChange?: () => void;
}

class OptionsButton extends Component<Props> {
  render() {
    let className = "options-button";

    if (this.props.active) {
      className += " is-active";
    }

    return (
      <label className={className}>
        <span className="button-text">{this.props.children}</span>
        <input
          className="button-check"
          type="checkbox"
          checked={this.props.active}
          onChange={this.props.onChange}
        />
        <span className="check-icon" />
      </label>
    );
  }
}

export default OptionsButton;
