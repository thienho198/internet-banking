import React from 'react';
import { Spin, Space, Layout, Typography, Button } from 'antd';

import axios from '../../../axios/mainAxios';
import classes from './exchangeHistory.module.css'

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
        axios.post('/banker/historyOnlineExchange').then((response)=>{
            console.log(response.data);
        }).catch(err => console.log(err));
    }
    

    render(){
        return(<div className={classes.container}>
            <Spin spinning={this.state.isLoading}>
                <Space>
                    <Layout>
                        <Layout.Header>
                            <Typography.Title level={3}>Lịch sử giao dịch liên ngân hàng</Typography.Title>
                        </Layout.Header>
                        <Layout.Content>

                        </Layout.Content>
                        <Layout.Footer>

                        </Layout.Footer>
                    </Layout>
                </Space>
            </Spin>
        </div>)
    }
    
}

export default ExchangeHistory