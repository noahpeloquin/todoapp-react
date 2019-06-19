/**
 * Template account page, decides whether user is authenticated or for them to sign-up
 */

import React from 'react';
import PropTypes from 'prop-types';
import AuthToggleForm from './AuthToggleForm';
import { connect } from 'react-redux';

export class MyAccountTemplate extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    authenticated: PropTypes.bool,
    children: PropTypes.node,
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
  }

  render() {
    let content;
    let { authenticated } = this.props;
    if (authenticated) {
      content = <div>{this.props.children}</div>;
    } else {
      content = <AuthToggleForm />;
    }

    return (
      <div>
        <div className="container page-body">{content}</div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    loading: state.application.loading,
    authenticated: state.application.authenticated
  };
})(MyAccountTemplate);
