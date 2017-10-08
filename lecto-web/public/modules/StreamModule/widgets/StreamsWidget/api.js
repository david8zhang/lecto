/**
 * Fetch a list of streams from firebase
 * @param  {Object} firebase The firebase object
 * @return {Promise}          A promise that evaluates some stuff
 */
export const fetchStreams = (firebase) => {
	const streamRef = firebase.database().ref('streams');
	return streamRef.once('value').then((res) => res.val());
};

/**
 * Create a new stream
 * @param  {Object} firebase  The firebase configuration object
 * @param  {Object} newStream the new stream object
 * @return {Promise}           A promise that evaluates to creating a new stream
 */
export const editStream = (firebase, newStream) => {
	const { streamId } = newStream;
	const streamRef = firebase.database().ref(`streams/${streamId}`);
	return streamRef.update({
		...newStream
	}).then(() => newStream);
};
