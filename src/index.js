import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ErrorBounday } from './pages/ErrorBoundary';

function init() {
	document.clear();
	document.write(`
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
	<div id="root" style="width:100vw;height:100vh;display:flex;flex-direction:column"></div>
`);
	ReactDOM.render(
		<ErrorBounday>
			<CssBaseline />
			<App />
		</ErrorBounday>, document.getElementById('root'));
}

try {
	init();
} catch (ex) {
	alert(`${ex.message}\n\n${ex.stack}`)
}
