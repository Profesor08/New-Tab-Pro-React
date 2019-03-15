import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ActionButton, ActionMenu, ActionSeparator } from "./ActionMenu";
import { Bookmarks, ChromeBookmark } from "./Bookmarks";
import {
  setBookmarks,
  InitialState,
  toggleBookmarksEditor,
} from "../../store/reducers/bookmarksApp";

const bookmarks = new Bookmarks();

interface DispatchProps {
  setBookmarks: (bookmarks: ChromeBookmark[]) => void;
  openBookmarkEditor: () => void;
}

interface StateProps {
  bookmarksApp: InitialState;
}

interface State {
  bookmark: ChromeBookmark;
  containerHeight: number;
  containerTop: number;
  x: number;
  y: number;
  isActive: boolean;
}

type Props = State & DispatchProps;

class BookmarkMenu extends Component<Props> {
  menu: any;

  constructor(props: Props) {
    super(props);

    this.menu = null;
  }

  componentDidMount = () => {
    this.menu = ReactDOM.findDOMNode(this);
  };

  removeBookmark = async () => {
    await bookmarks.remove(this.props.bookmark);

    this.props.setBookmarks(await bookmarks.get());
  };

  closeBookmarkMenu = () => {};

  openInNewTab = () => {
    chrome.tabs.create({ url: this.props.bookmark.url }, () => {
      this.closeBookmarkMenu();
    });
  };

  openInNewWindow = () => {
    chrome.windows.create({ url: this.props.bookmark.url }, () => {
      this.closeBookmarkMenu();
    });
  };

  openInIncognito = () => {
    chrome.windows.create(
      {
        url: this.props.bookmark.url,
        incognito: true,
      },
      () => {
        this.closeBookmarkMenu();
      },
    );
  };

  copyBookmarkUrl = () => {
    const fake = document.createElement("textarea");
    fake.style.position = "absolute";
    fake.style.left = "-99999px";
    fake.value = this.props.bookmark.url;
    document.body.appendChild(fake);
    fake.select();
    document.execCommand("copy");
    document.body.removeChild(fake);
  };

  render() {
    let y = this.props.y;

    if (this.menu) {
      if (
        y + this.menu.offsetHeight >
        this.props.containerHeight + this.props.containerTop
      ) {
        y =
          this.props.containerHeight -
          this.menu.offsetHeight +
          this.props.containerTop;
      }
    }

    const style = {
      // left: this.props.x + "px",
      top: y + "px",
    };

    let className = "bookmark-menu";

    if (this.props.isActive) {
      className += " is-active";
    }

    return (
      <ActionMenu className={className} style={style}>
        <ActionButton onClick={this.props.openBookmarkEditor}>
          Edit Bookmark
        </ActionButton>
        <ActionButton onClick={this.copyBookmarkUrl}>
          Copy Bookmark URL
        </ActionButton>
        <ActionButton onClick={this.removeBookmark}>
          Delete Bookmark
        </ActionButton>
        <ActionSeparator />
        <ActionButton onClick={this.openInNewTab}>Open in New Tab</ActionButton>
        <ActionButton onClick={this.openInNewWindow}>
          Open in New Window
        </ActionButton>
        <ActionButton onClick={this.openInIncognito}>
          Open in Incognito
        </ActionButton>
        <ActionSeparator />
        <ActionButton>Close</ActionButton>
      </ActionMenu>
    );
  }
}

const mapStateToProps = (state: StateProps) => {
  return {
    ...state.bookmarksApp.bookmarkMenu,
    bookmark: state.bookmarksApp.targetBookmark,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setBookmarks: (bookmarks: ChromeBookmark[]): void => {
      dispatch(setBookmarks(bookmarks));
    },

    openBookmarkEditor: (): void => {
      dispatch(toggleBookmarksEditor(true));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookmarkMenu);
