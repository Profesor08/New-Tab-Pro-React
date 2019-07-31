import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Site, SitesAppInitialState } from "../../store/reducers/sitesApp";
import { Form, ButtonsList, ButtonsListItem } from "../../lib/form";

interface SitePartialData {
  name?: string;
  url?: string;
  image?: string;
}

interface EditSiteDispatchProps {}

interface EditSiteStateProps {
  site: Site | null;
  submit: (site: Site) => void;
  close: () => void;
}

type Props = EditSiteDispatchProps & EditSiteStateProps;

interface State {
  site: Site;
}

class EditSite extends Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);

    this.state = {
      site: {
        name: "",
        url: "",
        image: "",
      },
    };
  }

  saveData = (data: SitePartialData) => {
    this.setState({
      site: {
        ...this.state.site,
        ...data,
      },
    });
  };

  componentWillReceiveProps = (newProps: Props) => {
    if (newProps.site === null) {
      this.setState({
        site: {
          name: "",
          url: "",
          image: "",
        },
      });
    } else {
      this.setState({
        site: newProps.site,
      });
    }
  };

  render() {
    const title = "Edit Site";

    const buttons: ButtonsListItem[] = [
      {
        text: "Update",
        type: "btn-success",
        onClick: event => {
          event.preventDefault();

          this.props.submit({
            ...this.state.site,
          });
        },
      },
      {
        text: "Undo",
        type: "btn-warning",
        onClick: event => {
          event.preventDefault();

          if (this.props.site) {
            this.setState({
              site: this.props.site,
            });
          }
        },
      },
    ];

    const buttonsList = <ButtonsList buttons={buttons} />;

    const onSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();
    };

    const content = (
      <div>
        <input
          type="text"
          placeholder="Site name"
          value={this.state.site.name}
          onChange={e => {
            this.saveData({
              name: e.target.value,
            });
          }}
          required
        />
        <input
          type="text"
          placeholder="Site url"
          value={this.state.site.url}
          onChange={e => {
            this.saveData({
              url: e.target.value,
            });
          }}
          required
        />
        <input
          type="text"
          placeholder="Image url or data:base64"
          value={this.state.site.image}
          onChange={e => {
            this.saveData({
              image: e.target.value,
            });
          }}
          required
        />
      </div>
    );

    const closeAction = () => {
      this.props.close();
    };

    return (
      <Form
        title={title}
        buttons={buttonsList}
        content={content}
        closeAction={closeAction}
        onSubmit={onSubmit}
        show={this.props.site !== null}
      />
    );
  }
}

export default EditSite;
