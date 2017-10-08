/**
 * Fetch the profile given a user id
 * @param  {String} uid      the id of the user's profile to fetch
 * @param  {Object} firebase The pre-configured firebase object
 * @return {Promise}          A promise that resolves to the value of the profile
 */
export const fetchProfile = (uid, firebase) => {
	const profileRef = firebase.database().ref(`users/${uid}`);
	return profileRef.once('value').then((userSnap) => userSnap.val());
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
	const profileRef = firebase.database().ref(`users/${uid}`);
	return profileRef.update({
		...newProfile
	}).then(() => newProfile);
};
