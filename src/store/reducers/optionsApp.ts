const TOGGLE_OPTIONS_PANEL = "TOGGLE_OPTIONS_PANEL";
const TOGGLE_ADDITIONAL_OPTIONS = "TOGGLE_ADDITIONAL_OPTIONS";
const TOGGLE_BACKGROUND_STAR_SPACE = "TOGGLE_BACKGROUND_STAR_SPACE";

type ToggleAdditionalOptionsAction = {
  type: "TOGGLE_ADDITIONAL_OPTIONS";
  isActive: boolean;
};

type ToggleBackgroundStarSpaceAction = {
  type: "TOGGLE_BACKGROUND_STAR_SPACE";
  isActive: boolean;
};

type ToggleOptionsPanelAction = {
  type: "TOGGLE_OPTIONS_PANEL";
  isActive: boolean;
};

type OptionsAppAction =
  | ToggleAdditionalOptionsAction
  | ToggleBackgroundStarSpaceAction
  | ToggleOptionsPanelAction;

export interface OptionsAppInitialState {
  additionalOptions: boolean;
  optionsPanelShow: boolean;
  backgroundStarSpace: boolean;
}

export const toggleAdditionalOptions = (isActive: boolean) => {
  return {
    type: TOGGLE_ADDITIONAL_OPTIONS,
    isActive,
  };
};

export const toggleBackgroundStarSpace = (isActive: boolean) => {
  return {
    type: TOGGLE_BACKGROUND_STAR_SPACE,
    isActive,
  };
};

export const toggleOptionsPanel = (isActive: boolean) => {
  return {
    type: TOGGLE_OPTIONS_PANEL,
    isActive,
  };
};

const initialState: OptionsAppInitialState = {
  additionalOptions: false,
  optionsPanelShow: false,
  backgroundStarSpace: true,
};

export function optionsApp(
  state: OptionsAppInitialState = initialState,
  action: OptionsAppAction,
) {
  switch (action.type) {
    case TOGGLE_ADDITIONAL_OPTIONS: {
      return {
        ...state,
        additionalOptions: action.isActive,
      };
    }

    case TOGGLE_BACKGROUND_STAR_SPACE: {
      return {
        ...state,
        backgroundStarSpace: action.isActive,
      };
    }

    case TOGGLE_OPTIONS_PANEL: {
      return {
        ...state,
        optionsPanelShow: action.isActive,
      };
    }

    default:
      return state;
  }
}
