import sweetalert from 'sweetalert';
import * as _ from 'lodash';
import moment from 'moment';

import * as storage from './storage';
import * as constants from '../constants';

/**
 * Filtration for a response
 *
 * @param {object} response
 * @returns {object}
 */
export function checkStatus(response) {
  let error;

  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status === 401) {
    error = new Error(response.status);
    error.response = { errors: [{ general: 'Unauthorized Error' }] };
    throw error;
  } else if (response.status >= 500) {
    error = new Error(response.status);
    error.response = { errors: { general: 'Unknown error' } };
    throw error;
  } else {
    error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

/**
 * Returns the response data as json
 *
 * @param {object} response
 * @returns {object}
 */
export function parseJSON(response) {
  return response.json();
}

/**
 * Returns true if is a valid password and false if not valid
 *
 * @param {string} password
 * @returns {bool}
 */
export function passwordValidator(password) {
  // eslint-disable-next-line
  const specChars = new RegExp(/[@()_~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
  if (
    password.length >= 8 && // at least 8 chars
    /[a-z]/.test(password) && // contains lowercase
    /[A-Z]/.test(password) && // contains uppercase
    /\d/.test(password) && // contains a number
    specChars.test(password) // contains special character
  ) {
    return true;
  }
  return false;
}

/**
 * Returns true if passwords match and neither are an empty string.
 *
 * @param {string} password1
 * @param {string} password2
 * @returns {bool}
 */
export function equalPasswords(password1, password2) {
  if (password1 === '' || password2 === '' || password1 === password2) {
    return true;
  }
  return false;
}

/**
 * Returns the path given the current API URL
 *
 * @param {string} path
 * @returns {string}
 */
export function api(path) {
  const API_URL =
    process.env.REACT_APP_API_URL || `http://${window.location.hostname}:8001`;
  // Could be a a different API location in the future.
  return `${API_URL}${path}`;
}

/**
 * Returns the given object with the tokens added
 *
 * @param {object} obj the object to modify and return
 * @returns {object} the object with the authorization data in the header
 */
export function tokenize(object) {
  // Add the XSRF token to the request
  const obj = object;
  obj.headers = obj.headers || {};
  obj.headers['X-XSRF-Token'] = `${storage.get('xsrf_token')}`;

  obj.headers.authorization = `Bearer: ${storage.get('jwt_token')}`;

  // Make sure fetch includes cookies wihch contain the jwt token
  obj.credentials = 'include';

  return obj;
}

/**
 * Dispatches the errors
 *
 * @param {function} dispatch - The promise
 * @param {string} ACTION - the action to dispatch
 * @param {object} error - the error
 * @returns {void}
 */
export function dispatchJSONErrors(dispatch, ACTION, error) {
  if (error.response) {
    if (error.response.json) {
      // For handling proper requests
      return error.response.json().then(data => {
        dispatch({
          type: ACTION,
          payload: { errors: data.errors }
        });
        if (data.errors && data.errors.permissions) {
          sweetalert({
            title: 'Error',
            type: 'error',
            text:
              'You do not have sufficient privileges to perform this action.',
            timer: 5000
          });
        } else if (data.errors && data.errors.general) {
          sweetalert({
            title: 'Error',
            type: 'error',
            text: `There was an error: ${data.errors.general[0]}`,
            timer: 5000
          });
        }
        return Promise.resolve(data);
      });
    }
    // For handling unexpected 500 errors
    dispatch({
      type: ACTION,
      payload: { errors: error.response.errors }
    });
  } else {
    // For handling another random error
    dispatch({
      type: ACTION,
      payload: { errors: [error] }
    });
  }
  return Promise.resolve();
}

/**
 * Generic get function
 * Sends a get request to the provided url and takes care of the apiUrlsLoading and error handling
 * @param {string} url - the api url to request
 * @param {bool} trackApiUrlsLoading - allows user to override default behaviour of apiUrlsLoading
 * @param {bool} forceLoad - allows us to Force loading the URL, even if we already
 * have the URL in apiUrlsLoading
 * @returns {Promise}
 */
export function get(url, forceLoad = false, trackApiUrlsLoading = true) {
  return (dispatch, getState) => {
    // If we already have the Author. We don't need to load it.

    if (
      (!forceLoad && _.includes(getState().taskData.apiUrlsLoaded, url)) ||
      _.includes(getState().taskData.apiUrlsLoading, url)
    ) {
      return Promise.resolve();
    }

    // This will triger apiUrlsLoading to increment
    if (trackApiUrlsLoading) {
      dispatch({ type: constants.GET_REQUEST_MADE, payload: { url } });
    }

    // Data Fetching
    return fetch(
      api(url),
      tokenize({
        method: 'get'
        // eslint-disable-next-line comma-dangle
      })
    )
      .then(checkStatus)
      .then(parseJSON)
      .catch(error => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
        // This will allow apiUrlsLoading to decrement
        if (trackApiUrlsLoading) {
          dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
        }
      });
  };
}

/**
 * Clear all stored user data
 * @returns {void}
 */
export function clearCachedUserData() {
  storage.remove('xsrf_token');
  storage.remove('jwt_token');
}

/**
 * Update all stored user data
 * @param {object} object - the data
 * @returns {void}
 */
export function cacheUserData(object) {
  storage.put('xsrf_token', object.xsrf_token);
  storage.put('jwt_token', object.jwt_token);
}

/**
 * Parses and returns a moment date object
 * @param {string} date - a parseable date
 * @returns {string} formatted date
 */
export function getUTCDateObject(date) {
  return moment(date).utc();
}

/**
 * Parses and returns a date in format MM/DD/YYYY
 * @param {string} date - a parseable date
 * @param {string} formate - optional param
 * @returns {string} formatted date
 */
export function getFormattedDate(date, format = 'MM/DD/YYYY') {
  if (date && date.length > 0) {
    return getUTCDateObject(date).format(format);
  }
  return '';
}
