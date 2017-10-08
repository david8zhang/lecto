const SET_PROFILE = 'SET_PROFILE';

export const setProfile = (profile) => ({
	type: SET_PROFILE,
	payload: profile
});

export default (state = null, action) => {
	switch (action.type) {
		case SET_PROFILE: {
			return action.payload;
		}
		default:
			return state;
	}
};
