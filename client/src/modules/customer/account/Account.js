import React from 'react';
import { Spin } from 'antd';

import axios from '../../../axios/mainAxios';
import classes from './account.module.css';

export default class Account extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			listAccount: {}
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = async () => {
		this.setState({ isLoading: true });
		await axios
			.get('/payment/paymentAccount')
			.then((res) => {
				console.log('data receive', res.data);
				this.setState({
					listAccount: res.data.account,
					isLoading: false
				});
				console.log('data trong show', this.state.listAccount.account.stk);
			})
			.catch((err) => console.log(err));
	};

	render() {
		return (
			<div className={classes.container} style={{ display: 'flex', justifyContent: 'center' }}>
				<Spin spinning={this.state.isLoading} className={classes.header}>
					<div className={classes.title}>Thông tin tài khoản</div>
					<div>Số tài khoản: {this.state.listAccount.stk}</div>
					<div>Số dư: {this.state.listAccount.balance}</div>
				</Spin>
			</div>
		);
	}
}
