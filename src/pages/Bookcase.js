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
	const { onChangeUrl } = props;

	const [reloadKey, setReloadKey] = React.useState(0);

	const [list, setList] = React.useState(null);

	const [filterNew, setFilterNew] = React.useState(true);

	const filteredList = React.useMemo(
		() => list === null
			? null
			: filterNew
				? list.filter(row => row.bookmarkedChapterTitle !== row.latestChapterTitle)
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
					latestChapterTitle: getContent(tr.cells[2]),
					latestChapterLink: tr.cells[2].querySelector('a').href,
					bookmarkedChapterTitle: getContent(tr.cells[3]),
					bookmarkedChapterLink: tr.cells[3].querySelector('a').href,
					bookmarkId: /delid=(\d+)/.exec(tr.cells[6].querySelector('a').href)[1],
					bookId: /aid=(\d+)/.exec(tr.cells[1].querySelector('a').href)[1],
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

	const onDeleteBookmark = React.useCallback(
		async bookmarkId => {
			if (window.confirm('確定要刪除本書嗎？')) {
				await fetch(`https://www.ptwxz.com/modules/article/bookcase.php?delid=${bookmarkId}`);
				setMenuTarget(null);
				onReload();
			};
		},
		[onReload, setMenuTarget]
	);

	const onShowList = React.useCallback(
		bookId => {
			onChangeUrl(`https://www.ptwxz.com/html/${Math.floor(parseInt(bookId, 10) / 1000)}/${bookId}/`)
		},
		[onChangeUrl]
	);

	return (
		<>
			<Container style={{ paddingBottom: 8 }} maxWidth="sm">
				{
					filteredList === null
						? <Loading />
						: <>
							<FormControlLabel
								control={<Switch checked={filterNew} onChange={evt => setFilterNew(evt.target.checked)} />}
								label={<span style={{ color: localStorage.textColor }} children={filterNew ? '更新' : '全部'} />}
							/>
							<List style={{ color: localStorage.textColor }}>
								{filteredList.map(book => (
									<ListItem
										button
										key={book.name}
										onClick={() => book.bookmarkedChapterTitle ? onChangeUrl(book.bookmarkedChapterLink) : onShowList(book.bookId)}
										onContextMenu={evt => {
											evt.preventDefault();
											setMenuTarget({ el: evt.currentTarget, data: book });
										}}>
										<ListItemText
											color="inherit"
											primary={book.latestChapterTitle !== book.bookmarkedChapterTitle ? <Badge variant="dot" color="secondary" badgeContent=" " anchorOrigin={newArticleAnchor} children={book.name} /> : book.name}
											secondary={<span style={{ color: localStorage.textColor + 'aa' }}>最新：{book.latestChapterTitle}<br />書籤：{book.bookmarkedChapterTitle}</span>}
										/>
									</ListItem>
								))}
							</List>
							{
								menuTarget &&
								<Menu open={!!menuTarget} anchorEl={menuTarget && menuTarget.el} onClose={() => setMenuTarget(null)}>
									<MenuItem onClick={() => onChangeUrl(menuTarget.data.latestChapterLink)} children="最新章節" />
									<MenuItem onClick={() => onShowList(menuTarget.data.bookId)} children="章節列表" />
									<Divider />
									<MenuItem onClick={() => onDeleteBookmark(menuTarget.data.bookmarkId)} children="刪除書籤" style={{ color: 'red' }} />
								</Menu>
							}
						</>
				}
			</Container>
			<PtToolbar>
				<IconButton color="inherit" onClick={onReload}><RefreshIcon /></IconButton>
			</PtToolbar>
		</>
	);
}