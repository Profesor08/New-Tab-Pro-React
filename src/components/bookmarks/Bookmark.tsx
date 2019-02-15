import React, { Component } from "react";
import { Dispatch } from "redux";
import { IconButton } from "../buttons/IconButton";
import { connect } from "react-redux";
import {
  setTargetBookmark,
  toggleBookmarksMenu,
  BookmarkMenuPosition,
} from "../../store/reducers/bookmarksApp";
import { ChromeBookmark } from "./Bookmarks";

interface BookmarkDisplatchProps {
  openBookmarkMenu: (position: BookmarkMenuPosition) => void;
  closeBookmarkMenu: () => void;
  setTargetBookmark: (bookmark: ChromeBookmark) => void;
}

interface BookmarkProps {
  bookmark: ChromeBookmark;
  container: HTMLElement;
}

type Props = BookmarkProps & BookmarkDisplatchProps;

function dateFormat(timestamp: number): string {
  return new Date(timestamp).toLocaleString().substr(0, 10);
}

function timeFormat(timestamp: number): string {
  let time = new Date(timestamp).toLocaleString().substr(12);

  if (time.length < 8) {
    return "0" + time;
  }

  return time;
}

class Bookmark extends Component<Props> {
  openMenu = (e: React.MouseEvent) => {
    const event = e.nativeEvent;

    let x: number = event.x - event.offsetX;
    let y: number = event.y - event.offsetY;

    if (this.props.container) {
      x -= (window.innerWidth - this.props.container.offsetWidth) / 2;

      const position: BookmarkMenuPosition = {
        x,
        y,
        containerHeight: this.props.container.offsetHeight,
        containerTop: this.props.container.offsetTop,
      };

      this.props.openBookmarkMenu(position);
      this.props.setTargetBookmark(this.props.bookmark);
    }
  };

  closeMenu = () => {
    this.props.closeBookmarkMenu();
  };

  render() {
    const bookmark: ChromeBookmark = this.props.bookmark;

    return (
      <div className="bookmark">
        <div className="bookmark-icon">
          {/*<img src={`chrome://favicon/size/24@1x/` + bookmark.url} alt=""/>*/}
          {
            <img
              src="https://www.compart.com/en/unicode/images/icon/favicon.ico"
              alt=""
            />
          }
        </div>
        <div className="bookmark-link-wrapper">
          <a href={bookmark.url} className="bookmark-link">
            {bookmark.title}
          </a>
        </div>
        <div className="bookmark-time">
          {dateFormat(bookmark.dateAdded)}, {timeFormat(bookmark.dateAdded)}
        </div>
        <IconButton
          onClick={this.openMenu}
          onBlur={this.closeMenu}
          className="bookmark-menu-button"
        >
          ⋮
        </IconButton>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchProps = (dispatch: Dispatch): BookmarkDisplatchProps => {
  return {
    openBookmarkMenu: (position: BookmarkMenuPosition) => {
      dispatch(toggleBookmarksMenu(true, position));
    },

    closeBookmarkMenu: () => {
      dispatch(
        toggleBookmarksMenu(false, {
          x: -99999,
          y: 0,
          containerTop: 0,
          containerHeight: 0,
        }),
      );
    },

    setTargetBookmark: (bookmark: ChromeBookmark) => {
      dispatch(setTargetBookmark(bookmark));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(Bookmark);
