/**
 * Load a single task
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class Task extends Component {
  static propTypes = {
    errors: PropTypes.array,
    task: PropTypes.object
  };
  render() {
    let { task } = this.props;
    return <div>{task.body}</div>;
  }
}

export default connect()(Task);
