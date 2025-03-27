import React, { useEffect } from "react";
import { DownloadOutlined } from '@ant-design/icons';
import { Table, Button } from 'antd'
import "./index.less"
import { useHistory } from 'react-router-dom'


export default function TemplateConfiguration () {
    const history = useHistory()
    const dataSource = [
        {
            key1: 'RM与客户约会面时间',
            key2: 'RM',
            key3: 'Bob',
            key4: '2025-01-03 09:14:31',
        },
        {
            key1: 'RM与客户约会面时间2',
            key2: 'RM',
            key3: 'Bob',
            key4: '2025-02-03 09:14:31',
        },
    ];

    const renderActions = () => {
        return <div className="table-actions">
            <a className="edit">编辑</a>
            <a className="delete">删除</a>
        </div>
    }

    const columns = [
        {
            title: '模板名称',
            dataIndex: 'key1',
            key: 'key1',
        },
        {
            title: '模板角色',
            dataIndex: 'key2',
            key: 'key2',
        },
        {
            title: '创建人',
            dataIndex: 'key3',
            key: 'key3',
        },
        {
            title: '创建时间',
            dataIndex: 'key4',
            key: 'key4',
        },

        {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            render: renderActions,
        },
    ];

    const createTemplate =()=>{
        history.push('/main/templateEdit')
    }
    return (
        <div className="page-container">
            <div className="table-header">
                <h1>模板配置</h1>
                <div className="actions">
                    <Button type="primary" icon={<DownloadOutlined />} size="middle" onClick={createTemplate}>创建模板</Button>
                </div>
            </div>
            <Table dataSource={dataSource} columns={columns} />;
        </div>
    )
}