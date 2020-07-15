import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as React from 'react';
import { PtToolbar } from '../components/PtToolbar';
import { fetchPt } from './../fetch-pt';
import { Loading } from './Loading';

export function Book(props) {
	const [reloadKey, setReloadKey] = React.useState(0);

	const [content, setContent] = React.useState(null);

	React.useEffect(
		() => {
			setContent(null);

			fetchPt(props.url).then(res => {
				const html = document.createElement('html');
				html.innerHTML = res;

				setContent({
					title: html.querySelector('.title h1').innerText,
					articles: [...html.querySelectorAll('li a')].map(a => ({ name: a.innerText, link: a.href }))
				});
			});
		},
		[reloadKey, props.url]
	);

	return (
		<>
			<PtToolbar>
				<div style={ { color: 'inherit' } }>
					<IconButton color="inherit" onClick={ () => props.onChangeUrl('https://www.ptwxz.com/modules/article/bookcase.php') }><HomeIcon /></IconButton>
					<IconButton color="inherit" onClick={ () => setReloadKey(+new Date()) }><RefreshIcon /></IconButton>
				</div>
			</PtToolbar>
			<Container>
				{
					content === null
						? <Loading />
						: <>
							<Typography variant="h5" style={ { paddingTop: 8 } }>{ content.title }</Typography>
							<List>
								{
									content.articles.map((a, i) => (
										<ListItem button key={ i } onClick={ () => props.onChangeUrl(a.link) }>
											<ListItemText primary={ a.name } />
										</ListItem>
									))
								}
							</List>
						</>
				}
			</Container>
		</>
	);
}