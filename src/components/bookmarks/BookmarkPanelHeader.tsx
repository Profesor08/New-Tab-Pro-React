import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import BookmarksSort from "./BookmarksSort";
import BookmarkSearch from "./BookmarkSearch";
import { IconButton } from "../buttons/IconButton";
import { Bookmarks, ChromeBookmark } from "./Bookmarks";
import {
  setBookmarks,
  toggleBookmarksPanel,
  InitialState as BookmarkPanelHeaderInitialState,
} from "../../store/reducers/bookmarksApp";
import { CloseButton } from "../buttons/CloseButton";

const bookmarks = new Bookmarks();

interface BookmarkPanelHeaderDispatchProps {
  setBookmarks: (bookmarks: ChromeBookmark[]) => void;
  closeBookmarksPanel: () => void;
}

interface BookmarkPanelHeaderState {
  bookmarksApp: BookmarkPanelHeaderInitialState;
}

interface BookmarkPanelHeaderStateProps {
  bookmarks: ChromeBookmark[];
}

type Props = BookmarkPanelHeaderStateProps & BookmarkPanelHeaderDispatchProps;

class BookmarkPanelHeader extends Component<Props> {
  restoreBookmark = async () => {
    await bookmarks.restore();

    this.props.setBookmarks(await bookmarks.get());
  };

  render() {
    return (
      <div className="panel-header">
        <BookmarkSearch />
        <BookmarksSort />
        <IconButton onClick={this.restoreBookmark} className="restore-button">
          ↶
        </IconButton>
        <CloseButton onClick={this.props.closeBookmarksPanel} />
      </div>
    );
  }
}

const mapStateToProps = (
  state: BookmarkPanelHeaderState,
): BookmarkPanelHeaderStateProps => {
  return {
    bookmarks: state.bookmarksApp.bookmarks,
  };
};

const mapDispatchProps = (
  dispatch: Dispatch,
): BookmarkPanelHeaderDispatchProps => {
  return {
    setBookmarks: (bookmarks: ChromeBookmark[]) => {
      dispatch(setBookmarks(bookmarks));
    },

    closeBookmarksPanel: () => {
      dispatch(toggleBookmarksPanel(false));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookmarkPanelHeader);
