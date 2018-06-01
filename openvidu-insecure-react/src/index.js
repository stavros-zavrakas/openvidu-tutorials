import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';

import './index.css';
import App from './App';
import reducers from './reducers';

import registerServiceWorker from './registerServiceWorker';

const middlewareStack = applyMiddleware(ReduxPromise);
const createStoreWithMiddleware = middlewareStack(createStore);
let store = createStoreWithMiddleware(reducers);

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
registerServiceWorker();
