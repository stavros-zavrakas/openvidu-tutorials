import axios from 'axios';

import {
  OPENVIDU_FETCH_TOKEN,
} from './types';

const API_URL = process.env.REACT_APP_API_URL || '';

export const getToken = payload => {
  const url = `${API_URL}/api-sessions/get-token`;

  const reqOpts = {
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    json: true,
    data: payload
  };

  const request = axios(reqOpts);

  return {
    type: OPENVIDU_FETCH_TOKEN,
    payload: request
  };
};