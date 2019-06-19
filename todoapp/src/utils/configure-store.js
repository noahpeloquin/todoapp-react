import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from '../middleware/logger';
import combinedReducer from '../reducers/index';
import DevTools from '../components/DevTools';

const storeEnhancers = [];

if (process.env.NODE_ENV === 'development') {
  storeEnhancers.push(DevTools.instrument());
}

const combinedCreateStore = compose(...storeEnhancers)(createStore);

let finalCreateStore;
if (process.env.NODE_ENV === 'development') {
  finalCreateStore = applyMiddleware(thunk, logger)(combinedCreateStore);
} else {
  finalCreateStore = applyMiddleware(thunk)(combinedCreateStore);
}

export default initialState => {
  const store = finalCreateStore(combinedReducer, initialState);

  return store;
};
