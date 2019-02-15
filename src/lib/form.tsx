import React, { Component } from "react";

export interface CloseButtonProps {
  onClick?: (event: React.SyntheticEvent) => void;
}

export class CloseButton extends Component<CloseButtonProps> {
  render() {
    return (
      <div className="form-close" onClick={this.props.onClick}>
        <svg
          className="close-image"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 174.239 174.239"
        >
          <path
            d="M146.537,1.047c-1.396-1.396-3.681-1.396-5.077,0L89.658,52.849c-1.396,1.396-3.681,1.396-5.077,0L32.78,1.047
      c-1.396-1.396-3.681-1.396-5.077,0L1.047,27.702c-1.396,1.396-1.396,3.681,0,5.077l51.802,51.802c1.396,1.396,1.396,3.681,0,5.077
      L1.047,141.46c-1.396,1.396-1.396,3.681,0,5.077l26.655,26.655c1.396,1.396,3.681,1.396,5.077,0l51.802-51.802
      c1.396-1.396,3.681-1.396,5.077,0l51.801,51.801c1.396,1.396,3.681,1.396,5.077,0l26.655-26.655c1.396-1.396,1.396-3.681,0-5.077
      l-51.801-51.801c-1.396-1.396-1.396-3.681,0-5.077l51.801-51.801c1.396-1.396,1.396-3.681,0-5.077L146.537,1.047z"
          />
        </svg>
      </div>
    );
  }
}

export interface ButtonProps {
  key?: number;
  children?: React.ReactNode;
  type?: string;
  onClick?: (event: React.SyntheticEvent) => void;
}

export class Button extends Component<ButtonProps> {
  render() {
    let className = "btn";

    if (this.props.type) {
      className += " " + this.props.type;
    } else {
      className += " btn-default";
    }

    return (
      <button onClick={this.props.onClick} className={className}>
        {this.props.children}
      </button>
    );
  }
}

export interface ButtonsListItem {
  text?: React.ReactNode;
  type?: string;
  onClick?: (event: React.SyntheticEvent) => void;
}

export interface ButtonsListProps {
  buttons?: ButtonsListItem[];
}

export class ButtonsList extends Component<ButtonsListProps> {
  render() {
    if (this.props.buttons) {
      return this.props.buttons.map(
        (button: ButtonsListItem, index: number) => {
          return (
            <Button key={index} onClick={button.onClick} type={button.type}>
              {button.text}
            </Button>
          );
        },
      );
    } else {
      return null;
    }
  }
}

export interface FormProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  show?: boolean;
  closeAction?: (event: React.SyntheticEvent) => void;
  onSubmit?: (event: React.SyntheticEvent) => void;
  buttons?: JSX.Element;
}

export class Form extends Component<FormProps> {
  render() {
    let formContainer = "form-container";

    if (this.props.show) {
      formContainer += " is-active";
    }

    return (
      <div className={formContainer}>
        <div className="form-backdrop" onClick={this.props.closeAction} />
        <form className="form" onSubmit={this.props.onSubmit}>
          <CloseButton onClick={this.props.closeAction} />
          <div className="form-header">{this.props.title}</div>
          <div className="form-body">{this.props.content}</div>
          <div className="form-footer">{this.props.buttons}</div>
        </form>
      </div>
    );
  }
}
