/*
 * Pure TwoFactor Component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormGroup, InputGroup } from 'react-bootstrap';

export class MfaLoginContent extends Component {
  static propTypes = {
    mfaNeeded: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    smsMfa: PropTypes.object,
    totp: PropTypes.object,
    smsHandler: PropTypes.func,
    totpHandler: PropTypes.func,
  };

  render() {
    const { mfaNeeded, smsHandler, totpHandler } = this.props;
    let content;

    if (mfaNeeded === 'totp') {
      content = (
        <FormGroup>
          <InputGroup>
            <InputGroup.Addon>Google Authenticator code</InputGroup.Addon>
            <FormControl
              type="text"
              className="form-elem-full"
              name="token"
              placeholder="Enter your Google Authenticator Code"
              onChange={totpHandler}
            />
          </InputGroup>
        </FormGroup>
      );
    } else {
      content = (
        <FormGroup>
          <InputGroup>
            <InputGroup.Addon>SMS CODE</InputGroup.Addon>
            <FormControl
              type="text"
              className="form-elem-full"
              name="token"
              placeholder="Enter your SMS MFA Code (If Activated)"
              onChange={smsHandler}
            />
          </InputGroup>
        </FormGroup>
      );
    }

    return (
      <div>
        {content}
        <div className="clear" />
      </div>
    );
  }
}
export default MfaLoginContent;
