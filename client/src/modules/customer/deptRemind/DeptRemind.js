import React from 'react';
import { Table, Layout, Spin, Tabs, Button, Typography, Space, Input, Modal, Form, AutoComplete, Tooltip } from 'antd';
import { PlusSquareOutlined, DeleteOutlined, CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import _, { result } from 'lodash';

import axios from '../../../axios/mainAxios';
import classes from './deptRemind.module.css';
import { connect } from 'react-redux';
import { toastSuccess, toastError } from '../../../util/AppUtil';

const { Column } = Table;
const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;

const mapStateToProps = (state) => {
	return {
		email: state.auth.authData.email
	};
};

class DeptRemind extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			dataDeptReminder: [],
			dataWasDeptReminder: [],
			modal1Visible: false,
			modal2Visible: false,
			infoRow: null,
			isFormEditLoading: false,
			isFormMessageLoading: false,
			modalTranferVisible: false,
			isFormTranferLoading: false,
			listAccountRemind: []
		};
	}
	formRef = React.createRef();
	//#region function
	componentDidMount() {
		this.getData1();
		this.getData2();
	}

	getListAccountRemind() {
		axios
			.get('/customer/getListRemind')
			.then((response) => {
				this.setState({
					listAccountRemind: response.data.listAccountRemind
				});
			})
			.catch((err) => console.log(err));
	}

	getData1 = () => {
		this.setState({ isLoading: true });
		this.getListAccountRemind();
		axios.get('/customer/getListDeptReminderRemind').then((response) => {
			this.setState({
				dataDeptReminder: response.data,
				isLoading: false
			});
			console.log('data dept remind', this.state.dataDeptReminder);
			console.log('data list acc remind', this.state.listAccountRemind);
		});
	};

	getData2 = () => {
		this.setState({ isLoading: true });
		axios.get('/customer/getListDeptReminderWasRemined').then((response) => {
			// console.log(response.data);
			this.setState({
				dataWasDeptReminder: response.data,
				isLoading: false
			});
		});
	};

	sendOtpCode() {
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
	}

	cancelMessageModal() {
		this.setState({ modal1Visible: false, isFormMessageLoading: false });
	}

	confirm(row) {
		this.setState({
			modal1Visible: true
		});
	}

	renderAccountRemind = (item) => ({
		value: item.stk,
		label: <div>{item.nameRemind}</div>
	});

	render() {
		return (
			<Spin spinning={this.state.isLoading}>
				<Tabs defaultActiveKey="1" centered={true}>
					<TabPane tab="Danh sách nhắc nợ" key="1">
						<Layout>
							<Content className={classes.container}>
								<div className={classes.header}>
									<Title level={3}>Danh sách người nợ</Title>
									<Tooltip title='Chỉ tạo nhắc nợ với khách hàng của ngân hàng'>
										<Button
											type="primary"
											style={{ background: 'green' }}
											onClick={() => {
												this.setState({
													modal2Visible: true,
													infoRow: null
												});
											}}
										>
											<PlusSquareOutlined style={{ color: 'white' }} />
											Tạo nhắc nợ
										</Button>
									</Tooltip>
								</div>
								<Table
									dataSource={this.state.dataDeptReminder}
									bordered
									className={classes.container}
									pagination={{ pageSize: 20 }}
								>
									<Column
										title="Người nợ"
										render={(row) => {
											return row.deptReminderId.nameReminded
												? row.deptReminderId.nameReminded
												: row.deptReminderId.stkWasRemined;
										}}
										align="center"
									/>
									<Column
										title="Nội dung"
										render={(row) => {
											return row.deptReminderId.content;
										}}
										align="center"
									/>
									<Column
										title="Số tiền"
										render={(row) => {
											return `${row.deptReminderId.amountOfMoney} VND`;
										}}
										align="center"
									/>
									<Column
										title="Action"
										render={(row) => {
											return (
												<Space>
													<Button
														type="primary"
														danger
														onClick={() => {
															this.setState({
																modal1Visible: true,
																infoRow: row
															});
														}}
													>
														<DeleteOutlined />
													</Button>
												</Space>
											);
										}}
									/>
								</Table>
							</Content>
						</Layout>
					</TabPane>
					<TabPane tab="Danh sách nợ" key="2">
						<Layout>
							<Content className={classes.container}>
								<div className={classes.header}>
									<Title level={3}>Danh sách chủ nợ</Title>
								</div>
								<Table
									dataSource={this.state.dataWasDeptReminder}
									bordered
									className={classes.container}
									pagination={{ pageSize: 20 }}
								>
									<Column
										title="Chủ nợ"
										render={(row) => {
											return row.deptReminderId.nameRemind
												? row.deptReminderId.nameRemind
												: row.deptReminderId.stkRemind;
										}}
										align="center"
									/>
									<Column
										title="Nội dung"
										render={(row) => {
											return row.deptReminderId.content;
										}}
										align="center"
									/>
									<Column
										title="Số tiền"
										render={(row) => {
											return `${row.deptReminderId.amountOfMoney} VND`;
										}}
										align="center"
									/>
									<Column
										title="Action"
										render={(row) => {
											return (
												<Space>
													<Button
														type="primary"
														danger
														onClick={() => {
															this.setState({
																modal1Visible: true,
																infoRow: row
															});
														}}
													>
														<DeleteOutlined />
													</Button>
													<Button
														type="primary"
														style={{ background: '3EC1D3', color: 'white' }}
														onClick={() => {
															this.sendOtpCode();
															this.setState({
																infoRow: row,
																modalTranferVisible: true,
																isFormTranferLoading: false
															});
														}}
													>
														<CheckOutlined />
														Thanh toán
													</Button>
												</Space>
											);
										}}
									/>
								</Table>
							</Content>
						</Layout>
					</TabPane>
				</Tabs>
				<Modal
					title="Lời nhắn"
					visible={this.state.modal1Visible}
					onCancel={() => this.cancelMessageModal()}
					footer={null}
				>
					<Spin spinning={this.state.isFormMessageLoading}>
						<Form
							onFinish={(values) => {
								axios
									.delete('/customer/deleteDeptReminder', {
										data: {
											message: values.message,
											id: this.state.infoRow.deptReminderId._id
										}
									})
									.then((res) => {
										this.getData1();
										this.getData2();
										toastSuccess('Xóa nhắc nợ thành công');
										this.setState({ isFormMessageLoading: false, modal1Visible: false });
									})
									.catch((err) => {
										this.setState({ isLoading: false });
										console.log(err);
										toastError('Xóa thất bại');
									});
							}}
						>
							<Form.Item name="message">
								<Input.TextArea row={4} />
							</Form.Item>
							<Form.Item>
								<Button style={{ marginRight: 5 }} onClick={() => this.cancelMessageModal()}>
									Trở lại
								</Button>
								<Button type="primary" htmlType="submit">
									Gởi
								</Button>
							</Form.Item>
						</Form>
					</Spin>
				</Modal>
				<Modal
					visible={this.state.modal2Visible}
					title="Nhắc nợ"
					onCancel={() => {
						this.setState({ modal2Visible: false, isFormEditLoading: false });
					}}
					footer={[
						<Button
							key="back"
							onClick={() => {
								this.setState({ modal2Visible: false, isFormEditLoading: false });
							}}
						>
							Trở lại
						</Button>,
						<Button
							key="submit"
							type="primary"
							loading={this.state.isFormEditLoading}
							onClick={() => {
								this.formRef.current
									.validateFields()
									.then((result) => {
										this.setState({ isFormEditLoading: true });
										console.log('fdsfsd', this.state.infoEdit);
										axios
											.post('/deptReminder/create', {
												...result
											})
											.then((response) => {
												this.getData1();
												toastSuccess('Tạo nhắc nợ thành công');
												this.setState({ isFormEditLoading: false, modal2Visible: false });
											})
											.catch((error) => {
												toastError('Lỗi hệ thống');
												this.setState({ isFormEditLoading: false });
												console.log(error);
											});
									})
									.catch((err) => console.log(err));
							}}
						>
							Lưu
						</Button>
					]}
				>
					<Spin spinning={this.state.isFormEditLoading}>
						<Form ref={this.formRef} initialValues={this.state.infoRow} name="editForm">
							<Form.Item
								label="Người nợ"
								name="stkWasRemined"
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
								labelCol={{ span: 5 }}
							>
								<AutoComplete
									options={this.state.listAccountRemind.map((item) => this.renderAccountRemind(item))}
								>
									<Input placeholder="4356343256" />
								</AutoComplete>
							</Form.Item>
							<Form.Item label="Nội dung" name="content" wrapperCol={{ span: 14 }} labelCol={{ span: 5 }}>
								<Input placeholder="" />
							</Form.Item>
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
								wrapperCol={{ span: 14 }}
								labelCol={{ span: 5 }}
							>
								<Input placeholder="150000" />
							</Form.Item>
						</Form>
					</Spin>
				</Modal>
				<Modal
					visible={this.state.modalTranferVisible}
					title="Trả nợ"
					onCancel={() => {
						this.setState({ modalTranferVisible: false, isFormTranferLoading: false });
					}}
					footer={[
						<Button
							key="back"
							onClick={() => {
								this.setState({ modalTranferVisible: false, isFormTranferLoading: false });
							}}
						>
							Trở lại
						</Button>,
						<Button
							key="submit"
							type="primary"
							style={{ background: '#00C5CD' }}
							loading={this.state.isFormTranferLoading}
							onClick={() => {
								this.formRef.current
									.validateFields()
									.then((result) => {
										this.setState({ isFormTranferLoading: true });
										const dataTransfer = {
											otpcode: parseInt(result.otpcode),
											message: result.message,
											stk: this.state.infoRow.deptReminderId.stkRemind,
											amountOfMoney: this.state.infoRow.deptReminderId.amountOfMoney,
											category: 'DeptPay'
										};
										console.log('data', dataTransfer);
										console.log('data Transfer stk: ', typeof dataTransfer.stk);
										console.log('data Transfer amountmoney: ', typeof dataTransfer.amountOfMoney);
										console.log('data Transfer category: ', typeof dataTransfer.category);
										console.log('data Transfer OTP: ', typeof dataTransfer.otpcode);
										axios
											.post('/customer/transfer', dataTransfer)
											.then((response) => {
												toastSuccess('Thanh toán thành công');
												this.setState({
													isFormTranferLoading: false,
													modalTranferVisible: false
												});
												this.getData2();
											})
											.catch((error) => {
												toastError('Thanh toán thất bại');
												this.setState({ isFormTranferLoading: false });
												console.log(error);
											});
									})
									.catch((err) => console.log(err));
							}}
						>
							Thanh toán
						</Button>
					]}
				>
					<Spin spinning={this.state.isFormTranferLoading}>
						<Form ref={this.formRef} name="tranferForm">
							<Form.Item
								label="OTP code:"
								name="otpcode"
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
								labelCol={{ span: 5 }}
							>
								<Input placeholder="Nhập OTP code trong email" />
							</Form.Item>
							<Form.Item
								label="Lời nhắn:"
								name="message"
								rules={[
									{
										required: true,
										message: 'Điền đầy đủ thông tin'
									}
								]}
								wrapperCol={{ span: 14 }}
								labelCol={{ span: 5 }}
							>
								<Input />
							</Form.Item>
						</Form>
					</Spin>
				</Modal>
			</Spin>
		);
	}
}
export default connect(mapStateToProps)(DeptRemind);
