/*
 * Both the Sign up and sign in form
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

import { PageHeader, Row, Col, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';

export class AuthToggleForm extends Component {
  static propTypes = {
    errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    mfa_needed: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    loading: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = { currentForm: 0 };

    this._showRegisterForm = this._showRegisterForm.bind(this);
    this._showLoginForm = this._showLoginForm.bind(this);
  }

  _showRegisterForm() {
    this.setState({ currentForm: 1 });
  }

  _showLoginForm() {
    this.setState({ currentForm: 0 });
  }

  render() {
    let { currentForm } = this.state;
    let { loading, errors, mfa_needed } = this.props;

    switch (currentForm) {
      case 0:
        return (
          <Row>
            <Col xs={12} md={8} mdOffset={2}>
              <PageHeader>
                Log in <small>access your account</small>
              </PageHeader>
              <LoginForm
                loading={loading}
                errors={errors}
                mfa_needed={mfa_needed}
                showRegistration={this._showRegisterForm}
              />
            </Col>
          </Row>
        );
      case 1:
        return (
          <Row>
            <Col xs={12} md={8} mdOffset={2}>
              <PageHeader>
                Register <small>join the blogging madness</small>
              </PageHeader>
              <RegisterForm loading={loading} errors={errors} />
              <div className="back-to-login" onClick={this._showLoginForm}>
                <a href="#">
                  <Glyphicon glyph="arrow-left" /> Back to login form
                </a>
              </div>
            </Col>
          </Row>
        );
      default:
        return null;
    }
  }
}
export default connect(state => {
  return {
    loading: state.application.loading,
    errors: state.application.errors,
    mfa_needed: state.application.mfa_needed
  };
})(AuthToggleForm);
