import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import PlusIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import React from 'react';


export function DisplayConfig(props) {

	const changeFontSize = delta => {
		localStorage.fontSize = parseInt(localStorage.fontSize, 10) + delta;
		props.onChange();
	};

	const changeColor = (target, evt) => {
		localStorage[target] = evt.target.value;
		props.onChange();
	};

	return (
		<Dialog open>
			<DialogContent>
				<div>
					<Typography>Font Size</Typography>
					<Button onClick={ () => changeFontSize(-1) }><MinusIcon /></Button>
					<Button onClick={ () => changeFontSize(1) }><PlusIcon /></Button>
				</div>
				<div>
					<Typography>Background Color</Typography>
					<input type="color" value={ localStorage.backgroundColor } onChange={ evt => changeColor('backgroundColor', evt) } />
				</div>
				<div>
					<Typography>Text Color</Typography>
					<input type="color" value={ localStorage.textColor } onChange={ evt => changeColor('textColor', evt) } />
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={ props.onClose }>確定</Button>
			</DialogActions>
		</Dialog>
	);
}