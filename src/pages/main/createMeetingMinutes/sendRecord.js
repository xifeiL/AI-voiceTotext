
const wsUrl = 'ws://120.26.248.174:8007/rtasr_stream'
const chunks = [];
let ws = null;
let mediaRecorder = null;

// 音频配置参数
const audioConstraints = {
    audio: {
        sampleRate: 16000,    // 16kHz采样率
        channelCount: 1,      // 单声道
        noiseSuppression: true,
        echoCancellation: true
    }
};

const connectWS = () => new Promise((resolve, reject) => {
    ws = new WebSocket(wsUrl);

    // 连接成功回调
    ws.onopen = () => {
        console.log('已连接到服务器');
        resolve()
    };

    // 接收消息回调
    ws.onmessage = (event) => {
        console.log(`收到消息: ${event.data}`);
    };

    // 关闭连接回调
    ws.onclose = () => {
        reject('ws连接失败')
        console.log('连接已关闭');
        ws = null
    };
})


export const startRecording = async () => {
    try {
        // 获取麦克风权限
        const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
        // await connectWS()
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 16000  // 16kbps比特率
        });

        mediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
                // 转换为ArrayBuffer发送
                const buffer = await event.data.arrayBuffer();
                // 检查WebSocket状态
                // if (ws.readyState === WebSocket.OPEN) {
                //     // 发送音频数据包（添加时间戳）
                //     ws.send(JSON.stringify({
                //         type: 'audio',
                //         timestamp: Date.now(),
                //         data: buffer
                //     }));
                // }
            }
        };

        // 开始录制（每500ms分片）
        mediaRecorder.start(2000);
    } catch (err) {
        console.log('录音过程中出错了')
    }
}

