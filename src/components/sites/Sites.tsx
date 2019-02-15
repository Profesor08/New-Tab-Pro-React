import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import "./sites.scss";
import {
  removeSite,
  Site,
  SitesAppInitialState,
} from "../../store/reducers/sitesApp";
import { OptionsAppInitialState } from "../../store/reducers/optionsApp";
import AddSiteButton from "./AddSiteButton";

interface SitesDispatchProps {
  removeSite: (index: number) => void;
}

interface SitesStateProps {
  sites: Site[];
  additionalOptions: boolean;
}

interface SitesAppState {
  sitesApp: SitesAppInitialState;
  optionsApp: OptionsAppInitialState;
}

type Props = SitesStateProps & SitesDispatchProps;

class Sites extends Component<Props> {
  getSitesList = () => {
    let removeButtonClassName = "remove-site";

    if (this.props.additionalOptions) {
      removeButtonClassName += " is-active";
    }

    return this.props.sites.map((site, index) => {
      return (
        <div key={index} className="site-button">
          <div className="name">{site.name}</div>
          <a className="link" href={site.url}>
            <div
              className="image"
              style={{ backgroundImage: `url(${site.image})` }}
            />
          </a>
          <div
            className={removeButtonClassName}
            onClick={e => this.props.removeSite(index)}
          >
            ×
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="sites-container">
        <div className="sites-grid">
          {this.getSitesList()}
          <AddSiteButton />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: SitesAppState): SitesStateProps => {
  return {
    sites: state.sitesApp.sites,
    additionalOptions: state.optionsApp.additionalOptions,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): SitesDispatchProps => {
  return {
    removeSite: (index: number) => {
      dispatch(removeSite(index));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sites);
