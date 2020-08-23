import React from 'react';
import { Link } from 'react-router-dom';
import { Steps, Form, Input, Row, Col, Button, Modal, Spin, Tooltip, Radio, Select, Checkbox } from 'antd';
import {
	ContactsOutlined,
	ArrowRightOutlined,
	VerticalAlignBottomOutlined,
	ArrowLeftOutlined,
	CheckOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';

import axios from '../../../axios/mainAxios';
import classes from './transferInBank.module.css';
import { toastSuccess, toastError } from '../../../util/AppUtil';
import _ from 'lodash';

const { Step } = Steps;
const { Option } = Select;

class TransferInBank extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
		this.formRef = React.createRef();
		this.state = {
			modalVisible: false,
			listAccountRemind: [],
			formOneLoading: false,
			currentStep: 0,
			otp: '',
			isFinishedTransfer: false,
			type: 'inBank'
		};
		this.dataPost = { type: 'inBank', bankName: 'PGP' };
		this.bankName = 'PGP';
	}

	//#region side effect
	fetchData = () => {
		this.setState({ isFormEditLoading: true });
		axios
			.get('/customer/getListRemind')
			.then((response) => {
				console.log(response);
				let listAccountRemind = response.data.listAccountRemind;
				if (this.state.type === 'inBank') {
					listAccountRemind = listAccountRemind.filter((item) => item.bank === 'G16BANK');
				} else {
					if (this.bankName === 'PGP') {
						listAccountRemind = listAccountRemind.filter((item) => item.bank === 'PGPBANK');
					} else {
						listAccountRemind = listAccountRemind.filter((item) => item.bank === 'RGPBANK');
					}
				}
				this.setState({ listAccountRemind: listAccountRemind, isFormEditLoading: false });
			})
			.catch((error) => {
				console.log(error);
				this.setState({ isFormEditLoading: false });
				toastError('Lỗi hệ thống');
			});
	};
	checkIfExistAcountInRemind = (stk) => {
		console.log('stk', stk);
		console.log('list', this.state.listAccountRemind);
		const result = this.state.listAccountRemind.some((item) => item.stk == stk);
		return result;
	};
	//#region events

	//#region render
	renderItem = (item) => {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					paddingBottom: '10px',
					borderBottom: '1px dashed #ddd',
					alignItems: 'center',
					paddingTop: '10px'
				}}
			>
				<div style={{ display: 'inline-block', marginRight: '3px' }}>
					<strong>Tên gợi nhớ:</strong>
				</div>
				<div style={{ display: 'inline-block' }}>{item.nameRemind}</div>
				<div style={{ display: 'inline-block', marginLeft: '20px', marginRight: '3px', whitespace: 'nowrap' }}>
					<strong>STK:</strong>
					{`(${item.bank})`}
				</div>
				<div style={{ display: 'inline-block', marginRight: '20px' }}>{item.stk}</div>

				<Tooltip title="Chọn">
					<Button
						size="small"
						type="primary"
						style={{ display: 'inline-block', borderRadius: '5px', marginRight: '10px' }}
						onClick={() => {
							// this.state.infoEdit && this.formRef.current.setFieldsValue(item);
							this.formRef.current.setFieldsValue({ stk: item.stk });
							this.setState({ modalVisible: false });
						}}
					>
						<VerticalAlignBottomOutlined style={{ color: 'white' }} />
						Chọn
					</Button>
				</Tooltip>
			</div>
		);
	};
	render() {
		return (
			<div className={classes.Container}>
				<div className={classes.content}>
					{this.state.isFinishedTransfer ? (
						<div className={classes.finishedContainer}>
							<div className={classes.imageSuccess} />
							<p className={classes.titleSuccess}>Giao dịch thành công</p>
							<div>
								<div
									style={{
										marginRight: '10px',
										display: 'inline-block',
										color: 'green',
										cursor: 'pointer'
									}}
									onClick={() => {
										console.log('im here');
										this.dataPost = { type: 'inBank', bankName: 'PGP' };
										this.bankName = 'PGP';
										this.setState(
											{ currentStep: 0, isFinishedTransfer: false, otp: '', type: 'inBank' },
											() => {
												this.formRef.current.resetFields();
											}
										);
									}}
								>
									Giao dịch khác
								</div>
								<Link to={'/history-customer'}>Lịch sử giao dịch</Link>
							</div>
						</div>
					) : (
						<React.Fragment>
							<Steps size="small" current={this.state.currentStep}>
								<Step title="Nhập thông tin chuyển khoản" />
								<Step title="Kiểm tra thông tin" />
								<Step title="Hoàn tất" />
							</Steps>
							{this.state.currentStep === 0 ? (
								<React.Fragment>
									<p className={classes.title}>Nhập Thông tin</p>
									<Form
										ref={this.formRef}
										initialValues={this.dataPost}
										onValuesChange={({ type, bankName }) => {
											type && this.setState({ type: type });
											if (bankName) {
												this.bankName = bankName;
											}
										}}
									>
										<Spin spinning={this.state.formOneLoading}>
											<Row>
												<Col span={16}>
													<Form.Item
														label="Chuyển khoản"
														wrapperCol={{ span: 18 }}
														labelCol={{ span: 6 }}
														name="type"
													>
														<Radio.Group value={this.state.type}>
															<Radio.Button value="inBank">Trong ngân hàng</Radio.Button>
															<Radio.Button value="outBank">Ngoài ngân hàng</Radio.Button>
														</Radio.Group>
													</Form.Item>
												</Col>
											</Row>
											{this.state.type === 'outBank' && (
												<Row>
													<Col span={16}>
														<Form.Item
															name="bankName"
															label="Ngân hàng"
															rules={[ { required: true } ]}
															wrapperCol={{ span: 18 }}
															labelCol={{ span: 6 }}
														>
															<Select placeholder="Chọn ngân hàng" onChange={() => {}}>
																<Option value="PGP">PGP Bank</Option>
																<Option value="RSA">RSA Bank</Option>
															</Select>
														</Form.Item>
													</Col>
												</Row>
											)}

											<Row>
												<Col span={16}>
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
														wrapperCol={{ span: 18 }}
														labelCol={{ span: 6 }}
													>
														<Input placeholder="4356343256" />
													</Form.Item>
												</Col>
												<Col span={2}>
													<Button
														onClick={() => {
															this.setState({ modalVisible: true });
															this.fetchData();
														}}
														type="primary"
														icon={<ContactsOutlined />}
													>
														Gợi nhớ
													</Button>
												</Col>
											</Row>
											<Row>
												<Col span={16}>
													<Form.Item
														label="Số tiền"
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
														wrapperCol={{ span: 18 }}
														labelCol={{ span: 6 }}
													>
														<Input placeholder="1000000" />
													</Form.Item>
												</Col>
												<Col span={2}>
													<div style={{ paddingTop: '5px', paddingLeft: '10px' }}>VND</div>
												</Col>
											</Row>
											<Row>
												<Col span={16}>
													<Form.Item
														label="Lời nhắn"
														name="message"
														rules={[
															{
																required: true,
																message: 'Điền đầy đủ thông tin'
															}
														]}
														wrapperCol={{ span: 18 }}
														labelCol={{ span: 6 }}
													>
														<Input placeholder="Chuyển khoản" />
													</Form.Item>
												</Col>
											</Row>
										</Spin>
									</Form>
								</React.Fragment>
							) : null}
							{this.state.currentStep === 1 ? (
								<Spin spinning={this.state.formOneLoading}>
									<React.Fragment>
										<p className={classes.title}>Kiểm tra thông tin</p>
										<div>
											<span>
												<strong className={classes.label}>Người gửi:</strong>{' '}
											</span>
											<span>{this.props.userName}</span>
										</div>
										<div>
											<span>
												<strong className={classes.label}>Stk:</strong>{' '}
											</span>
											<span>{this.props.stk}</span>
										</div>
										<div>
											<span>
												<strong className={classes.label}>Người nhận:</strong>{' '}
											</span>
											<span>{this.dataPost.name}</span>
										</div>
										<div>
											<span>
												<strong className={classes.label}>Stk:</strong>{' '}
											</span>
											<span>{this.dataPost.stk}</span>
										</div>
										<div>
											<span>
												<strong className={classes.label}>Số tiền:</strong>{' '}
											</span>
											<span>{this.dataPost.amountOfMoney} vnđ</span>
										</div>
										<div>
											<span>
												<strong className={classes.label}>Nội dung:</strong>{' '}
											</span>
											<span>{this.dataPost.message}</span>
										</div>
										<div style={{ marginTop: '20px' }}>
											{this.checkIfExistAcountInRemind(this.dataPost.stk) ? null : (
												<Checkbox
													onChange={(e) => {
														this.saveAccount = e.target.checked;
													}}
												>
													Lưu tài khoản
												</Checkbox>
											)}
										</div>
									</React.Fragment>
								</Spin>
							) : null}
							{this.state.currentStep === 2 ? (
								<Spin spinning={this.state.formOneLoading}>
									<p className={classes.title}>Hoàn tất</p>
									<p> Nhập mã OTP được gửi về email</p>
									<input
										type="text"
										onChange={(ip) => this.setState({ otp: ip.target.value })}
										value={this.state.otp}
										style={{
											border: '1px solid #ddd',
											height: '40px',
											width: '200px',
											paddingLeft: '10px'
										}}
									/>
								</Spin>
							) : null}
							{this.state.currentStep === 1 || this.state.currentStep === 2 ? (
								<Button
									onClick={() => {
										this.setState((prevS) => {
											return { currentStep: prevS.currentStep - 1 };
										});
									}}
									className={classes.buttonBack}
									type="primary"
									shape="round"
									icon={<ArrowLeftOutlined />}
								>
									Trở lại
								</Button>
							) : null}
							{this.state.currentStep === 0 ? (
								<Button
									onClick={() => {
										this.formRef.current.validateFields().then((values) => {
											this.setState({ formOneLoading: true });
											console.log(values);

											if (values.type === 'outBank') {
												if (values.bankName === 'PGP') {
													// values.accountID = Number(values.stk);
													axios
														.post('/bank/checkPgpCustomer', {
															accountID: Number(values.stk)
														})
														.then((response) => {
															if (response.data.success) {
																if (response.data.data != '') {
																	this.dataPost = {
																		...values,
																		name: response.data.data.clientName
																	};
																	axios
																		.get('/customer/getListRemind')
																		.then((res) => {
																			this.setState({
																				listAccountRemind:
																					res.data.listAccountRemind,
																				formOneLoading: false,
																				dataPost: values,
																				currentStep: 1
																			});
																		})
																		.catch((err) => {
																			toastError('Lỗi hệ thống');
																			this.setState({
																				formOneLoading: false
																			});
																		});
																} else {
																	this.setState({
																		formOneLoading: false
																	});
																	toastError('Số tài khoản không tồn tại');
																}
															} else {
																this.setState({
																	formOneLoading: false
																});
																toastError('Số tài khoản không tồn tại');
															}
															console.log(response);
														})
														.catch((error) => {
															console.log(error);
															this.setState({ formOneLoading: false });
															toastError('Số tài khoản không tồn tại');
														});
												}
												if (values.bankName === 'RSA') {
													axios
														.post('/bank/checkRgpCustomer', {
															data: {
																usernameID: Number(values.stk)
															}
														})
														.then((response) => {
															if (response.data.success) {
																if (response.data.data != '') {
																	this.dataPost = {
																		...values,
																		name: response.data.data.name
																	};
																	axios
																		.get('/customer/getListRemind')
																		.then((res) => {
																			this.setState({
																				listAccountRemind:
																					res.data.listAccountRemind,
																				formOneLoading: false,
																				dataPost: values,
																				currentStep: 1
																			});
																		})
																		.catch((err) => {
																			toastError('Lỗi hệ thống');
																			this.setState({
																				formOneLoading: false
																			});
																		});
																} else {
																	this.setState({ formOneLoading: false });
																	toastError('Số tài khoản không tồn tại');
																}
															} else {
																this.setState({ formOneLoading: false });
																toastError('Số tài khoản không tồn tại');
															}
															console.log(response);
														})
														.catch((error) => {
															console.log(error);
															this.setState({ formOneLoading: false });
															toastError('Số tài khoản không tồn tại');
														});
												}
											} else {
												axios
													.post('/payment/getCustomer', values)
													.then((response) => {
														this.dataPost = { ...values, name: response.data.data.name };
														axios
															.get('/customer/getListRemind')
															.then((res) => {
																this.setState({
																	listAccountRemind: res.data.listAccountRemind,
																	formOneLoading: false,
																	dataPost: values,
																	currentStep: 1
																});
															})
															.catch((err) => {
																toastError('Lỗi hệ thống');
																this.setState({
																	formOneLoading: false
																});
															});
													})
													.catch((error) => {
														console.log(error);
														this.setState({ formOneLoading: false });
														toastError('Số tài khoản không tồn tại');
													});
											}
										});
									}}
									className={classes.buttonNext}
									type="primary"
									shape="round"
									icon={<ArrowRightOutlined />}
								>
									Tiếp tục
								</Button>
							) : null}
							{this.state.currentStep === 1 ? (
								<Button
									onClick={() => {
										this.setState({ formOneLoading: true });
										axios
											.get('/customer/sendOTP')
											.then((response) => {
												this.setState({ currentStep: 2, formOneLoading: false });
											})
											.catch((err) => {
												console.log(err);
												toastError('Lỗi hệ thống');
												this.setState({ formOneLoading: true });
											});
										// this.setState({ currentStep: 2 });
									}}
									className={classes.buttonNext}
									type="primary"
									shape="round"
									icon={<ArrowRightOutlined />}
								>
									Tiếp tục
								</Button>
							) : null}
							{this.state.currentStep === 2 ? (
								<Button
									onClick={() => {
										this.setState({ formOneLoading: true });

										if (this.dataPost.type === 'outBank') {
											if (this.dataPost.bankName === 'PGP') {
												axios
													.post('/bank/bankTransferPgp', {
														accNumber: this.dataPost.stk,
														newBalance: Number(this.dataPost.amountOfMoney),
														message: this.dataPost.message,
														otpcode: Number(this.state.otp)
													})
													.then((response) => {
														this.setState({
															isFinishedTransfer: true,
															formOneLoading: false
														});
														toastSuccess('Chuyển khoản thành công');
														if (
															!this.checkIfExistAcountInRemind(this.dataPost.stk) &&
															this.saveAccount
														) {
															axios.post('/customer/createListRemind', {
																stk: this.dataPost.stk,
																nameRemind: this.dataPost.name,
																bank: 'PGPBANK'
															});
														}
													})
													.catch((err) => {
														console.log(err);
														toastError(_.get(err, 'response.data.err'));
														this.setState({ formOneLoading: false });
													});
											}
											if (this.dataPost.bankName === 'RSA') {
												axios
													.post('/bank/bankTransferRgp', {
														data: {
															des_username: Number(this.dataPost.stk),
															value: Number(this.dataPost.amountOfMoney),
															message: this.dataPost.message,
															otpcode: Number(this.state.otp)
														}
													})
													.then((response) => {
														this.setState({
															isFinishedTransfer: true,
															formOneLoading: false
														});
														toastSuccess('Chuyển khoản thành công');
														if (
															!this.checkIfExistAcountInRemind(this.dataPost.stk) &&
															this.saveAccount
														) {
															axios.post('/customer/createListRemind', {
																stk: this.dataPost.stk,
																nameRemind: this.dataPost.name,
																bank: 'RGPBANK'
															});
														}
													})
													.catch((err) => {
														console.log(err);
														toastError(_.get(err, 'response.data.err'));
														this.setState({ formOneLoading: false });
													});
											}
										} else {
											this.dataPost.otpcode = Number(this.state.otp);
											this.dataPost.amountOfMoney = Number(this.dataPost.amountOfMoney);

											axios
												.post('/customer/transfer', this.dataPost)
												.then((response) => {
													this.setState({
														isFinishedTransfer: true,
														formOneLoading: false
													});
													toastSuccess('Chuyển khoản thành công');

													if (
														!this.checkIfExistAcountInRemind(this.dataPost.stk) &&
														this.saveAccount
													) {
														axios.post('/customer/createListRemind', {
															stk: this.dataPost.stk,
															nameRemind: this.dataPost.name,
															bank: 'G16BANK'
														});
													}
												})
												.catch((err) => {
													console.log(err);
													toastError(_.get(err, 'response.data.err'));
													this.setState({ formOneLoading: false });
												});
										}
									}}
									className={classes.buttonNext}
									type="primary"
									shape="round"
									icon={<CheckOutlined />}
								>
									Hoàn tất
								</Button>
							) : null}
							<Modal
								visible={this.state.modalVisible}
								title="Danh sách gợi nhớ"
								// onOk={this.handleOk}
								onCancel={() => {
									this.setState({ modalVisible: false, isFormEditLoading: false });
								}}
								footer={[
									<Button
										key="back"
										onClick={() => {
											this.setState({ modalVisible: false, isFormEditLoading: false });
										}}
									>
										Trở lại
									</Button>
								]}
							>
								<Spin spinning={this.state.isFormEditLoading}>
									{this.state.listAccountRemind.map((item) => this.renderItem(item))}
								</Spin>
							</Modal>
						</React.Fragment>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userName: state.auth.authData.userName,
		stk: state.auth.authData.stk,
		email: state.auth.authData.email
	};
};

export default connect(mapStateToProps)(TransferInBank);
