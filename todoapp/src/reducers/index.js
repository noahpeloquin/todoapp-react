import { combineReducers } from 'redux';
import applicationReducer from './application-reducer';
import postsReducer from './posts-reducer.js';

export default combineReducers({
  application: applicationReducer,
  postData: postsReducer
});
