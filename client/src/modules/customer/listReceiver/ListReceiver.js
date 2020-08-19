import React from 'react';
import { Form, Input, Spin, Row, Col, Button, Select, Popconfirm, Tooltip, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import axios from '../../../axios/mainAxios';
import classes from './listReceiver.module.css';
import { toastSuccess, toastError } from '../../../util/AppUtil';

const { Option } = Select;
export default class ListReceiver extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			listAccountRemind: [],
			modalVisible: false,
			infoEdit: null,
			isFormEditLoading: false
		};
	}
	formRef = React.createRef();

	//#region life cycle
	componentDidMount() {
		this.fetchData();
	}
	//#region functions
	fetchData = () => {
		this.setState({ isLoading: true });
		axios.get('/customer/getListRemind').then((response) => {
			console.log(response);
			this.setState({ listAccountRemind: response.data.listAccountRemind, isLoading: false });
		});
	};
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
				<div style={{ display: 'inline-block' }}>{item.stk}</div>
				<div style={{ display: 'inline-block', marginLeft: '20px', marginRight: '3px' }}>
					<strong>Bank:</strong>
				</div>
				<div style={{ display: 'inline-block', marginRight: '10px' }}>{item.bank}</div>
				<Popconfirm
					placement="topLeft"
					title={'Bạn có chắc xóa tên gợi nhớ này không?'}
					onConfirm={() => {
						this.setState({ isLoading: true });
						console.log(item.stk);
						axios
							.delete('/customer/deleteListRemind', { data: { stk: item.stk } })
							.then((res) => {
								this.fetchData();
								toastSuccess('Xóa tên gợi nhớ thành công');
							})
							.catch((err) => {
								this.setState({ isLoading: false });
								console.log(err);
								toastError('Lỗi hệ thống');
							});
					}}
					okText="Có"
					cancelText="Không"
				>
					<Tooltip title="Xóa">
						<Button
							size="small"
							type="danger"
							style={{ display: 'inline-block', borderRadius: '5px', marginRight: '10px' }}
						>
							<DeleteOutlined style={{ color: 'white' }} />
						</Button>
					</Tooltip>
				</Popconfirm>
				<Tooltip title="Sửa">
					<Button
						size="small"
						type="primary"
						style={{ display: 'inline-block', borderRadius: '5px', marginRight: '10px' }}
						onClick={() => {
							this.state.infoEdit && this.formRef.current.setFieldsValue(item);
							this.setState({ modalVisible: true, infoEdit: item });
						}}
					>
						<EditOutlined style={{ color: 'white' }} />
					</Button>
				</Tooltip>
			</div>
		);
	};
	render() {
		return (
			<div className={classes.container}>
				<Spin spinning={this.state.isLoading}>
					<Form
						layout="horizontal"
						wrapperCol={{ span: 6 }}
						onFinish={(values) => {
							console.log(values);
							if (values.bank === 'G16BANK') {
								axios
									.post('/payment/getCustomer', values)
									.then((res) => {
										axios
											.post('/customer/createListRemind', values)
											.then((response) => {
												console.log(response);
												this.fetchData();
												toastSuccess('Thêm tên gợi nhớ thành công');
											})
											.catch((error) => {
												console.log(error);
												toastError(
													'Số tài khoản đã tồn tại trong danh sách hoặc số tài khoản không đúng'
												);
											});
									})
									.catch((error) => {
										toastError('Không tồn tại tài khoản này');
									});
							}
							if (values.bank === 'RGPBANK') {
								axios
									.post('/bank/checkRgpCustomer', {
										data: {
											usernameID: Number(values.stk)
										}
									})
									.then((res) => {
										axios
											.post('/customer/createListRemind', values)
											.then((response) => {
												console.log(response);
												this.fetchData();
												toastSuccess('Thêm tên gợi nhớ thành công');
											})
											.catch((error) => {
												console.log(error);
												toastError(
													'Số tài khoản đã tồn tại trong danh sách hoặc số tài khoản không đúng'
												);
											});
									})
									.catch((error) => {
										toastError('Không tồn tại tài khoản này');
									});
							}
							if (values.bank === 'PGPBANK') {
								axios
									.post('/bank/checkPgpCustomer', {
										accountID: Number(values.stk)
									})
									.then((res) => {
										axios
											.post('/customer/createListRemind', values)
											.then((response) => {
												console.log(response);
												this.fetchData();
												toastSuccess('Thêm tên gợi nhớ thành công');
											})
											.catch((error) => {
												console.log(error);
												toastError(
													'Số tài khoản đã tồn tại trong danh sách hoặc số tài khoản không đúng'
												);
											});
									})
									.catch((error) => {
										toastError('Không tồn tại tài khoản này');
									});
							}
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

					<Modal
						visible={this.state.modalVisible}
						title="Sửa tên gợi nhớ"
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
												.put('/customer/updateListRemind', {
													...result,
													id: this.state.infoEdit._id
												})
												.then((response) => {
													toastSuccess('Cập nhật thành công');
													this.setState({ isFormEditLoading: false, modalVisible: false });
													this.fetchData();
												})
												.catch((error) => {
													toastError('Tài khoản không tồn tại hoặc đã được thêm trước đó');
													this.setState({ isFormEditLoading: false });
												});
										})
										.catch((err) => console.log(err));

									// if (this.formRef.current.isFieldValidating('bank')) {

									// }
								}}
							>
								Lưu
							</Button>
						]}
					>
						<Spin spinning={this.state.isFormEditLoading}>
							<Form ref={this.formRef} initialValues={this.state.infoEdit} name="editForm">
								<Form.Item
									label="Tên gợi nhớ"
									name="nameRemind"
									wrapperCol={{ span: 14 }}
									labelCol={{ span: 5 }}
								>
									<Input placeholder="Thầy web nc" />
								</Form.Item>
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
									wrapperCol={{ span: 14 }}
									labelCol={{ span: 5 }}
								>
									<Input placeholder="4356343256" />
								</Form.Item>
								{/* <Form.Item
									name="bank"
									label="Ngân hàng:"
									rules={[ { required: true } ]}
									wrapperCol={{ span: 14 }}
									labelCol={{ span: 5 }}
								>
									<Select placeholder="Chọn ngân hàng" allowClear>
										<Option value="G16BANK">G16BANK</Option>
										<Option value="PGPBANK">PGPBANK</Option>
										<Option value="RGPBANK">RGPBANK</Option>
									</Select>
								</Form.Item> */}
							</Form>
						</Spin>
					</Modal>

					<div className={classes.title}>Danh sách gợi nhớ</div>
					<div style={{ marginRight: '40px', marginTop: '20px' }}>
						{this.state.listAccountRemind.map((item) => this.renderItem(item))}
					</div>
				</Spin>
			</div>
		);
	}
}
