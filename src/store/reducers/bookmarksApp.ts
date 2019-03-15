export const TOGGLE_BOOKMARKS_PANEL = "TOGGLE_BOOKMARKS_PANEL";
export const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
export const SET_BOOKMARKS = "SET_BOOKMARKS";
export const SET_TARGET_BOOKMARK = "SET_TARGET_BOOKMARK";
export const TOGGLE_BOOKMARK_MENU = "TOGGLE_BOOKMARK_MENU";
export const TOGGLE_BOOKMARK_EDITOR = "TOGGLE_BOOKMARK_EDITOR";

export const ORDER_BY_NAME = "ORDER_BY_NAME";
export const ORDER_BY_DATE = "ORDER_BY_DATE";
export const ORDER_DIRECTION_ASCENDING = "ORDER_DIRECTION_ASCENDING";
export const ORDER_DIRECTION_DESCENDING = "ORDER_DIRECTION_DESCENDING";

export interface InitialState {
  bookmarksPanelShow: boolean;
  bookmarks: ChromeBookmark[];
  targetBookmark: ChromeBookmark;
  bookmarkMenu: BookmarkMenuState;
  bookmarkEditorShow: boolean;
  searchQuery: string;
  sortOrder: SortOrder;
}

const bookmarksSortType = "bookmarksSortType";
const bookmarksSortDirection = "bookmarksSortDirection";

import { ChromeBookmark } from "../../components/bookmarks/Bookmarks";

export interface BookmarkMenuPosition {
  containerHeight: number;
  containerTop: number;
  x: number;
  y: number;
}

export type MenuState = {
  isActive: boolean;
};

export type BookmarkMenuState = BookmarkMenuPosition & MenuState;

type ToggleBookmarksPanelAction = {
  type: "TOGGLE_BOOKMARKS_PANEL";
  isActive: boolean;
};

export const toggleBookmarksPanel = (
  isActive: boolean,
): ToggleBookmarksPanelAction => {
  return {
    type: TOGGLE_BOOKMARKS_PANEL,
    isActive: isActive,
  };
};

type ToggleBookmarksEditorAction = {
  type: "TOGGLE_BOOKMARK_EDITOR";
  isActive: boolean;
};

export const toggleBookmarksEditor = (
  isActive: boolean,
): ToggleBookmarksEditorAction => {
  return {
    type: TOGGLE_BOOKMARK_EDITOR,
    isActive: isActive,
  };
};

type ToggleBookmarksMenuAction = {
  type: "TOGGLE_BOOKMARK_MENU";
  isActive: boolean;
  position: BookmarkMenuPosition;
};

export const toggleBookmarksMenu = (
  isActive: boolean,
  position: BookmarkMenuPosition,
): ToggleBookmarksMenuAction => {
  return {
    type: TOGGLE_BOOKMARK_MENU,
    isActive: isActive,
    position: {
      ...position,
    },
  };
};

type OrderByNameAscAction = {
  type: "ORDER_BY_NAME";
  direction: "ORDER_DIRECTION_ASCENDING";
};

export const orderByNameAsc = (): OrderByNameAscAction => ({
  type: ORDER_BY_NAME,
  direction: ORDER_DIRECTION_ASCENDING,
});

type OrderByNameDescAction = {
  type: "ORDER_BY_NAME";
  direction: "ORDER_DIRECTION_DESCENDING";
};

export const orderByNameDesc = (): OrderByNameDescAction => ({
  type: ORDER_BY_NAME,
  direction: ORDER_DIRECTION_DESCENDING,
});

type OrderByDateAscAction = {
  type: "ORDER_BY_DATE";
  direction: "ORDER_DIRECTION_ASCENDING";
};

export const orderByDateAsc = (): OrderByDateAscAction => ({
  type: ORDER_BY_DATE,
  direction: ORDER_DIRECTION_ASCENDING,
});

type OrderByDateDescAction = {
  type: "ORDER_BY_DATE";
  direction: "ORDER_DIRECTION_DESCENDING";
};

export const orderByDateDesc = (): OrderByDateDescAction => ({
  type: ORDER_BY_DATE,
  direction: ORDER_DIRECTION_DESCENDING,
});

type SetSearchQueryAction = {
  type: "SET_SEARCH_QUERY";
  value: string;
};

export const setSearchQuery = (value: string): SetSearchQueryAction => ({
  type: SET_SEARCH_QUERY,
  value,
});

type SetBookmarksAction = {
  type: "SET_BOOKMARKS";
  bookmarks: ChromeBookmark[];
};

export const setBookmarks = (
  bookmarks: ChromeBookmark[],
): SetBookmarksAction => ({
  type: SET_BOOKMARKS,
  bookmarks,
});

type SetTargetBookmarkAction = {
  type: "SET_TARGET_BOOKMARK";
  bookmark: ChromeBookmark;
};

export const setTargetBookmark = (
  bookmark: ChromeBookmark,
): SetTargetBookmarkAction => ({
  type: SET_TARGET_BOOKMARK,
  bookmark,
});

export type SortType = "ORDER_BY_DATE" | "ORDER_BY_NAME";
export type SortDirection =
  | "ORDER_DIRECTION_ASCENDING"
  | "ORDER_DIRECTION_DESCENDING";

export type SortOrder = {
  type: SortType;
  direction: SortDirection;
};

function getSortOrder(): SortOrder {
  function getType(): SortType {
    const type = localStorage.getItem(bookmarksSortType);

    switch (type) {
      case ORDER_BY_DATE:
        return ORDER_BY_DATE;
      case ORDER_BY_NAME:
        return ORDER_BY_NAME;
      default:
        return ORDER_BY_DATE;
    }
  }

  function getDirection(): SortDirection {
    const direction = localStorage.getItem(bookmarksSortDirection);

    switch (direction) {
      case ORDER_DIRECTION_ASCENDING:
        return ORDER_DIRECTION_ASCENDING;
      case ORDER_DIRECTION_DESCENDING:
        return ORDER_DIRECTION_DESCENDING;
      default:
        return ORDER_DIRECTION_DESCENDING;
    }
  }

  return {
    type: getType(),
    direction: getDirection(),
  };
}

const initialState: InitialState = {
  bookmarksPanelShow: false,
  bookmarks: [],
  searchQuery: "",
  sortOrder: getSortOrder(),
  targetBookmark: {
    parentId: "",
    title: "",
    url: "",
    id: "",
    dateAdded: Date.now(),
  },
  bookmarkMenu: {
    isActive: false,
    x: 0,
    y: 0,
    containerHeight: 0,
    containerTop: 0,
  },
  bookmarkEditorShow: false,
};

type Action =
  | ToggleBookmarksPanelAction
  | ToggleBookmarksEditorAction
  | ToggleBookmarksMenuAction
  | OrderByNameAscAction
  | OrderByNameDescAction
  | OrderByDateAscAction
  | OrderByDateDescAction
  | SetSearchQueryAction
  | SetBookmarksAction
  | SetTargetBookmarkAction;

export function bookmarksApp(
  state: InitialState = initialState,
  action: Action,
) {
  switch (action.type) {
    case TOGGLE_BOOKMARKS_PANEL: {
      return {
        ...state,
        bookmarksPanelShow: action.isActive,
      };
    }

    case TOGGLE_BOOKMARK_EDITOR: {
      return {
        ...state,
        bookmarkEditorShow: action.isActive,
      };
    }

    case ORDER_BY_NAME: {
      localStorage.setItem(bookmarksSortType, ORDER_BY_NAME);
      localStorage.setItem(bookmarksSortDirection, action.direction);

      return {
        ...state,
        sortOrder: {
          type: ORDER_BY_NAME,
          direction: action.direction,
        },
      };
    }

    case ORDER_BY_DATE: {
      localStorage.setItem(bookmarksSortType, ORDER_BY_DATE);
      localStorage.setItem(bookmarksSortDirection, action.direction);

      return {
        ...state,
        sortOrder: {
          type: ORDER_BY_DATE,
          direction: action.direction,
        },
      };
    }

    case SET_SEARCH_QUERY: {
      return {
        ...state,
        searchQuery: action.value,
      };
    }

    case SET_BOOKMARKS: {
      return {
        ...state,
        bookmarks: action.bookmarks,
      };
    }

    case SET_TARGET_BOOKMARK: {
      return {
        ...state,
        targetBookmark: action.bookmark,
      };
    }

    case TOGGLE_BOOKMARK_MENU: {
      return {
        ...state,
        bookmarkMenu: {
          isActive: action.isActive,
          ...action.position,
        },
      };
    }

    default:
      return state;
  }
}
