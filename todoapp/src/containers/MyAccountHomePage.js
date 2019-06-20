import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MyAccountTemplate from '../containers/MyAccountTemplate';

export class MyAccountHomePage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
    manufacturers: PropTypes.array
  };

  render() {
    return <MyAccountTemplate></MyAccountTemplate>;
  }
}

export default connect(state => {
  return {
    user: state.application.user
  };
})(MyAccountHomePage);
