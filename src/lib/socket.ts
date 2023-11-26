// lib/socket.ts

import GoEasy from 'goeasy'; // 或者您使用的WebSocket服务的库

// 初始化GoEasy
const goEasy = new GoEasy({
    host: 'hangzhou.goeasy.io',
    appkey: 'BC-affe1c6cf16b45b49790dce021506d53',
    modules: ['pubsub']
});

     //建立连接
     goEasy.connect({
        onSuccess: function () { //连接成功
            console.log("GoEasy connect successfully.") //连接成功
        },
        onFailed: function (error) { //连接失败
            console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
        }
    });

// 设置消息监听
export function setupMessageListener(onMessageReceived) {
    goEasy.pubsub.subscribe({
        channel: 'chatmed', // 替换为您的频道名
        onMessage: onMessageReceived,
        onSuccess: function () {
            console.log("Channel订阅成功。");
        },
        onFailed: function (error) {
            console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
        }
    });
}

// 发送消息
export function sendMessage(message) {
    goEasy.publish({
        channel: 'chatmed', // 替换为您的频道名
        message: message
    });
}
