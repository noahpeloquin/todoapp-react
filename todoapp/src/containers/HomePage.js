import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PublicTemplate from './PublicTemplate';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AllTasks } from '../components/AllTasks';
import { Button, FormControl, FormGroup, InputGroup } from 'react-bootstrap';

import { loadTasks, newTask } from '../actions/task-actions';

// Import loader from components
import Loader from '../components/Loader';

export class HomePage extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    user: PropTypes.object,
    errors: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    apiUrlsLoading: PropTypes.array.isRequired,
    tasks: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      task: {}
    };
    this._handleInputChange = this._handleInputChange.bind(this);
    this._addTask = this._addTask.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(loadTasks());
  }

  _handleInputChange(e) {
    let task = { ...this.state.task };
    task[e.target.name] = e.target.value;
    this.setState({ task });
  }

  _addTask(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    const { task } = this.state;
    dispatch(newTask({ task: task }));
  }

  render() {
    const { apiUrlsLoading, tasks, authenticated, user, dispatch } = this.props;
    // Make a buffer just in case the page loads before information is fetched.
    let content = <Loader />;
    let notification;

    if (tasks.length === 0) {
      if (authenticated) {
        notification = (
          <div>
            <p>You have no tasks right now. Add some!</p>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>Task</InputGroup.Addon>
                <FormControl
                  type="text"
                  name="body"
                  placehoder="Enter task here"
                  onChange={this._handleInputChange}
                />
                <Button
                  bsStyle="primary"
                  onClick={e => {
                    this._addTask(e);
                  }}
                >
                  Add Task
                </Button>
              </InputGroup>
            </FormGroup>
          </div>
        );
      } else {
        notification = (
          <div>
            <p>
              You have no tasks right now. <Link to="/my-account">Log in</Link>{' '}
              to create one!
            </p>
          </div>
        );
      }
    } else {
      notification = (
        <div>
          <p>Knock out those tasks boiiiiiiii! (Boi is gender inclusive)</p>
          <FormGroup>
            <InputGroup>
              <InputGroup.Addon>Task</InputGroup.Addon>
              <InputGroup.Addon>
                <FormControl
                  type="text"
                  name="body"
                  placehoder="Enter task here"
                  onChange={this._handleInputChange}
                />
              </InputGroup.Addon>

              <InputGroup.Addon>
                <Button
                  bsStyle="primary"
                  onClick={e => {
                    this._addTask(e);
                  }}
                >
                  Add Task
                </Button>
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <AllTasks tasks={tasks} user={user} dispatch={dispatch} />
        </div>
      );
    }
    if (apiUrlsLoading.length === 0) {
      content = (
        <div className="tasktainer">
          <Row>
            <Col sm={12} md={8} mdOffset={2}>
              <h1>The Ultimate To-Do List</h1>
              {notification}
            </Col>
          </Row>
        </div>
      );
    }

    return <PublicTemplate>{content}</PublicTemplate>;
  }
}

export default connect(state => {
  return {
    user: state.application.user,
    tasks: state.taskData.tasks,
    errors: state.application.errors,
    apiUrlsLoading: state.taskData.apiUrlsLoading,
    authenticated: state.application.authenticated
  };
})(HomePage);
