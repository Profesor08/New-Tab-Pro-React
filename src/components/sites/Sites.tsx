import React, { Component } from "react";
import ReactDOM from "react-dom";
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

function constrain(n: number, low: number, high: number): number {
  return Math.max(Math.min(n, high), low);
}

function map(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
  withinBounds?: boolean,
): number {
  let newValue =
    ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newValue;
  }
  if (start2 < stop2) {
    return constrain(newValue, start2, stop2);
  } else {
    return constrain(newValue, stop2, start2);
  }
}

interface SitesDispatchProps {
  removeSite: (index: number) => void;
}

interface SitesStateProps {
  sites: Site[];
  additionalOptions: boolean;
  showWebSites: boolean;
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

  componentDidMount = () => {
    const component = ReactDOM.findDOMNode(this);

    if (component instanceof HTMLElement) {
      const container = component.querySelector(".sites-grid");

      if (container instanceof HTMLElement) {
        let isActivated = false;

        const pos = {
          mx: container.offsetWidth / 2,
          my: container.offsetHeight / 2,
          x: container.offsetWidth / 2,
          y: container.offsetHeight / 2,
          rx: 0,
          ry: 0,
        };

        container.addEventListener("mousemove", e => {
          const rect = container.getBoundingClientRect();
          pos.mx = e.clientX - rect.left;
          pos.my = e.clientY - rect.top;
        });

        container.addEventListener("mouseleave", e => {
          pos.mx = container.offsetWidth / 2;
          pos.my = container.offsetHeight / 2;
        });

        container.addEventListener("mouseenter", e => {
          if (isActivated === false) {
            isActivated = true;
            pos.mx = container.offsetWidth / 2;
            pos.my = container.offsetHeight / 2;
            pos.x = pos.mx;
            pos.y = pos.my;
            animate();
          }
        });

        let lastTime = Date.now();
        const speed = 3.0;

        const animate = () => {
          requestAnimationFrame(animate);

          const now = Date.now();
          const dt = now - lastTime;
          lastTime = now;

          let ease_t = (dt / 1000) * speed;

          if (ease_t > 1) {
            ease_t = 1;
          }

          pos.x += (pos.mx - pos.x) * ease_t;
          pos.y += (pos.my - pos.y) * ease_t;

          let halfW = container.offsetWidth / 2;
          let halfH = container.offsetHeight / 2;

          let rotateY = parseFloat(
            map(Math.abs(pos.x - halfW), 0, halfW, 0, 5).toFixed(5),
          );

          let rotateX = parseFloat(
            map(Math.abs(pos.y - halfH), 0, halfH, 0, 5).toFixed(5),
          );

          if (pos.x - halfW < 0) {
            rotateY *= -1;
          }

          if (pos.y - halfH > 0) {
            rotateX *= -1;
          }

          container.style.transform = `perspective(900px) rotateX(${-rotateX}deg) rotateY(${-rotateY}deg) translate3d(0, 0, 0)`;
        };
      }
    }
  };

  render() {
    if (this.props.showWebSites === false) {
      return null;
    }

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
    showWebSites: state.optionsApp.showWebSites,
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
