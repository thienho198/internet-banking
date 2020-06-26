import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import 'antd/dist/antd.css';

import axios from '../../../axios/mainAxios';
import { toastSuccess, toastError } from '../../../util/AppUtil';
import classes from './AddMoney.module.css';

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

const AddMoneyByStk = (props) => {
	//#region state
	const [ isMask, setIsMask ] = useState(false);

	//#region events
	const onFinish = (values, form) => {
		values.amountOfMoney = Number(values.amountOfMoney);
		console.log(values);
		setIsMask(true);
		axios
			.post('/banker/addMoney', values)
			.then((res) => {
				res.data.success ? toastSuccess('Nộp tiền thành công') : toastError('Số tài khoản không khớp');
				setIsMask(false);
				form.resetFields();
			})
			.catch((err) => {
				console.log(err);
				toastError('Số tài khoản không khớp');
				setIsMask(false);
			});
	};

	//#region render
	return (
		<div className={classes.FormArea}>
			<Spin spinning={isMask}>
				<div className={classes.Form}>
					<div className={classes.title}>Nộp tiền bằng số tài khoản</div>
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

							<Form.Item
								label="Tiền nộp"
								name="amountOfMoney"
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
								<Input placeholder="1000000" />
							</Form.Item>

							<Form.Item {...tailLayout}>
								<Button type="primary" htmlType="submit">
									Nộp
								</Button>
							</Form.Item>
						</Form>
					</Form.Provider>
				</div>
			</Spin>
		</div>
	);
};

export default AddMoneyByStk;
