import { createClient } from 'redis';
import 'dotenv/config';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
});

redisClient.on('error', (err) => console.error(' Erreur client Redis :', err));

await redisClient.connect();
console.log('Connecté à Redis');

export default redisClient;