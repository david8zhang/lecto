/** Babel require hook to pretranspile all es6 code */
require('babel-register');

/** CSS modules requirehook so that imported css files won't cause problems */
require('css-modules-require-hook')({
  // This path should match the localIdentName in your webpack css-loader config.
  generateScopedName: '[name]__[local]___[hash:base64:5]'
});

const app = require('./app');

const HOST = '0.0.0.0';
const PORT = '9000';

app.listen(PORT, HOST, () => {
	console.log(`Listening at http://${HOST}:${PORT}`);
});
