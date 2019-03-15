interface Chrome {
  bookmarks: ChromeBookmarks;
}

interface ChromeBookmarkPartial {
  title?: string;
  url?: string;
}

interface ChromeBookmarks {
  onCreated: ChromeBookmarksEvent;
  onRemoved: ChromeBookmarksEvent;
  onChanged: ChromeBookmarksEvent;
  create: (bookmark: ChromeBookmark) => void;
  remove: (id: string) => void;
  update: (id: string, changes: ChromeBookmarkPartial) => void;
  getTree: (callback: Function) => void;
}

export interface ChromeBookmark {
  parentId: string;
  title: string;
  url: string;
  id: string;
  dateAdded: number;
  children?: ChromeBookmark[];
}

interface ChromeBookmarksEvent {
  addListener(callback: () => Promise<void>): void;
}

interface Storage {
  setItem(key: string, value: string): void;
  getItem(key: string): string;
}

declare var chrome: Chrome;
declare var localStorage: Storage;

export class Bookmarks {
  _onCreatedCallbacks: Function[];
  _onRemovedCallbacks: Function[];
  _onChangedCallbacks: Function[];

  constructor() {
    this._onCreatedCallbacks = [];
    this._onRemovedCallbacks = [];
    this._onChangedCallbacks = [];

    if (this._hasAccess()) {
      chrome.bookmarks.onCreated.addListener(async () => {
        await this._onCreated();
      });

      chrome.bookmarks.onRemoved.addListener(async () => {
        await this._onRemoved();
      });

      chrome.bookmarks.onChanged.addListener(async () => {
        await this._onChanged();
      });
    }
  }

  _hasAccess() {
    return chrome !== undefined && chrome.bookmarks !== undefined;
  }

  _updateLocalStorage(bookmarks: ChromeBookmark[]) {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  _parserBookmarksThree(tree: ChromeBookmark[]): ChromeBookmark[] {
    const bookmarks: ChromeBookmark[] = [];

    function parse(nodeList: ChromeBookmark[]) {
      nodeList.forEach((node: ChromeBookmark) => {
        if (node.children !== undefined) {
          parse(node.children);
        } else {
          bookmarks.push(node);
        }
      });
    }

    parse(tree);

    return bookmarks;
  }

  _getDeletedBookmarks() {
    const json = localStorage.getItem("deletedBookmarks");

    if (typeof json === "string") {
      try {
        const bookmarks = JSON.parse(json);
        return bookmarks;
      } catch {
        return [];
      }
    } else {
      return [];
    }
  }

  _setDeletedBookmarks(bookmarks: ChromeBookmark[]) {
    localStorage.setItem("deletedBookmarks", JSON.stringify(bookmarks));
  }

  _pushDeletedBookmark({ title, url }: { title: string; url: string }) {
    const bookmarks = this._getDeletedBookmarks();

    bookmarks.unshift({
      title,
      url,
    });

    this._setDeletedBookmarks(bookmarks);
  }

  _popDeletedBookmark() {
    const bookmarks = this._getDeletedBookmarks();

    const bookmark = bookmarks.shift();

    this._setDeletedBookmarks(bookmarks);

    return bookmark;
  }

  async _onCreated() {
    this._updateLocalStorage(await this.get());

    this._onCreatedCallbacks.forEach(callback => {
      callback();
    });
  }

  async _onRemoved() {
    this._updateLocalStorage(await this.get());

    this._onRemovedCallbacks.forEach(callback => {
      callback();
    });
  }

  async _onChanged() {
    this._updateLocalStorage(await this.get());

    this._onChangedCallbacks.forEach(callback => {
      callback();
    });
  }

  async restore() {
    let bookmark = this._popDeletedBookmark();

    if (bookmark) {
      await this.add(bookmark.title, bookmark.url);
    }
  }

  async add(title: string, url: string, parentId: string = "1") {
    const bookmark = {
      parentId: parentId,
      title: title,
      url: url,
      id: "",
      dateAdded: Date.now(),
    };

    if (this._hasAccess()) {
      chrome.bookmarks.create(bookmark);
    } else {
      const bookmarks = await this.get();

      bookmarks.push({
        ...bookmark,
        dateAdded: Date.now(),
      });

      this._updateLocalStorage(bookmarks);

      await this._onCreated();
    }
  }

  async remove(bookmark: ChromeBookmark) {
    if (this._hasAccess()) {
      chrome.bookmarks.remove(bookmark.id);
    } else {
      const bookmarks = await this.get();

      this._updateLocalStorage(
        bookmarks.filter(b => {
          return b.dateAdded !== bookmark.dateAdded;
        }),
      );

      await this._onRemoved();
    }

    this._pushDeletedBookmark(bookmark);
  }

  async update(bookmark: ChromeBookmark) {
    if (this._hasAccess()) {
      chrome.bookmarks.update(bookmark.id, {
        title: bookmark.title,
        url: bookmark.url,
      });
    } else {
      const bookmarks = await this.get();

      this._updateLocalStorage(
        bookmarks.map(b => {
          if (bookmark.id === b.id) {
            return bookmark;
          }

          return b;
        }),
      );

      await this._onChanged();
    }
  }

  async get(): Promise<ChromeBookmark[]> {
    return new Promise(resolve => {
      if (this._hasAccess()) {
        chrome.bookmarks.getTree((tree: ChromeBookmark[]) => {
          const bookmarks = this._parserBookmarksThree(tree);
          this._updateLocalStorage(bookmarks);
          resolve(bookmarks);
        });
      } else {
        const json = localStorage.getItem("bookmarks");

        if (typeof json === "string") {
          try {
            const bookmarks = JSON.parse(json);

            resolve(bookmarks);
          } catch {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      }
    });
  }

  onCreated(callback: () => void) {
    this._onCreatedCallbacks.push(callback);
  }

  onRemoved(callback: () => void) {
    this._onRemovedCallbacks.push(callback);
  }

  onChanged(callback: () => void) {
    this._onChangedCallbacks.push(callback);
  }
}
