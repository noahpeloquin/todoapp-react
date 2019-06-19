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
import MfaLoginContent from '../components/MfaLoginContent';
import * as _ from 'lodash';

import { login, requestSMS } from '../actions/application-actions';

export class LoginForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    mfa_needed: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    showRegistration: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        password: ''
      },
      totp: {},
      sms_mfa: {},
      pickedMethod: false
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleTotpChange = this._handleTotpChange.bind(this);
    this._handleSmsChange = this._handleSmsChange.bind(this);
    this._handleSignInClick = this._handleSignInClick.bind(this);
    this._handleChoose2Factor = this._handleChoose2Factor.bind(this);
    this._handleResendSms = this._handleResendSms.bind(this);
  }

  _handleInputChange(ev) {
    let user = _.cloneDeep(this.state.user);
    user[ev.target.name] = ev.target.value;
    this.setState({ user });
  }

  _handleTotpChange(ev) {
    let totp = _.cloneDeep(this.state.totp);
    totp[ev.target.name] = ev.target.value;
    this.setState({ totp });
  }

  _handleSmsChange(ev) {
    let sms_mfa = _.cloneDeep(this.state.sms_mfa);
    sms_mfa[ev.target.name] = ev.target.value;
    this.setState({ sms_mfa });
  }

  _handleChoose2Factor(ev) {
    const { dispatch } = this.props;
    const { user } = this.state;
    let method = ev.target.name;
    if (method === 'sms') {
      dispatch(requestSMS({ user: user }));
    }
    this.setState({ pickedMethod: method });
  }

  _handleResendSms() {
    const { dispatch } = this.props;
    const { user } = this.state;
    dispatch(requestSMS({ user: user }));
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
    let { errors, mfa_needed, showRegistration } = this.props;
    let { sms_mfa, totp, pickedMethod } = this.state;

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

    // Both 2Factor Methods Chosen.
    if (mfa_needed.totp && mfa_needed.sms && !pickedMethod) {
      content = (
        <Panel
          header="Which multifactor authentication method would you prefer?"
          eventKey="1"
        >
          <Button onClick={this._handleChoose2Factor} name="totp">
            Google Authenticator
          </Button>
          <Button
            onClick={this._handleChoose2Factor}
            name="sms"
            className="marg-left-mdsm"
          >
            SMS Message
          </Button>
        </Panel>
      );

      // Google Authenticator chosen.
    } else if (
      (mfa_needed.totp && !mfa_needed.sms) ||
      pickedMethod === 'totp'
    ) {
      content = (
        <Panel
          header="Please enter your authentication code below:"
          eventKey="1"
        >
          <MfaLoginContent
            mfaNeeded={'totp'}
            smsMfa={sms_mfa}
            totp={totp}
            smsHandler={this._handleSmsChange}
            totpHandler={this._handleTotpChange}
          />
          {loginButton}
        </Panel>
      );

      // SMS Chosen.
    } else if ((mfa_needed.sms && !mfa_needed.totp) || pickedMethod === 'sms') {
      content = (
        <Panel header="SMS:" eventKey="1">
          <MfaLoginContent
            mfaNeeded={'sms'}
            smsMfa={sms_mfa}
            totp={totp}
            smsHandler={this._handleSmsChange}
            totpHandler={this._handleTotpChange}
          />
          {loginButton}
          <div className="clear" />
          <Button className="fr marg-top-sm" onClick={this._handleResendSms}>
            Resend SMS
          </Button>
        </Panel>
      );

      // Initial step.
    } else {
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
    }

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
