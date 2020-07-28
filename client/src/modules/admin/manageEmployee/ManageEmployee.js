import React from 'react';
import { Spin } from 'antd';

import axios from '../../../axios/mainAxios';

class ManageEmployee extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            isLoading: false,
            listEmployee: [],
            infoEdit: null,
        };
    }
    
    componentDidMount(){
        this.getListEmployee();
    }

    getListEmployee() {
        axios.get('/banker/getAllCustomer').then((response) => {
            console.log('danh sach nhan vien', response);
        }).catch(err => console.log(err));
    }
	render() {
		return <div>đây là trang quản lý nhân viên</div>;
	}
}

export default ManageEmployee;
