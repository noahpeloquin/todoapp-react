import * as constants from '../constants';

const initialState = {
  user: null,
  errors: null,
  loading: false,
  mfa_needed: false,
  authenticated: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.APPLICATION_ERRORS:
      return { ...state, errors: action.payload.errors, loading: false };
    case constants.APPLICATION_LOADING:
      return { ...state, loading: true };
    case constants.APPLICATION_LOADED:
      return { ...state, loading: false };
    case constants.CURRENT_USER_LOADED:
      return {
        ...state,
        user: action.payload.user,
        authenticated: true,
        loading: false,
        errors: null
      };
    default:
      return state;
  }
};
