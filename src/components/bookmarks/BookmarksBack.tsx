import React, { Component } from "react";

type BookmarksBackProps = {
  onClick: () => void;
};

class BookmarksBack extends Component<BookmarksBackProps> {
  render() {
    return <div className="bookmarks-back" onClick={this.props.onClick} />;
  }
}

export { BookmarksBack };
