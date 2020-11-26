import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';

const toolbarStyle = {
	display: 'flex',
	justifyContent: 'space-between'
};

export function PtToolbar(props) {
	return (
		<>
			<AppBar position="static" style={{ opacity: 0 }}>
				<Toolbar />
			</AppBar>
			<AppBar position="fixed" style={{ bottom: 0, top: 'auto' }}>
				<Toolbar style={toolbarStyle} children={props.children} />
			</AppBar>
		</>
	);
}