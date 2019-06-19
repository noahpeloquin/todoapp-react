import sweetalert from 'sweetalert';
import * as constants from '../constants';
import {
  checkStatus,
  parseJSON,
  api,
  tokenize,
  dispatchJSONErrors,
  clearCachedUserData,
  cacheUserData,
  updateTwoFactor,
} from '../utils/functions';

import history from '../utils/history';

/**
 * Logs in a user then redirects
 *
 * @param {object} data
 * @param {string} redirect
 * @returns {Promise}
 */
export function login(data, redirect) {
  const loginData = data;
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/sign-in'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        // make sure user is valid and that we received a valid response from api
        if (data.user && data.xsrf_token) {
          cacheUserData(data);

          dispatch({
            type: constants.MFA_NEEDED,
            payload: { mfa: false },
          });

          dispatch({
            type: constants.CURRENT_USER_LOADED,
            payload: { user: data.user },
          });

          // Can be used to navigate to a new route
          if (redirect) {
            redirect();
          }
        } else if (data.mfa) {
          if (data.mfa.sms === true && !data.mfa.totp) {
            dispatch(requestSMS(loginData));
          }
          dispatch({
            type: constants.MFA_NEEDED,
            payload: { mfa: data.mfa },
          });
        }
      })
      .catch(errors => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, errors);
      });
  };
}

/**
 * Logout a user
 *
 * @param {string} redirect - An optional URL to redirect to
 * @returns {Promise}
 */
export function logout(redirect) {
  return fetch(
    api('/sign-out'),
    tokenize({
      method: 'post',
    }),
  ).then(() => {
    clearCachedUserData();

    // Hard refresh to clear local app data
    if (redirect) {
      window.location = redirect;
    } else {
      window.location = '/';
    }
  });
}

/**
 * Registers a user then redirects
 *
 * @param {object} data
 * @param {string} redirect - An optional URL to redirect to
 * @returns {Promise}
 */
export function register(data, redirect) {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/users'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.REGISTERED,
        });
        sweetalert(
          {
            title: 'Success',
            type: 'success',
            text: 'Your account was created successfully. You may now log in.',
            timer: 1500,
            showConfirmButton: false,
          },
          () => {
            history.push('/my-account');
            window.location.reload();
          },
        );
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Updates a user's password using data from the form
 * @param {object} data - object containing user data, containing email, containing chars
 *
 * @returns {Promise}
 */
export function resetUserPassword(data) {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });
    return fetch(api('/users/reset-password'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(checkStatus)
      .then(() => {
        dispatch({
          type: constants.REGISTERED,
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text: 'Password was succesfully updated. You may now log in.',
          timer: 5000,
        });
        history.push('/my-account');
      })
      .catch(error => {
        sweetalert(
          {
            title: 'Error',
            type: 'error',
            text:
              'The password-reset token is either expired or invalid. \r\n\r\nPlease try emailing a new password-reset link, or if this problem persists, contact your web administrator.',
          },
          () => {
            dispatch({
              type: constants.APPLICATION_ERRORS,
              payload: { errors: error },
            });
          },
        );
        history.push('/forgotten-password');
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Send Reset Password Email
 * @param {object} data
 * @returns {Promise}
 */
export function sendPasswordResetEmail(data) {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });
    return fetch(
      api('/users/send-password-reset-email'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.REGISTERED,
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text:
            'A password-reset email has been sent. <br /> <strong> The link will be active for 10 minutes. </strong>',
          html: true,
        });
        history.push('/my-account');
      })
      .catch(error => {
        if (error.response.status === 404) {
          sweetalert(
            {
              title: 'Error',
              type: 'error',
              text: 'There was no user found with this email address.',
            },
            () => {
              dispatch({
                type: constants.APPLICATION_ERRORS,
                payload: { errors: error },
              });
            },
          );
        } else {
          dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
        }
      });
  };
}

/**
 * Load current user
 *
 * @returns {Promise}
 */
export function loadCurrentUser() {
  return (dispatch, getState) => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/users/me'),
      tokenize({
        method: 'get',
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.CURRENT_USER_LOADED,
          payload: { user: data.user },
        });
      })
      .catch(error => {
        // We only want to logout if the error is an
        // unauthorized error and not some random error
        // thrown for some other reason
        if (error.message === 401) {
          return dispatch(logout());
        }
      });
  };
}

/**
 * Updates a user
 *
 * @param {object} data - object containing user fields to update
 * @param {string} userId - the user id of the user we want to update
 * @returns {Promise}
 */
export function updateUser(data, userId) {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    if (userId) {
      return fetch(
        api(`/users/${userId}`),
        tokenize({
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }),
      )
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
          // make sure user exists - we need a proper api response to continue
          if (data.user && data.xsrf_token) {
            cacheUserData(data);

            dispatch({
              type: constants.CURRENT_USER_LOADED,
              payload: { user: data.user },
            });
            sweetalert({
              title: 'Success',
              type: 'success',
              text: 'Your account was successfully updated',
            });
          }
        })
        .catch(error => {
          dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
        });
    } else {
      return null;
    }
  };
}

/**
 * Deletes selected user given the user id
 *
 * @param {string} userId
 * @returns {Promise}
 */
export function deleteUser(userId) {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api(`/users/${userId}`),
      tokenize({
        method: 'delete',
        body: JSON.stringify(userId),
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.LOGGED_OUT,
        });
        dispatch(logout());
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/*
 * TWO FACTOR AUTHENTICATION
 */

/**
 * Add TOTP to the User.
 *
 * @returns {Promise}
 */
export function addTOTP() {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/users/add-totp'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        if (data.totp_key) {
          updateTwoFactor('totp_key', data.totp_key);

          dispatch({
            type: constants.TOTP_ADDED,
            payload: { totp_key: data.totp_key },
          });
        }
        sweetalert({
          title: 'Success',
          type: 'success',
          text: "You've added Google Authenticator, now you must activate it.",
        });
        return data;
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Activate TOTP to the User.
 *
 * @param {object} data
 * @returns {Promise}
 */
export function activateTOTP(data) {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/users/activate-totp'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totp: data }),
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.TOTP_ACTIVATED,
          payload: { totp_enabled: data.success },
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text: "You've acctivated Google Authenticator.",
        });
        return data;
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Remove TOTP from the User.
 *
 * @returns {Promise}
 */
export function removeTOTP() {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/users/remove-totp'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        if (data.success) {
          updateTwoFactor('totp_key');
        }
        dispatch({
          type: constants.TOTP_DEACTIVATED,
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text: "You've removed Google Authenticator.",
        });
        return data;
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Add SMS to the User.
 *
 * @param {object} data
 * @returns {Promise}
 */
export function addSMS(data) {
  const submittedPhone = data.mobile_phone ? data.mobile_phone : null;
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });
    return fetch(
      api('/users/add-sms-mfa-phone'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: data }),
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.PHONE_ADDED,
          payload: { mobile_phone: submittedPhone },
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text: 'Your phone number was added. You can now send an SMS text to Activate it.',
        });
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Add SMS to the User.
 *
 * @param {object} data
 * @returns {Promise}
 */
export function requestSMS(data) {
  return dispatch =>
    fetch(
      api('/users/request-sms-mfa-token'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        sweetalert({
          title: 'Success',
          type: 'success',
          text: 'Your Activation Code has been sent. Your code expires in 5 minutes.',
        });
        return data;
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
}

/**
 * Activate TOTP to the User.
 *
 * @param {object} data
 * @returns {Promise}
 */
export function activateSMS(data) {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/users/activate-sms-mfa'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sms_mfa: data }),
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.SMS_MFA_ACTIVATED,
          payload: { sms_mfa_enabled: data.success },
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text: "You've successfully acctivated SMS 2Factor Authentication.",
        });
        return data;
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Remove TOTP from the User.
 *
 * @returns {Promise}
 */
export function removeSMSMFA() {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/users/remove-sms-mfa'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        if (data.success) {
          updateTwoFactor('sms_mfa_enabled');
        }
        dispatch({
          type: constants.SMS_MFA_DEACTIVATED,
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text: "You've removed SMS MFA.",
        });
        return data;
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Remove Phone Number from the User.
 *
 * @returns {Promise}
 */
export function removeSmsMfaPhone() {
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING,
    });

    return fetch(
      api('/users/remove-sms-mfa-phone'),
      tokenize({
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.PHONE_REMOVED,
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text: "You've removed your phone number.",
        });
        return data;
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}
