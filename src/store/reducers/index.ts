import { combineReducers } from "redux";
import { sitesApp } from "./sitesApp";
import { addSiteForm } from "./addSiteFormApp";
import { optionsApp } from "./optionsApp";
import { bookmarksApp } from "./bookmarksApp";

export default combineReducers({
  sitesApp,
  addSiteForm,
  optionsApp,
  bookmarksApp,
} as any);
