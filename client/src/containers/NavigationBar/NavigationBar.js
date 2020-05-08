import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { userLogoutRequest } from "../../store/actions/usersActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

class NavigationBar extends Component {
  render() {
    const userLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-2 mt-2">
          Hello, {this.props.authenticatedUsername}
        </li>
        <li className="nav-item">
          <a
            style={{ position: "relative", top: "10px" }}
            onClick={this.props.userLogoutRequest}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </a>
        </li>
      </ul>
    );
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink to="/">
          <h1 className="navbar-brand">
            <FontAwesomeIcon icon={faHome} />
          </h1>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#myNavBar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="myNavBar">
          {this.props.isAuthenticated ? userLinks : ""}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    authenticatedUsername: state.users.authenticatedUsername
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLogoutRequest: () => dispatch(userLogoutRequest())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
