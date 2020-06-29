import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import 'antd/dist/antd.css';

import axios from '../../axios/mainAxios';
import { toastSuccess, toastError } from '../../util/AppUtil';
import classes from './ForgotPassword.module.css';

const layout = {
	labelCol: {
		span: 4
	},
	wrapperCol: {
		span: 20
	}
};
const tailLayout = {
	wrapperCol: {
		offset: 4,
		span: 10
	}
};

const ForgorPassword = (props) => {
	//#region state
	const [ isMask, setIsMask ] = useState(false);
	const [ isSendMail, setIsSendMail ] = useState(false);

	//#region events
	const onFinish = (values, form) => {
		setIsMask(true);
		console.log('value', values);
		axios
			.post('/auth/forgotpassword', values)
			.then((res) => {
				console.log(res);
				setIsSendMail(true);
				// res.data.success ? toastSuccess('Nộp tiền thành công') : toastError('Số tài khoản không khớp');
				setIsMask(false);
				// form.resetFields();
			})
			.catch((err) => {
				console.log(err);
				toastError('Email sai');
				setIsMask(false);
			});
	};

	//#region render
	const formItemEmail = (
		<Form.Item
			label="Email"
			name="email"
			rules={[
				{
					type: 'email',
					message: 'Không đúng định dạng email'
				},
				{
					required: true,
					message: 'Điền đầy đủ thông tin'
				}
			]}
		>
			<Input placeholder="nguyenvana@gmail.com" />
		</Form.Item>
	);
	const formItemOTP = (
		<Form.Item
			label="Otp"
			name="otp"
			rules={[
				{
					required: true,
					message: 'Điền đầy đủ thông tin'
				}
			]}
		>
			<Input placeholder="54354" />
		</Form.Item>
	);
	return (
		<div className={classes.FormArea}>
			{isSendMail ? (
				<div>
					<div> Mail cài lại mật khẩu đã được gửi, vui lòng kiểm tra trong hộp thư</div>
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
						<Button type="primary">Gửi lại</Button>
					</div>
				</div>
			) : (
				<Spin spinning={isMask}>
					<div className={classes.Form}>
						<div className={classes.title}>Quên mật khẩu</div>
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
								{formItemEmail}

								<Form.Item {...tailLayout}>
									<Button type="primary" htmlType="submit">
										Tiếp tục
									</Button>
								</Form.Item>
							</Form>
						</Form.Provider>
					</div>
				</Spin>
			)}
		</div>
	);
};

export default ForgorPassword;
