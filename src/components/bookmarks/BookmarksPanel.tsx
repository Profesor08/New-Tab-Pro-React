import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import BookmarkPanelHeader from "./BookmarkPanelHeader";
import Bookmark from "./Bookmark";
import { Bookmarks, ChromeBookmark } from "./Bookmarks";
import BookmarkMenu from "./BookmarkMenu";
import BookmarkEditor from "./BookmarkEditor";
import {
  ORDER_BY_DATE,
  ORDER_BY_NAME,
  ORDER_DIRECTION_ASCENDING,
  ORDER_DIRECTION_DESCENDING,
  setBookmarks,
  SortOrder,
  SortDirection,
  SortType,
  InitialState as BookmarksInitialState,
} from "../../store/reducers/bookmarksApp";

const bookmarks = new Bookmarks();

interface BookmarksPanelStateProps {
  searchQuery: string;
  sortOrder: SortOrder;
  bookmarks: ChromeBookmark[];
}

interface BookmarksPanelDispatchProps {
  setBookmarks: (bookmarks: ChromeBookmark[]) => void;
}

interface BookmarksPanelState {
  bookmarksApp: BookmarksInitialState;
}

interface State {
  container: HTMLElement;
}

type Props = BookmarksPanelStateProps & BookmarksPanelDispatchProps;

class BookmarksPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount = async () => {
    const element = ReactDOM.findDOMNode(this);

    if (element instanceof HTMLElement) {
      const container = element.querySelector(".bookmarks-container");

      if (container instanceof HTMLElement) {
        this.setState({
          container: container,
        });

        this.props.setBookmarks(await bookmarks.get());
      }
    }
  };

  filter = (bookmarks: ChromeBookmark[]): ChromeBookmark[] => {
    return bookmarks
      .filter(bookmark => {
        return (
          bookmark.title.search(this.props.searchQuery) !== -1 ||
          bookmark.url.search(this.props.searchQuery) !== -1
        );
      })
      .sort(
        (a: ChromeBookmark, b: ChromeBookmark): -1 | 0 | 1 => {
          function sortOrder(
            a: string | number,
            b: string | number,
            order: SortDirection,
          ): -1 | 0 | 1 {
            switch (order) {
              case ORDER_DIRECTION_ASCENDING: {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }

                break;
              }

              case ORDER_DIRECTION_DESCENDING: {
                if (a < b) {
                  return 1;
                }
                if (a > b) {
                  return -1;
                }

                break;
              }
            }

            return 0;
          }

          switch (this.props.sortOrder.type) {
            case ORDER_BY_NAME: {
              return sortOrder(
                a.title,
                b.title,
                this.props.sortOrder.direction,
              );
            }

            case ORDER_BY_DATE: {
              return sortOrder(
                a.dateAdded,
                b.dateAdded,
                this.props.sortOrder.direction,
              );
            }
          }

          return 0;
        },
      );
  };

  render() {
    return (
      <div className="bookmarks-panel">
        <BookmarkPanelHeader />
        <div className="panel-body">
          <div className="bookmarks-container">
            <BookmarkMenu />
            <BookmarkEditor />
            {this.filter(this.props.bookmarks).map(
              (bookmark: ChromeBookmark, index: number) => (
                <Bookmark
                  key={index}
                  bookmark={bookmark}
                  container={this.state.container}
                />
              ),
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  state: BookmarksPanelState,
): BookmarksPanelStateProps => {
  return {
    bookmarks: state.bookmarksApp.bookmarks,
    sortOrder: state.bookmarksApp.sortOrder,
    searchQuery: state.bookmarksApp.searchQuery,
  };
};

const mapDispatchProps = (dispatch: Dispatch) => {
  return {
    setBookmarks: (bookmarks: ChromeBookmark[]) => {
      dispatch(setBookmarks(bookmarks));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookmarksPanel);
