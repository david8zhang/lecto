import * as api from './api.js';

const FETCH_STREAMS = 'FETCH_STREAMS';
const SET_STREAM = 'SET_STREAM';
const CREATE_STREAM = 'CREATE_STREAM';
const EDIT_STREAM = 'EDIT_STREAM';

export const fetchStreams = (firebase) => {
	const fetchStreamPromise = api.fetchStreams(firebase);
	return {
		type: FETCH_STREAMS,
		payload: fetchStreamPromise
	};
};

export const setStream = (streamId) => ({
	type: SET_STREAM,
	payload: streamId
});

export const createStream = (firebase, newStream) => {
	const createStreamPromise = api.createStream(firebase, newStream);
	return {
		type: CREATE_STREAM,
		payload: createStreamPromise
	};
};

export const editStream = (firebase, editedStream) => {
	const editStreamPromise = api.editStream(firebase, editedStream);
	return {
		type: EDIT_STREAM,
		payload: editStreamPromise
	};
};

export default (state = {}, action) => {
	switch (action.type) {
		case FETCH_STREAMS: {
			const newState = { ...state };
			newState.allStreams = action.payload;
			return newState;
		}
		case SET_STREAM: {
			const newState = { ...state };
			newState.room = action.payload;
			return newState;
		}
		case CREATE_STREAM: {
			const newState = { ...state };
			const { streamersId } = action.payload;
			if (!newState.allStreams) {
				newState.allStreams = { [streamersId]: action.payload };
			} else {
				newState.allStreams[streamersId] = action.payload;
			}
			return newState;
		}
		case EDIT_STREAM: {
			const newState = { ...state };
			const { streamId } = action.payload;
			newState.allStreams[streamId] = action.payload;
			return newState;
		}
		default:
			return state;
	}
};
