import sweetalert from 'sweetalert';
import * as constants from '../constants';
import {
  checkStatus,
  parseJSON,
  api,
  tokenize,
  dispatchJSONErrors,
  get
} from '../utils/functions';

import history from '../utils/history';

/**
 * Loads all tasks - INTERNAL FUNCTION
 * @returns {Promise}
 */
export function loadTasks() {
  return async dispatch => {
    const url = '/tasks';
    try {
      let data = await dispatch(get(url));

      await dispatch({
        type: constants.TASKS_LOADED,
        payload: { tasks: data.tasks }
      });

      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return data;
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      dispatch({
        type: constants.GET_REQUEST_FINISHED,
        payload: { url: url }
      });
    }
  };
}

/**
 * Loads a single blog task - INTERNAL FUNCTION
 *
 * @param {string} url_path - url_path of task
 * @returns {Promise}
 */
export function loadTaskByUrl(url_path) {
  return async dispatch => {
    const url = '/tasks?url_path=' + url_path;
    try {
      let data = await dispatch(get(url));
      await dispatch({
        type: constants.SINGLE_TASK_LOADED,
        payload: { task: data.task }
      });
      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return data;
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      dispatch({
        type: constants.GET_REQUEST_FINISHED,
        payload: { url: url }
      });
    }
  };
}

/**
 * Gets all tasks written by author with userId - INTERNAL FUNCTION
 *
 * @param {string} userId
 * @returns {Promise}
 */
export function loadTasksByUserId(userId) {
  let url = `/users/${userId}/tasks`;
  return async dispatch => {
    try {
      let singleTask = await dispatch(get(url));
      await dispatch({
        type: constants.SINGLE_TASK_LOADED,
        payload: { task: singleTask.task }
      });
      dispatch({ type: constants.GET_REQUEST_FINISHED, payload: { url } });
      return singleTask;
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
      dispatch({
        type: constants.GET_REQUEST_FINISHED,
        payload: { url: url }
      });
    }
  };
}

/**
 * Updates a task
 *
 * @param {object} data
 * @returns {Promise}
 */
export function updateTask(data) {
  return async dispatch => {
    try {
      let taskData = await fetch(
        api('/tasks/' + data.task.id),
        tokenize({
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
      );
      let status = await checkStatus(taskData);
      let task = await parseJSON(status);

      await dispatch({
        type: constants.TASK_UPDATED,
        payload: { task: task }
      });

      history.push('/');
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
    }
  };
}

/**
 * Deletes a task
 *
 * @param {object} data
 * @returns  {Promise}
 */
export function deleteTask(data) {
  return async dispatch => {
    try {
      let taskData = await fetch(
        api('/tasks/' + data.task.id),
        tokenize({
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
      );
      let status = await checkStatus(taskData);
      let task = await parseJSON(status);

      await dispatch({
        type: constants.TASK_DELETED,
        payload: { task: task }
      });

      history.push('/');
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
    }
  };
}

/**
 * Creates a task
 *
 * @param {object} data - consists of task and user objects
 * @returns {Promise}
 */
export function newTask(data) {
  return async dispatch => {
    try {
      let taskData = await fetch(
        api('/tasks'),
        tokenize({
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
      );
      let status = await checkStatus(taskData);
      let task = await parseJSON(status);
      await dispatch({
        type: constants.TASK_CREATED,
        payload: { task: task.task }
      });

      // redirect to edit-task screen after successful task creation
      history.push('/');
    } catch (error) {
      dispatchJSONErrors(dispatch, constants.APPLICATION_ERRORS, error);
    }
  };
}
