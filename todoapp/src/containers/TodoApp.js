import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class TodoApp extends Component {
  static propTypes = {
    children: PropTypes.node,
    authenticated: PropTypes.bool.isRequired,
    loading: PropTypes.bool
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default connect(state => {
  return {
    authenticated: state.application.authenticated,
    loading: state.application.loading
  };
})(TodoApp);
