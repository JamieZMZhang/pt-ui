import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';

const toolbarStyle = {
	display: 'flex',
	justifyContent: 'space-between'
};

const zIndex = { zIndex: 0 };

export function PtToolbar(props) {
	return (
		<>
			<AppBar position="fixed">
				<Toolbar style={ toolbarStyle } children={ props.children } />
			</AppBar>
			<AppBar position="static" elevation={ 0 } style={ zIndex }><Toolbar /></AppBar>
		</>
	);
}