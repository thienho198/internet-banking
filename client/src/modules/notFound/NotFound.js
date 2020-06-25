import React from 'react';

export default class NotFound extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
	}

	//#region render
	render() {
		return <h1 style={{ textAlign: 'center' }}>Không Tìm Thấy Trang Này...Opp!</h1>;
	}
}
