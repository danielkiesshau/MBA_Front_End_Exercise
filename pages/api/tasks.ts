import type { NextApiRequest, NextApiResponse } from 'next'

import type { DefaultResponseMsg } from '../../types/DefaultResponseMsg';
import type { TaskRequest } from '../../types/TaskRequest';
import { connectDb } from '../../middlewares/connectDb';
import { TaskModel } from '../../models/TaskModel';
import moment from 'moment';
import { jwtValidator } from '../../middlewares/jwtValidator';


const createTask = async (
  req: NextApiRequest, 
  res: NextApiResponse<DefaultResponseMsg | TaskRequest>
) => {
  const {
    name,
    previsionDate,
    userId,
  } = req.body || req.query;

  if (!userId)
    return res.status(400).json({ error: 'Usuário não informado' })


  const isEmptyRequest = !previsionDate || !name;
  
  if (isEmptyRequest)
    return res.status(400).json({ error: 'Requisição inválida' })
  

  const previsionDateParsed = moment(previsionDate);
  const beginningOfToday = moment();
  beginningOfToday.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  const isBeforeToday = previsionDateParsed.isBefore(beginningOfToday);

  if (isBeforeToday) {
    return res.status(400).json({ error: 'Data não pode ser menor que hoje' })
  }
  
  const minNameLength = name.length <= 2;

  if (minNameLength)
    return res.status(400).json({ error: 'O name precisa ter pelo menos 2 caracteres' })

  const minPasswordLength = name.length < 4;

  if (minPasswordLength)
    return res.status(400).json({ error: 'A senha precisa ter pelo menos 4 caracteres' })

  const task = {
    userId,
    name,
    previsionDate,
  }

  await TaskModel.create(task);
  

  return res.status(200).json({ msg: 'Tarefa criada' })
}

const tasksAPI = async (
  req: NextApiRequest, 
  res: NextApiResponse<DefaultResponseMsg | TaskRequest>
) => {
  const methodName = req.method || '';

  switch (methodName) {
    case 'POST':
      return createTask(req, res);
    default:
      return res.status(405).json({ error: 'Método informado não é válido' })
    }
}

export default connectDb(jwtValidator(tasksAPI));

