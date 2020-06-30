import React from 'react';
import { Tabs, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import axios from '../../../axios/mainAxios';
import classes from './history.module.css';
const { TabPane } = Tabs;

export default class History extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
		this.state = {
			isMask: true,
			dataHistoryReceive: []
		};
	}
	//#region events
	callback(key) {
		console.log(key);
		axios
			.get('/customer/historyReceive')
			.then((response) => {
				const listData = _.get(response, 'data.historyReceive');
				this.setState({ dataHistoryReceive: listData });
			})
			.catch((error) => console.log(error));
	}

	//#region lifeCycle
	componentDidMount() {
		axios
			.get('/customer/historyReceive')
			.then((response) => {
				const listData = _.get(response, 'data.historyReceive');
				this.setState({ dataHistoryReceive: listData, isMask: false });
			})
			.catch((error) => console.log(error));
	}
	//#region render
	receiveItem = (item) => {
		return (
			<div className={classes.item_receive}>
				<div className={classes.sub_wrap}>
					<div className={classes.label}>Người gửi:</div>
					<div className="content">{item.bankSender || item.sender}</div>
				</div>
				<div className={classes.sub_wrap}>
					<div className={classes.label}>Ngày gửi:</div>
					<div className="content">{moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
				</div>
				<div className={classes.sub_wrap}>
					<div className={classes.label}>Số tiền:</div>
					<div className="content">{item.amountOfMoney + 'vnđ'}</div>
				</div>
			</div>
		);
	};
	render() {
		return (
			<Spin spinning={this.state.isMask}>
				<div className={classes.container}>
					<Tabs defaultActiveKey="1" centered={true} onChange={this.callback}>
						<TabPane tab="Nhận tiền" key="1">
							{this.state.dataHistoryReceive.map((item) => this.receiveItem(item))}
						</TabPane>
						<TabPane tab="Chuyển khoản" key="2">
							Content of Tab Pane 2
						</TabPane>
						<TabPane tab="Thanh toán nhắc nợ" key="3">
							Content of Tab Pane 3
						</TabPane>
					</Tabs>
				</div>
			</Spin>
		);
	}
}
