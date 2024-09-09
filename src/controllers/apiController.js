import { validationResult, body } from 'express-validator';
import { prismaClient } from '../server.js'
import { compareSync, hashSync } from "bcrypt";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.js';

export const validateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const all = async (req, res) => {
    const users = await prismaClient.user.findMany();

    if(users){
        return res.json(users)
    }else{
        return res.status(500).json({erro: 'Erro ao buscar os usuários'});
    }
}

export const findOne = async(req, res) => {
    
    const { id } = req.params;
    
    const userId = parseInt(id, 10);

    const user = await prismaClient.user.findUnique({ where: { id: userId }});

    if(!user){
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    res.json(user);
}

export const update = async (req, res) => {

    const { id } = req.params;
    const { name, email} = req.body;

    const userId = parseInt(id, 10);

    const user = await prismaClient.user.findUnique({ where: { id: userId }});

    if(!user){
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    const updatedUser = await prismaClient.user.update({
        where: { id: parseInt(id) }, // Filtra o usuário pelo id
        data: {
          name, // Atualiza o nome
          email, // Atualiza o e-mail
          
        }, 
    })
    
    res.status(200).json(updatedUser);
    
}

export const remove = async(req, res) => {

    const { id } = req.params;

    const userId = parseInt(id, 10);

    const user = await prismaClient.user.findUnique({ where: { id: userId } });

    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
      }
  
    // Exclui o usuário
    await prismaClient.user.delete({ where: { id: userId } });
  
    res.status(200).json({ message: 'Usuário excluído com sucesso!' });

   
}

export const registrer = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    
    const { email, password, name } = req.body;

    // Verifica se o usuário já existe
    const hasUser = await prismaClient.user.findFirst({ where: { email } });

    if (!hasUser) {
        const hashedPassword = hashSync(password, 10); // Gera o hash da senha

        // Cria o novo usuário
        const newUser = await prismaClient.user.create({
            data: {
            name,
            email,
            password: hashedPassword,
            },
        });

        res.status(201).json({ newUser }); // Retorna o novo usuário criado
    } else {
        res.status(400).json({ error: 'Usuário já existe!' });
    }

}

export const login = async (req, res) => {

    const { email, password } = req.body;

    // Verifica se o usuário já existe
    const user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) {
        return res.status(400).json({ error: 'Usuário não existe!' });
    }  
    
    if(!compareSync(password, user.password)){
        return res.status(400).json({ error: 'Senha Incorreta!' });
    }
    
  

    const token = jwt.sign({
        userId: user.id
      }, JWT_SECRET);
    
    res.json({user, token});

    

}

export const me = async (req, res) => {
    res.json(req.user);
}

