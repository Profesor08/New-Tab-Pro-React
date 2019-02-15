import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import "./sites.scss";
import { toggleShow } from "../../store/reducers/addSiteFormApp";

interface AddSiteButtonDispatchProps {
  openAddSiteForm: () => void;
}

type Props = AddSiteButtonDispatchProps;

class AddSiteButton extends Component<Props> {
  render() {
    return (
      <div
        className="site-button add-site-button"
        onClick={this.props.openAddSiteForm}
      >
        <svg
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 301 301"
        >
          <path d="M112.5.5h76c9,0,12,5,12,12v88h88c7.45,0,12,4.49,12,12v76c0,7.38-4.48,12-12,12h-88v88c0,8-5.5,12-16,12h-76c-7.62,0-8-5.75-8-12v-88h-88c-7.54,0-12-4-12-12v-76c0-7.73,5.23-12,12-12h88v-88C100.5,4.69,103.78.5,112.5.5Z" />
        </svg>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch): AddSiteButtonDispatchProps => {
  return {
    openAddSiteForm: () => {
      dispatch(toggleShow(true));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddSiteButton);
