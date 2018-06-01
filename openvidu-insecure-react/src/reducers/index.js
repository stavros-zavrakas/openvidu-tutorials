import { combineReducers } from 'redux';

import OpenViduReducer from './OpenViduReducer';

const rootReducer = combineReducers({
  openvidu: OpenViduReducer
});

export default rootReducer;