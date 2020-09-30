import { Badge, Container, Divider, FormControlLabel, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Switch } from '@material-ui/core';
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
					deleteId: /delid=(\d+)/.exec(tr.cells[6].querySelector('a').href)[1]
				})));
			});
		},
		[reloadKey]
	);

	const [menuTarget, setMenuTarget] = React.useState(null);

	const onReload = React.useCallback(
		() => {
			setReloadKey(+new Date());
		},
		[setReloadKey]
	);

	const onDeleteBookmark = async bookId => {
		if (window.confirm('確定要刪除本書嗎？')) {
			await fetch(`https://www.ptwxz.com/modules/article/bookcase.php?delid=${menuTarget.data.deleteId}`);
			onReload();
		};
	};

	return (
		<>
			<Container style={ { paddingBottom: 8 } } maxWidth="sm">
				{
					filteredList === null
						? <Loading />
						: <>
							<FormControlLabel
								control={ <Switch checked={ filterNew } onChange={ evt => setFilterNew(evt.target.checked) } /> }
								label={ <span style={ { color: localStorage.textColor } } children={ filterNew ? '更新' : '全部' } /> }
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
								<MenuItem onClick={ () => props.onChangeUrl(menuTarget.data.latestLink) } children="最新章節" />
								<Divider />
								<MenuItem onClick={ () => onDeleteBookmark(menuTarget.data.deleteId) } children="刪除書籤" style={ { color: 'red' } } />
							</Menu>
						</>
				}
			</Container>
			<PtToolbar>
				<IconButton color="inherit" onClick={ onReload }><RefreshIcon /></IconButton>
			</PtToolbar>
		</>
	);
}