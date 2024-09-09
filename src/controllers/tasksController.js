import { prismaClient } from '../server.js'

export const all = async (req, res) => {

    const userId = req.user.id; 

    const tasks = await  prismaClient.task.findMany({where: {userId}});

    if(tasks){
        return res.json({tasks})
    }else{
        return res.status(500).json({erro: 'Erro ao bsucar as tarefas.'})
    }
}

export const create = async (req, res) => {

    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
    }

    const userId = req.user.id; 
  
    const newTask = await prismaClient.task.create({
        data: {
            title,
            description,
            userId,
        },
    });

    res.status(201).json({newTask})    

}

export const update = async(req, res) => {

   
    const {description, title, status } = req.body;
    const userId = req.user.id; 

    if(!description || !title || !status){
        return res.status(400).json({ message: 'Título e descriçãoe e status são obrigatórios.' });
    }

    const hasTask = await prismaClient.task.findUnique({where: {id: userId}});

    if(!hasTask){
        return res.status(404).json({ message: 'Tarefa não encontrado!' });
    }
  
    const newTask = await prismaClient.user.update({
        data: {
            title,
            description,
            status,
            userId
            
        },
    });

    res.status(201).json({newTask})

}

export const remove =  async (req, res) => {

    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10); 

    // Verifica se a tarefa existe e se pertence ao usuário logado
    const task = await  prismaClient.task.findUnique({where: {id: taskId}});

    if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada!' });
    }

    // Verifica se a tarefa pertence ao usuário logado
    if (task.userId !== userId) {
        return res.status(403).json({ message: 'Você não tem permissão para remover esta tarefa!' });
    }
    
    if(task.userId === userId) {
        // Exclui a tarefa
        await prismaClient.task.delete({ where: { id: taskId } });

        return res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
    }else{
        return res.status(500).json({ message: 'Ocorreu um erro ao remover a tarefa.' });
    }   

   
}