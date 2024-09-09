import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets.js";
import { prismaClient } from "../server.js";


const authMiddleware = async(req, res, next) => {

    const token = req.headers.authorization;

    //fazer a autorização do usuário
    
    if(!token){
        return res.status(401).json({error: 'Não autorizado n tem token.'})
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        const user = await prismaClient.user.findFirst({where : {id: payload.userId}})
        
        if(!user){
            return res.status(401).json({error: 'Não autorizado, usuário n existe.'})
        }

        req.user = user;
        next();
        
    }catch(error){
        return res.status(401).json({error: 'Não autorizado erro n conseguiu.'});
    }
  
}

export default authMiddleware;