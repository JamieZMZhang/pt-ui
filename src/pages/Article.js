import { Button, Menu, MenuItem, Snackbar } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import NavBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavNextIcon from '@material-ui/icons/NavigateNext';
import RefreshIcon from '@material-ui/icons/Refresh';
import TextFormatIcon from '@material-ui/icons/Settings';
import * as React from 'react';
import { PtToolbar } from '../components/PtToolbar';
import { fetchPt } from './../fetch-pt';
import { DisplayConfig } from './DisplayConfig';
import { Loading } from './Loading';

export function Article(props) {
	const [reloadKey, setReloadKey] = React.useState(0);

	const [content, setContent] = React.useState(null);

	const [, rerender] = React.useState(0);

	React.useEffect(
		() => {
			setContent(null);


			fetchPt(props.url).then(res => {
				const html = document.createElement('html');
				html.innerHTML = res;
				const data = {};

				const title = html.querySelector('h1');
				title.querySelector('a').remove();
				data.title = title.innerText.trim();

				data.prevArticleUrl = html.querySelector('.toplink a:nth-child(1)').href;
				data.listUrl = html.querySelector('.toplink a:nth-child(2)').href + 'index.html';
				data.nextArticleUrl = html.querySelector('.toplink a:nth-child(3)').href;


				const temp = document.createElement('div')
				temp.append(...[...html.childNodes[1].childNodes].filter(n => n.nodeName === 'BR' || n.nodeName === '#text'));
				temp.innerHTML = temp.innerHTML.trimStart().trimEnd();
				data.article = temp.innerHTML.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n').replace(/\n\n\n/g, '\n\n').trimStart().trimEnd();

				setContent(data);
			});
		},
		[reloadKey, props.url]
	);

	const [isBookmarked, setIsBookmarked] = React.useState(false);

	const onBookmark = () => {
		const ids = /\d+\/(\d+)\/(\d+)/.exec(props.url);
		fetch(`https://www.ptwxz.com/modules/article/addbookcase.php?bid=${ids[1]}&cid=${ids[2]}`).then(() => setIsBookmarked(true));
	};

	const [showDisplayConfig, setShowDisplayConfig] = React.useState(false);

	const [showContextMenu, setShowContextMenu] = React.useState();

	return (
		<>
			<Snackbar
				message="已加入書籤"
				open={isBookmarked}
				onClose={() => setIsBookmarked(false)}
				style={{ backgroundColor: localStorage.backgroundColor, color: localStorage.textColor, bottom: 70 }}
				action={<Button color="inherit" onClick={() => setIsBookmarked(false)} children="關閉" />}
			/>
			{
				showDisplayConfig &&
				<DisplayConfig
					onChange={() => rerender(+new Date())}
					onClose={() => setShowDisplayConfig(false)}
				/>
			}
			{
				showContextMenu &&
				<Menu open anchorReference="anchorPosition" anchorPosition={showContextMenu} onClose={() => setShowContextMenu(null)}>
					<MenuItem children="上一章" onClick={() => props.onChangeUrl(content.prevArticleUrl)} disabled={!content || content.prevArticleUrl.endsWith('index.html')} />
					<MenuItem children="下一章" onClick={() => props.onChangeUrl(content.nextArticleUrl)} disabled={!content || content.nextArticleUrl.endsWith('index.html')} />
				</Menu>
			}
			<Container key={props.url} maxWidth="sm">
				{
					content === null
						? <Loading />
						: <>
							<Typography variant="h5" style={{ paddingTop: 8, marginBottom: 36, color: localStorage.textColor, }} children={content.title} />
							<Typography
								children={content.article}
								style={{ fontSize: parseInt(localStorage.fontSize, 10), whiteSpace: 'pre-wrap', color: localStorage.textColor, paddingBottom: 200, userSelect: 'none' }}
								onContextMenu={evt => {
									evt.preventDefault();
									setShowContextMenu({ left: evt.clientX, top: evt.clientY })
								}}
							/>
						</>
				}
			</Container>
			<PtToolbar>
				<div style={{ color: 'inherit' }}>
					<IconButton color="inherit" onClick={() => props.onChangeUrl('https://www.ptwxz.com/modules/article/bookcase.php')}><HomeIcon /></IconButton>
					<IconButton color="inherit" onClick={() => props.onChangeUrl(`${content.listUrl}#${content.title}`)}><ListIcon /></IconButton>
					<IconButton color="inherit" onClick={onBookmark}><FavoriteIcon /></IconButton>
					<IconButton color="inherit" onClick={() => setReloadKey(+new Date())}><RefreshIcon /></IconButton>
					<IconButton color="inherit" onClick={() => setShowDisplayConfig(true)}><TextFormatIcon /></IconButton>
				</div>
				<div style={{ color: 'inherit' }}>
					<IconButton color="inherit" disabled={!content || content.prevArticleUrl.endsWith('index.html')} onClick={() => props.onChangeUrl(content.prevArticleUrl)}><NavBeforeIcon /></IconButton>
					<IconButton color="inherit" disabled={!content || content.nextArticleUrl.endsWith('index.html')} onClick={() => props.onChangeUrl(content.nextArticleUrl)}><NavNextIcon /></IconButton>
				</div>
			</PtToolbar>
		</>
	);
}