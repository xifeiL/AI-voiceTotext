import React, { useEffect } from "react";
import { DownloadOutlined, SignatureOutlined, CopyOutlined, DeploymentUnitOutlined,FileTextOutlined } from '@ant-design/icons';
import { Table, Button, Input } from 'antd'
import "./index.less"

export default function () {

    return (
        <div className="page-container">
            <div className="header">
                <h1>模板编辑</h1>
            </div>


            <div className="content">

                <div className="content-left">
                    <Input.TextArea></Input.TextArea>
                    <Button type="text" icon={<DeploymentUnitOutlined />}>生成</Button>
                </div>

                <div className="content-right">

                    <div className="top">
                        <h3>模板推理步骤</h3>
                        <div className="step">
                            1.读取电话录音内容<br />
                            2.根据录音内容生成一个营销活动，确保活动具有营销价值<br />
                            3.在生成的活动中，包含目标受众，主要信息，和推广渠道<br />
                            4.输入的内容应简介明了，避免使用XML标签。<br />
                        </div>
                        <span className="num-tag">885</span>
                    </div>
                    <h3 className="sub-title">模板示例</h3>
                    <div className="bottom">
                        活动名称：环保清洁活动<br />
                        目标受众：家庭祖父<br />
                        主要信息：使用环保产品，保护环境<br />
                        推广渠道：社交媒体，短视频传播<br />
                        <br />
                        简洁明了的营销活动，旨在引导家庭主妇通过一些行动倡导环保理念

                        <div className="actions">
                            <Button type="default" icon={<FileTextOutlined />} size="small" >日志</Button>
                            <Button type="default" icon={<CopyOutlined />} size='small' >复制</Button>
                        </div>


                    </div>

                </div>

            </div>

            <div className="footer">
                <Button type="link" icon={<DownloadOutlined />}>取消</Button>
                <Button type="primary" icon={<DownloadOutlined />}>确认创建</Button>


            </div>


        </div>
    )
}