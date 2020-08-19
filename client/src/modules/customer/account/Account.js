import React from 'react';
import { Spin } from 'antd';

import axios from '../../../axios/mainAxios';
import classes from './account.module.css';

export default class Account extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			listAccount: []
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
					listAccount: res.data,
					isLoading: false
				});
				console.log('data trong show', this.state.listAccount.account.stk);
			})
			.catch((err) => console.log(err));
	};

	render() {
		return (
			<div className={classes.container}>
				<Spin spinning={this.state.isLoading} className={classes.header}>
					<div className={classes.title}>Danh sách tài khoản của người dùng</div>
                    <p>{this.state.listAccount.account.stk}</p>
                    <p>{this.state.listAccount.account.balance}</p>
				</Spin>
			</div>
		);
	}
}
