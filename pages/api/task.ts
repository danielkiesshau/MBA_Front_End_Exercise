import type { NextApiRequest, NextApiResponse } from 'next'

import type { DefaultResponseMsg } from '../../types/DefaultResponseMsg';
import type { TaskRequest } from '../../types/TaskRequest';
import type { GetTasksParams } from '../../types/GetTasksParams';
import { connectDb } from '../../middlewares/connectDb';
import { TaskModel } from '../../models/TaskModel';
import moment from 'moment';
import { jwtValidator } from '../../middlewares/jwtValidator';


const createTask = async (
  req: NextApiRequest, 
  res: NextApiResponse<DefaultResponseMsg | TaskRequest>,
  userId: string,
) => {
  const {
    name,
    previsionDate,
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

const updateTask = async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const body = req.body as TaskRequest;

  const taskId = req?.query?.id;
  
  if (!taskId) 
    return res.status(400).json({ error: 'Tarefa não informada' });

  const task = await TaskModel.findById(taskId);

  if(!task || task.userId !== userId)
    return res.status(400).json({ error: 'Tarefa não encontrada' });

  const errorMsg = validateBody(body, userId);
  if(errorMsg)
    return res.status(400).json({ error: errorMsg });

  const previsionDate = moment(body.previsionDate);

  task.name = body.name;
  task.previsionDate = previsionDate;
  task.finishDate = body.finishDate ? moment(body.finishDate) : null;

  await TaskModel.findByIdAndUpdate({ _id: task._id}, task);
  return res.status(200).json({ msg: 'Tarefa Alterada' });
}

const deleteTask = async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const body = req.body as TaskRequest;

  const taskId = req?.query?.id;
  
  if (!taskId) 
    return res.status(400).json({ error: 'Tarefa não informada' });

  const task = await TaskModel.findById(taskId);

  if(!task || task.userId !== userId)
    return res.status(400).json({ error: 'Tarefa não encontrada' });

  await TaskModel.findByIdAndDelete({ _id: task._id });
  return res.status(200).json({ msg: 'Tarefa deletada' });
}


const getTask = async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const params = req.query as GetTasksParams;

  const query: any = {
    userId,
  }

  if (params?.previsionDateStart) {
    const startDate = moment(params.previsionDateStart).toDate();
    query.previsionDate = { $gte: startDate };
  }

  if (params?.previsionDateEnd) {
    const endDate = moment(params.previsionDateEnd).toDate();

    if (!query.previsionDate) { 
      query.previsionDate = { };
    } 
    
    query.previsionDate.$lte = endDate ;
  }

  if (params?.status) {
    const status = parseInt(params.status);

    switch (status) {
      case 1: 
        query.finishDate = null; 
        break;
      case 2: 
        query.finishDate = { $ne: null }; 
        break;
    }
  }

  const result = await TaskModel.find(query);

  return res.status(200).json(result);
}


const tasksAPI = async (
  req: NextApiRequest, 
  res: NextApiResponse<DefaultResponseMsg | TaskRequest>
) => {
  const {
    userId
  } = req.body || req.query;
  const methodName = req.method || '';

  switch (methodName) {
    case 'POST':
      return createTask(req, res, userId);
    case 'PUT':
      return updateTask(req, res, userId);
    case 'DELETE':
      return deleteTask(req, res, userId);
    case 'GET':
      return getTask(req, res, userId);
    default:
        return res.status(405).json({ error: 'Metodo infomado não é valido' });
  }
}

const validateBody = (body : TaskRequest, userId : string) => {
  if (!userId) {
      return 'Usuario não informado';
  }

  if (!body.name || body.name.length < 2) {
      return 'Nome inválido';
  }

  if (!body.previsionDate) {
      return 'Data inválida';
  }
  }



export default connectDb(jwtValidator(tasksAPI));

