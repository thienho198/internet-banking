import React from 'react';
import { Spin, Layout, Typography, Button, Popconfirm, List, Modal, Form, Input, Select, Space } from 'antd';
import { PlusSquareFilled, DeleteOutlined } from '@ant-design/icons';

import axios from '../../../axios/mainAxios';
import classes from './manageEmployee.module.css';
import { toastSuccess, toastError } from '../../../util/AppUtil';

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
		offset: 8,
		span: 20
	}
};

class ManageEmployee extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			listEmployee: [],
			infoRow: null,
			modalCreateVisible: false,
			isModalCreateLoading: false
		};
	}
	formRef = React.createRef();

	componentDidMount() {
		this.getListEmployee();
	}

	getListEmployee() {
		this.setState({ isLoading: true });
		axios
			.get('/banker/getAllBanker')
			.then((response) => {
				let employees = [];
				console.log(response.data.data);
				response.data.data.forEach((element) => {
					if (element.role === 'employee') employees.push(element);
				});
				this.setState({
					listEmployee: employees,
					isLoading: false
				});
			})
			.catch((err) => console.log(err));
	}

	openCreateModel(row) {
		this.setState({
			modalCreateVisible: true,
			infoRow: row
		});
	}

	deleteEmployee(item) {
		this.setState({ isLoading: true });
		console.log('data xóa: ', item);
		axios
			.delete('/banker/deleteBanker', {
				data: {
					id: item._id
				}
			})
			.then((response) => {
				toastSuccess('Xóa thành công');
				this.setState({ isLoading: false });
				this.getListEmployee();
			})
			.catch((err) => {
				toastError('Xoá thất bại');
				this.setState({ isLoading: false });
			});
	}

	render() {
		return (
			<div className={classes.container}>
				<Spin spinning={this.state.isLoading}>
					<Layout.Content>
						<div className={classes.header}>
							<Typography.Title level={3}>Danh sách nhân viên</Typography.Title>
							<Button
								style={{ background: 'green', color: 'white' }}
								onClick={() => {
									this.openCreateModel(null);
								}}
							>
								<PlusSquareFilled style={{ color: 'white', background: 'green' }} />
								Thêm nhân viên
							</Button>
						</div>
						<div className={classes.dataShowSpace}>
							<List
								itemLayout="horizontal"
								dataSource={this.state.listEmployee}
								pagination={{
									onChange: (page) => {
										console.log(page);
									},
									pageSize: 5
								}}
								renderItem={(item) => (
									<List.Item
										key={item._id}
										actions={[
											<Popconfirm
												title="Bạn có chắc muốn xóa nhân viên này không?"
												onConfirm={() => {
													this.deleteEmployee(item);
												}}
												okText="Yes"
												cancelText="No"
											>
												<Button type="primary" danger>
													<DeleteOutlined />
												</Button>
											</Popconfirm>
										]}
									>
										<List.Item.Meta
											title={<Typography level={4}>{item.name}</Typography>}
											description={`${item.email}`}
										/>
									</List.Item>
								)}
							/>
						</div>
					</Layout.Content>
					<Modal
						visible={this.state.modalCreateVisible}
						onCancel={() => {
							this.setState({ modalCreateVisible: false,
							isModalCreateLoading: false });
						}}
						title="Basic Modal"
						footer={null}
					>
						<Spin spinning={this.state.isModalCreateLoading}>
							<Form {...layout} ref={this.formRef} name="create_form" onFinish={(values) => {
								this.setState({isModalCreateLoading: true})
								let data = {name: values.employee_name,
									email: values.employee_mail,
									password: values.employee_password,
									role: values.type};
									console.log(data);
								axios.post('/banker/create', data).then((response) => {
									toastSuccess('Tạo nhân viên thành công');
									this.setState({
										modalCreateVisible: false,
										isModalCreateLoading: false,
									})
									this.getListEmployee();
								}).catch((error) => {
									toastError('Tạo nhân viên thất bại');
									console.log(error);
								})
							}}>
								<Form.Item
									name="employee_name"
									label="Tên nhân viên"
									rules={[
										{
											required: true,
											message: 'Điền đầy đủ thông tin'
										}
									]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									name="employee_mail"
									label="Email"
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
									<Input />
								</Form.Item>
								<Form.Item
									name="employee_password"
									label="Mật khẩu"
									rules={[
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
									<Input.Password />
								</Form.Item>
								<Form.Item name="type" label="Loại nhân viên" rules={[ { required: true } ]}>
									<Select allowClear>
										<Select.Option value="admin">Quản trị viên</Select.Option>
										<Select.Option value="employee">Nhân viên giao dịch</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item {...tailLayout}>
									<Space>
										<Button
											onClick={() => {
												this.setState({ modalCreateVisible: false,
												isModalCreateLoading: false });
											}}
										>
											Hủy
										</Button>
										<Button
											onClick={() => {
												this.formRef.current.resetFields();
											}}
										>
											Reset
										</Button>
										<Button type="primary" htmlType="submit">
											Tạo nhân viên
										</Button>
									</Space>
								</Form.Item>
							</Form>
						</Spin>
					</Modal>
				</Spin>
			</div>
		);
	}
}

export default ManageEmployee;
