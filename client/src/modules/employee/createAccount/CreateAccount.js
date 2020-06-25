import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import 'antd/dist/antd.css';

import axios from '../../../axios/mainAxios';
import { toastSuccess, toastError } from '../../../util/AppUtil';
import classes from './CreateAccount.module.css';

const layout = {
	labelCol: {
		span: 7
	},
	wrapperCol: {
		span: 20
	}
};
const tailLayout = {
	wrapperCol: {
		offset: 10,
		span: 10
	}
};

const CreateAccount = (props) => {
	//#region state
	const [ isMask, setIsMask ] = useState(false);

	//#region events
	const onFinish = (values, form) => {
		console.log(values);
		setIsMask(true);
		axios
			.post('/customer/create', values)
			.then((res) => {
				res.data.success ? toastSuccess('Tạo người dùng thành công') : toastError('Email đã tồn tại');
				setIsMask(false);
				form.resetFields();
			})
			.catch((err) => {
				console.log(err);
				toastError('Email đã tồn tại');
				setIsMask(false);
			});
	};

	//#region render
	return (
		<div className={classes.FormArea}>
			<Spin spinning={isMask}>
				<div className={classes.Form}>
					<div className={classes.title}>Tạo tài khoản người dùng</div>
					<Form.Provider
						onFormFinish={(formName, { values, forms }) => {
							onFinish(values, forms.myForm);
						}}
					>
						<Form
							{...layout}
							name="myForm"
							initialValues={{
								remember: true
							}}
							// onFinish={onFinish}
						>
							<Form.Item
								label="Họ tên"
								name="name"
								rules={[
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									}
								]}
							>
								<Input placeholder="Nhập họ tên" />
							</Form.Item>

							<Form.Item
								label="Email"
								name="email"
								rules={[
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									},
									{
										type: 'email',
										message: 'Please enter'
									}
								]}
							>
								<Input placeholder="Email" />
							</Form.Item>

							<Form.Item
								label="Số điện thoại"
								name="phoneNumber"
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
								<Input placeholder="Nhập số điện thoại" />
							</Form.Item>
							<Form.Item
								label="Mật khẩu"
								name="password"
								rules={[
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									}
								]}
							>
								<Input.Password placeholder="Password" />
							</Form.Item>

							<Form.Item {...tailLayout}>
								<Button type="primary" htmlType="submit">
									Tạo
								</Button>
							</Form.Item>
						</Form>
					</Form.Provider>
					{/* <Button
						type="primary"
						onClick={() => {
							axios
								.post('/banker/addMoney', {
									stk: '4539187725024845',
									amountOfMoney: 1000
								})
								.then((result) => console.log('result', result));
						}}
					>
						Test Add Money
					</Button> */}
				</div>
			</Spin>
		</div>
	);
};

export default CreateAccount;
