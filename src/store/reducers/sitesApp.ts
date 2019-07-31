import { sites } from "../demo/sites";

export const ADD_SITE = "ADD_SITE";
export const REMOVE_SITE = "REMOVE_SITE";
export const UPDATE_SITE = "UPDATE_SITE";

export interface SitesAppInitialState {
  sites: Site[];
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

interface UpdateSiteAction {
  type: "UPDATE_SITE";
  index: number;
  site: Site;
}

type SitesAppAction = AddSiteAction | RemoveSiteAction | UpdateSiteAction;

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

export const updateSite = (index: number, site: Site): UpdateSiteAction => {
  return {
    type: UPDATE_SITE,
    index,
    site,
  };
};

const initialState: SitesAppInitialState = {
  sites: [],
};

try {
  const json = localStorage.getItem("webSites");

  if (json) {
    initialState.sites = JSON.parse(json);
  } else {
    initialState.sites = sites;
  }
} catch {
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

    case UPDATE_SITE: {
      let sites = [...state.sites];

      if (sites[action.index]) {
        sites[action.index] = action.site;
      }

      localStorage.setItem("webSites", JSON.stringify(sites));

      return Object.assign({}, state, {
        sites,
      });
    }

    default:
      return state;
  }
}
