import React, { Component } from "react";
import "./close-button.scss";

export const CloseButton = ({
  children,
  onClick,
  className,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  let buttonClass = "close-button";

  if (className) {
    buttonClass += " " + className;
  }

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};
