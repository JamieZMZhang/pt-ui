import React from 'react';
import { Article } from './components/Article';
import { Bookcase } from './components/Bookcase';

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
	return <Article onChangeUrl={ setUrl } url={ url } />;
}

export default App;
