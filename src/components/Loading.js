import { CircularProgress } from '@material-ui/core';
import React from 'react';

export function Loading() {
	return (
		<div style={ {
			position: 'fixed',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		} }>
			<CircularProgress />
		</div>
	);
}