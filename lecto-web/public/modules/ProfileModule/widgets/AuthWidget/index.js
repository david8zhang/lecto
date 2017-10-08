/**
 * AUTH WIDGET
 *
 * The authentication widget contains the reducers and the API
 * interactions for authenticating users and serializing player objects
 * to the database
 *
 * @author David Zhang
 */
import * as api from './api';

/* The different types for the actions */
const SET_AUTH = 'SET_AUTH';

/**
 * Log the user into their account
 * 
 * @param {Object} params 	The parameters for logging in
 * 
 * @param {Object} firebase An object that contains a firebase configuration for
 *                          serializing objects
 * 
 * @return {Object}      The action to be handed off to the reducer
 */
export const login = (params, firebase) => {
	const loginPromise = api.login(params, firebase);
	return {
		type: SET_AUTH,
		payload: loginPromise
	};
};


/**
 * Log out the user
 * 
 * @param  {Object} firebase An object that contains a firebase configuration for
 *                           serializing objects
 *                           
 * @return {Object}          The object to be handed off to the reducer
 */
export const logout = (firebase) => {
	const logoutPromise = api.logout(firebase);
	return {
		type: SET_AUTH,
		payload: logoutPromise
	};
};

/**
 * Create a new user account
 * 
 * @param  {Object} params     the parameters for creating a new account in firebase
 * 
 * @param  {Object} attributes the attributes of the user account to create within firebase
 * 
 * @param  {Object} firebase   The firebase configuration object itself
 * 
 * @return {Object}            the action to be handed off to the reducer
 */
export const signUp = (params, attributes, firebase) => {
	const signUpPromise = api.signUp(params, attributes, firebase);
	return {
		type: SET_AUTH,
		payload: signUpPromise
	};
};

/**
 * The reducer that handles the action dispatches above
 * @param  {Boolean} state  The state of the auth flag, which determines if the
 *                          user has logged in or not
 * @param  {Object} action The action that was dispatched
 * @return {Boolean}       The authentication flag defined by the redux reducer
 */
export default (state = null, action) => {
	switch (action.type) {
		case SET_AUTH: {
			return action.payload;
		}
		default:
			return state;
	}
};
