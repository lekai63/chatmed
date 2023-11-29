const { Kafka } = require('kafkajs');

// Reading Kafka broker address from environment variables
const kafkaBrokerAddress = process.env.KAFKA_BROKER_ADDRESS || 'ip.quarkmed.com:9094';

export default async function handler(req, res) {

  const userId = req.query.userId; // 从请求中获取用户ID
  console.log(`Received userId: ${userId}`); // 日志用户ID
  const consumerGroupId = `chat-app-group-${userId}`; // 使用用户ID作为消费者组ID的一部分

  // Kafka setup
const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: [kafkaBrokerAddress]
});
const consumer = kafka.consumer({ 
  groupId: consumerGroupId,
  enableAutoCommit: true, // 自动提交
  autoOffsetReset: 'latest', // 或者 'earliest'，根据需求选择
  fetchMaxBytes: 512000, // 例如，0.5MB
  maxPartitionFetchBytes: 512000 // 例如，1MB
});

 // Connecting the Kafka consumer
 consumer.connect().then(() => {
  console.log('Kafka consumer connected');
}).catch(error => {
  console.error('Error connecting Kafka consumer:', error);
});

 // 修改此处以订阅建立连接后的消息
 consumer.subscribe({ topic: 'chatmed', fromBeginning: false }).then(() => {
  console.log('Kafka consumer subscribed to topic chatmed');
}).catch(error => {
  console.error('Error subscribing to topic:', error);
});
// 在nextjs中使用SSE 需要注意 客户端无法接收到数据，需设置'no-cache, no-transform'，因为nextjs默认会压缩内容。
  res.writeHead(200, {
    'Content-Type': 'text/event-stream;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });
  res.write('\n');

  // Kafka consumer messages
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      const content = JSON.parse(message.value.toString());
      
      // 日志转发前的消息内容
      console.log(`Forwarding message to client: ${JSON.stringify(content)}`);

      // 客户端无法收到data中的换行符，解决办法是对于有空格符的消息添加自定义事件，客户端监听进行空格符的添加
       // 确保只处理该userId的消息
       if (content.userId === userId) {
        console.log(`Forwarding message to client: ${JSON.stringify(content)}`);
        res.write(`event: customMessage\ndata: ${JSON.stringify(content)}\n\n`);
      }

      // 手动提交offset
    // await consumer.commitOffsets([
    //   { topic, partition, offset: (message.offset + 1).toString() }
    // ]);
  
    },
  });
 
  req.on('close', () => {
    // Handle client disconnect
    res.end();
  });
}
