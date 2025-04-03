// import { useState } from "react";
const wsUrl = 'ws://120.26.248.174:8007/recognition'

const recordType = {
    default: 0,
    recording: 1,
    pause: 2,
    finish: 3
}

// export const [recordStatus, setRecordStatus] = useState(recordType.default)

let websocket;


const connectWS = () => new Promise((resolve, reject) => {
    websocket = new WebSocket(wsUrl);

    // 连接成功回调
    websocket.onopen = () => {
        console.log('已连接到服务器');
        resolve(websocket)
    };

    // 接收消息回调
    websocket.onmessage = (event) => {
        console.log(`收到消息: ${event.data}`);
    };

    // 关闭连接回调
    websocket.onclose = () => {
        reject('ws连接失败')
        console.log('连接已关闭');
        websocket = null
    };
})


export const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(stream);

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioContext.destination);
        await connectWS()
        processor.onaudioprocess = (e) => {
            const pcmData = convertFloat32ToInt16(e.inputBuffer.getChannelData(0));
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.send(pcmData);
            }
        };
    } catch (err) {
        console.log('录音过程中出错了')
    }
}

function convertFloat32ToInt16(buffer) {
    const int16Buffer = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        const s = Math.max(-1, Math.min(1, buffer[i]));
        int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Buffer.buffer;
}
