/**
 * Template account page, decides whether user is authenticated or for them to sign-up
 */

import React from 'react';
import Header from '../components/Header';
import PropTypes from 'prop-types';
import AuthToggleForm from './AuthToggleForm';
import { connect } from 'react-redux';
import { loadCurrentUser } from '../actions/application-actions';

import * as storage from '../utils/storage';

export class MyAccountTemplate extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    authenticated: PropTypes.bool,
    children: PropTypes.node,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    if (storage.get('xsrf_token')) {
      dispatch(loadCurrentUser());
    }
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
        <Header user={this.props.user} />
        <div className="container page-body">{content}</div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    loading: state.application.loading,
    user: state.application.user,
    authenticated: state.application.authenticated
  };
})(MyAccountTemplate);
