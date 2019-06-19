import * as _ from 'lodash';
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
 * Loads all tags - INTERNAL FUNCTION
 *
 * @param {string} url - the api url
 * @returns {Promise}
 */
export function loadTags(url) {
  return (dispatch) => {
    const url = '/tags';
    return dispatch(get(url)).then((data) => {
      if (data && data.tags) {
        dispatch({ type: constants.TAGS_LOADED, payload: { tags: data.tags } });
      }
      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
    });
  };
}

/**
 * Adds a tag for a post
 *
 * @param {object} data - data containing tag
 * @param {int} postId - the post id
 * @returns {Promise}
 */
export function addTagToPost(data, postId) {
  return (dispatch, getState) => {
    const url = api(`/tags?text=${data.tag.text}`);

    // fetch get-tag-by-text
    return fetch(
      url,
      tokenize({
        method: 'get',
      }),
    )
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        // the tag was found - toggle existing tag id
        dispatch(toggleTagOnPost(data.tag, postId, true));
      })
      .catch((error) => {
        if (error.response.status === 404) {
          // the tag was not found - create it!
          dispatch(createTag(data))
            .then((data) => {
              dispatch(toggleTagOnPost(data.tag, postId, true));
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  };
}

/**
 * Creates a new tag
 *
 * @param {object} data
 * @returns {Promise}
 */
export function createTag(data) {
  return (dispatch) => {
    const url = api('/tags');

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
        // do stuff
        dispatch({
          type: constants.TAG_CREATED,
          payload: { tag: data.tag },
        });
        // return data so that next promise can use it
        return data;
      })
      .catch((error) => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Toggles a tag on a post
 *
 * @param {object} tag
 * @param {int} post_id
 * @param {boolean} status - true to add the tag to a post, false to remove it from the post
 * @returns {Promise}
 */
function toggleTagOnPost(tag, post_id, status) {
  return (dispatch) => {
    const url = api('/toggle-tag-on-post');
    const tagID = tag.id;
    const data = { post_id, tag_id: tagID, status };

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
          type: constants.POST_TAGS_UPDATED,
          payload: { postID: post_id, tag, status },
        });
      })
      .catch((error) => {
        dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      });
  };
}

/**
 * Removes a tag from a post
 *
 * @param {object} tag - the tag
 * @param {int} postId - the post id
 * @returns {Promise}
 */
export function removeTagFromPost(tag, postId) {
  return (dispatch) => dispatch(toggleTagOnPost(tag, postId, false));
}
