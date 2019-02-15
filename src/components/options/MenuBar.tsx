import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import style from "./options.module.scss";
import MenuBarButton from "./MenuBarButton";
import {
  toggleOptionsPanel,
  OptionsAppInitialState,
} from "../../store/reducers/optionsApp";
import { toggleBookmarksPanel } from "../../store/reducers/bookmarksApp";

interface MenuBarStateProps {
  optionsPanelShow: boolean;
}

interface MenuBarDispatchProps {
  openOptionsPanel: () => void;
  openBookmarksPanel: () => void;
}

interface MenuBarState {
  optionsApp: OptionsAppInitialState;
}

type Props = MenuBarStateProps & MenuBarDispatchProps;

class MenuBar extends Component<Props> {
  render() {
    return (
      <div className={style["options-bar"]}>
        <MenuBarButton
          onClick={this.props.openOptionsPanel}
          iconStyle={{ transform: "scale(1.3, 1)" }}
        >
          ☰
        </MenuBarButton>
        <MenuBarButton
          onClick={this.props.openBookmarksPanel}
          iconStyle={{ fontSize: "1.37rem" }}
        >
          ★
        </MenuBarButton>
      </div>
    );
  }
}

const mapStateToProps = (state: MenuBarState): MenuBarStateProps => {
  return {
    optionsPanelShow: state.optionsApp.optionsPanelShow,
  };
};

const mapDispatchProps = (dispatch: Dispatch) => {
  return {
    openOptionsPanel: () => {
      dispatch(toggleOptionsPanel(true));
    },

    openBookmarksPanel: () => {
      dispatch(toggleBookmarksPanel(true));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(MenuBar);
