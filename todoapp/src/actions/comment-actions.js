import sweetalert from 'sweetalert';
import * as constants from '../constants';
import {
  checkStatus,
  parseJSON,
  api,
  tokenize,
  dispatchJSONErrors,
  get,
} from '../utils/functions';

/**
 * Gets comments corresponding to a post id
 *
 * @param {int} postId
 * @param {string} limit
 * @returns {Promise}
 */
export function loadCommentsByPostId(
  postId,
  offset = 0,
  forceLoad = false,
  trackApiUrlsLoading = true,
) {
  return (dispatch) => {
    const url = `/posts/${postId}/comments?offset=${offset}`;
    dispatch(get(url, forceLoad, trackApiUrlsLoading))
      .then((data) => {
        dispatch({
          type: constants.COMMENTS_LOADED,
          payload: { comments: data.comments, totalCount: data.count },
        });
        dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
        return data;
      })
      .catch((error) => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Creates a comment for a post
 *
 * @param {object} data - data containing comment object
 * @param {int} id - the post id
 * @returns {Promise}
 */
export function newComment(data, id) {
  return (dispatch) => {
    const url = api(`/posts/${id}/comments`);

    return fetch(
      url,
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
      .then((data) => {
        dispatch({
          type: constants.COMMENT_CREATED,
          payload: { comment: data.comment },
        });
      })
      .catch((error) => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Updates a comment for a post
 *
 * @param {string} data - The Updated Comment.
  * @param {int} id - the comment id
 * @returns {Promise}
 */
export function updateComment(data, id) {
  return (dispatch) => {
    const url = api(`/comments/${  id}`);

    return fetch(
      url,
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
      .then((data) => {
        dispatch({
          type: constants.COMMENT_UPDATED,
          payload: { comment: data.comment },
        });
        sweetalert({
          title: 'Success',
          type: 'success',
          text: 'The comment was successfully updated',
        });
      })
      .catch((error) => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}
