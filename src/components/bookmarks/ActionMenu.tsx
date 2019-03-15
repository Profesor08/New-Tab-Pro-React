import React, { Component, ReactNode } from "react";
import "./action-menu.scss";

interface ActionMenuProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export class ActionMenu extends Component<ActionMenuProps> {
  render() {
    let { children, className, style } = this.props;

    if (className) {
      className = "action-menu " + className;
    } else {
      className = "action-menu";
    }

    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
}

type ActionButtonProps = {
  children?: ReactNode;
  isActive?: boolean;
  style?: React.CSSProperties;
  disabled?: any;
  onClick?: () => void;
};

export class ActionButton extends Component<ActionButtonProps> {
  render() {
    let { children, isActive, onClick, style, disabled } = this.props;

    let className = "action-button";

    if (isActive) {
      className += " is-active";
    }

    if (disabled !== undefined) {
      className += " is-disabled";
    }

    return (
      <div className={className} onClick={onClick} style={style}>
        {children}
      </div>
    );
  }
}

export const ActionSeparator = () => <div className="action-separator" />;
