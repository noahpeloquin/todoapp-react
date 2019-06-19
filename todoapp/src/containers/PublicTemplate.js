/*
 * The default template for public pages
 */
import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { loadCurrentUser } from '../actions/application-actions';
import { connect } from 'react-redux';
import * as storage from '../utils/storage';

export class PublicTemplate extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    children: PropTypes.node,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    if (storage.get('xsrf_token')) {
      dispatch(loadCurrentUser());
    }
  }

  render() {
    return (
      <div>
        <Header user={this.props.user} />
        <div className="container page-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    authenticated: state.application.authenticated,
    user: state.application.user,
  };
})(PublicTemplate);
