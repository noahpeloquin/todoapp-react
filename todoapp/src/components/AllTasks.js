import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Task } from './Task';
import { updateTask, deleteTask } from '../actions/task-actions';

import {
  Button,
  Row,
  Col,
  FormGroup,
  FormControl,
  InputGroup,
  Modal
} from 'react-bootstrap';

export class AllTasks extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    tasks: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      task: {}
    };

    this._editTask = this._editTask.bind(this);
    this._deleteTask = this._deleteTask.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handleShow = this._handleShow.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
  }

  _handleInputChange(e) {
    let task = { ...this.state.task };
    task[e.target.name] = e.target.value;
    this.setState({ task });
  }

  _handleClose() {
    this.setState({ show: false });
  }

  _handleShow() {
    this.setState({ show: true });
  }

  _editTask(etask) {
    const { dispatch } = this.props;
    let task = { ...this.state.task };
    etask.body = task.body;

    dispatch(updateTask({ task: etask }));
  }
  _deleteTask(etask) {
    const { dispatch } = this.props;
    dispatch(deleteTask({ task: etask }));
  }

  render() {
    const { tasks, user } = this.props;

    let printTasks = _.map(tasks, task => {
      if (task) {
        const url = 'tasks/' + task.url_path;
        return (
          <FormGroup key={task.id}>
            <InputGroup>
              <InputGroup.Addon>
                <Button
                  bsStyle="default"
                  onClick={e => {
                    this._handleShow();
                  }}
                >
                  Edit Task
                </Button>
              </InputGroup.Addon>

              <InputGroup.Addon>
                <Task task={task} url={url} user={user} />
              </InputGroup.Addon>

              <InputGroup.Addon>
                <Button
                  bsStyle="default"
                  onClick={e => {
                    this._deleteTask(task);
                  }}
                >
                  Delete Task
                </Button>
              </InputGroup.Addon>
            </InputGroup>

            <Modal show={this.state.show} onHide={this._handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Task</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FormControl
                  type="text"
                  name="body"
                  placehoder="Enter task here"
                  onChange={this._handleInputChange}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this._handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={event => {
                    this._handleClose();
                    this._editTask(task);
                  }}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </FormGroup>
        );
      }
    });

    return (
      <Row>
        <Col sm={12} md={9}>
          {printTasks}
        </Col>
      </Row>
    );
  }
}

export default connect(state => {
  return {
    user: state.application.user,
    authenticated: state.application.authenticated
  };
})(AllTasks);
