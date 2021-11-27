import type { NextApiRequest, NextApiResponse } from 'next'
import sha256 from 'sha256';
import jwt from 'jsonwebtoken';

import type { LoginRequest } from '../../types/LoginRequest';
import type { DefaultResponseMsg } from '../../types/DefaultResponseMsg';
import { UserModel } from '../../models/UserModel';
import { connectDb } from '../../middlewares/connectDb';
import { LoginResponse } from '../../types/LoginResponse';

const login = async (
  req: NextApiRequest, 
  res: NextApiResponse<DefaultResponseMsg | LoginResponse>
) => {
  const {
    SECRET_KEY
  } = process.env;

  if (!SECRET_KEY)
    return res.status(500).json({ error: 'ENV SECRET_KEY JWT não informada' })

  if (req.method === 'POST') {
    const body = req.body as LoginRequest;

    if (!body) return res.status(400).json({ msg: 'Requisição inválida' })
    if (!body.login || !body.password) 
      return res.status(404).json({ error: 'Informe usuário e senha' })

 
    
    const user = await UserModel.findOne({
      email: body.login,
      password: sha256(body.password),
    })
  
    if (!user) 
      return res.status(404).json({ error: 'Usuário ou senha inválidos' })

    if (user) {
      const token = jwt.sign({ _id: user.id }, SECRET_KEY)
      const result = {
        name: user.name,
        email: user.email,
        token,
      }

      return res.status(200).json(result)
    }

    return res.status(404).json({ error: 'Usuário não cadastrado' })
  } 
  
  return res.status(405).json({ error: 'Método informado não é válido' })
}

export default connectDb(login);