import React from 'react';
import { Route } from 'react-router';

/** Containers */
import { BaseContainer } from './modules';

export default (
	<Route path='/*' component={BaseContainer} />
);
