/*
 * The sign up form for creating a new account
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Panel,
  Alert,
  Button,
  FormControl,
  FormGroup,
  InputGroup,
  ControlLabel,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { passwordValidator, equalPasswords } from '../utils/functions';
import * as _ from 'lodash';

import { register } from '../actions/application-actions';

export class RegisterForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    errors: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
        provider: 'email',
      },
      passwordValidationError: false,
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleRegistrationClick = this._handleRegistrationClick.bind(this);
    this._passwordInputChange = this._passwordInputChange.bind(this);
  }

  _handleInputChange(ev) {
    let user = _.cloneDeep(this.state.user);
    user[ev.target.name] = ev.target.value;
    this.setState({ user: user });
  }

  _passwordInputChange(ev) {
    this._handleInputChange(ev);
    if (ev.target.value.length === 0) {
      this.setState({ passwordValidationError: false });
    } else if (passwordValidator(ev.target.value)) {
      this.setState({ passwordValidationError: false });
    } else {
      this.setState({ passwordValidationError: true });
    }
  }

  _handleKeyDown(e) {
    let ENTER = 13;
    if (e.keyCode === ENTER) {
      this._handleRegistrationClick(e);
    }
  }

  _handleRegistrationClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    let user = this.state.user;
    dispatch(register({ user }));
  }
  render() {
    let { passwordValidationError } = this.state;
    let { password, password_confirmation } = this.state.user;
    let errors = this.props.errors;
    let emailError,
      alertErrors,
      passwordError,
      passwordConfirmationError,
      emailErrorLabel,
      passwordConfirmationErrorLabel,
      nameError,
      nameErrorLabel,
      disableButton;

    let passwordErrorLabel = (
      <ControlLabel>
        Password Must be: at least 8 characters; contain an uppercase letter, lowercase letter and special character.
      </ControlLabel>
    );

    // If there are any errors we dont' want them to be able to register.
    if (
      password.length === 0 ||
      password_confirmation.length === 0 ||
      passwordValidationError ||
      !equalPasswords(password, password_confirmation)
    ) {
      disableButton = { disabled: true };
    }

    // If API returned Errors
    if (errors) {
      if (errors.email) {
        emailError = { validationState: 'error' };
        emailErrorLabel = <ControlLabel>{errors.email}</ControlLabel>;
      }
      if (errors.name) {
        nameError = { validationState: 'error' };
        nameErrorLabel = <ControlLabel>{errors.name}</ControlLabel>;
      }
      if (errors.password) {
        passwordError = { validationState: 'error' };
        passwordErrorLabel = <ControlLabel>{errors.email}</ControlLabel>;
      }
      if (errors.password_confirmation) {
        passwordConfirmationError = { validationState: 'error' };
        passwordConfirmationErrorLabel = (
          <ControlLabel>{errors.password_confirmation}</ControlLabel>
        );
      }
    }

    // If Password is not Valid
    if (passwordValidationError) {
      passwordError = { validationState: 'error' };
    }

    // If Passwords Don't match and they've typed in both fields
    if (!equalPasswords(password, password_confirmation)) {
      passwordConfirmationError = { validationState: 'error' };
      passwordError = { validationState: 'error' };
      passwordConfirmationErrorLabel = (
        <ControlLabel>Passwords Do Not Match</ControlLabel>
      );
    }

    // If API returned General Errors
    if (errors && errors.general) {
      alertErrors = (
        <Alert bsStyle="danger">
          <div>{errors.general}</div>
        </Alert>
      );
    }

    return (
      <Panel>
        {alertErrors}
        <form onKeyDown={this._handleKeyDown} className="form-style-1">
          <div className="form-body">
            <FormGroup {...nameError}>
              {nameErrorLabel}
              <InputGroup>
                <InputGroup.Addon>Name</InputGroup.Addon>
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={this.state.name}
                  onChange={this._handleInputChange}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup {...emailError}>
              {emailErrorLabel}
              <InputGroup>
                <InputGroup.Addon>Email</InputGroup.Addon>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={this.state.email}
                  onChange={this._handleInputChange}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup {...emailError}>
              <InputGroup>
                <InputGroup.Addon>Username</InputGroup.Addon>
                <FormControl
                  type="text"
                  name="username"
                  placeholder="Enter a username"
                  value={this.state.username}
                  onChange={this._handleInputChange}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup {...passwordError}>
              {passwordErrorLabel}
              <InputGroup>
                <InputGroup.Addon>Password</InputGroup.Addon>
                <FormControl
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={this._passwordInputChange}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup {...passwordConfirmationError}>
              {passwordConfirmationErrorLabel}
              <InputGroup>
                <InputGroup.Addon>Password Confirmation</InputGroup.Addon>
                <FormControl
                  type="password"
                  name="password_confirmation"
                  placeholder="Re-type your password"
                  value={this.state.password_confirmation}
                  onChange={this._passwordInputChange}
                />
              </InputGroup>
            </FormGroup>
          </div>
          <Button
            {...disableButton}
            bsStyle="primary"
            onClick={this._handleRegistrationClick}
          >
            Register!
          </Button>
        </form>
      </Panel>
    );
  }
}

export default connect(state => {
  return {
    loading: state.application.loading,
    errors: state.application.errors,
  };
})(RegisterForm);
