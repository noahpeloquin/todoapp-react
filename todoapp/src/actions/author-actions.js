import * as constants from '../constants';
import { get } from '../utils/functions';

/**
 * Gets author by author id
 * @param {int} id
 * @returns {Promise}
 */
export function loadAuthorById(id) {
  // Was return(dispatch, getState) => {
  return (dispatch) => {
    const url = `/users/${id}`;
    return dispatch(get(url)).then((data) => {
      dispatch({
        type: constants.SINGLE_AUTHOR_LOADED,
        payload: { author: data.user },
      });
      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return data;
    });
  };
}

/**
 * Loads all authors
 * @returns {Promise}
 */
export function loadAuthors() {
  // Was return(dispatch, getState) => {
  return (dispatch) => {
    const url = '/users/';
    return dispatch(get(url)).then((data) => {
      if (data) {
        dispatch({
          type: constants.AUTHORS_LOADED,
          payload: { authors: data.users },
        });
      }
      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return data;
    });
  };
}
