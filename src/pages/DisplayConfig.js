import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
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

	React.useEffect(
		() => {
			document.body.style.backgroundColor = localStorage.backgroundColor;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[localStorage.backgroundColor]
	);

	return (
		<Dialog open>
			<DialogContent>
				<Grid container spacing={ 2 }>
					<Grid item xs={ 12 }>
						<Typography children="Font Size" />
						<Button onClick={ () => changeFontSize(-1) }><MinusIcon /></Button>
						<Button onClick={ () => changeFontSize(1) }><PlusIcon /></Button>
					</Grid>
					<Grid item xs={ 12 }>
						<Typography children="背景顏色" />
						<input type="color" value={ localStorage.backgroundColor } onChange={ evt => changeColor('backgroundColor', evt) } />
					</Grid>
					<Grid item xs={ 12 }>
						<Typography children="字體顏色" />
						<input type="color" value={ localStorage.textColor } onChange={ evt => changeColor('textColor', evt) } />
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={ props.onClose } children="確定" />
			</DialogActions>
		</Dialog>
	);
}