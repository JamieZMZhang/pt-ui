import React from 'react';
import { Article } from './pages/Article';
import { Book } from './pages/Book';
import { Bookcase } from './pages/Bookcase';
import { Redirect } from './pages/Redirect';

function App() {
	const [url, setUrl] = React.useState(window.location.href);

	React.useEffect(
		() => {
			window.history.pushState(null, 'PT GUI', url.substring(url.indexOf('/', 10)));
			document.querySelector('html').scrollTop = 0;
		},
		[url]
	);

	if (url.endsWith('bookcase.php')) {
		return <Bookcase onChangeUrl={ setUrl } />
	}
	if (url.includes('readbookcase.php')) {
		return <Redirect onChangeUrl={ setUrl } url={ url } />
	}
	if (/\d+\/\d+\/\d+/.test(url)) {
		return <Article onChangeUrl={ setUrl } url={ url } />;
	}
	return <Book onChangeUrl={ setUrl } url={ url } />
}

export default App;
