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
const consumer = kafka.consumer({ groupId: consumerGroupId });

// Connecting the Kafka consumer
consumer.connect().then(() => {
  console.log('Kafka consumer connected'); // Kafka消费者连接成功
}).catch(error => {
  console.error('Error connecting Kafka consumer:', error); // Kafka消费者连接错误
});

consumer.subscribe({ topic: 'chatmed', fromBeginning: true }).then(() => {
  console.log('Kafka consumer subscribed to topic chatmed'); // Kafka消费者订阅主题成功
}).catch(error => {
  console.error('Error subscribing to topic:', error); // Kafka消费者订阅主题错误
});

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write('\n');

  // Kafka consumer messages
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      const content = JSON.parse(message.value.toString());
      
      // 日志转发前的消息内容
      console.log(`Forwarding message to client: ${JSON.stringify(content)}`);
  
      res.write(`data: ${JSON.stringify(content)}\n\n`);
  
      // 可以在此处添加更多的日志，如果有额外的处理逻辑
    },
  });
 
  req.on('close', () => {
    // Handle client disconnect
    res.end();
  });
}
