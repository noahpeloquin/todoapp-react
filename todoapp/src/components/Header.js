import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import LogoutLink from './LogoutLink';

export class Header extends Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.object
  };

  render() {
    let authLink;
    let username;
    let user = this.props.user;

    if (this.props.authenticated && user) {
      authLink = <LogoutLink />;
      username = <span className="marg-left-mdsm">{user.name}</span>;
    } else {
      authLink = <Link to={'/my-account'}>Log In</Link>;
    }

    return (
      <header>
        <div className="container">
          <h1 className="title">
            <Link to={'/'}>To-Do App</Link>
          </h1>
          <div className="right">
            {authLink}
            {username}
          </div>
        </div>
      </header>
    );
  }
}

export default connect(state => {
  return {
    user: state.application.user,
    authenticated: state.application.authenticated
  };
})(Header);
