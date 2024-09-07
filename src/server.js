import express from 'express';
import router from './routes/index.js'
import { notFound, errorHandler } from './routes/errorhandler.js';

const server = express();

server.use('/', router);
server.use(notFound);
server.use(errorHandler);

server.listen(3000,  () => {
  console.log('Servidor rodando em http://localhost:3000');
});
