import React, { useState } from 'react';
import { Form, Input, Spin, Button } from 'antd';
import _ from 'lodash';

import axios from '../../../axios/mainAxios';
import classes from './History.module.css';

export default class History extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
		this.state = {
			stkCheck: null,
			isMask: false
		};
	}

	//#region render
	render() {
		return (
			<div className={classes.FormArea}>
				<Spin spinning={this.state.isMask}>
					<div className={classes.Form}>
						<div className={classes.title}>Xem lịch sử giao dịch người dùng</div>
						<Form
							onFinish={(values) => {
								console.log('info', values);
								values.stk = _.trim(values.stk);
								axios.post('/banker/getHistoryAccount', values).then((res) => console.log(res));
							}}
						>
							<Form.Item
								label="Số tài khoản"
								name="stk"
								rules={[
									{
										transform: (value) => Number(value),
										type: 'number',
										message: 'Không được chứa các kí tự khác ngoài số'
									},
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									},
									{
										whitespace: true,
										message: 'Không được chứa khoản trống'
									}
								]}
							>
								<Input placeholder="4356343256" />
							</Form.Item>
							<Form.Item {...this.tailLayout}>
								<Button type="primary" htmlType="submit">
									Xem
								</Button>
							</Form.Item>
						</Form>
					</div>
				</Spin>
			</div>
		);
	}
}
