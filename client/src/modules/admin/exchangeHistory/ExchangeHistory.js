import React from 'react';
import { Spin } from 'antd';

import axios from '../../../axios/mainAxios';

class ExchangeHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            isLoading: false,
            listOnlineHistory: [],
            totalExchange: null,

        }
        
    }

    componentDidMount(){

    }

    getAllData(){
        axios.post('/banker/historyOnlineExchange',)
    }
    

    render(){
        return(<div>
            Đây là trang xem giao dịch
        </div>)
    }
    
}

export default ExchangeHistory