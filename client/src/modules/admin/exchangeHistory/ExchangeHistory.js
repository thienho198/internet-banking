import React from 'react';
import { Spin, Space, Layout, Typography, DatePicker, Select, Table } from 'antd';
import moment from 'moment';

import axios from '../../../axios/mainAxios';
import classes from './exchangeHistory.module.css';

const { Option } = Select;
const { Column } = Table;

class ExchangeHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			listOnlineHistory: [],
			totalExchange: 0,
			listDataShow: [],
			startDate: 'October 30, 1996 15:27:08',
			endDate: 'October 30, 2020 15:27:08',
			cooperativeBank: 'All'
		};
	}

	componentDidMount() {
		this.getAllData();
	}

	getAllData() {
		this.setState({ isLoading: true });
		axios
			.post('/banker/historyOnlineExchange')
			.then((response) => {
				console.log(response.data);
				this.setState({
					listOnlineHistory: response.data.onlineHistory,
					listDataShow: response.data.onlineHistory,
					totalExchange: response.data.totalExchange,
					isLoading: false
				});
			})
			.catch((err) => console.log(err));
	}

	countTotalExchange(dataShow) {
		let totalMoney = 0;
		dataShow.forEach((element) => {
			totalMoney += element.amountOfMoney;
		});
		this.setState({
			totalExchange: totalMoney
		});
		console.log('số tiền giao dịch: ', this.state.totalExchange);
	}

	onFilterChange() {
		this.setState({ isLoading: true });
		let data = [];
		const start = new Date(this.state.startDate);
		const end = new Date(this.state.endDate);
		this.state.listOnlineHistory.forEach((ele) => {
			if (new Date(ele.createdAt) - start >= 0 && new Date(ele.createdAt) - end <= 0) {
				data.push(ele);
			}
		});
		console.log('data show', data);
		console.log('start date', this.state.startDate);
		if (this.state.cooperativeBank === 'All') {
			this.countTotalExchange(data);
			this.setState({
				listDataShow: data,
				isLoading: false
			});
		} else {
			data = data.filter(
				(item) => item.bankReceiver === this.state.cooperativeBank || item.bankSender === this.state.cooperativeBank
			);
			this.countTotalExchange(data);
			this.setState({
				listDataShow: data,
				isLoading: false
			});
		}
	}

	render() {
		return (
			<div className={classes.container}>
				<Spin spinning={this.state.isLoading}>
					<Layout>
						<Layout.Content>
							<Typography.Title level={3} style={{ margin: 15 }}>
								Danh sách giao dịch liên ngân hàng
							</Typography.Title>
							<Space size="large" align="center">
								<div style={{ margin: 15 }}>
									<Typography.Text>Khoảng thời gian: </Typography.Text>
									<DatePicker.RangePicker
										onChange={async(value) => {
											// this.filterByDay(value[0], value[1]);
											await this.setState({
												startDate: value[0],
												endDate: value[1]
											});
											this.onFilterChange();
										}}
									/>
								</div>
								<div style={{ margin: 15 }}>
									<Typography.Text>Ngân hàng liên kết: </Typography.Text>
									<Select
										defaultValue="All"
										style={{ width: 120 }}
										onChange={async (value) => {
											await this.setState({
												cooperativeBank: value
											});
											this.onFilterChange();
										}}
									>
										<Option value="All">All</Option>
										<Option value="PGPBANK">PGP Bank</Option>
										<Option value="RGPBANK">RSA Bank</Option>
									</Select>
								</div>
								<div>
									<Typography.Text strong={true}>Tổng tiền giao dịch: </Typography.Text>
									<Typography.Text>{this.state.totalExchange} VNĐ</Typography.Text>
								</div>
							</Space>
							<Table
								dataSource={this.state.listDataShow}
								bordered
								pagination={{ pageSize: 10 }}
								style={{ margin: 20 }}
							>
								<Column
									title="Người gởi"
									render={(row) => {
										return row.sender;
									}}
									align="center"
								/>
								<Column
									title="Ngân hàng gởi"
									render={(row) => {
										return row.bankSender;
									}}
									align="center"
								/>
								<Column
									title="Người nhận"
									render={(row) => {
										return row.receiver;
									}}
									align="center"
								/>
								<Column
									title="Ngân hàng nhận"
									render={(row) => {
										return row.bankReceiver;
									}}
									align="center"
								/>
								<Column
									title="Số tiền"
									render={(row) => {
										return row.amountOfMoney;
									}}
									align="center"
								/>
								<Column
									title="Ngày giao dịch"
									render={(row) => {
										return row.createdAt;
									}}
									align="center"
								/>
							</Table>
						</Layout.Content>
					</Layout>
				</Spin>
			</div>
		);
	}
}

export default ExchangeHistory;
