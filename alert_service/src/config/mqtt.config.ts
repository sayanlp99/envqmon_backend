import mqtt from 'mqtt';

const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';

const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('envqmon/#', (err) => {
    if (!err) {
      console.log('Subscribed to envqmon/#');
    }
  });
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});

export default client;