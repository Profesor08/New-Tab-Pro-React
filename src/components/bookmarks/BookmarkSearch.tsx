import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setSearchQuery } from "../../store/reducers/bookmarksApp";
import { CloseButton } from "../buttons/CloseButton";
import { ChromeBookmark } from "./Bookmarks";

interface BookmarkSearchProps {
  searchQuery: string;
}

interface DispatchProps {
  setSearchQuery: (value: string) => void;
}

interface StateProps {
  bookmarksApp: {
    searchQuery: string;
    bookmarks: ChromeBookmark;
  };
}

type State = {
  searchQuery: string;
  bookmarks: ChromeBookmark;
};

type Props = State & DispatchProps;

class BookmarkSearch extends Component<Props> {
  render() {
    let clearInputClass = "clear-input";

    if (this.props.searchQuery.length > 0) {
      clearInputClass += " is-active";
    }

    return (
      <label className="bookmark-search">
        <input
          type="text"
          value={this.props.searchQuery}
          placeholder="Поиск"
          onChange={e => this.props.setSearchQuery(e.target.value)}
        />
        <div className="search-outline" />
        <CloseButton
          className={clearInputClass}
          onClick={() => this.props.setSearchQuery("")}
        />
      </label>
    );
  }
}

const mapStateToProps = (state: StateProps): State => {
  return {
    searchQuery: state.bookmarksApp.searchQuery,
    bookmarks: state.bookmarksApp.bookmarks,
  };
};

const mapDispatchProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setSearchQuery: (value: string) => {
      dispatch(setSearchQuery(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookmarkSearch);
