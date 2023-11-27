const { Kafka } = require('kafkajs');

// Reading Kafka broker address from environment variables
const kafkaBrokerAddress = process.env.KAFKA_BROKER_ADDRESS || 'localhost:9092';

// Kafka setup
const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: [kafkaBrokerAddress]
});
const consumer = kafka.consumer({ groupId: 'chat-group' });

// Connecting the Kafka consumer
consumer.connect();
consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });  //确保 topic `chat-messages` 已经在kafka服务端创建

export default function handler(req, res) {
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
      res.write(`data: ${JSON.stringify(content)}\n\n`);
    },
  });

  req.on('close', () => {
    // Handle client disconnect
    res.end();
  });
}
