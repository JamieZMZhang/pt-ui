import { Container, IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as React from 'react';
import { PtToolbar } from '../components/PtToolbar';
import { fetchPt } from './../fetch-pt';
import { Loading } from './Loading';
import LocationIcon from '@material-ui/icons/Room';

export function Book(props) {
	const [reloadKey, setReloadKey] = React.useState(0);
	const [relocateKey, setRelocateKey] = React.useState(0);

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

	const highlightIndex = React.useMemo(
		() => {
			if (!window.location.hash || !content) {
				return null;
			}
			const title = decodeURIComponent(window.location.hash.substring(1));
			let targetIndex = content.articles.findIndex(a => a.name === title);
			if (targetIndex === -1) {
				targetIndex = content.articles.findIndex(a => title.includes(a.name));
			}
			if (targetIndex === -1) {
				targetIndex = content.articles.findIndex(a => a.name.includes(title));
			}
			return targetIndex === -1 ? null : targetIndex;
		},
		[window.location.hash, content]
	);

	React.useEffect(
		() => {
			if (highlightIndex && content) {
				const tag = document.querySelectorAll('.article')[highlightIndex];
				if (tag) {
					return tag.scrollIntoView({ block: 'center' });
				}
			}
		},
		[highlightIndex, relocateKey]
	);

	return (
		<>
			<Container>
				{
					content === null
						? <Loading />
						: <>
							<Typography variant="h5" style={{ paddingTop: 8, color: localStorage.textColor }} children={content.title} />
							<List style={{ color: localStorage.textColor }}>
								{
									content.articles.map((a, i) =>
										<ListItem
											key={i}
											button
											onClick={() => props.onChangeUrl(a.link)}
											children={<ListItemText primary={a.name} className="article" color="inherit" />}
											style={{ background: highlightIndex === i ? '#0003' : undefined }}
										/>
									)
								}
							</List>
						</>
				}
			</Container>
			<PtToolbar>
				<div style={{ color: 'inherit' }}>
					<IconButton color="inherit" onClick={() => props.onChangeUrl('https://www.ptwxz.com/modules/article/bookcase.php')}><HomeIcon /></IconButton>
					<IconButton color="inherit" onClick={() => setReloadKey(+new Date())}><RefreshIcon /></IconButton>
					{
						highlightIndex !== null &&
						<IconButton color="inherit" onClick={() => setRelocateKey(+new Date())}><LocationIcon /></IconButton>
					}
				</div>
			</PtToolbar>
		</>
	);
}