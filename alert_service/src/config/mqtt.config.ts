import mqtt from 'mqtt';

const MQTT_BROKER = process.env.MQTT_BROKER || '';
const MQTT_PORT = parseInt(process.env.MQTT_PORT || '');
const MQTT_USERNAME = process.env.MQTT_USERNAME || '';
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || '';
const MQTT_USE_TLS = process.env.MQTT_USE_TLS === 'true';
const MQTT_CLIENT_ID = process.env.MQTT_CLIENT_ID || '';

const options: mqtt.IClientOptions = {
  host: MQTT_BROKER,
  port: MQTT_PORT,
  protocol: MQTT_USE_TLS ? 'mqtts' : 'mqtt',
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  clientId: MQTT_CLIENT_ID,
};

const client = mqtt.connect(options);

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