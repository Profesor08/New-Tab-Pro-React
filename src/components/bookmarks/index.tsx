import React, { Component } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import "./bookmarks.scss";
import { toggleBookmarksPanel } from "../../store/reducers/bookmarksApp";
import { BookmarksBack } from "./BookmarksBack";
import BookmarksPanel from "./BookmarksPanel";

interface DispatchProps {
  closeBookmarksPanel: () => void;
}

interface StateProps {
  bookmarksApp: {
    bookmarksPanelShow: boolean;
  };
}

interface State {
  bookmarksPanelShow: boolean;
}

type Props = State & DispatchProps;

class BookmarksComponent extends Component<Props> {
  render() {
    let className = "bookmarks-wrapper";

    if (this.props.bookmarksPanelShow) {
      className += " is-active";
    }

    return (
      <div className={className}>
        <BookmarksBack onClick={this.props.closeBookmarksPanel} />
        <BookmarksPanel />
      </div>
    );
  }
}

const mapStateToProps = (state: StateProps): State => {
  return {
    bookmarksPanelShow: state.bookmarksApp.bookmarksPanelShow,
  };
};

const mapDispatchProps = (dispatch: Dispatch): DispatchProps => {
  return {
    closeBookmarksPanel: () => {
      dispatch(toggleBookmarksPanel(false));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookmarksComponent);
