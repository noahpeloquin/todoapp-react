import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PublicTemplate from './PublicTemplate';

export class HomePage extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
  }

  render() {
    return <PublicTemplate>Hello World!</PublicTemplate>;
  }
}

export default HomePage;
