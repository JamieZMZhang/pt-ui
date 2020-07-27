import { Snackbar } from '@material-ui/core';
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
				data.title = title.innerText;

				data.before = html.querySelector('.toplink a:nth-child(1)').href;
				data.list = html.querySelector('.toplink a:nth-child(2)').href + 'index.html';
				data.after = html.querySelector('.toplink a:nth-child(3)').href;


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



	return (
		<>
			<Snackbar open={ isBookmarked } onClose={ () => setIsBookmarked(false) } message="已加入書籤" style={ { backgroundColor: localStorage.backgroundColor, color: localStorage.textColor } } />
			{
				showDisplayConfig &&
				<DisplayConfig
					onChange={ () => rerender(+new Date()) }
					onClose={ () => setShowDisplayConfig(false) }
				/>
			}
			<Container key={ props.url }>
				{
					content === null
						? <Loading />
						: <>
							<Typography variant="h5" style={ { paddingTop: 8, marginBottom: 36, color: localStorage.textColor, } } children={ content.title } />
							<Typography style={ { fontSize: parseInt(localStorage.fontSize, 10), whiteSpace: 'pre-wrap', color: localStorage.textColor, paddingBottom: 200, userSelect: 'none' } } children={ content.article } />
						</>
				}
			</Container>
			<PtToolbar>
				<div style={ { color: 'inherit' } }>
					<IconButton color="inherit" onClick={ () => props.onChangeUrl('https://www.ptwxz.com/modules/article/bookcase.php') }><HomeIcon /></IconButton>
					<IconButton color="inherit" onClick={ () => props.onChangeUrl(content.list) }><ListIcon /></IconButton>
					<IconButton color="inherit" onClick={ onBookmark }><FavoriteIcon /></IconButton>
					<IconButton color="inherit" onClick={ () => setReloadKey(+new Date()) }><RefreshIcon /></IconButton>
					<IconButton color="inherit" onClick={ () => setShowDisplayConfig(true) }><TextFormatIcon /></IconButton>
				</div>
				<div style={ { color: 'inherit' } }>
					<IconButton color="inherit" disabled={ !content || content.before.endsWith('index.html') } onClick={ () => props.onChangeUrl(content.before) }><NavBeforeIcon /></IconButton>
					<IconButton color="inherit" disabled={ !content || content.after.endsWith('index.html') } onClick={ () => props.onChangeUrl(content.after) }><NavNextIcon /></IconButton>
				</div>
			</PtToolbar>
		</>
	);
}