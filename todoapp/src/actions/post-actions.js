import sweetalert from 'sweetalert';
import * as constants from '../constants';
import { checkStatus, parseJSON, api, tokenize, dispatchJSONErrors, get } from '../utils/functions';

import history from '../utils/history';

/**
 * Loads all posts - INTERNAL FUNCTION
 * @returns {Promise}
 */
export function loadPosts() {
  return async dispatch => {
    const url = '/posts';
    try {
      let data = await dispatch(get(url));
      await dispatch({
        type: constants.POSTS_LOADED,
        payload: { posts: data.posts },
      });

      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return data;
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      dispatch({
        type: constants.GET_REQUEST_FINISHED,
        payload: { url: url },
      });
    }
  };
}

/**
 * Loads a single blog post - INTERNAL FUNCTION
 *
 * @param {string} url_path - url_path of post
 * @returns {Promise}
 */
export function loadPostByUrl(url_path) {
  return async dispatch => {
    const url = '/posts?url_path=' + url_path;
    try {
      let data = await dispatch(get(url));
      await dispatch({
        type: constants.SINGLE_POST_LOADED,
        payload: { post: data.post },
      });
      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return data;
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      dispatch({
        type: constants.GET_REQUEST_FINISHED,
        payload: { url: url },
      });
    }
  };
}

/**
 * Loads a set of posts given tag_text if not already loaded
 *
 * @param {string} tag_text
 * @returns {Promise}
 */
export function loadPostsByTag(tag_text) {
  let url;
  return async dispatch => {
    try {
      let tag = await getTagByTagText(tag_text);
      url = `/tags/${tag.tag.id}/posts`;
      let postsLoaded = await dispatch(get(url));

      await dispatch({
        type: constants.POSTS_LOADED,
        payload: { posts: postsLoaded.posts },
      });
      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return postsLoaded;
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      dispatch({
        type: constants.GET_REQUEST_FINISHED,
        payload: { url: url },
      });
    }
  };
}

/**
 * Gets all posts written by author with userId - INTERNAL FUNCTION
 *
 * @param {string} userId
 * @returns {Promise}
 */
export function loadPostsByUserId(userId) {
  let url = `/users/${userId}/posts`;
  return async dispatch => {
    try {
      let singlePost = await dispatch(get(url));
      await dispatch({
        type: constants.SINGLE_POST_LOADED,
        payload: { post: singlePost.post },
      });
      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return singlePost;
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      dispatch({
        type: constants.GET_REQUEST_FINISHED,
        payload: { url: url },
      });
    }
  };
}

/**
 * Updates a post
 *
 * @param {object} data
 * @returns {Promise}
 */
export function updatePost(data) {
  return async dispatch => {
    try {
      let postData = await fetch(
        api('/posts/' + data.post.id),
        tokenize({
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }),
      );
      let status = await checkStatus(postData);
      let post = await parseJSON(status);

      await dispatch({
        type: constants.POST_UPDATED,
        payload: { post: post.post },
      });

      await sweetalert({
        title: 'Success',
        type: 'success',
        text: 'The post was successfully updated',
      });
      // redirect if url changed
      const old_url = window.location.pathname.match(/\/posts\/(.*)\/edit/)[1];
      if (old_url !== data.post.url_path) {
        const redirectUrl = `/posts/${data.post.url_path}/edit`;
        history.push(redirectUrl);
      }
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
    }
  };
}

/**
 * Creates a post
 *
 * @param {object} data - consists of post and user objects
 * @returns {Promise}
 */
export function newPost(data) {
  return async dispatch => {
    try {
      let postData = await fetch(
        api('/posts'),
        tokenize({
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }),
      );
      let status = await checkStatus(postData);
      let post = await parseJSON(status);
      await dispatch({
        type: constants.POST_CREATED,
        payload: { post: post.post },
      });

      await sweetalert({
        title: 'Success',
        type: 'success',
        text: 'Post successfully created',
      });
      // redirect to edit-post screen after successful post creation
      history.push('/my-account');
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
    }
  };
}

export function uploadImg(data) {
  return async dispatch => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'img') formData.append(key, value);
        else formData.append(key, JSON.stringify(value));
      });

      // Test to see if form data was complete
      // for (var pair of formData.entries()) {
      //   console.log(pair[0] + ', ' + pair[1]);
      // }

      const postData = await fetch(
        api(`/upload/${data.post.id}`),
        tokenize({
          method: 'post',
          body: formData,
        }),
      );

      const status = await checkStatus(postData);
      const post = await parseJSON(status);

      await dispatch({
        type: constants.POST_UPDATED,
        payload: { post: post.post },
      });

      if (data.isNew && data.isNew === true) {
        history.push(`/posts/${post.post.url_path}/edit`);
        window.location.reload();
      }
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
    }
  };
}

/*
 * Private Functions
 */

/**
 * Loads a single tag from queried tag text - NOT A PUBLIC FUNCTION, INTERNAL TO POST-ACTIONS
 * This is here in post-actions because it is used by loadPostsByTag
 *
 * @param {string} tag_text

 */
async function getTagByTagText(tag_text) {
  try {
    let tagData = await fetch(
      api('/tags?text=' + tag_text),
      tokenize({
        method: 'get',
      }),
    );
    let status = await checkStatus(tagData);
    let tag = await parseJSON(status);
    return tag;
  } catch (error) {
    return error;
  }
}
