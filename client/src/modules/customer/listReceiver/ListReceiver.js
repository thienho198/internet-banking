import React from 'react';
import { Form, Input, Spin, Row, Col, Button, Select } from 'antd';

import axios from '../../../axios/mainAxios';
import classes from './listReceiver.module.css';
import { toastSuccess, toastError } from '../../../util/AppUtil';

const { Option } = Select;
export default class ListReceiver extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false
		};
	}
	//#region render
	render() {
		return (
			<div className={classes.container}>
				<Spin spinning={this.state.isLoading}>
					<Form
						layout="horizontal"
						wrapperCol={{ span: 6 }}
						onFinish={(values) => {
							console.log(values);
							axios
								.post('/customer/createListRemind', values)
								.then((response) => {
									console.log(response);
									toastSuccess('Thêm tên gợi nhớ thành công');
								})
								.catch((error) => {
									console.log(error);
									toastError('Số tài khoản đã tồn tại trong danh sách hoặc số tài khoản không đúng');
								});
						}}
					>
						<Row>
							<Col span={7}>
								<Form.Item
									label="Tên gợi nhớ"
									name="nameRemind"
									wrapperCol={{ span: 15 }}
									labelCol={{ span: 9 }}
									style={{ marginBottom: '0' }}
								>
									<Input placeholder="Thầy web nc" />
								</Form.Item>
							</Col>
							<Col span={7}>
								<Form.Item
									style={{ marginBottom: '0' }}
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
									wrapperCol={{ span: 14 }}
									labelCol={{ span: 9 }}
								>
									<Input placeholder="4356343256" />
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item
									name="bank"
									label="Ngân hàng:"
									rules={[ { required: true } ]}
									wrapperCol={{ span: 14 }}
									labelCol={{ span: 9 }}
									style={{ marginBottom: '0' }}
								>
									<Select placeholder="Chọn ngân hàng" allowClear>
										<Option value="G16BANK">G16BANK</Option>
										<Option value="PGPBANK">PGPBANK</Option>
										<Option value="RGPBANK">RGPBANK</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item style={{ marginBottom: '0' }}>
									<Button type="primary" htmlType="submit">
										Thêm
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Spin>
				<div className={classes.title}>Danh sách gợi nhớ</div>
			</div>
		);
	}
}
