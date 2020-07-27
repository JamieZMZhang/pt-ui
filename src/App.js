import React from 'react';
import { Article } from './pages/Article';
import { Book } from './pages/Book';
import { Bookcase } from './pages/Bookcase';
import { Redirect } from './pages/Redirect';

function App() {
	const [url, setUrl] = React.useState(window.location.href);

	const onChangeUrl = React.useCallback(
		(url, replace = false) => {
			window.history[replace ? 'replaceState' : 'pushState'](null, 'PT GUI', url.substring(url.indexOf('/', 10)));
			setUrl(url);
			document.body.scrollTop = 0;
		},
		[]
	);

	React.useEffect(
		() => {
			document.body.style.backgroundColor = localStorage.backgroundColor;

			window.onpopstate = () => {
				setUrl(window.location.href);
			};
		},
		[]
	);

	if (url.endsWith('bookcase.php')) {
		return <Bookcase onChangeUrl={ onChangeUrl } />
	}
	if (url.includes('readbookcase.php')) {
		return <Redirect onChangeUrl={ onChangeUrl } url={ url } />
	}
	if (/\d+\/\d+\/\d+/.test(url)) {
		return <Article onChangeUrl={ onChangeUrl } url={ url } />;
	}
	return <Book onChangeUrl={ onChangeUrl } url={ url } />
}

export default App;
