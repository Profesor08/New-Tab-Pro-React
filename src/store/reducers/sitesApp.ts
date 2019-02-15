import { sites } from "../demo/sites";

export const ADD_SITE = "ADD_SITE";
export const REMOVE_SITE = "REMOVE_SITE";
export const TOGGLE_SITES = "TOGGLE_SITES";

export interface SitesAppInitialState {
  sites: Site[];
  isActive: boolean;
}

export interface Site {
  name: string;
  url: string;
  image: string;
}

interface AddSiteAction {
  type: "ADD_SITE";
  site: Site;
}

interface RemoveSiteAction {
  type: "REMOVE_SITE";
  index: number;
}

interface ToggleSitesAction {
  type: "TOGGLE_SITES";
  isActive: boolean;
}

type SitesAppAction = AddSiteAction | RemoveSiteAction | ToggleSitesAction;

export const addSite = (site: Site): AddSiteAction => {
  return {
    type: ADD_SITE,
    site,
  };
};

export const removeSite = (index: number): RemoveSiteAction => {
  return {
    type: REMOVE_SITE,
    index,
  };
};

export const toggleSites = (isActive: boolean): ToggleSitesAction => {
  return {
    type: TOGGLE_SITES,
    isActive,
  };
};

const initialState: SitesAppInitialState = {
  sites: [],
  isActive: true,
};

try {
  const json = localStorage.getItem("webSites");

  if (json) {
    initialState.sites = JSON.parse(json);
  } else {
    initialState.sites = sites;
  }
} catch (err) {
  initialState.sites = sites;
}

export function sitesApp(
  state: SitesAppInitialState = initialState,
  action: SitesAppAction,
) {
  switch (action.type) {
    case ADD_SITE: {
      const sites = [...state.sites, action.site];

      localStorage.setItem("webSites", JSON.stringify(sites));

      return Object.assign({}, state, {
        sites,
      });
    }

    case REMOVE_SITE: {
      let sites = [...state.sites];

      sites.splice(action.index, 1);

      localStorage.setItem("webSites", JSON.stringify(sites));

      return Object.assign({}, state, {
        sites,
      });
    }

    default:
      return state;
  }
}
