/**
 * PROFILE WIDGET
 *
 * The profile widget defines the API interactions and the redux actions for
 * creating new profiles and fetching profiles
 *
 * @author David Zhang
 */

import * as api from './api';

/** @type {String} The types for the actions */
const FETCH_PROFILE = 'FETCH_PROFILE';
const EDIT_PROFILE = 'EDIT_PROFILE';
const SET_PROFILE = 'SET_PROFILE';

export const setProfile = (profile) => ({
	type: SET_PROFILE,
	payload: profile
});

/**
 * Fetch a profile given its uid
 * 
 * @param  {String} uid      the id of the user to fetch a profile for
 * @param  {Object} firebase The pre-configured firebase object to fetch stuff from
 * @return {Object}          The action to dispatch to the reducer
 */
export const fetchProfile = (uid, firebase) => {
	const getProfilePromise = api.fetchProfile(uid, firebase);
	return {
		type: FETCH_PROFILE,
		payload: getProfilePromise
	};
};

/**
 * Edit the profile given the id of the profile to edit and the
 * new profile to change it to
 * 
 * @param  {String} uid        the id of the profile to edit
 * @param  {Object} newProfile The new profile
 * @param  {Object} firebase   The pre-configured firebase object to edit stuff in
 * @return {Object}            The action to dispatch to the reducer
 */
export const editProfile = (uid, newProfile, firebase) => {
	const editProfilePromise = api.editProfile(uid, newProfile, firebase);
	return {
		type: EDIT_PROFILE,
		payload: editProfilePromise
	};
};

export default (state = null, action) => {
	switch (action.type) {
		case SET_PROFILE: {
			return action.payload;
		}
		case FETCH_PROFILE: {
			return action.payload;
		}
		case EDIT_PROFILE: {
			const newState = { ...state };
			Object.keys(action.payload).forEach((key) => {
				newState[key] = action.payload[key];
			});
			return newState;
		}
		default:
			return state;
	}
};
