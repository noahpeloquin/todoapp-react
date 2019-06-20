import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Panel,
  FormControl,
  FormGroup,
  InputGroup,
  Alert,
  Button,
  Checkbox
} from 'react-bootstrap';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { login } from '../actions/application-actions';

export class LoginForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    showRegistration: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        password: ''
      }
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleSignInClick = this._handleSignInClick.bind(this);
  }

  _handleInputChange(ev) {
    let user = _.cloneDeep(this.state.user);
    user[ev.target.name] = ev.target.value;
    this.setState({ user });
  }

  _handleKeyDown(e) {
    let ENTER = 13;
    if (e.keyCode === ENTER) {
      this._handleSignInClick(e);
    }
  }

  _handleSignInClick(e) {
    const { dispatch } = this.props;
    e.preventDefault();

    dispatch(login(this.state));
  }

  render() {
    let alertErrors, content, loginButton;
    let { errors, showRegistration } = this.props;

    if (errors !== null) {
      alertErrors = (
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
          <div>{errors.general}</div>
          <div>{errors.unauthenticated}</div>
          <div>{errors.email}</div>
          <div>{errors.password}</div>
        </Alert>
      );
    }

    // Login Button
    loginButton = (
      <Button
        bsStyle="primary"
        className="fr"
        onClick={this._handleSignInClick}
      >
        Log In
      </Button>
    );

    content = (
      <div>
        <FormGroup>
          <InputGroup>
            <InputGroup.Addon>Email</InputGroup.Addon>
            <FormControl
              type="email"
              className="form-elem-full"
              name="email"
              placeholder="Enter your email address"
              value={this.state.email}
              onChange={this._handleInputChange}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroup.Addon>Password</InputGroup.Addon>
            <FormControl
              type="password"
              className="form-elem-full"
              name="password"
              placeholder="Enter your password"
              value={this.state.password}
              onChange={this._handleInputChange}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <div className="ta-r">
            <Checkbox>Remember me</Checkbox>
          </div>
        </FormGroup>
        {loginButton}
        <div className="clear" />
        <Button
          bsStyle="default"
          className="fr marg-top-sm"
          onClick={showRegistration}
        >
          Sign Up
        </Button>
        <div className="clear" />
        <a className="fr marg-top-sm" href="/forgotten-password">
          Forgot your password?
        </a>
      </div>
    );

    return (
      <Panel>
        {alertErrors}
        <form onKeyDown={this._handleKeyDown} className="form-style-1">
          <div className="form-body">{content}</div>
        </form>
      </Panel>
    );
  }
}

export default connect()(LoginForm);
