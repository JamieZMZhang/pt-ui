import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as React from 'react';
import { fetchPt } from './../fetch-pt';
import { Loading } from './Loading';

const getContent = cell => cell.textContent.trimStart().trimEnd();

const newArticleAnchor = {
	vertical: 'top',
	horizontal: 'left',
};

export function Bookcase(props) {
	const [reloadKey, setReloadKey] = React.useState(0);

	const [list, setList] = React.useState(null);

	const [filterNew, setFilterNew] = React.useState(false);

	const filteredList = React.useMemo(
		() => list === null
			? null
			: filterNew
				? list.filter(row => row.isNew)
				: list,
		[list, filterNew]
	);

	React.useEffect(
		() => {
			setList(null)
			fetchPt('https://www.ptwxz.com/modules/article/bookcase.php').then(res => {
				const html = window.document.createElement('html');
				html.innerHTML = res

				const books = [...html.querySelectorAll('tr')].slice(1, -1);
				setList(books.map(tr => ({
					isNew: !!tr.cells[1].querySelector('.hottext'),
					name: tr.cells[1].querySelector('a').innerText,
					latest: getContent(tr.cells[2]),
					bookmark: getContent(tr.cells[3]),
					link: tr.cells[3].querySelector('a').href,
				})));
			});
		},
		[reloadKey]
	);


	return (
		<>
			<AppBar position="sticky">
				<Toolbar>
					<div>
						<IconButton onClick={ () => setReloadKey(+new Date()) }><RefreshIcon /></IconButton>
					</div>
				</Toolbar>
			</AppBar>
			<Container style={ { paddingTop: 8 } }>
				{
					filteredList === null
						? <Loading />
						: <>
							<FormControlLabel
								control={ <Switch checked={ filterNew } onChange={ evt => setFilterNew(evt.target.checked) } /> }
								label={ filterNew ? '新文' : '全部' }
							/>

							<List>
								{ filteredList.map(book => (
									<ListItem button key={ book.name } onClick={ () => props.onChangeUrl(book.link) }>
										<ListItemText
											primary={ book.isNew ? <Badge variant="dot" color="secondary" badgeContent=" " anchorOrigin={ newArticleAnchor }>{ book.name }</Badge> : book.name }
											secondary={ <>最新：{ book.latest }<br />書籤：{ book.bookmark }</> }
										/>
									</ListItem>
								)) }
							</List>
						</>
				}
			</Container>
		</>
	);
}