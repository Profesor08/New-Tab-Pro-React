import React, { Component } from "react";
import "./icon-button.scss";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  onBlur?: () => void;
  className?: string;
}

export class IconButton extends Component<IconButtonProps> {
  render() {
    let buttonClass: string = "icon-button";
    let { children, onClick, onBlur, className } = this.props;

    if (className) {
      buttonClass += " " + className;
    }

    return (
      <button className={buttonClass} onClick={onClick} onBlur={onBlur}>
        {children}
      </button>
    );
  }
}
