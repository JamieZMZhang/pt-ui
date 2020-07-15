import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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
			localStorage.fontSize = localStorage.fontSize || 16;
			localStorage.backgroundColor = localStorage.backgroundColor || 'white';
			localStorage.textColor = localStorage.textColor || 'black';
		},
		[]
	);

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
			{
				isBookmarked &&
				<Dialog open>
					<DialogContent>
						<DialogContentText>已加入書籤</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={ () => setIsBookmarked(false) }>確定</Button>
					</DialogActions>
				</Dialog>
			}
			{
				showDisplayConfig &&
				<DisplayConfig
					onChange={ () => rerender(+new Date()) }
					onClose={ () => setShowDisplayConfig(false) }
				/>
			}
			<Container>
				{
					content === null
						? <Loading />
						: <>
							<Typography variant="h5" style={ { paddingTop: 8, marginBottom: 36, color: localStorage.textColor, } } children={ content.title } />
							<Typography style={ { fontSize: parseInt(localStorage.fontSize, 10), whiteSpace: 'pre-wrap', color: localStorage.textColor, paddingBottom: 36, } } children={ content.article } />
							{
								!content.after.endsWith('index.html') &&
								<div style={ { textAlign: 'center', paddingBottom: 64, color: localStorage.textColor } }>
									<IconButton color="inherit" onClick={ () => props.onChangeUrl(content.after) } children={ <NavNextIcon /> } />
								</div>
							}
						</>
				}
			</Container>
		</>
	);
}