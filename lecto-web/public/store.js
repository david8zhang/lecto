import { createStore, applyMiddleware } from 'redux';
import { BaseReducer } from './modules';

const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStoreWithMiddleware(BaseReducer);

export { store };
