import React from "react";
import { DownloadOutlined, PhoneOutlined, AudioOutlined, FileDoneOutlined, LeftOutlined } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd'
import "./index.less"
import { useHistory } from 'react-router-dom'

export default function () {
    const history = useHistory()
    const goBack = ()=>{
        history.goBack()
    }

    return (
        <div className="page-container">
            <div className="header">
                <Button onClick={goBack} icon={<LeftOutlined />} type="primary">返回</Button>
            </div>
            <div className="page-content">
                <div className="content-left"></div>
                <div className="content-center">
                    <div className="content-header">
                        <h1>2025.03.03与客户ABC邀约电话记录</h1>
                        <p>2025-01-12 09:12:44</p>
                    </div>

                    <div className="">

                    </div>
                </div>
                <div className="content-right"></div>

            </div>
        </div>
    )
}