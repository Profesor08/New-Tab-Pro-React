import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import "./options-panel.scss";
import OptionsPanelButton from "./OptionsPanelButton";
import {
  toggleAdditionalOptions,
  toggleBackgroundStarSpace,
  OptionsAppInitialState,
} from "../../../store/reducers/optionsApp";

interface OprionsPanelDispatchProps {
  toggleAdditionalOptions: (isActive: boolean) => void;
  toggleBackgroundStarSpace: (isActive: boolean) => void;
}

interface OptionsPanelState {
  optionsApp: OptionsAppInitialState;
}

interface OptionsPanelStateProps {
  additionalOptions: boolean;
  backgroundStarSpace: boolean;
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
          <div className="close-button" onClick={this.props.onClose}>
            ×
          </div>
          <div className="options-buttons">
            <OptionsPanelButton
              active={this.props.backgroundStarSpace}
              onChange={() =>
                this.props.toggleBackgroundStarSpace(
                  !this.props.backgroundStarSpace,
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

const mapStateToProps = (state: OptionsPanelState): OptionsPanelStateProps => {
  return {
    additionalOptions: state.optionsApp.additionalOptions,
    backgroundStarSpace: state.optionsApp.backgroundStarSpace,
  };
};

const mapDispatchProps = (dispatch: Dispatch) => {
  return {
    toggleAdditionalOptions: (isActive: boolean) => {
      dispatch(toggleAdditionalOptions(isActive));
    },

    toggleBackgroundStarSpace: (isActive: boolean) => {
      dispatch(toggleBackgroundStarSpace(isActive));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(OptionsPanel);
