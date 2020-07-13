import React from 'react';
import { Steps, Form, Input, Row, Col, Button } from 'antd';
import { ContactsOutlined, ArrowRightOutlined } from '@ant-design/icons';

import classes from './transferInBank.module.css';

const { Step } = Steps;

class TransferInBank extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
	}
	//#region events
	onFinish = (values) => {
		console.log(values);
	};
	//#region render
	render() {
		return (
			<div className={classes.Container}>
				<div className={classes.content}>
					<Steps size="small" current={0}>
						<Step title="Nhập thông tin chuyển khoản" />
						<Step title="Kiểm tra thông tin" />
						<Step title="Hoàn tất" />
					</Steps>
					<p className={classes.title}>Nhập Thông tin</p>
					<Form onFinish={this.onFinish}>
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
								<Button type="primary" icon={<ContactsOutlined />}>
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
					</Form>
					<Button className={classes.buttonNext} type="primary" shape="round" icon={<ArrowRightOutlined />}>
						Tiếp tục
					</Button>
				</div>
			</div>
		);
	}
}

export default TransferInBank;
