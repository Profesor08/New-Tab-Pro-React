export const TOGGLE_ADD_SITE_FORM = "TOGGLE_ADD_SITE_FORM";

export interface AddSiteFormState {
  show: boolean;
}

interface ToggleAddSiteForm {
  type: "TOGGLE_ADD_SITE_FORM";
  show: boolean;
}

type AddSiteFormAction = ToggleAddSiteForm;

const initialState: AddSiteFormState = {
  show: false,
};

export const toggleShow = (show: boolean): ToggleAddSiteForm => {
  return {
    type: TOGGLE_ADD_SITE_FORM,
    show: show,
  };
};

export function addSiteForm(
  state: AddSiteFormState = initialState,
  action: AddSiteFormAction,
) {
  switch (action.type) {
    case TOGGLE_ADD_SITE_FORM:
      return Object.assign({}, state, {
        show: action.show,
      });
    default:
      return state;
  }
}
