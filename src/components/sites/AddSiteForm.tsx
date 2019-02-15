import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Form, ButtonsList, ButtonsListItem } from "../../lib/form";
import { toggleShow } from "../../store/reducers/addSiteFormApp";
import { addSite, Site } from "../../store/reducers/sitesApp";

interface AddSiteFormDispatchProps {
  addSite: (site: Site) => void;
  closeForm: () => void;
}

interface AddSiteFormStateProps {
  show: boolean;
}

interface AddSiteFormAppState {
  addSiteForm: AddSiteFormStateProps;
}

interface SitePartialData {
  name?: string;
  url?: string;
  image?: string;
}

type State = {
  show: boolean;
  site: Site;
};

type Props = AddSiteFormDispatchProps & AddSiteFormStateProps;

class AddSiteForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      show: false,

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

  clearForm = () => {
    this.setState({
      site: {
        name: "",
        url: "",
        image: "",
      },
    });
  };

  render() {
    const title = "Add Site";

    const buttons: ButtonsListItem[] = [
      {
        text: "Add",
        type: "btn-success",
      },
      {
        text: "Clear",
        type: "btn-warning",
        onClick: event => {
          event.preventDefault();
          this.clearForm();
        },
      },
    ];

    const buttonsList = <ButtonsList buttons={buttons} />;

    const onSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();
      this.props.addSite(this.state.site);
      this.props.closeForm();
      this.clearForm();
    };

    const content = (
      <div>
        <input
          type="text"
          placeholder="Site name"
          value={this.state.site.name}
          onChange={e =>
            this.saveData({
              name: e.target.value,
            })
          }
          required
        />
        <input
          type="text"
          placeholder="Site url"
          value={this.state.site.url}
          onChange={e =>
            this.saveData({
              url: e.target.value,
            })
          }
          required
        />
        <input
          type="text"
          placeholder="Image url or data:base64"
          value={this.state.site.image}
          onChange={e =>
            this.saveData({
              image: e.target.value,
            })
          }
          required
        />
      </div>
    );

    const closeAction = () => {
      this.clearForm();
      this.props.closeForm();
    };

    return (
      <Form
        title={title}
        buttons={buttonsList}
        content={content}
        closeAction={closeAction}
        onSubmit={onSubmit}
        show={this.props.show}
      />
    );
  }
}

const mapStateToProps = (state: AddSiteFormAppState): AddSiteFormStateProps => {
  return {
    show: state.addSiteForm.show,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): AddSiteFormDispatchProps => {
  return {
    addSite: (site: Site) => {
      dispatch(addSite(site));
    },

    closeForm: () => {
      dispatch(toggleShow(false));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddSiteForm);
