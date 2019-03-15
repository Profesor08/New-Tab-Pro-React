const TOGGLE_OPTIONS_PANEL = "TOGGLE_OPTIONS_PANEL";
const TOGGLE_ADDITIONAL_OPTIONS = "TOGGLE_ADDITIONAL_OPTIONS";
const TOGGLE_BACKGROUND_STAR_SPACE_ANIMATION =
  "TOGGLE_BACKGROUND_STAR_SPACE_ANIMATION";
const TOGGLE_WEATHER_WIDGET = "TOGGLE_WEATHER_WIDGET";
const TOGGLE_CURRENCY_WIDGET = "TOGGLE_CURRENCY_WIDGET";
const TOGGLE_WEB_SITES = "TOGGLE_WEB_SITES";

type ToggleAdditionalOptionsAction = {
  type: "TOGGLE_ADDITIONAL_OPTIONS";
  isActive: boolean;
};

type ToggleBackgroundStarSpaceAnimationAction = {
  type: "TOGGLE_BACKGROUND_STAR_SPACE_ANIMATION";
  isActive: boolean;
};

type ToggleOptionsPanelAction = {
  type: "TOGGLE_OPTIONS_PANEL";
  isActive: boolean;
};

type ToggleWeatherWidgetAction = {
  type: "TOGGLE_WEATHER_WIDGET";
  isActive: boolean;
};

type ToggleCurrencyWidgetAction = {
  type: "TOGGLE_CURRENCY_WIDGET";
  isActive: boolean;
};

type ToggleWebSitesAction = {
  type: "TOGGLE_WEB_SITES";
  isActive: boolean;
};

type OptionsAppAction =
  | ToggleAdditionalOptionsAction
  | ToggleBackgroundStarSpaceAnimationAction
  | ToggleWeatherWidgetAction
  | ToggleCurrencyWidgetAction
  | ToggleWebSitesAction
  | ToggleOptionsPanelAction;

export const toggleAdditionalOptions = (
  isActive: boolean,
): ToggleAdditionalOptionsAction => {
  return {
    type: TOGGLE_ADDITIONAL_OPTIONS,
    isActive,
  };
};

export const toggleBackgroundStarSpace = (
  isActive: boolean,
): ToggleBackgroundStarSpaceAnimationAction => {
  return {
    type: TOGGLE_BACKGROUND_STAR_SPACE_ANIMATION,
    isActive,
  };
};

export const toggleOptionsPanel = (
  isActive: boolean,
): ToggleOptionsPanelAction => {
  return {
    type: TOGGLE_OPTIONS_PANEL,
    isActive,
  };
};

export const toggleWeatherWidget = (
  isActive: boolean,
): ToggleWeatherWidgetAction => {
  return {
    type: TOGGLE_WEATHER_WIDGET,
    isActive,
  };
};

export const toggleCurrencyWidget = (
  isActive: boolean,
): ToggleCurrencyWidgetAction => {
  return {
    type: TOGGLE_CURRENCY_WIDGET,
    isActive,
  };
};

export const toggleWebSites = (isActive: boolean): ToggleWebSitesAction => {
  return {
    type: TOGGLE_WEB_SITES,
    isActive,
  };
};

export interface OptionsAppInitialState {
  additionalOptions: boolean;
  optionsPanelShow: boolean;
  backgroundStarSpaceAnimation: boolean;
  showWeatherWidget: boolean;
  showCurrencyWidget: boolean;
  showWebSites: boolean;
  [key: string]: boolean;
}

function save(options: OptionsAppInitialState): void {
  try {
    localStorage.setItem("options", JSON.stringify(options));
  } catch (err) {
    console.warn(err);
  }
}

function load(): OptionsAppInitialState {
  const state = initialState;

  try {
    const json = localStorage.getItem("options");

    if (json) {
      const options = JSON.parse(json);

      if (options) {
        for (const prop in state) {
          if (
            state.hasOwnProperty(prop) &&
            typeof options[prop] === "boolean"
          ) {
            state[prop] = options[prop];
          }
        }
      }
    }
  } catch (err) {
    console.warn(err);
  }

  return state;
}

const initialState: OptionsAppInitialState = {
  additionalOptions: false,
  optionsPanelShow: false,
  backgroundStarSpaceAnimation: true,
  showWeatherWidget: true,
  showCurrencyWidget: true,
  showWebSites: true,
};

export function optionsApp(
  state: OptionsAppInitialState = load(),
  action: OptionsAppAction,
) {
  const newState: OptionsAppInitialState = {
    ...state,
  };

  switch (action.type) {
    case TOGGLE_ADDITIONAL_OPTIONS: {
      newState.additionalOptions = action.isActive;
      break;
    }

    case TOGGLE_BACKGROUND_STAR_SPACE_ANIMATION: {
      newState.backgroundStarSpaceAnimation = action.isActive;
      break;
    }

    case TOGGLE_OPTIONS_PANEL: {
      newState.optionsPanelShow = action.isActive;
      break;
    }

    case TOGGLE_WEATHER_WIDGET: {
      newState.showWeatherWidget = action.isActive;
      break;
    }

    case TOGGLE_CURRENCY_WIDGET: {
      newState.showCurrencyWidget = action.isActive;
      break;
    }

    case TOGGLE_WEB_SITES: {
      newState.showWebSites = action.isActive;
      break;
    }

    default:
      return state;
  }

  save(newState);

  return newState;
}
