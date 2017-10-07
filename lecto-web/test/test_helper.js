// Setting up JSDOM
/* eslint-disable */
import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'jsdom';

// Chai plugins
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import chaiImmutable from 'chai-immutable';

// Initializing Redux state
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducers } from '../public/reducers';

global.document = jsdom.jsdom('<!doctype html><html><body><div id="container"></div></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
const $ = _$(window);

chaiJquery(chai, chai.util, $);
chai.use(chaiImmutable);

function renderComponent(ComponentClass, props= {}, state = {}) {
	const componentInstance = TestUtils.renderIntoDocument(
		<Provider store={createStore(reducers, state)}>
			<ComponentClass {...props} />
		</Provider>
	);

	return $(ReactDOM.findDOMNode(componentInstance));
}

$.fn.simulate = function (eventName, value) {
	if (value) {
		this.val(value);
	}
	TestUtils.Simulate[eventName](this[0]);
};

export { renderComponent, expect };
/* eslint-enable */