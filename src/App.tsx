import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import "./scss/App.scss";
import VoiceSearch from "./components/VoiceSearch/VoiceSearch";
import MenuBar from "./components/options/MenuBar";
import Sites from "./components/sites/Sites";
import Background from "./components/background/Background";
import AddSiteForm from "./components/sites/AddSiteForm";
import Weather from "./components/Weather/Weather";
import OptionsPanel from "./components/options/options-panel/OptionsPanel";
import Currency from "./components/currency/Currency";
import Bookmarks from "./components/bookmarks";
import {
  toggleOptionsPanel,
  OptionsAppInitialState,
} from "./store/reducers/optionsApp";

interface OptionsAppState {
  optionsApp: OptionsAppInitialState;
}

interface AppStateProps {
  optionsPanelShow: boolean;
}

interface AppDispatchProps {
  toggleOptionsPanel: (isActive: boolean) => void;
}

type Props = AppStateProps & AppDispatchProps;

class App extends Component<Props> {
  closeOptionsPanel = () => {};

  render() {
    return (
      <div className="App">
        <Background />
        <div className="main-layout">
          <div className="sidebar-left">
            <Currency />
          </div>
          <div className="main-container">
            <VoiceSearch />
            <Sites />
          </div>
          <div className="sidebar-right" />
        </div>
        <MenuBar />
        <AddSiteForm />
        <Weather />
        <Bookmarks />
        <OptionsPanel
          show={this.props.optionsPanelShow}
          onClose={() => this.props.toggleOptionsPanel(false)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: OptionsAppState): AppStateProps => {
  return {
    optionsPanelShow: state.optionsApp.optionsPanelShow,
  };
};

const mapDispatchProps = (dispatch: Dispatch): AppDispatchProps => {
  return {
    toggleOptionsPanel: (isActive: boolean) => {
      dispatch(toggleOptionsPanel(isActive));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(App);
