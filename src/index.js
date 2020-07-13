import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function init() {
	document.write(`<div id="root" style="width:100vw;height:100vh;display:flex;flex-direction:column"></div>`);
	ReactDOM.render(
		<>
			<CssBaseline />
			<App />
		</>, document.getElementById('root'));
}

init();
