import { combineReducers } from 'redux';
import applicationReducer from './application-reducer';
import tasksReducer from './tasks-reducer.js';

export default combineReducers({
  application: applicationReducer,
  taskData: tasksReducer
});
