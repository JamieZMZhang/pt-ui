import React from 'react';
import { Loading } from "./Loading";

export function Redirect(props) {
	React.useEffect(
		() => {
			const url = new URL(props.url);
			const params = new URLSearchParams(url.search);

			props.onChangeUrl(`https://www.ptwxz.com/html/${Math.floor(parseInt(params.get('aid'), 10) / 1000)}/${params.get('aid')}/${params.get('cid')}.html`);
		},
		[props.url]
	);

	return <Loading />;
}