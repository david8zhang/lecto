/**
 * Log the user in
 * 
 * @param  {Object} params Contains the email and password to check credentials against
 *
 * @param {Object} firebase The pre-configured firebase object that stores the 
 *                          serialized information
 * 
 * @return {Promise}       A promise that resolves when user is successfully logged in
 */
export const login = (params, firebase) => {
	const { email, password } = params;
	return firebase.auth().signInWithEmailAndPassword(email, password)
		.then(() => {
			const { uid } = firebase.auth().currentUser;

			/** Return the user id of the authenticated user */
			return uid;
		})
		.catch((err) => err);
};

/**
 * Log the user out
 * 
 * @param  {Object} firebase The pre-configured firebase object that stores the
 *                           serialized information
 *                           
 * @return {Promise}          A promise that resolves when user is successfully logged out
 */
export const logout = (firebase) => (
	firebase.auth().signOut()
		.then(() => null)
		.catch((err) => err)
);


/**
 * Register a new account and create a new user in the database
 * 
 * @param  {Object} params Contains the email and password to create a new user with
 *
 * @param {Object} attributes Contains the attributes of the player to fill in as defaults
 *
 * @param {Object} firebase The firebase object that stores the serialized information
 * 
 * @return {Promise}        A promise that resolves when the user is successfully created
 */
export const signUp = (params, attributes, firebase) => {
	const { email, password } = params;
	return firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(() => {
			const { uid } = firebase.auth().currentUser;

			// Create a new node in the firebase table that serializes user data
			const newUserRef = firebase.database().ref('users');
			newUserRef.child(uid).update({
				...attributes,
				uid
			});

			/** Return the user id of the authenticated user */
			return uid;
		})
		.catch((err) => err);
};
