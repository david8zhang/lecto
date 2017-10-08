import { combineReducers } from 'redux';
import { StreamsReducer } from '../../StreamModule';
import { ProfileReducer, AuthReducer } from '../../ProfileModule';

export default combineReducers({
	streams: StreamsReducer,
	profile: ProfileReducer,
	auth: AuthReducer
});
