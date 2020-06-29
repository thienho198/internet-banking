import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash';

import axios from '../../axios/mainAxios';
import { toastSuccess, toastError } from '../../util/AppUtil';
import classes from './ForgotPassword.module.css';

const layout = {
	labelCol: {
		span: 10
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

const AddMoneyByEmail = (props) => {
	//#region state
	const [ isMask, setIsMask ] = useState(false);

	//#region events
	const onFinish = (values, form) => {
		if (values.password !== values.confirmPassword) {
			toastError('Mật khẩu không khớp');
		} else {
			values.token = _.get(props, 'match.params.token');
			console.log(values);
			setIsMask(true);
			axios
				.post('/auth/resetpassword/' + values.token, values)
				.then((res) => {
					res.data.success ? toastSuccess('Đổi mật khẩu thành công') : toastError('Hết hạn đổi');
					props.history.push('/login');
					setIsMask(false);
					form.resetFields();
				})
				.catch((err) => {
					console.log(err);
					toastError('Lỗi hệ thống');
					setIsMask(false);
				});
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

							<Form.Item
								label="Nhập Lại Mật khẩu"
								name="confirmPassword"
								rules={[
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									}
								]}
							>
								<Input.Password placeholder="Confirm Password" />
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

export default AddMoneyByEmail;
