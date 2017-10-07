import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import promise from 'redux-promise';
import express from 'express';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import clientRoutes from './public/routes';
import { BaseReducer } from './public/modules';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const app = express();

app.use(morgan('combined'));

/* eslint-disable */
// Configure the static files
app.use(express.static(__dirname + '/public', { maxage: '1y'}));
app.use('/static', express.static(__dirname + '/public', { maxage: '1y' }));
app.use(favicon(__dirname + '/public/static/images/favicon.ico'));
/* eslint-enable */

/** 
 * Match client side routes on server using middleware - basically,
 * if a route matches a client side route, hand it off to the client side
 * react-router
 */
app.use((req, res) => {
	const store = createStoreWithMiddleware(BaseReducer);

	match({ routes: clientRoutes, location: req.url }, (error, redirectLocation, renderProps) => {
		const html = renderToString(
			<Provider store={store}>
				<RouterContext {...renderProps} />
			</Provider>
		);

		if (error) {
			return res.status(500).send(error.message);
		}
		if (redirectLocation) {
			return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		}
		if (renderProps == null) {
			return res.status(404).send('Not Found!');
		}
		const page = renderFullPage(html, JSON.stringify(store.getState()));
		return res.status(200).send(page);
	});
});

function renderFullPage(html, initialState) {
	return `
		<!doctype html>
		<html lang="utf-8">
			<head>
				<title>protospace</title>
				<link href="https://fonts.googleapis.com/css?family=Raleway:400,600" rel="stylesheet">
				<link rel="stylesheet" href="/static/css/skeleton.css"/>
				<link rel="stylesheet" href="/static/css/normalize.css"/>
				<link rel="stylesheet" href="/static/style.css"/>
			</head>
			<body>
				<div id="container">${html}</div>
				<script>window.$REDUX_STATE=${initialState}</script>
				<script src="/static/bundle.js"></script>
			</body>
		</html>
	`;
}

module.exports = app;
