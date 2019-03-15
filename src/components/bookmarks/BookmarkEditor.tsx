import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Form, ButtonsList, ButtonsListItem } from "../../lib/form";
import {
  InitialState,
  toggleBookmarksEditor,
  setBookmarks,
} from "../../store/reducers/bookmarksApp";
import { Bookmarks, ChromeBookmark } from "./Bookmarks";

const bookmarks = new Bookmarks();

interface BookmarkPartialData {
  title?: string;
  url?: string;
}

interface DispatchProps {
  closeBookmarkEditor: () => void;
  setBookmarks: (bookmarks: ChromeBookmark[]) => void;
}

interface EditorProps {
  bookmark: ChromeBookmark;
  isActive: boolean;
}

interface State {
  bookmark: ChromeBookmark;
}

type Props = EditorProps & DispatchProps;

class BookmarkEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    bookmarks.onChanged(async () => {
      this.props.setBookmarks(await bookmarks.get());
    });

    this.state = {
      bookmark: props.bookmark,
    };
  }

  resetForm = () => {
    this.setState({
      bookmark: this.props.bookmark,
    });
  };

  saveData = (data: BookmarkPartialData) => {
    this.setState({
      bookmark: {
        ...this.state.bookmark,
        ...data,
      },
    });
  };

  componentWillReceiveProps = (newProps: Props) => {
    this.setState({
      bookmark: newProps.bookmark,
    });
  };

  render() {
    const title = "Bookmark Editor";

    const buttons: ButtonsListItem[] = [
      {
        text: "Save",
        type: "btn-success",
      },
      {
        text: "Reset",
        type: "btn-warning",
        onClick: event => {
          event.preventDefault();
          this.resetForm();
        },
      },
    ];

    const buttonsList = <ButtonsList buttons={buttons} />;

    const onSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault();

      bookmarks.update(this.state.bookmark);
      this.props.closeBookmarkEditor();
    };

    const closeAction = () => {
      this.resetForm();
      this.props.closeBookmarkEditor();
    };

    const content = (
      <div>
        <input
          type="text"
          placeholder="Site name"
          value={this.state.bookmark.title}
          onChange={e =>
            this.saveData({
              title: e.target.value,
            })
          }
          required
        />
        <input
          type="text"
          placeholder="Site url"
          value={this.state.bookmark.url}
          onChange={e =>
            this.saveData({
              url: e.target.value,
            })
          }
          required
        />
      </div>
    );

    return (
      <Form
        title={title}
        buttons={buttonsList}
        content={content}
        closeAction={closeAction}
        onSubmit={onSubmit}
        show={this.props.isActive}
      />
    );
  }
}

interface StateProps {
  bookmarksApp: InitialState;
}

const mapStateToProps = (state: StateProps) => {
  return {
    bookmark: state.bookmarksApp.targetBookmark,
    isActive: state.bookmarksApp.bookmarkEditorShow,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    closeBookmarkEditor: (): void => {
      dispatch(toggleBookmarksEditor(false));
    },
    setBookmarks: (bookmarks: ChromeBookmark[]): void => {
      dispatch(setBookmarks(bookmarks));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookmarkEditor);
