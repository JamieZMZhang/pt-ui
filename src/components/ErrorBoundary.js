import React from 'react';

export class ErrorBounday extends React.Component {
	constructor(props) {
		super(props);

		this.state = { error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, errorInfo) {
		console.log(error, errorInfo);
		this.setState(error, errorInfo);
	}

	render() {
		return this.props.children;
	}
}