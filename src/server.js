import express from 'express';
import router from './routes/index.js'
import { notFound, errorHandler } from './routes/errorhandler.js';
import { PrismaClient } from '@prisma/client';

import cors from 'cors'; // Importe a configuração do CORS

const server = express();

export const prismaClient = new PrismaClient({
  log:['query']
})
server.use(cors(
  {
    origin: "http://localhost:3001",
    methods: ["POST", "GET", "PUT", "DELETE"]
  }
))
server.use(express.json())
server.use('/', router);
server.use(notFound);
server.use(errorHandler);

server.listen(3000,  () => {
  console.log('Servidor rodando em http://localhost:3000');
});
