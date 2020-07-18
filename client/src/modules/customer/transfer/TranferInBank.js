import React from 'react';
import { Link } from 'react-router-dom';
import { Steps, Form, Input, Row, Col, Button, Modal, Spin, Tooltip } from 'antd';
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

const { Step } = Steps;

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
			isFinishedTransfer: false
		};
	}

	//#region side effect
	fetchData = () => {
		this.setState({ isFormEditLoading: true });
		axios
			.get('/customer/getListRemind')
			.then((response) => {
				console.log(response);
				let listAccountRemind = response.data.listAccountRemind;
				listAccountRemind = listAccountRemind.filter((item) => item.bank === 'G16BANK');
				this.setState({ listAccountRemind: listAccountRemind, isFormEditLoading: false });
			})
			.catch((error) => {
				console.log(error);
				this.setState({ isFormEditLoading: false });
				toastError('Lỗi hệ thống');
			});
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
				<div style={{ display: 'inline-block', marginLeft: '20px', marginRight: '3px' }}>
					<strong>STK:</strong>
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
								<Link to={'/'} style={{ marginRight: '10px' }}>
									Trang chủ
								</Link>
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
									<Form ref={this.formRef} initialValues={this.dataPost}>
										<Spin spinning={this.state.formOneLoading}>
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
											axios
												.post('/payment/getCustomer', values)
												.then((response) => {
													this.dataPost = { ...values, name: response.data.data.name };
													this.setState({
														formOneLoading: false,
														dataPost: values,
														currentStep: 1
													});
													console.log(response);
												})
												.catch((error) => {
													console.log(error);
													this.setState({ formOneLoading: false });
													toastError('Số tài khoản không tồn tại');
												});
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
											.post('/customer/sendOTP', { email: this.props.email })
											.then((response) => {
												this.setState({ currentStep: 2, formOneLoading: false });
											})
											.catch((err) => {
												console.log(err);
												toastError('Sai mã OTP');
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
										this.dataPost.otpcode = Number(this.state.otp);
										this.dataPost.amountOfMoney = Number(this.dataPost.amountOfMoney);
										this.setState({ formOneLoading: true });
										axios
											.post('/customer/transfer', this.dataPost)
											.then((response) => {
												this.setState({
													isFinishedTransfer: true,
													formOneLoading: false
												});
												toastSuccess('Chuyển khoản thành công');
											})
											.catch((err) => {
												console.log(err);
												toastError('Lỗi hệ thống');
												this.setState({ formOneLoading: false });
											});
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
