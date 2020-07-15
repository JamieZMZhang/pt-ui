import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as React from 'react';
import { PtToolbar } from '../components/PtToolbar';
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

	const [filterNew, setFilterNew] = React.useState(true);

	const filteredList = React.useMemo(
		() => list === null
			? null
			: filterNew
				? list.filter(row => row.bookmark !== row.latest)
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
					name: tr.cells[1].querySelector('a').innerText,
					latest: getContent(tr.cells[2]),
					latestLink: tr.cells[2].querySelector('a').href,
					bookmark: getContent(tr.cells[3]),
					bookmarkLink: tr.cells[3].querySelector('a').href,
				})));
			});
		},
		[reloadKey]
	);

	const [menuTarget, setMenuTarget] = React.useState(null);

	return (
		<>
			<PtToolbar>
				<IconButton color="inherit" onClick={ () => setReloadKey(+new Date()) }><RefreshIcon /></IconButton>
			</PtToolbar>
			<Container style={ { paddingTop: 8 } }>
				{
					filteredList === null
						? <Loading />
						: <>
							<FormControlLabel
								control={ <Switch checked={ filterNew } onChange={ evt => setFilterNew(evt.target.checked) } /> }
								label={ <span style={ { color: localStorage.textColor } }>{ filterNew ? '更新' : '全部' } </span> }
							/>

							<List style={ { color: localStorage.textColor } }>
								{ filteredList.map(book => (
									<ListItem
										button
										key={ book.name }
										onClick={ () => props.onChangeUrl(book.bookmarkLink) } onContextMenu={ evt => {
											evt.preventDefault();
											setMenuTarget({ el: evt.currentTarget, data: book });
										} }>
										<ListItemText
											color="inherit"
											primary={ book.latest !== book.bookmark ? <Badge variant="dot" color="secondary" badgeContent=" " anchorOrigin={ newArticleAnchor } children={ book.name } /> : book.name }
											secondary={ <span style={ { color: localStorage.textColor + 'aa' } }>最新：{ book.latest }<br />書籤：{ book.bookmark }</span> }
										/>
									</ListItem>
								)) }
							</List>
							<Menu open={ !!menuTarget } anchorEl={ menuTarget && menuTarget.el } onClose={ () => setMenuTarget(null) }>
								<MenuItem onClick={ () => props.onChangeUrl(menuTarget.data.latestLink) }>閱讀最新</MenuItem>
							</Menu>
						</>
				}
			</Container>
		</>
	);
}