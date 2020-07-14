import React from 'react';
import { Article } from './components/Article';
import { Book } from './components/Book';
import { Bookcase } from './components/Bookcase';
import { Redirect } from './components/Redirect';

function App() {
	const [url, setUrl] = React.useState(
		window.location.host.startsWith('local')
			? 'https://www.ptwxz.com/modules/article/bookcase.php'
			: window.location.href
	);

	React.useEffect(
		() => {
			window.history.pushState(null, '', url.substring(url.indexOf('/', 10)));
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
