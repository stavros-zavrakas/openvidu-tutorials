import {
  OPENVIDU_FETCH_TOKEN,
  OPENVIDU_FETCH_SESSION,
} from '../actions/types';

const INITIAL_STATE = {
  token: null,
  session: null
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case OPENVIDU_FETCH_TOKEN:
      return {...state, ...{ token: action.token } };
    case OPENVIDU_FETCH_SESSION:
      return {...state, ...{ session: action.session } };
    default: {
      return state;
    }
  }
};