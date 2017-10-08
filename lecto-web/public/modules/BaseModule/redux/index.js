import { combineReducers } from 'redux';
import { StreamsReducer } from '../../StreamModule';
import { ProfileReducer } from '../../ProfileModule';

export default combineReducers({
	streams: StreamsReducer,
	profile: ProfileReducer
});
