import React, { useEffect, useState } from "react";
import { DownloadOutlined, PhoneOutlined, UserOutlined, AudioOutlined, FileDoneOutlined, CopyOutlined, LeftOutlined, UpOutlined, CheckOutlined, DownOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Input, message } from 'antd'
import "./index.less"
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from "@/shared/util";
import callNet from '@/servers/callNet'
import { startRecording } from './sendRecord'
import pause from '@/assets/pause.png'
import play from '@/assets/play.png'
import dayjs from "dayjs";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";


export default function () {
    const [uploading, setUploading] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [showTranslateText, setShowTranslateText] = useState(false)
    const [translateText, setTranslateText] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [uploadSuccess, setUploadSuccess] = useState(false)
    let { meeting_id, customer, title, meeting_type } = useQuery();
    const [OPTIONS_TEMPLATE, setTemplateOptions] = useState([]);
    const [chooseTemplate, setChooseTemplate] = useState({})
    const [generating, setGenerating] = useState(false)
    const [generateNote, setGenerateNote] = useState('')
    const [myNote, setMyNote] = useState('')
    const [recording, setRecording] = useState(false)
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

    const [chooseTab, setChooseTab] = useState('0')


    useEffect(() => {
        getTemplateOptions()
        getDetails()
    }, [])
    const history = useHistory()

    const goBack = () => {
        history.goBack()
    }

    const testRecord = () => {
        startRecording()
    }

    const getDetails = async () => {
        const { notes } = await callNet.get('/note_details', { meeting_id })
        customer = notes.customer
        title = notes.customer
        meeting_type = notes.customer
        debugger
    }

    const getTemplateOptions = async () => {
        const { templates } = await callNet.get('/templates')
        const options = templates.map(e => ({ label: e.template_name, value: e.template_id }))
        setTemplateOptions(options)
    }

    const chooseFile = () => new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            console.log('传统方法选择的文件:', file);
            resolve(file)
        };
        input.click();
    })


    const uploadRecordFile = async () => {
        const file = await chooseFile()

        try {
            setUploading(true)
            const res = await callNet.upload('/lfasr_transcribe', file, { meeting_id })
            messageApi.open({
                type: 'success',
                content: '录音文件上传成功！',
            });
            setUploadSuccess(true)
        } catch (err) {
            messageApi.open({
                type: 'error',
                content: '录音文件上传失败，请稍后再试！',
            });
            setUploadSuccess(false)
        } finally {
            setUploading(false)
        }

    }

    const getTranslateText = async () => {
        try {
            const { content } = await callNet.get('/transcripts', { meeting_id })
            setTranslateText(content)
        } catch (err) {

        } finally {

        }
    }

    const toggleShowTranslate = () => {
        if (!showTranslateText && !translateText) {
            getTranslateText()
        }
        setShowTranslateText(!showTranslateText)
    }

    const setChooseTemplateFunc = (option) => {
        setShowOptions(false)
        setChooseTemplate(option)
    }

    const toggleShowOptions = () => {
        setShowOptions(!showOptions)
    }

    const generate = async () => {
        if (generating) return;
        try {
            setGenerating(true)
            const { result } = await callNet.post('/analyze', {
                content: myNote,
                cue: '',
                meeting_id
            })
            messageApi.open({
                type: 'success',
                content: 'ai强化笔记已经生成',
            });
            const htmlRes = marked.parse(result)
            setGenerateNote(htmlRes)
        } catch (err) {

        } finally {
            setGenerating(false)

        }
    }

    const chooseTabFunc = (tab) => {
        setChooseTab(tab)
    }

    function copyToClipboard(text) {
        // 现代方法：使用 Clipboard API
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text)
                .then(() => {
                    messageApi.open({
                        type: 'success',
                        content: '已复制ai强化笔记',
                    });
                    return true
                })
                .catch(async (err) => {
                    // 尝试回退到旧方法
                    // console.error('Clipboard API 失败，尝试旧方法:', err);
                });
        } else {
            // 直接使用旧方法
            // return Promise.resolve(fallbackCopyText(text));
        }
    }


    return (
        <div className="page-container">
            {contextHolder}
            <div className="header">
                <Button onClick={goBack} icon={<LeftOutlined />} type="primary">返回</Button>
            </div>
            <div className="page-content">
                <div className="content-left"></div>
                <div className="content-center">
                    <div className="content-header">
                        <h1>{title}</h1>
                        <p>{now}<span><UserOutlined style={{ marginRight: '5px' }} />{customer}</span></p>
                    </div>

                    <div className="content-container">
                        <div className="tabs">
                            {
                                generating ?
                                    <div className="loading"> <LoadingOutlined /> <span>正在生成中...</span></div>
                                    :
                                    generateNote ?
                                        <>
                                            <div onClick={() => chooseTabFunc('1')} className={chooseTab === '1' ? 'tab active' : 'tab'}>强化笔记</div>
                                            <div onClick={() => chooseTabFunc('0')} className={chooseTab === '0' ? 'tab active' : 'tab'}>我的笔记</div>
                                        </> : null
                            }


                        </div>
                        <div className="content-view">
                            {
                                chooseTab === '0' ?
                                    <Input.TextArea className="my-note" placeholder="请在此处输入笔记..." value={myNote} onChange={(e) => setMyNote(e.target.value)}></Input.TextArea>
                                    :
                                    [
                                        <div className="note-pro" dangerouslySetInnerHTML={{ __html: generateNote }}></div>,
                                        <div className="copy-button" onClick={() => copyToClipboard(generateNote)}><CopyOutlined />复制AI内容</div>
                                    ]
                            }

                        </div>

                    </div>
                    <div className="content-footer">


                        {
                            meeting_type === '3' &&
                            <>
                                {
                                    uploadSuccess ?
                                        // true ?
                                        [<div className="recording record-detail" onClick={toggleShowTranslate}> <span>音频内容</span> <UpOutlined />
                                            {showTranslateText && <div className="translate-content-modal" onClick={() => { }}>
                                                <h1>实时语音内容记录</h1>
                                                <div>
                                                    {translateText}
                                                </div>
                                            </div>}
                                        </div>,
                                        <div className="generate">
                                            <div className={generating ? "button-content disabled" : "button-content"} onClick={generate}>{generating ? '会议纪要生成中' : 'AI生成会议纪要'}</div>
                                            <div className="meeting-type">
                                                <div className="choose" onClick={toggleShowOptions}>{chooseTemplate.label || '请选择'}  {showOptions ? <DownOutlined /> : <UpOutlined />}</div>
                                                {showOptions ? OPTIONS_TEMPLATE.map(e => {
                                                    return <div className="option-item" onClick={() => setChooseTemplateFunc(e)}>{e.label}</div>
                                                }) : null}
                                            </div>
                                        </div>] :
                                        <div className="upload-record-file" onClick={uploadRecordFile}>
                                            {!uploading ? <UploadOutlined /> : <LoadingOutlined />}
                                        </div>
                                }





                            </>
                        }

                        {
                            meeting_type === '2' &&
                            <>
                                <div className="start-record" onClick={testRecord}></div>
                                <div className="recording"> <span>录音中</span> <UpOutlined />
                                    {/* <div className="translate-content-modal">
                                        <h1>实时语音内容记录</h1>
                                        <div>
                                            
                                        </div>
                                    </div> */}
                                </div>
                                <div className="pause">
                                    <img src={pause} alt="" />

                                </div>
                                <div className="play">
                                    <img src={play} alt="" />
                                </div>

                                <div className="stop"><div></div></div>
                            </>
                        }
                    </div>
                </div>
                <div className="content-right"></div>

            </div>
        </div>
    )
}