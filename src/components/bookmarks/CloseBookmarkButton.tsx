import React, { Component } from "react";

type CloseBookmarkButtonProps = {
  onClick: () => void;
};

class CloseBookmarkButton extends Component<CloseBookmarkButtonProps> {
  render() {
    return <div className="close-button" onClick={this.props.onClick} />;
  }
}

export { CloseBookmarkButton };
