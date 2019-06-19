// import * as constants from '../constants';
// import * as _ from 'lodash';

const initialState = {
  posts: [], // empty array of posts
  authors: [], // empty array of authors
  apiUrlsLoading: [], // array that keeps track of which posts are currently loading
  apiUrlsLoaded: [] // array that keeps track of which posts have loaded
};

export default (state = initialState, action) => {
  //let x, y; // just a dummy variable so that we can use block-scoping inside of the switch statement
  switch (action.type) {
    default:
      return state;
  }
};
