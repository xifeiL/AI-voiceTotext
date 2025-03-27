import React, { useEffect, useState } from "react";
import { DownloadOutlined, PhoneOutlined, AudioOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd'
import "./index.less"
import { useHistory } from 'react-router-dom'


export default function AiMeetingMinutes () {
    const history = useHistory()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dataSource = [
        {
            key1: '2025.09.09与客户约会电话纪要',
            key2: '专用模板1',
            key3: 'ACC',
            key4: 'WH',
            key5: '2025-01-03 09:14:31',
        },
        {
            key1: '2025.09.03与客户约会电话纪要',
            key2: '专用模板2',
            key3: 'ACE',
            key4: 'WHW',
            key5: '2025-01-03 09:14:31',
        },
    ];

    const renderActions = () => {
        return <div className="table-actions">
            <a className="edit">查看</a>
            <a className="delete">删除</a>
        </div>
    }

    const columns = [
        {
            title: '纪要标题',
            dataIndex: 'key1',
            key: 'key1',
        },
        {
            title: '模板',
            dataIndex: 'key2',
            key: 'key2',
        },
        {
            title: '客户',
            dataIndex: 'key3',
            key: 'key3',
        },
        {
            title: '员工',
            dataIndex: 'key4',
            key: 'key4',
        },
        {
            title: '创建时间',
            dataIndex: 'key4',
            key: 'key5',
        },

        {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            render: renderActions,
        },
    ];

    const onCreateClick = () => {
        setIsModalOpen(true)
    }

    const onCreateMeetingMinutes = (flag) => {
        setIsModalOpen(false);
        history.push('/main/createMeetingMinutes')
    }


    return (
        <>
            <div className="page-container">
                <div className="table-header">
                    <h1>AI 电话纪要列表</h1>
                    <div className="actions">
                        <Button type="primary" icon={<DownloadOutlined />} size="middle" onClick={onCreateClick}>新建会议纪要</Button>
                    </div>
                </div>
                <Table dataSource={dataSource} columns={columns} />;
            </div>

            <Modal title="选择会议纪要类型" open={isModalOpen} centered footer={null} onCancel={() => setIsModalOpen(false)}>
                <div className="modal-content">
                    <div className="choose-item" onClick={() => onCreateMeetingMinutes(1)}>
                        <PhoneOutlined size={30} />
                        <p>线上会议</p>
                    </div>
                    <div className="choose-item" onClick={() => onCreateMeetingMinutes(2)}>
                        <AudioOutlined />
                        <p>录音</p>
                    </div>
                    <div className="choose-item" onClick={() => onCreateMeetingMinutes(3)}>
                        <FileDoneOutlined />
                        <p>音频文件</p>
                    </div>
                </div>
            </Modal>
        </>
    )
}