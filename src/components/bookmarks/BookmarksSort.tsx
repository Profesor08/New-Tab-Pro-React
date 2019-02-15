import React, { Component } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ActionButton, ActionMenu, ActionSeparator } from "./ActionMenu";
import { IconButton } from "../buttons/IconButton";
import {
  ORDER_BY_DATE,
  ORDER_BY_NAME,
  ORDER_DIRECTION_ASCENDING,
  ORDER_DIRECTION_DESCENDING,
  orderByDateAsc,
  orderByDateDesc,
  orderByNameAsc,
  orderByNameDesc,
  SortType,
  SortDirection,
  SortOrder,
} from "../../store/reducers/bookmarksApp";

interface StateProps {
  bookmarksApp: {
    sortOrder: SortOrder;
  };
}

interface DispatchProps {
  orderByNameAsc: () => void;
  orderByNameDesc: () => void;
  orderByDateAsc: () => void;
  orderByDateDesc: () => void;
}

interface State {
  sortOrder: SortOrder;
}

type Props = State & DispatchProps;

class BookmarksSort extends Component<Props> {
  isActive = (type: SortType, direction: SortDirection) => {
    return (
      this.props.sortOrder.type === type &&
      this.props.sortOrder.direction === direction
    );
  };

  render() {
    return (
      <div className="bookmarks-sort">
        <IconButton className="sort-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
          </svg>
        </IconButton>
        <ActionMenu className="sort-menu">
          <ActionButton
            onClick={this.props.orderByDateDesc}
            isActive={this.isActive(ORDER_BY_DATE, ORDER_DIRECTION_DESCENDING)}
          >
            ↑ By Date
          </ActionButton>
          <ActionButton
            onClick={this.props.orderByDateAsc}
            isActive={this.isActive(ORDER_BY_DATE, ORDER_DIRECTION_ASCENDING)}
          >
            ↓ By Date
          </ActionButton>
          <ActionButton
            onClick={this.props.orderByNameDesc}
            isActive={this.isActive(ORDER_BY_NAME, ORDER_DIRECTION_DESCENDING)}
          >
            ↑ By Name
          </ActionButton>
          <ActionButton
            onClick={this.props.orderByNameAsc}
            isActive={this.isActive(ORDER_BY_NAME, ORDER_DIRECTION_ASCENDING)}
          >
            ↓ By Name
          </ActionButton>
          <ActionSeparator />
          <ActionButton>&nbsp;&nbsp;&nbsp;Close</ActionButton>
        </ActionMenu>
      </div>
    );
  }
}

const mapStateToProps = (state: StateProps) => {
  return {
    sortOrder: state.bookmarksApp.sortOrder,
  };
};

const mapDispatchProps = (dispatch: Dispatch) => {
  return {
    orderByNameAsc: () => {
      dispatch(orderByNameAsc());
    },

    orderByNameDesc: () => {
      dispatch(orderByNameDesc());
    },

    orderByDateAsc: () => {
      dispatch(orderByDateAsc());
    },

    orderByDateDesc: () => {
      dispatch(orderByDateDesc());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookmarksSort);
