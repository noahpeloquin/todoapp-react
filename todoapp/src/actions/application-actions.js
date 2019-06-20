import sweetalert from 'sweetalert';
import * as constants from '../constants';
import {
  checkStatus,
  parseJSON,
  api,
  tokenize,
  dispatchJSONErrors,
  clearCachedUserData,
  cacheUserData
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
  return dispatch => {
    dispatch({
      type: constants.APPLICATION_LOADING
    });

    return fetch(
      api('/sign-in'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        // make sure user is valid and that we received a valid response from api
        if (data.user && data.xsrf_token) {
          cacheUserData(data);

          dispatch({
            type: constants.CURRENT_USER_LOADED,
            payload: { user: data.user }
          });

          // Can be used to navigate to a new route
          if (redirect) {
            window.location = redirect;
          } else {
            window.location = '/';
          }
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
      method: 'post'
    })
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
      type: constants.APPLICATION_LOADING
    });

    return fetch(
      api('/users'),
      tokenize({
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.REGISTERED
        });
        sweetalert(
          {
            title: 'Success',
            type: 'success',
            text: 'Your account was created successfully. You may now log in.',
            timer: 1500,
            showConfirmButton: false
          },
          () => {
            history.push('/my-account');
            window.location.reload();
          }
        );
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
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
      type: constants.APPLICATION_LOADING
    });

    return fetch(
      api('/users/me'),
      tokenize({
        method: 'get'
      })
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.CURRENT_USER_LOADED,
          payload: { user: data.user }
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
      type: constants.APPLICATION_LOADING
    });

    if (userId) {
      return fetch(
        api(`/users/${userId}`),
        tokenize({
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
      )
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
          // make sure user exists - we need a proper api response to continue
          if (data.user && data.xsrf_token) {
            cacheUserData(data);

            dispatch({
              type: constants.CURRENT_USER_LOADED,
              payload: { user: data.user }
            });
            sweetalert({
              title: 'Success',
              type: 'success',
              text: 'Your account was successfully updated'
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
      type: constants.APPLICATION_LOADING
    });

    return fetch(
      api(`/users/${userId}`),
      tokenize({
        method: 'delete',
        body: JSON.stringify(userId)
      })
    )
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        dispatch({
          type: constants.LOGGED_OUT
        });
        dispatch(logout());
      })
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}
