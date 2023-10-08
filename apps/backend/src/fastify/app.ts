import Fastify from 'fastify';
const fastify = Fastify({
  logger: true,
});

fastify.get('/api/game', async (/* request, reply */) => {
  return { hello: 'world' };
});

export { fastify as fastifyApp };
