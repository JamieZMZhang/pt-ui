import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ErrorBounday } from './pages/ErrorBoundary';


function init() {
	localStorage.fontSize = localStorage.fontSize || 16;
	localStorage.backgroundColor = localStorage.backgroundColor || 'white';
	localStorage.textColor = localStorage.textColor || 'black';

	document.clear();
	document.write(`
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
	<div id="root"></div>
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
