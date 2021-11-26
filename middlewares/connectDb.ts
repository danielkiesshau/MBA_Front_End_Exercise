import mongoose from 'mongoose'
import type { NextApiRequest, NextApiHandler, NextApiResponse } from 'next'

export const connectDb = (handler: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    readyState: isConnected
  } = mongoose.connections[0];

  console.log('MongoDB connection: ', isConnected)

  if (isConnected)
    return handler(req,res);
  
  const {
    DB_CONNECTION_NAME
  } = process.env;

  if (!DB_CONNECTION_NAME)
    return res.status(500).json({ error: 'ENV database connection não informada' })

  await mongoose.connect(DB_CONNECTION_NAME);

  mongoose.connection.on('connection', () => {
    console.log('connectado ao DB')
  })

  mongoose.connection.on('error', () => {
    console.log('erro ao conectar-se ao DB')
  })

  return handler(req,res)
}
