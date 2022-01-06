import type { NextApiRequest, NextApiResponse } from 'next'
import sha256 from 'sha256';

import type { UserRequest } from '../../types/UserRequest';
import type { DefaultResponseMsg } from '../../types/DefaultResponseMsg';
import { connectDb } from '../../middlewares/connectDb';
import { UserModel } from '../../models/UserModel';

const userApi = async (
  req: NextApiRequest, 
  res: NextApiResponse<DefaultResponseMsg>
) => {
  if (req.method === 'POST') {
    const {
      email,
      name,
      password
    } = req.body as UserRequest;

    const isEmptyRequest = !email || !name || !password;
    
    if (isEmptyRequest)
      return res.status(400).json({ error: 'Favor informar email e senha' })
    
    const minNameLength = name.length <= 2;

    if (minNameLength)
      return res.status(400).json({ error: 'O name precisa ter pelo menos 2 caracteres' })

    const minPasswordLength = name.length < 4;

    if (minPasswordLength)
      return res.status(400).json({ error: 'A senha precisa ter pelo menos 4 caracteres' })

    const user = {
      name,
      email,
      password: sha256(password)
    }

   
    const isUserCreated = await UserModel.findOne({
      email
    })

    if (isUserCreated) 
      return res.status(400).json({ error: 'Já existe um usuário com o email informado' })

    await UserModel.create(user);
   

    return res.status(200).json({ msg: 'Usuário criado' })
  } 
  
  return res.status(405).json({ error: 'Método informado não é válido' })
}

export default connectDb(userApi)