import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import "./options-panel.scss";
import OptionsPanelButton from "./OptionsPanelButton";
import {
  toggleAdditionalOptions,
  toggleBackgroundStarSpace,
  toggleWeatherWidget,
  toggleCurrencyWidget,
  toggleWebSites,
  OptionsAppInitialState,
} from "../../../store/reducers/optionsApp";

interface OprionsPanelDispatchProps {
  toggleAdditionalOptions: (isActive: boolean) => void;
  toggleBackgroundStarSpace: (isActive: boolean) => void;
  toggleWebSites: (isActive: boolean) => void;
  toggleWeatherWidget: (isActive: boolean) => void;
  toggleCurrencyWidget: (isActive: boolean) => void;
}

interface OptionsPanelStateProps {
  additionalOptions: boolean;
  backgroundStarSpaceAnimation: boolean;
  showWebSites: boolean;
  showWeatherWidget: boolean;
  showCurrencyWidget: boolean;
}

interface OptionsPanelProps {
  show: boolean;
  onClose?: () => void;
}

type Props = OprionsPanelDispatchProps &
  OptionsPanelStateProps &
  OptionsPanelProps;

class OptionsPanel extends Component<Props, OptionsPanelStateProps> {
  render() {
    let className = "options-panel-wrapper";

    if (this.props.show) {
      className += " is-active";
    }

    return (
      <div className={className}>
        <div className="options-back" onClick={this.props.onClose} />
        <div className="options-panel">
          <div className="options-close-button" onClick={this.props.onClose}>
            ×
          </div>
          <div className="options-buttons">
            <OptionsPanelButton
              active={this.props.showWeatherWidget}
              onChange={() =>
                this.props.toggleWeatherWidget(!this.props.showWeatherWidget)
              }
            >
              Show weather
            </OptionsPanelButton>
            <OptionsPanelButton
              active={this.props.showCurrencyWidget}
              onChange={() =>
                this.props.toggleCurrencyWidget(!this.props.showCurrencyWidget)
              }
            >
              Show currency
            </OptionsPanelButton>
            <OptionsPanelButton
              active={this.props.showWebSites}
              onChange={() =>
                this.props.toggleWebSites(!this.props.showWebSites)
              }
            >
              Show sites
            </OptionsPanelButton>
            <OptionsPanelButton
              active={this.props.backgroundStarSpaceAnimation}
              onChange={() =>
                this.props.toggleBackgroundStarSpace(
                  !this.props.backgroundStarSpaceAnimation,
                )
              }
            >
              Background Star Space
            </OptionsPanelButton>
            <OptionsPanelButton
              active={this.props.additionalOptions}
              onChange={() =>
                this.props.toggleAdditionalOptions(
                  !this.props.additionalOptions,
                )
              }
            >
              Additional Options
            </OptionsPanelButton>
          </div>
        </div>
      </div>
    );
  }
}

interface OptionsPanelState {
  optionsApp: OptionsAppInitialState;
}

const mapStateToProps = (state: OptionsPanelState): OptionsPanelStateProps => {
  return {
    additionalOptions: state.optionsApp.additionalOptions,
    backgroundStarSpaceAnimation: state.optionsApp.backgroundStarSpaceAnimation,
    showWebSites: state.optionsApp.showWebSites,
    showWeatherWidget: state.optionsApp.showWeatherWidget,
    showCurrencyWidget: state.optionsApp.showCurrencyWidget,
  };
};

const mapDispatchProps = (dispatch: Dispatch): OprionsPanelDispatchProps => {
  return {
    toggleAdditionalOptions: (isActive: boolean): void => {
      dispatch(toggleAdditionalOptions(isActive));
    },

    toggleBackgroundStarSpace: (isActive: boolean): void => {
      dispatch(toggleBackgroundStarSpace(isActive));
    },

    toggleWebSites: (isActive: boolean): void => {
      dispatch(toggleWebSites(isActive));
    },

    toggleWeatherWidget: (isActive: boolean): void => {
      dispatch(toggleWeatherWidget(isActive));
    },

    toggleCurrencyWidget: (isActive: boolean): void => {
      dispatch(toggleCurrencyWidget(isActive));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(OptionsPanel);
