import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash';

import axios from '../../../axios/mainAxios';
import { toastSuccess, toastError } from '../../../util/AppUtil';
import classes from './changePassword.module.css';

const layout = {
	labelCol: {
		span: 12
	},
	wrapperCol: {
		span: 12
	}
};
const tailLayout = {
	wrapperCol: {
		offset: 10,
		span: 10
	}
};

const ChangePassword = (props) => {
	//#region state
	const [ isMask, setIsMask ] = useState(false);

	//#region events
	const onFinish = (values, form) => {
		if (values.newPassword === values.confirmNewPassword) {
			setIsMask(true);
			axios
				.post('/customer/changePassword', values)
				.then((response) => {
					toastSuccess('Đổi mật khẩu thành công');
					setIsMask(false);
					form.resetFields();
				})
				.catch((error) => {
					console.log(error);
					setIsMask(false);
					toastError('Mật khẩu cũ không chính xác');
				});
		} else {
			toastError('Mật khẩu không khớp');
		}
	};

	//#region render
	return (
		<div className={classes.FormArea}>
			<Spin spinning={isMask}>
				<div className={classes.Form}>
					<div className={classes.title}>Đổi mật khẩu</div>
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
								label="Mật khẩu cũ"
								name="oldPassword"
								rules={[
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									}
								]}
							>
								<Input.Password placeholder="Old password" />
							</Form.Item>
							<Form.Item
								label="Mật khẩu mới"
								name="newPassword"
								rules={[
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									}
								]}
							>
								<Input.Password placeholder="New password" />
							</Form.Item>
							<Form.Item
								label="Nhập lại mật khẩu mới"
								name="confirmNewPassword"
								rules={[
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									}
								]}
							>
								<Input.Password placeholder="Confirm new password" />
							</Form.Item>

							<Form.Item {...tailLayout}>
								<Button type="primary" htmlType="submit">
									Đổi
								</Button>
							</Form.Item>
						</Form>
					</Form.Provider>
				</div>
			</Spin>
		</div>
	);
};

export default ChangePassword;
