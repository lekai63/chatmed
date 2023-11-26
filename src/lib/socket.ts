import io from 'socket.io-client';

// 假设WebSocket服务器的URL是 http://localhost:3000
const SOCKET_URL = 'http://localhost:3000';

// 创建一个socket连接
const socket = io(SOCKET_URL);

export default socket;
