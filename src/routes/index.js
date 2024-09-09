import express from 'express';

import * as ApiController from '../controllers/apiController.js';
import * as TasksController from '../controllers/tasksController.js'
import authMiddleware from '../middlewares/auth.js';



const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hello, World!');
  });

router.get('/users', ApiController.all);
router.get('/users/:id', ApiController.findOne);
router.post('/users', ApiController.validateUser, ApiController.registrer);
router.put('/users/:id', authMiddleware, ApiController.update);
router.delete('/users/:id', authMiddleware, ApiController.remove);

router.get('/tasks',authMiddleware, TasksController.all);
router.post('/tasks', authMiddleware, TasksController.create);
router.put('/tasks/:id', authMiddleware, TasksController.update);
router.delete('/tasks/:id', authMiddleware, TasksController.remove);

router.get('/me', authMiddleware, ApiController.me)

router.post('/login', ApiController.login)



export default router;