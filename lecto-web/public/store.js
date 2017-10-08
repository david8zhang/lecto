import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { BaseReducer } from './modules';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);
const store = createStoreWithMiddleware(
	BaseReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export { store };
