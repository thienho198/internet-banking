import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';

import axios from '../../axios/mainAxios';
import classes from './Login.module.css';
import loginImg from '../../asset/images/person.png';
import * as authActions from '../../store/actions/auth';

const layout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 20
	}
};
const tailLayout = {
	wrapperCol: {
		offset: 6,
		span: 10
	}
};

const Login = (props) => {
	const onFinish = (values) => {
		props.authLogin(values, props.history);
	};

	return (
		<div className={classes.loginArea}>
			<Spin spinning={props.authLoading}>
				<div className={classes.loginForm}>
					<div className={classes.loginImage}>
						<img src={loginImg} alt="loginLogo" />
					</div>
					<Form
						{...layout}
						name="basic"
						initialValues={{
							remember: true
						}}
						onFinish={onFinish}
					>
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
									message: 'Không đúng định dạng email'
								}
							]}
						>
							<Input placeholder="hdh@gmail.com" />
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
								Đăng nhập
							</Button>
						</Form.Item>
						<div style={{ textAlign: 'right' }}>
							<Link to="/forgot-password"> Quên mật khẩu </Link>
						</div>
					</Form>
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

const mapStateToProps = (state) => {
	return {
		authLoading: state.auth.loading
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		authLogin: (loginInfo, history) => dispatch(authActions.authLogin(loginInfo, history))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
