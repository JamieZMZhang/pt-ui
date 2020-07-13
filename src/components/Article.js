import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ListIcon from '@material-ui/icons/List';
import NavBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavNextIcon from '@material-ui/icons/NavigateNext';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as React from 'react';
import { fetchPt } from './../fetch-pt';
import { Loading } from './Loading';

export function Article(props) {
	const [reloadKey, setReloadKey] = React.useState(0);

	const [content, setContent] = React.useState(null);

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
				data.after = html.querySelector('.toplink a:nth-child(3)').href;

				const temp = document.createElement('div')
				temp.append(...[...html.childNodes[1].childNodes].filter(n => n.nodeName === 'BR' || n.nodeName === '#text'));
				temp.innerHTML = temp.innerHTML.trimStart().trimEnd();
				data.article = temp.innerHTML.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n').replace(/\n\n\n/g, '\n\n');

				setContent(data);
			});
		},
		[reloadKey, props.url]
	);

	const [isBookmarked, setIsBookmarked] = React.useState(false);

	const onBookmark = () => {
		const ids = /\d+\/(\d+)\/(\d+)/.exec(props.url);
		fetch(`https://www.ptwxz.com/modules/article/addbookcase.php?bid=${ids[1]}&cid=${ids[2]}`).then(() => setIsBookmarked(true));
	}

	return (
		<>
			<AppBar position="sticky">
				<Toolbar style={ { display: 'flex', justifyContent: 'space-between' } }>
					<div>
						<IconButton onClick={ () => props.onChangeUrl('https://www.ptwxz.com/modules/article/bookcase.php') }><ListIcon /></IconButton>
						<IconButton onClick={ onBookmark }><FavoriteIcon /></IconButton>
						<IconButton onClick={ () => setReloadKey(+new Date()) }><RefreshIcon /></IconButton>
					</div>
					<div>
						<IconButton onClick={ () => props.onChangeUrl(content.before) }><NavBeforeIcon /></IconButton>
						<IconButton onClick={ () => props.onChangeUrl(content.after) }><NavNextIcon /></IconButton>
					</div>
				</Toolbar>
			</AppBar>
			{
				isBookmarked && <Dialog open>
					<DialogContent>
						<DialogContentText>已加入書籤</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={ () => setIsBookmarked(false) }>確定</Button>
					</DialogActions>
				</Dialog>
			}
			<Container>
				{
					content === null
						? <Loading />
						: <>
							<Typography variant="h4" style={ { paddingTop: 8 } }>{ content.title }</Typography>
							<Typography style={ { whiteSpace: 'pre-wrap' } }>{ content.article }</Typography>
						</>
				}
			</Container>
		</>
	);
}