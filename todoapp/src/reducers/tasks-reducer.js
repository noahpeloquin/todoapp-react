import * as constants from '../constants';
import * as _ from 'lodash';

const initialState = {
  tasks: [], // empty array of tasks
  authors: [], // empty array of authors
  apiUrlsLoading: [], // array that keeps track of which tasks are currently loading
  apiUrlsLoaded: [] // array that keeps track of which tasks have loaded
};

export default (state = initialState, action) => {
  let x, y; // just a dummy variable so that we can use block-scoping inside of the switch statement
  switch (action.type) {
    case constants.AUTHORS_LOADED:
      x = _.uniq([...action.payload.authors, ...state.authors], x => x.id);
      return { ...state, authors: x };

    case constants.GET_REQUEST_MADE:
      x = _.uniq([action.payload.url, ...state.apiUrlsLoading]);
      return { ...state, apiUrlsLoading: x };

    case constants.GET_REQUEST_FINISHED:
      // subtract url from apiUrlsLoading array
      x = state.apiUrlsLoading.filter(x => x !== action.payload.url);
      // add url to apiUrlsLoaded array
      y = _.uniq([action.payload.url, ...state.apiUrlsLoaded]);
      return { ...state, apiUrlsLoading: x, apiUrlsLoaded: y };

    case constants.TASK_CREATED:
      x = _.uniq([action.payload.task, ...state.tasks], x => x.id);
      return { ...state, tasks: x };

    case constants.TASK_UPDATED:
      x = state.tasks.map(task => {
        if (task.id === action.payload.task.id) {
          return action.payload.task;
        } else {
          return task;
        }
      });
      return { ...state, tasks: x };
    case constants.TASKS_LOADED:
      x = _.uniq([...action.payload.tasks, ...state.tasks], x => x.id);
      return { ...state, tasks: x };

    case constants.SINGLE_AUTHOR_LOADED:
      x = _.uniq([action.payload.author, ...state.authors]);
      return { ...state, authors: x };

    case constants.SINGLE_TASK_LOADED:
      x = _.uniq([action.payload.task, ...state.tasks], x => x.id);
      return { ...state, tasks: x };

    case constants.TASK_DELETED:
      x = state.tasks.filter(x => x.id !== action.payload.task.deleted_id);
      return { ...state, tasks: x };

    case constants.CURRENT_USER_LOADED:
      x = state.authors.map(author => {
        if (author.id === action.payload.user.id) {
          return action.payload.user;
        } else {
          return author;
        }
      });
      return { ...state, authors: x };

    default:
      return state;
  }
};
