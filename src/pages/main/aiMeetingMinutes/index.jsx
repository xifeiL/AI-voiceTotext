import React, { useEffect, useState } from "react";
import { DownloadOutlined, PhoneOutlined, AudioOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Form, Input, Select } from 'antd'
import "./index.less"
import { useHistory } from 'react-router-dom'
import callNet from '@/servers/callNet'
const OPTIONS_RECORDS = [
    {
        label: '线上会议',
        value: '1'
    },
    {
        label: '会议录音',
        value: '2'
    },
    {
        label: '录音文件',
        value: '3'
    },
]
export default function AiMeetingMinutes() {
    const history = useHistory()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [OPTIONS_TEMPLATE, setTemplateOptions] = useState(false);
    const [listData, setListData] = useState([])
    const [submitting, setSubmitting] = useState(false)


    useEffect(() => {
        // history.push(`/main/createMeetingMinutes?meeting_id=${'123'}&customer=${'王二麻子'}&title=${'简简单单一个小会议'}&meeting_type=${3}`)

        getList()
        getTemplateOptions()
    }, [])

    const renderActions = () => {
        return <div className="table-actions">
            <a className="edit">查看</a>
            <a className="delete">删除</a>
        </div>
    }

    const columns = [
        {
            title: '纪要标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '模板',
            dataIndex: 'template_name',
            key: 'template_name',
        },
        {
            title: '客户',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: '员工',
            dataIndex: 'employee',
            key: 'employee',
        },
        {
            title: '创建时间',
            dataIndex: 'ctime',
            key: 'ctime',
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




    const getTemplateOptions = async () => {
        const { templates } = await callNet.get('/templates')
        const options = templates.map(e => ({ label: e.template_name, value: e.template_id }))
        setTemplateOptions(options)
    }

    const getList = async () => {
        const { transcripts } = await callNet.get('/meeting_minutes')
        setListData(transcripts)
    }

    const submitCreate = async (values) => {
        try {
            const { template_id, customer, title, meeting_type } = values
            if (template_id) {
                const find = OPTIONS_TEMPLATE.find(e => e.value === template_id)
                values.template_name = find.label
            }
            setSubmitting(true)
            const { meeting_id } = await callNet.post('/meeting_minutes', values)
            history.push(`/main/createMeetingMinutes?meeting_id=${meeting_id}&customer=${customer}&title=${title}&meeting_type=${meeting_type}`)
        } finally {
            setSubmitting(false)
        }
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
                <Table dataSource={listData} columns={columns} />;
            </div>

            <Modal title="选择会议纪要类型" open={isModalOpen} centered footer={null} onCancel={() => setIsModalOpen(false)}>

                <Form
                    name="createForm"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 16 }}
                    // style={{ maxWidth: 600 }}
                    initialValues={{ employee: '吴用' }}
                    onFinish={submitCreate}
                    autoComplete="off"
                >
                    <Form.Item
                        label="纪要标题"
                        name="title"
                        rules={[{ required: true, message: '请输入纪要标题' }]}
                    >
                        <Input placeholder="请输入纪要标题"/>
                    </Form.Item>

                    <Form.Item
                        label="模板"
                        name="template_id"
                        rules={[{ required: true, message: '请选择模板' }]}
                    >
                        <Select options={OPTIONS_TEMPLATE} placeholder="请选择模板"/>
                    </Form.Item>

                    <Form.Item
                        label="客户"
                        name="customer"
                        rules={[{ required: true, message: '请输入客户姓名' }]}
                    >
                        <Input placeholder="请输入客户姓名"/>
                    </Form.Item>
                    <Form.Item
                        label="员工"
                        name="employee"
                        rules={[{ required: true, message: '请填写员工姓名' }]}
                    >
                        <Input readOnly placeholder="请填写员工姓名"/>
                    </Form.Item>
                    <Form.Item
                        label="纪要方式"
                        name="meeting_type"
                        rules={[{ required: true, message: '请选择纪要方式' }]}
                    >
                        <Select options={OPTIONS_RECORDS} placeholder="请选择纪要方式"/>
                    </Form.Item>

                    <div className="actions_button">
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            创建
                        </Button>
                    </div>
                </Form>
                {/* <div className="choose_items">
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
                </div> */}
            </Modal>
        </>
    )
}